import { CATALOGUE, Product } from './catalogue';

export interface CheckoutConsignment {
  shippingMethodId: string;
  shippingMethodName: string;
  shippingCostPence: number;
  estimatedDelivery: string;
}

export interface CheckoutLineItem {
  sku: string;
  name: string;
  colour: string;
  size: string;
  quantity: number;
  unitPricePence: number;
  totalPence: number;
  image: string;
}

export interface BigCommerceCheckout {
  id: string;
  cartId: string;
  status: 'draft' | 'pending_payment' | 'completed';
  items: CheckoutLineItem[];
  subtotalPence: number;
  shippingCostPence: number;
  taxPence: number;
  grandTotalPence: number;
  customer?: {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
  };
  shippingAddress?: {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    postcode: string;
    country: string;
  };
  billingAddress?: {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    postcode: string;
    country: string;
  };
  selectedConsignment?: CheckoutConsignment;
  stripePaymentIntentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BigCommerceOrder {
  id: string; // e.g. LR-100482
  bigCommerceId: string; // BC-89421
  status: 'awaiting_fulfillment' | 'fulfilled' | 'cancelled';
  paymentStatus: 'paid' | 'authorized' | 'declined';
  paymentMethod: 'Stripe' | 'Apple Pay' | 'Google Pay';
  transactionId: string; // pi_3Q...
  idempotencyKey: string;
  itemsTotalPence: number;
  shippingCostPence: number;
  taxPence: number;
  grandTotalPence: number;
  customer: {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
  };
  shippingAddress: {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    postcode: string;
    country: string;
  };
  billingAddress: {
    addressLine1: string;
    city: string;
    postcode: string;
    country: string;
  };
  shippingMethod: string;
  lineItems: {
    sku: string;
    name: string;
    colour: string;
    size: string;
    quantity: number;
    pricePence: number;
  }[];
  createdAt: string;
  timeline: {
    event: string;
    timestamp: string;
    status: 'completed' | 'queued' | 'simulated';
    detail: string;
  }[];
}

class InMemStore {
  public products: Product[] = JSON.parse(JSON.stringify(CATALOGUE));
  public checkouts: Map<string, BigCommerceCheckout> = new Map();
  public orders: Map<string, BigCommerceOrder> = new Map();
  public idempotencyRecord: Map<string, any> = new Map();
  public orderCounter: number = 100482;

  public resetAll() {
    this.products = JSON.parse(JSON.stringify(CATALOGUE));
    this.checkouts.clear();
    this.orders.clear();
    this.idempotencyRecord.clear();
    this.orderCounter = 100482;
  }

  public getProductBySku(sku: string): Product | undefined {
    return this.products.find((p) => p.sku === sku);
  }

  public getProductBySlug(slug: string): Product | undefined {
    return this.products.find((p) => p.slug === slug);
  }

  public deductStock(sku: string, qty: number): boolean {
    const prod = this.products.find((p) => p.sku === sku);
    if (!prod) return false;
    if (prod.stock < qty) return false;
    prod.stock -= qty;
    return true;
  }

  public getStock(sku: string): number {
    const prod = this.products.find((p) => p.sku === sku);
    return prod ? prod.stock : 0;
  }
}

export const mockStore = new InMemStore();
