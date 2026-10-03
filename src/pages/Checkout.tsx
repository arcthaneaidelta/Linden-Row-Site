import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCheckoutStore } from '../state/checkoutStore';
import { useCartStore } from '../state/cartStore';
import { mockApi } from '../mock/mockApi';
import { customerDetailsSchema, cardPaymentSchema, type CustomerDetails, type CardPayment } from '../lib/validators';
import { FormField, CheckboxField } from '../components/ui/FormField';
import { Button } from '../components/ui/Button';
import { CheckoutStepper } from '../components/commerce/CheckoutStepper';
import { ShippingOption } from '../components/commerce/ShippingOption';
import { CardInput } from '../components/commerce/CardInput';
import { OrderSummary } from '../components/commerce/OrderSummary';
import { Skeleton } from '../components/ui/Skeleton';
import { formatMoney } from '../lib/money';
import {
  Lock,
  AlertTriangle,
  AlertCircle,
  Check,
  ArrowRight,
  Server,
  Sparkles,
} from 'lucide-react';

export const Checkout: React.FC = () => {
  const navigate = useNavigate();

  const {
    checkout,
    setCheckout,
    activeStep,
    setActiveStep,
    completedSteps,
    markStepComplete,
    customerData,
    setCustomerData,
    fillSampleDetails,
    availableShippingMethods,
    setAvailableShippingMethods,
    selectedShippingMethod,
    setSelectedShippingMethod,
    isSavingDetails,
    isLoadingShipping,
    isProcessingPayment,
    serverNotice,
    setServerNotice,
    paymentError,
    setPaymentError,
    currentIdempotencyKey,
    open3DSModal,
    openStockResolution,
    setLatestOrder,
    openWalletSheet,
  } = useCheckoutStore();

  const { items: cartItems, clearCart } = useCartStore();

  // Form field errors
  const [detailsErrors, setDetailsErrors] = useState<Partial<Record<keyof CustomerDetails, string>>>({});
  const [cardData, setCardData] = useState<CardPayment>({
    cardNumber: '4242 4242 4242 4242',
    expiry: '12/28',
    cvc: '314',
    nameOnCard: 'Amelia Hartwell',
  });
  const [cardErrors, setCardErrors] = useState<Partial<Record<keyof CardPayment, string>>>({});

  // Ensure checkout session exists or initialize from cart
  useEffect(() => {
    if (!checkout) {
      if (cartItems.length === 0) {
        // Redirect to shop if bag is empty
        navigate('/shop');
        return;
      }

      // Initialize session
      const initSession = async () => {
        const res = await mockApi.createCheckoutSession(
          cartItems.map((i: any) => ({ sku: i.sku, quantity: i.quantity, size: i.size }))
        );
        if (res.ok && res.data) {
          setCheckout(res.data.checkout);
          if (res.data.priceTamperedNotice) {
            setServerNotice(res.data.priceTamperedNotice);
          }
        }
      };
      initSession();
    }
  }, [checkout, cartItems, navigate, setCheckout, setServerNotice]);

  // Step 1: Submit Customer & Address
  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkout) return;

    const result = customerDetailsSchema.safeParse(customerData);
    if (!result.success) {
      const errors: Partial<Record<keyof CustomerDetails, string>> = {};
      result.error.issues.forEach((err: any) => {
        if (err.path[0]) {
          errors[err.path[0] as keyof CustomerDetails] = err.message;
        }
      });
      setDetailsErrors(errors);
      return;
    }

    setDetailsErrors({});
    useCheckoutStore.setState({ isSavingDetails: true });

    try {
      const res = await mockApi.saveCustomerDetails(checkout.id, customerData);
      useCheckoutStore.setState({ isSavingDetails: false });

      if (res.ok && res.data) {
        setCheckout(res.data);
        markStepComplete(1);
        setActiveStep(2);

        // Fetch shipping methods
        useCheckoutStore.setState({ isLoadingShipping: true });
        const shipRes = await mockApi.getShippingMethods(checkout.id);
        useCheckoutStore.setState({ isLoadingShipping: false });

        if (shipRes.ok && shipRes.data) {
          setAvailableShippingMethods(shipRes.data);
          // Auto select first or free option
          const defaultShip = shipRes.data[0];
          setSelectedShippingMethod(defaultShip);
          const applyRes = await mockApi.selectShippingMethod(checkout.id, defaultShip);
          if (applyRes.ok && applyRes.data) {
            setCheckout(applyRes.data);
          }
        }
      }
    } catch (err: any) {
      useCheckoutStore.setState({ isSavingDetails: false });
      console.error(err);
    }
  };

  // Step 2: Select Shipping Option
  const handleSelectShipping = async (method: any) => {
    if (!checkout) return;
    setSelectedShippingMethod(method);

    const res = await mockApi.selectShippingMethod(checkout.id, method);
    if (res.ok && res.data) {
      setCheckout(res.data);
    }
  };

  const handleContinueToPayment = () => {
    markStepComplete(2);
    setActiveStep(3);
  };

  // Step 3: Pay with Card / Double-click protection test
  const handlePay = async () => {
    if (!checkout) return;
    setPaymentError(null);

    const result = cardPaymentSchema.safeParse(cardData);
    if (!result.success) {
      const errors: Partial<Record<keyof CardPayment, string>> = {};
      result.error.issues.forEach((err: any) => {
        if (err.path[0]) {
          errors[err.path[0] as keyof CardPayment] = err.message;
        }
      });
      setCardErrors(errors);
      return;
    }

    setCardErrors({});
    useCheckoutStore.setState({ isProcessingPayment: true });

    try {
      const res = await mockApi.payCheckout(checkout.id, {
        cardNumber: cardData.cardNumber,
        expiry: cardData.expiry,
        cvc: cardData.cvc,
        nameOnCard: cardData.nameOnCard,
        idempotencyKey: currentIdempotencyKey,
      });

      useCheckoutStore.setState({ isProcessingPayment: false });

      if (!res.ok) {
        if (res.error?.code === 'OUT_OF_STOCK' && res.error.details) {
          openStockResolution({
            sku: res.error.details.sku,
            name: res.error.details.name || 'Item',
            colour: res.error.details.colour || '',
            size: res.error.details.size || '',
            availableStock: res.error.details.available,
          });
        } else {
          setPaymentError(res.error?.message || 'Payment failed.');
        }
        return;
      }

      if (res.data) {
        if (res.data.requires3DS && res.data.clientSecret) {
          // Open bank 3DS Challenge modal
          open3DSModal(res.data.clientSecret);
        } else if (res.data.order) {
          setLatestOrder(res.data.order);
          clearCart();
          navigate(`/order/${res.data.order.id}`);
        }
      }
    } catch (err: any) {
      useCheckoutStore.setState({ isProcessingPayment: false });
      setPaymentError('Network error connecting to payment gateway.');
    }
  };

  if (!checkout) {
    return (
      <div className="min-h-screen pt-24 px-4 max-w-7xl mx-auto flex items-center justify-center">
        <div className="p-8 text-center space-y-3">
          <Skeleton variant="row" className="w-48 mx-auto" />
          <p className="text-xs font-mono text-ink-muted">Initializing BigCommerce Checkout Session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-16 bg-bg">
      {/* Checkout Top Bar */}
      <div className="border-b border-border bg-surface px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/shop" className="font-serif text-xl font-normal lowercase tracking-wide">
            linden row
          </Link>
          <div className="flex items-center gap-2 text-xs font-mono text-ink-muted">
            <Lock className="w-3.5 h-3.5 text-success" />
            <span>256-bit Encrypted Checkout</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
        {/* Tamper Alert Notice if Price Tampering was tested */}
        {serverNotice && (
          <div className="mb-6 p-4 bg-accent-soft/80 border border-accent/30 rounded-xs flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
            <div className="text-xs text-ink">
              <strong className="font-semibold text-accent block mb-0.5">Security Barrier Triggered:</strong>
              {serverNotice}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          {/* Left Column: 3-Step Accordion Forms (60%) */}
          <div className="lg:col-span-7 space-y-6">
            <CheckoutStepper
              activeStep={activeStep}
              completedSteps={completedSteps}
              onStepClick={(s) => setActiveStep(s)}
            />

            {/* STEP 1: Details & Address */}
            <div className="bg-surface-elevated rounded-sm border border-border overflow-hidden">
              <div
                onClick={() => completedSteps.includes(1) && setActiveStep(1)}
                className={`p-5 flex items-center justify-between border-b border-border ${
                  completedSteps.includes(1) && activeStep !== 1 ? 'cursor-pointer hover:bg-surface' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono ${
                    completedSteps.includes(1) ? 'bg-success text-white' : 'bg-primary text-surface'
                  }`}>
                    {completedSteps.includes(1) ? <Check className="w-3.5 h-3.5" /> : '1'}
                  </span>
                  <h2 className="font-serif text-lg text-ink font-normal">Contact & Shipping Address</h2>
                </div>

                {completedSteps.includes(1) && activeStep !== 1 && (
                  <button className="text-xs font-mono text-accent hover:underline">
                    Edit
                  </button>
                )}
              </div>

              {activeStep === 1 ? (
                <form onSubmit={handleDetailsSubmit} className="p-6 space-y-4">
                  {/* Sample auto-fill demo button */}
                  <div className="flex items-center justify-between pb-2 border-b border-border">
                    <span className="text-xs text-ink-muted">Guest Checkout</span>
                    <button
                      type="button"
                      onClick={fillSampleDetails}
                      className="inline-flex items-center gap-1 text-xs font-mono text-accent hover:underline"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Fill with sample details</span>
                    </button>
                  </div>

                  <FormField
                    label="Email Address"
                    type="email"
                    placeholder="amelia.hartwell@example.com"
                    value={customerData.email}
                    onChange={(e) => setCustomerData({ email: e.target.value })}
                    error={detailsErrors.email}
                    showSuccessCheck={!!customerData.email && !detailsErrors.email}
                    required
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <FormField
                      label="First Name"
                      placeholder="Amelia"
                      value={customerData.firstName}
                      onChange={(e) => setCustomerData({ firstName: e.target.value })}
                      error={detailsErrors.firstName}
                      required
                    />
                    <FormField
                      label="Last Name"
                      placeholder="Hartwell"
                      value={customerData.lastName}
                      onChange={(e) => setCustomerData({ lastName: e.target.value })}
                      error={detailsErrors.lastName}
                      required
                    />
                  </div>

                  <FormField
                    label="Phone Number"
                    type="tel"
                    placeholder="+44 7700 900412"
                    value={customerData.phone}
                    onChange={(e) => setCustomerData({ phone: e.target.value })}
                    error={detailsErrors.phone}
                    helperText="For carrier delivery notifications only"
                    required
                  />

                  <div className="pt-2 border-t border-border">
                    <FormField
                      label="Street Address"
                      placeholder="14 Calder Mews"
                      value={customerData.addressLine1}
                      onChange={(e) => setCustomerData({ addressLine1: e.target.value })}
                      error={detailsErrors.addressLine1}
                      required
                    />

                    <FormField
                      label="Apartment, suite, etc. (Optional)"
                      placeholder="Apt 3B"
                      value={customerData.addressLine2 || ''}
                      onChange={(e) => setCustomerData({ addressLine2: e.target.value })}
                    />

                    <div className="grid grid-cols-2 gap-3">
                      <FormField
                        label="City"
                        placeholder="Bristol"
                        value={customerData.city}
                        onChange={(e) => setCustomerData({ city: e.target.value })}
                        error={detailsErrors.city}
                        required
                      />
                      <FormField
                        label="Postcode"
                        placeholder="BS1 5TQ"
                        value={customerData.postcode}
                        onChange={(e) => setCustomerData({ postcode: e.target.value })}
                        error={detailsErrors.postcode}
                        showSuccessCheck={!!customerData.postcode && !detailsErrors.postcode}
                        required
                      />
                    </div>

                    <CheckboxField
                      label="Billing address same as shipping"
                      checked={customerData.billingSameAsShipping}
                      onChange={(e) => setCustomerData({ billingSameAsShipping: e.target.checked })}
                    />
                  </div>

                  <div className="pt-4 flex justify-end">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="w-full sm:w-auto px-8"
                      isLoading={isSavingDetails}
                      loadingText="Saving to BigCommerce..."
                      rightIcon={<ArrowRight className="w-4 h-4" />}
                    >
                      Continue to Delivery
                    </Button>
                  </div>
                </form>
              ) : completedSteps.includes(1) ? (
                <div className="px-6 py-3 bg-surface text-xs text-ink-2 flex justify-between items-center">
                  <span>
                    {customerData.firstName} {customerData.lastName} · {customerData.addressLine1}, {customerData.city} {customerData.postcode}
                  </span>
                </div>
              ) : null}
            </div>

            {/* STEP 2: Delivery Options */}
            <div className="bg-surface-elevated rounded-sm border border-border overflow-hidden">
              <div
                onClick={() => completedSteps.includes(2) && setActiveStep(2)}
                className={`p-5 flex items-center justify-between border-b border-border ${
                  completedSteps.includes(2) && activeStep !== 2 ? 'cursor-pointer hover:bg-surface' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono ${
                    completedSteps.includes(2) ? 'bg-success text-white' : activeStep === 2 ? 'bg-primary text-surface' : 'bg-secondary text-ink-muted'
                  }`}>
                    {completedSteps.includes(2) ? <Check className="w-3.5 h-3.5" /> : '2'}
                  </span>
                  <h2 className="font-serif text-lg text-ink font-normal">Delivery Method</h2>
                </div>

                {completedSteps.includes(2) && activeStep !== 2 && (
                  <button className="text-xs font-mono text-accent hover:underline">
                    Edit
                  </button>
                )}
              </div>

              {activeStep === 2 ? (
                <div className="p-6 space-y-4">
                  {isLoadingShipping ? (
                    <div className="space-y-3">
                      <Skeleton variant="row" />
                      <Skeleton variant="row" />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {availableShippingMethods.map((method: any) => (
                        <ShippingOption
                          key={method.shippingMethodId}
                          method={method}
                          isSelected={selectedShippingMethod?.shippingMethodId === method.shippingMethodId}
                          onSelect={handleSelectShipping}
                        />
                      ))}
                    </div>
                  )}

                  <div className="pt-4 flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => setActiveStep(1)}
                      className="text-xs text-ink-muted hover:text-ink underline"
                    >
                      Return to customer details
                    </button>

                    <Button
                      type="button"
                      variant="primary"
                      size="lg"
                      onClick={handleContinueToPayment}
                      rightIcon={<ArrowRight className="w-4 h-4" />}
                    >
                      Continue to Payment
                    </Button>
                  </div>
                </div>
              ) : completedSteps.includes(2) && selectedShippingMethod ? (
                <div className="px-6 py-3 bg-surface text-xs text-ink-2 flex justify-between items-center">
                  <span>
                    {selectedShippingMethod.shippingMethodName} ({selectedShippingMethod.estimatedDelivery})
                  </span>
                  <span className="font-medium">
                    {selectedShippingMethod.shippingCostPence === 0 ? 'Free' : formatMoney(selectedShippingMethod.shippingCostPence)}
                  </span>
                </div>
              ) : null}
            </div>

            {/* STEP 3: Payment (Stripe Card + 3DS) */}
            <div className="bg-surface-elevated rounded-sm border border-border overflow-hidden">
              <div className="p-5 flex items-center justify-between border-b border-border">
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono ${
                    activeStep === 3 ? 'bg-primary text-surface' : 'bg-secondary text-ink-muted'
                  }`}>
                    3
                  </span>
                  <h2 className="font-serif text-lg text-ink font-normal">Payment</h2>
                </div>
              </div>

              {activeStep === 3 ? (
                <div className="p-6 space-y-6">
                  {/* Express Wallets Row */}
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-ink-muted block mb-2">
                      Express Wallets
                    </span>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        variant="wallet-apple"
                        size="md"
                        onClick={() => openWalletSheet('Apple Pay')}
                      >
                        Apple Pay
                      </Button>
                      <Button
                        variant="wallet-google"
                        size="md"
                        onClick={() => openWalletSheet('Google Pay')}
                      >
                        Google Pay
                      </Button>
                    </div>
                  </div>

                  <div className="relative flex items-center justify-center">
                    <div className="w-full h-[1px] bg-border" />
                    <span className="bg-surface-elevated px-3 text-xs uppercase font-mono text-ink-muted">
                      Or pay with card
                    </span>
                  </div>

                  {/* Payment Error / Card Decline Banner */}
                  {paymentError && (
                    <div className="p-3.5 bg-error/10 border border-error/20 rounded-xs flex items-start gap-2.5 text-xs text-error">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block font-semibold">Payment Unsuccessful</strong>
                        {paymentError}
                      </div>
                    </div>
                  )}

                  {/* Stripe Card Input Form */}
                  <CardInput
                    formData={cardData}
                    onChange={(update) => setCardData({ ...cardData, ...update })}
                    errors={cardErrors}
                  />

                  {/* Pay Primary Button */}
                  <div className="pt-2">
                    <Button
                      variant="primary"
                      size="lg"
                      className="w-full text-base font-medium py-3.5"
                      isLoading={isProcessingPayment}
                      loadingText="Processing with Stripe & BigCommerce..."
                      onClick={handlePay}
                      leftIcon={<Lock className="w-4 h-4" />}
                    >
                      Pay {formatMoney(checkout.grandTotalPence)}
                    </Button>

                    <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-ink-muted">
                      <Server className="w-3.5 h-3.5 text-success" />
                      <span>Authoritative order created in BigCommerce after payment confirmation</span>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          {/* Right Column: Sticky BigCommerce Order Summary (40%) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <OrderSummary checkout={checkout} />
          </div>
        </div>
      </div>
    </div>
  );
};
