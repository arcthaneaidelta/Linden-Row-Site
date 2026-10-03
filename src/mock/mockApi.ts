import { mockStore, BigCommerceCheckout, BigCommerceOrder, CheckoutLineItem, CheckoutConsignment } from './store';
import { appendLog } from './eventLog';
import { getFailureState, setFailureState } from './failures';
import { calculateVat } from '../lib/money';
import { CustomerDetails } from '../lib/validators';

function getRandomLatency(isFast: boolean): number {
  if (isFast) {
    return Math.floor(Math.random() * 200) + 150; // 150 - 350ms
  }
  return Math.floor(Math.random() * 600) + 400; // 400 - 1000ms
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export interface ApiResponse<T> {
  ok: boolean;
  data?: T;
  error?: {
    code: 'OUT_OF_STOCK' | 'PRICE_CHANGED' | 'CARD_DECLINED' | 'AUTH_REQUIRED' | 'AUTH_FAILED' | 'NETWORK_TIMEOUT' | 'DUPLICATE' | 'NOT_FOUND' | 'VALIDATION_ERROR';
    message: string;
    details?: any;
  };
}

export const mockApi = {
  /**
   * POST /api/checkout/session
   * Server receives ONLY SKUs and Quantities. Ignores browser price.
   */
  async createCheckoutSession(
    items: { sku: string; quantity: number; size: string; tamperedPricePence?: number }[]
  ): Promise<ApiResponse<{ checkout: BigCommerceCheckout; priceTamperedNotice?: string }>> {
    const failureState = getFailureState();
    const latency = getRandomLatency(failureState.fastLatency);
    await delay(latency);

    // Filter items and validate
    const lineItems: CheckoutLineItem[] = [];
    let subtotalPence = 0;
    let priceTamperedNotice: string | undefined;

    for (const item of items) {
      const product = mockStore.getProductBySku(item.sku);
      if (!product) {
        appendLog({
          method: 'POST',
          path: '/api/checkout/session',
          statusCode: 404,
          latencyMs: latency,
          origin: 'vercel-server',
          summary: `Product SKU ${item.sku} not found in BigCommerce catalog`,
          requestPayload: { items: items.map(i => ({ sku: i.sku, qty: i.quantity })) },
          responsePayload: { error: 'PRODUCT_NOT_FOUND', sku: item.sku }
        });
        return {
          ok: false,
          error: { code: 'NOT_FOUND', message: `Product ${item.sku} not found in BigCommerce catalog.` }
        };
      }

      // Check stock
      if (product.stock < item.quantity) {
        appendLog({
          method: 'POST',
          path: '/api/checkout/session',
          statusCode: 409,
          latencyMs: latency,
          origin: 'bigcommerce',
          summary: `Insufficient stock for ${product.name} (SKU: ${item.sku}). Requested: ${item.quantity}, Available: ${product.stock}`,
          requestPayload: { items: items.map(i => ({ sku: i.sku, qty: i.quantity })) },
          responsePayload: { error: 'OUT_OF_STOCK', sku: item.sku, requested: item.quantity, available: product.stock }
        });
        return {
          ok: false,
          error: {
            code: 'OUT_OF_STOCK',
            message: `Only ${product.stock} left of ${product.name} (${product.colour}, ${item.size}).`,
            details: { sku: item.sku, available: product.stock, name: product.name, colour: product.colour, size: item.size }
          }
        };
      }

      // Check if price tampering was attempted
      if (failureState.tamperActive || (item.tamperedPricePence !== undefined && item.tamperedPricePence !== product.pricePence)) {
        priceTamperedNotice = `Browser price of £${((item.tamperedPricePence || 100) / 100).toFixed(2)} was rejected. Server authoritative price £${(product.pricePence / 100).toFixed(2)} applied.`;
      }

      // Always use server authoritative price
      const itemTotal = product.pricePence * item.quantity;
      subtotalPence += itemTotal;

      lineItems.push({
        sku: product.sku,
        name: product.name,
        colour: product.colour,
        size: item.size,
        quantity: item.quantity,
        unitPricePence: product.pricePence,
        totalPence: itemTotal,
        image: product.images[0],
      });
    }

    const checkoutId = `bc_chk_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const cartId = `bc_cart_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const taxPence = calculateVat(subtotalPence);

    const checkout: BigCommerceCheckout = {
      id: checkoutId,
      cartId,
      status: 'draft',
      items: lineItems,
      subtotalPence,
      shippingCostPence: 0,
      taxPence,
      grandTotalPence: subtotalPence,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockStore.checkouts.set(checkoutId, checkout);

    appendLog({
      method: 'POST',
      path: '/api/checkout/session',
      statusCode: 201,
      latencyMs: latency,
      origin: 'vercel-server',
      summary: `Created BigCommerce checkout ${checkoutId}. Server authoritative subtotal: £${(subtotalPence / 100).toFixed(2)}`,
      requestPayload: {
        _security_audit: "Client sends ONLY identifiers (SKUs & Quantities). Zero trust in client pricing.",
        items: items.map(i => ({ sku: i.sku, quantity: i.quantity, size: i.size, client_sent_price: i.tamperedPricePence ? `£${(i.tamperedPricePence/100).toFixed(2)} [IGNORED]` : undefined }))
      },
      responsePayload: {
        checkoutId: checkout.id,
        cartId: checkout.cartId,
        currency: 'GBP',
        subtotalPence: checkout.subtotalPence,
        taxPence: checkout.taxPence,
        authoritativeLineItems: checkout.items.map(i => ({ sku: i.sku, unitPricePence: i.unitPricePence, total: i.totalPence }))
      }
    });

    return {
      ok: true,
      data: { checkout, priceTamperedNotice }
    };
  },

  /**
   * PUT /api/checkout/:id/customer
   * Saves customer and consignment addresses in BigCommerce
   */
  async saveCustomerDetails(
    checkoutId: string,
    customerData: CustomerDetails
  ): Promise<ApiResponse<BigCommerceCheckout>> {
    const failureState = getFailureState();
    const latency = getRandomLatency(failureState.fastLatency);
    await delay(latency);

    const checkout = mockStore.checkouts.get(checkoutId);
    if (!checkout) {
      return { ok: false, error: { code: 'NOT_FOUND', message: 'Checkout session expired or not found.' } };
    }

    checkout.customer = {
      email: customerData.email,
      firstName: customerData.firstName,
      lastName: customerData.lastName,
      phone: customerData.phone,
    };

    checkout.shippingAddress = {
      addressLine1: customerData.addressLine1,
      addressLine2: customerData.addressLine2,
      city: customerData.city,
      postcode: customerData.postcode.toUpperCase(),
      country: customerData.country || 'United Kingdom',
    };

    checkout.billingAddress = customerData.billingSameAsShipping
      ? { ...checkout.shippingAddress }
      : {
          addressLine1: customerData.billingAddressLine1 || customerData.addressLine1,
          city: customerData.billingCity || customerData.city,
          postcode: (customerData.billingPostcode || customerData.postcode).toUpperCase(),
          country: customerData.country || 'United Kingdom',
        };

    checkout.updatedAt = new Date().toISOString();

    appendLog({
      method: 'PUT',
      path: `/api/checkout/${checkoutId}/consignments`,
      statusCode: 200,
      latencyMs: latency,
      origin: 'bigcommerce',
      summary: `Updated consignments & customer details for ${customerData.email}`,
      requestPayload: {
        customer: checkout.customer,
        shippingAddress: checkout.shippingAddress,
        billingSameAsShipping: customerData.billingSameAsShipping
      },
      responsePayload: {
        checkoutId: checkout.id,
        consignmentsStatus: 'ready_for_shipping_quotes',
        updatedAt: checkout.updatedAt
      }
    });

    return { ok: true, data: checkout };
  },

  /**
   * GET /api/checkout/:id/shipping
   * Returns available shipping methods from BigCommerce
   */
  async getShippingMethods(checkoutId: string): Promise<ApiResponse<CheckoutConsignment[]>> {
    const failureState = getFailureState();
    const latency = getRandomLatency(failureState.fastLatency);
    await delay(latency);

    const checkout = mockStore.checkouts.get(checkoutId);
    if (!checkout) {
      return { ok: false, error: { code: 'NOT_FOUND', message: 'Checkout session not found.' } };
    }

    const methods: CheckoutConsignment[] = [
      {
        shippingMethodId: 'ship_standard',
        shippingMethodName: 'Standard UK Delivery',
        shippingCostPence: 450, // £4.50
        estimatedDelivery: '3 to 5 working days',
      },
      {
        shippingMethodId: 'ship_express',
        shippingMethodName: 'Express Next-Day Delivery',
        shippingCostPence: 900, // £9.00
        estimatedDelivery: 'Next working day (order before 2pm)',
      },
    ];

    // Free shipping threshold over £150 (15000 pence)
    if (checkout.subtotalPence >= 15000) {
      methods.unshift({
        shippingMethodId: 'ship_free_standard',
        shippingMethodName: 'Complimentary Standard Delivery (Orders £150+)',
        shippingCostPence: 0,
        estimatedDelivery: '3 to 5 working days',
      });
    }

    appendLog({
      method: 'GET',
      path: `/api/checkout/${checkoutId}/shipping`,
      statusCode: 200,
      latencyMs: latency,
      origin: 'bigcommerce',
      summary: `Retrieved ${methods.length} calculated shipping rates for destination ${checkout.shippingAddress?.postcode || 'UK'}`,
      responsePayload: { availableMethods: methods }
    });

    return { ok: true, data: methods };
  },

  /**
   * PUT /api/checkout/:id/shipping
   * Selects shipping consignment and recalculates grand total in BigCommerce
   */
  async selectShippingMethod(
    checkoutId: string,
    consignment: CheckoutConsignment
  ): Promise<ApiResponse<BigCommerceCheckout>> {
    const failureState = getFailureState();
    const latency = getRandomLatency(failureState.fastLatency);
    await delay(latency);

    const checkout = mockStore.checkouts.get(checkoutId);
    if (!checkout) {
      return { ok: false, error: { code: 'NOT_FOUND', message: 'Checkout session not found.' } };
    }

    checkout.selectedConsignment = consignment;
    checkout.shippingCostPence = consignment.shippingCostPence;
    checkout.grandTotalPence = checkout.subtotalPence + checkout.shippingCostPence;
    checkout.taxPence = calculateVat(checkout.grandTotalPence);
    checkout.updatedAt = new Date().toISOString();

    appendLog({
      method: 'PUT',
      path: `/api/checkout/${checkoutId}/shipping`,
      statusCode: 200,
      latencyMs: latency,
      origin: 'bigcommerce',
      summary: `Applied shipping: ${consignment.shippingMethodName} (£${(consignment.shippingCostPence / 100).toFixed(2)}). Grand total: £${(checkout.grandTotalPence / 100).toFixed(2)}`,
      requestPayload: { shippingMethodId: consignment.shippingMethodId },
      responsePayload: {
        grandTotalPence: checkout.grandTotalPence,
        shippingCostPence: checkout.shippingCostPence,
        taxPence: checkout.taxPence,
      }
    });

    return { ok: true, data: checkout };
  },

  /**
   * POST /api/checkout/:id/pay
   * Stripe PaymentIntent creation, validation, idempotency, and BigCommerce order generation
   */
  async payCheckout(
    checkoutId: string,
    paymentData: {
      cardNumber: string;
      expiry: string;
      cvc: string;
      nameOnCard: string;
      idempotencyKey: string;
      paymentMethod?: 'Stripe' | 'Apple Pay' | 'Google Pay';
    }
  ): Promise<ApiResponse<{ order: BigCommerceOrder; requires3DS?: boolean; clientSecret?: string }>> {
    const failureState = getFailureState();
    const latency = getRandomLatency(failureState.fastLatency);
    await delay(latency);

    // 1. Check Idempotency Key
    if (mockStore.idempotencyRecord.has(paymentData.idempotencyKey)) {
      const cachedOrder = mockStore.idempotencyRecord.get(paymentData.idempotencyKey);
      appendLog({
        method: 'POST',
        path: `/api/checkout/${checkoutId}/pay`,
        statusCode: 200,
        latencyMs: Math.floor(latency * 0.4),
        origin: 'vercel-server',
        summary: `[IDEMPOTENT REPLAY] Key ${paymentData.idempotencyKey} already processed. Returned existing order ${cachedOrder.id} without recharging.`,
        idempotencyKey: paymentData.idempotencyKey,
        requestPayload: { idempotencyKey: paymentData.idempotencyKey, notice: 'Duplicate request detected' },
        responsePayload: { orderId: cachedOrder.id, status: cachedOrder.status, paymentStatus: 'paid_previously' }
      });
      return { ok: true, data: { order: cachedOrder } };
    }

    // 2. Failure Lab: Network Timeout
    if (failureState.armedScenario === 'network_timeout') {
      appendLog({
        method: 'POST',
        path: `/api/checkout/${checkoutId}/pay`,
        statusCode: 504,
        latencyMs: latency + 800,
        origin: 'vercel-server',
        summary: `Payment gateway timeout (Simulated Failure Lab). No charge made.`,
        requestPayload: { idempotencyKey: paymentData.idempotencyKey },
        responsePayload: { error: 'GATEWAY_TIMEOUT' }
      });
      return {
        ok: false,
        error: {
          code: 'NETWORK_TIMEOUT',
          message: 'We could not reach the payment service. You have not been charged.'
        }
      };
    }

    const checkout = mockStore.checkouts.get(checkoutId);
    if (!checkout) {
      return { ok: false, error: { code: 'NOT_FOUND', message: 'Checkout session not found.' } };
    }

    // 3. Failure Lab: Sell out mid-checkout
    if (failureState.armedScenario === 'sell_out') {
      // Force stock of first item to 0
      const firstItem = checkout.items[0];
      if (firstItem) {
        const p = mockStore.getProductBySku(firstItem.sku);
        if (p) p.stock = 0;
      }
      appendLog({
        method: 'POST',
        path: `/api/checkout/${checkoutId}/pay`,
        statusCode: 409,
        latencyMs: latency,
        origin: 'bigcommerce',
        summary: `Pre-payment inventory check failed: ${firstItem?.name || 'Item'} just sold out.`,
        responsePayload: { error: 'OUT_OF_STOCK', sku: firstItem?.sku }
      });
      return {
        ok: false,
        error: {
          code: 'OUT_OF_STOCK',
          message: `Only 0 left of ${firstItem?.name || 'Item'}. Another customer just completed their order.`,
          details: { sku: firstItem?.sku, available: 0, name: firstItem?.name, colour: firstItem?.colour, size: firstItem?.size }
        }
      };
    }

    // 4. Test Card Triggers & Failure Lab Scenarios
    const cleanCard = paymentData.cardNumber.replace(/\s+/g, '');
    const isDeclined = cleanCard.endsWith('0002') || failureState.armedScenario === 'declined_card';
    const is3DS = cleanCard.includes('3184') || failureState.armedScenario === '3ds_fail';

    if (isDeclined) {
      appendLog({
        method: 'POST',
        path: `/api/checkout/${checkoutId}/pay`,
        statusCode: 402,
        latencyMs: latency,
        origin: 'stripe',
        summary: `Stripe card decline: do_not_honor (code: generic_decline)`,
        idempotencyKey: paymentData.idempotencyKey,
        requestPayload: { card_last4: cleanCard.slice(-4), amount: checkout.grandTotalPence },
        responsePayload: { error: { code: 'card_declined', decline_code: 'do_not_honor' } }
      });
      return {
        ok: false,
        error: {
          code: 'CARD_DECLINED',
          message: 'Your bank declined this card. Try another card or payment method.'
        }
      };
    }

    if (is3DS) {
      const clientSecret = `pi_3Q${Date.now()}_secret_${Math.random().toString(36).substring(2, 9)}`;
      appendLog({
        method: 'POST',
        path: `/api/checkout/${checkoutId}/pay`,
        statusCode: 200,
        latencyMs: latency,
        origin: 'stripe',
        summary: `Stripe 3D Secure authentication required (SCA Challenge)`,
        idempotencyKey: paymentData.idempotencyKey,
        requestPayload: { amount: checkout.grandTotalPence, currency: 'gbp', payment_method_types: ['card'] },
        responsePayload: { status: 'requires_action', next_action: { type: 'use_stripe_sdk', client_secret: clientSecret } }
      });
      return {
        ok: true,
        data: {
          requires3DS: true,
          clientSecret,
          order: null as any
        }
      };
    }

    // 5. Successful Payment & Order Creation
    return this.completeOrderCreation(checkout, paymentData.idempotencyKey, paymentData.paymentMethod || 'Stripe', cleanCard.slice(-4));
  },

  /**
   * Completes BigCommerce order creation, stock deduction, and webhook logging
   */
  async completeOrderCreation(
    checkout: BigCommerceCheckout,
    idempotencyKey: string,
    paymentMethod: 'Stripe' | 'Apple Pay' | 'Google Pay',
    last4: string = '4242'
  ): Promise<ApiResponse<{ order: BigCommerceOrder }>> {
    const orderId = `LR-${mockStore.orderCounter++}`;
    const transactionId = `pi_3Q${Math.random().toString(36).substring(2, 12)}_${Date.now().toString().slice(-4)}`;

    // Deduct stock for all items
    for (const item of checkout.items) {
      mockStore.deductStock(item.sku, item.quantity);
    }

    const order: BigCommerceOrder = {
      id: orderId,
      bigCommerceId: `BC-${Math.floor(Math.random() * 80000) + 10000}`,
      status: 'awaiting_fulfillment',
      paymentStatus: 'paid',
      paymentMethod,
      transactionId,
      idempotencyKey,
      itemsTotalPence: checkout.subtotalPence,
      shippingCostPence: checkout.shippingCostPence,
      taxPence: checkout.taxPence,
      grandTotalPence: checkout.grandTotalPence,
      customer: checkout.customer || {
        email: 'customer@example.com',
        firstName: 'Valued',
        lastName: 'Customer',
        phone: '+44 7700 900000'
      },
      shippingAddress: checkout.shippingAddress || {
        addressLine1: '14 Calder Mews',
        city: 'Bristol',
        postcode: 'BS1 5TQ',
        country: 'United Kingdom'
      },
      billingAddress: checkout.billingAddress || {
        addressLine1: '14 Calder Mews',
        city: 'Bristol',
        postcode: 'BS1 5TQ',
        country: 'United Kingdom'
      },
      shippingMethod: checkout.selectedConsignment?.shippingMethodName || 'Standard UK Delivery',
      lineItems: checkout.items.map((i) => ({
        sku: i.sku,
        name: i.name,
        colour: i.colour,
        size: i.size,
        quantity: i.quantity,
        pricePence: i.unitPricePence,
      })),
      createdAt: new Date().toISOString(),
      timeline: [
        {
          event: 'order.created',
          timestamp: new Date().toLocaleTimeString(),
          status: 'completed',
          detail: `BigCommerce order ${orderId} created in 'awaiting_fulfillment' state.`,
        },
        {
          event: 'payment.captured',
          timestamp: new Date().toLocaleTimeString(),
          status: 'completed',
          detail: `Stripe captured £${(checkout.grandTotalPence / 100).toFixed(2)} (Ref: ${transactionId}).`,
        },
        {
          event: 'inventory.updated',
          timestamp: new Date().toLocaleTimeString(),
          status: 'completed',
          detail: `Authoritative stock levels decreased across ${checkout.items.length} SKUs in BigCommerce.`,
        },
        {
          event: 'klaviyo.placed_order',
          timestamp: new Date().toLocaleTimeString(),
          status: 'simulated',
          detail: `Webhook dispatched 'Placed Order' metric to Klaviyo for ${checkout.customer?.email || 'customer'}.`,
        },
        {
          event: 'fulfilment.queued',
          timestamp: new Date().toLocaleTimeString(),
          status: 'simulated',
          detail: `Order payload routed to Bristol warehouse WMS queue for same-day dispatch.`,
        },
      ],
    };

    // Save order in memory
    mockStore.orders.set(orderId, order);
    mockStore.idempotencyRecord.set(idempotencyKey, order);

    // Live log the payment and webhooks
    appendLog({
      method: 'POST',
      path: `/api/checkout/${checkout.id}/pay`,
      statusCode: 200,
      latencyMs: 520,
      origin: 'stripe',
      summary: `Stripe PaymentIntent confirmed: ${transactionId} (Card ending in ${last4})`,
      idempotencyKey,
      requestPayload: { amount: checkout.grandTotalPence, currency: 'gbp' },
      responsePayload: { status: 'succeeded', chargeId: `ch_${Date.now()}` }
    });

    // Webhook event from Stripe
    setTimeout(() => {
      appendLog({
        method: 'WEBHOOK',
        path: '/api/webhooks/stripe',
        statusCode: 200,
        latencyMs: 120,
        origin: 'webhook',
        summary: `Stripe webhook received: payment_intent.succeeded for ${transactionId}. Verified order ${orderId}.`,
        requestPayload: { type: 'payment_intent.succeeded', data: { object: { id: transactionId, amount: checkout.grandTotalPence, status: 'succeeded' } } },
        responsePayload: { received: true, bigcommerce_order_status: 'paid' }
      });
    }, 400);

    return { ok: true, data: { order } };
  },

  /**
   * POST /api/checkout/:id/3ds-challenge
   */
  async submit3DSAuthentication(
    checkoutId: string,
    idempotencyKey: string,
    shouldFail: boolean = false
  ): Promise<ApiResponse<{ order: BigCommerceOrder }>> {
    const failureState = getFailureState();
    const latency = getRandomLatency(failureState.fastLatency);
    await delay(latency);

    const isFailure = shouldFail || failureState.armedScenario === '3ds_fail';

    if (isFailure) {
      appendLog({
        method: 'POST',
        path: `/api/checkout/${checkoutId}/3ds-challenge`,
        statusCode: 400,
        latencyMs: latency,
        origin: 'stripe',
        summary: `3D Secure authentication failed: Cardholder authentication declined.`,
        requestPayload: { action: 'authenticate_3ds', status: 'challenge_failed' },
        responsePayload: { error: 'authentication_failed', message: 'Cardholder authentication failed or timed out.' }
      });
      return {
        ok: false,
        error: {
          code: 'AUTH_FAILED',
          message: 'Authentication failed. Your card was not charged.'
        }
      };
    }

    const checkout = mockStore.checkouts.get(checkoutId);
    if (!checkout) {
      return { ok: false, error: { code: 'NOT_FOUND', message: 'Checkout not found.' } };
    }

    appendLog({
      method: 'POST',
      path: `/api/checkout/${checkoutId}/3ds-challenge`,
      statusCode: 200,
      latencyMs: latency,
      origin: 'stripe',
      summary: `3D Secure authentication APPROVED by issuing bank. Proceeding to order creation.`,
      requestPayload: { action: 'authenticate_3ds', status: 'challenge_success' },
      responsePayload: { status: 'authenticated' }
    });

    return this.completeOrderCreation(checkout, idempotencyKey, 'Stripe', '3184');
  },

  /**
   * GET /api/orders/:id
   */
  async getOrder(orderId: string): Promise<ApiResponse<BigCommerceOrder>> {
    const failureState = getFailureState();
    const latency = getRandomLatency(failureState.fastLatency);
    await delay(latency);

    const order = mockStore.orders.get(orderId);
    if (!order) {
      return { ok: false, error: { code: 'NOT_FOUND', message: 'Order record not found.' } };
    }

    appendLog({
      method: 'GET',
      path: `/api/orders/${orderId}`,
      statusCode: 200,
      latencyMs: latency,
      origin: 'vercel-server',
      summary: `Retrieved BigCommerce order ${orderId} (Status: ${order.status}, Payment: ${order.paymentStatus})`,
      responsePayload: {
        orderId: order.id,
        bigCommerceId: order.bigCommerceId,
        paymentStatus: order.paymentStatus,
        grandTotalPence: order.grandTotalPence,
        itemsCount: order.lineItems.length
      }
    });

    return { ok: true, data: order };
  },

  /**
   * Express Checkout (Apple Pay / Google Pay)
   */
  async processExpressOrder(
    items: { sku: string; quantity: number; size: string }[],
    walletType: 'Apple Pay' | 'Google Pay',
    customer: { email: string; name: string; address: string; city: string; postcode: string }
  ): Promise<ApiResponse<{ order: BigCommerceOrder }>> {
    const sessionRes = await this.createCheckoutSession(items);
    if (!sessionRes.ok || !sessionRes.data) {
      return sessionRes as any;
    }
    const checkout = sessionRes.data.checkout;

    // Apply express shipping
    checkout.customer = {
      email: customer.email,
      firstName: customer.name.split(' ')[0] || 'Valued',
      lastName: customer.name.split(' ').slice(1).join(' ') || 'Customer',
      phone: '+44 7700 900412',
    };
    checkout.shippingAddress = {
      addressLine1: customer.address,
      city: customer.city,
      postcode: customer.postcode,
      country: 'United Kingdom',
    };
    checkout.billingAddress = { ...checkout.shippingAddress };
    checkout.selectedConsignment = {
      shippingMethodId: 'ship_standard',
      shippingMethodName: 'Standard UK Delivery',
      shippingCostPence: 450,
      estimatedDelivery: '3 to 5 working days',
    };
    checkout.shippingCostPence = 450;
    checkout.grandTotalPence = checkout.subtotalPence + 450;
    checkout.taxPence = calculateVat(checkout.grandTotalPence);

    const idempotencyKey = `wallet_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    return this.completeOrderCreation(checkout, idempotencyKey, walletType, '4242');
  }
};
