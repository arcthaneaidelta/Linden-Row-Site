import { create } from 'zustand';
import { BigCommerceCheckout, CheckoutConsignment, BigCommerceOrder } from '../mock/store';
import { CustomerDetails } from '../lib/validators';
import { generateIdempotencyKey } from '../lib/idempotency';

export interface CheckoutState {
  checkout: BigCommerceCheckout | null;
  activeStep: 1 | 2 | 3;
  completedSteps: number[];
  
  customerData: CustomerDetails;
  availableShippingMethods: CheckoutConsignment[];
  selectedShippingMethod: CheckoutConsignment | null;

  // Loading states
  isCheckingAvailability: boolean;
  isSavingDetails: boolean;
  isLoadingShipping: boolean;
  isProcessingPayment: boolean;

  // Server Authoritative Notices & Errors
  serverNotice: string | null;
  paymentError: string | null;
  currentIdempotencyKey: string;

  // Modals & Overlays
  stockResolutionModal: {
    isOpen: boolean;
    sku: string;
    name: string;
    colour: string;
    size: string;
    availableStock: number;
  } | null;

  is3DSModalOpen: boolean;
  threeDSClientSecret: string | null;

  walletSheet: {
    isOpen: boolean;
    type: 'Apple Pay' | 'Google Pay';
    expressProduct?: {
      sku: string;
      name: string;
      pricePence: number;
      size: string;
      image: string;
    };
  } | null;

  latestOrder: BigCommerceOrder | null;
  isOrderRecordModalOpen: boolean;

  // Actions
  setCheckout: (checkout: BigCommerceCheckout | null) => void;
  setActiveStep: (step: 1 | 2 | 3) => void;
  markStepComplete: (step: number) => void;
  setCustomerData: (data: Partial<CustomerDetails>) => void;
  fillSampleDetails: () => void;
  setAvailableShippingMethods: (methods: CheckoutConsignment[]) => void;
  setSelectedShippingMethod: (method: CheckoutConsignment | null) => void;
  setServerNotice: (notice: string | null) => void;
  setPaymentError: (error: string | null) => void;
  regenerateIdempotencyKey: () => void;
  
  // Modals
  openStockResolution: (info: { sku: string; name: string; colour: string; size: string; availableStock: number }) => void;
  closeStockResolution: () => void;
  open3DSModal: (clientSecret: string) => void;
  close3DSModal: () => void;
  openWalletSheet: (type: 'Apple Pay' | 'Google Pay', expressProduct?: any) => void;
  closeWalletSheet: () => void;
  setLatestOrder: (order: BigCommerceOrder | null) => void;
  setOrderRecordModalOpen: (open: boolean) => void;
  resetCheckout: () => void;
}

const defaultCustomerData: CustomerDetails = {
  email: '',
  firstName: '',
  lastName: '',
  phone: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  postcode: '',
  country: 'United Kingdom',
  billingSameAsShipping: true,
  billingAddressLine1: '',
  billingCity: '',
  billingPostcode: '',
};

const sampleCustomerData: CustomerDetails = {
  email: 'amelia.hartwell@example.com',
  firstName: 'Amelia',
  lastName: 'Hartwell',
  phone: '+44 7700 900412',
  addressLine1: '14 Calder Mews',
  addressLine2: 'Apt 3B',
  city: 'Bristol',
  postcode: 'BS1 5TQ',
  country: 'United Kingdom',
  billingSameAsShipping: true,
};

export const useCheckoutStore = create<CheckoutState>((set, get) => ({
  checkout: null,
  activeStep: 1,
  completedSteps: [],
  customerData: defaultCustomerData,
  availableShippingMethods: [],
  selectedShippingMethod: null,

  isCheckingAvailability: false,
  isSavingDetails: false,
  isLoadingShipping: false,
  isProcessingPayment: false,

  serverNotice: null,
  paymentError: null,
  currentIdempotencyKey: generateIdempotencyKey('idem_pay'),

  stockResolutionModal: null,
  is3DSModalOpen: false,
  threeDSClientSecret: null,
  walletSheet: null,
  latestOrder: null,
  isOrderRecordModalOpen: false,

  setCheckout: (checkout) => set({ checkout }),
  setActiveStep: (step) => set({ activeStep: step }),
  markStepComplete: (step) =>
    set((state) => ({
      completedSteps: Array.from(new Set([...state.completedSteps, step])),
    })),

  setCustomerData: (data) =>
    set((state) => ({
      customerData: { ...state.customerData, ...data },
    })),

  fillSampleDetails: () =>
    set({
      customerData: { ...sampleCustomerData },
    }),

  setAvailableShippingMethods: (methods) => set({ availableShippingMethods: methods }),
  setSelectedShippingMethod: (method) => set({ selectedShippingMethod: method }),
  setServerNotice: (notice) => set({ serverNotice: notice }),
  setPaymentError: (error) => set({ paymentError: error }),
  regenerateIdempotencyKey: () => set({ currentIdempotencyKey: generateIdempotencyKey('idem_pay') }),

  openStockResolution: (info) =>
    set({
      stockResolutionModal: {
        isOpen: true,
        ...info,
      },
    }),
  closeStockResolution: () => set({ stockResolutionModal: null }),

  open3DSModal: (clientSecret) =>
    set({
      is3DSModalOpen: true,
      threeDSClientSecret: clientSecret,
    }),
  close3DSModal: () => set({ is3DSModalOpen: false, threeDSClientSecret: null }),

  openWalletSheet: (type, expressProduct) =>
    set({
      walletSheet: {
        isOpen: true,
        type,
        expressProduct,
      },
    }),
  closeWalletSheet: () => set({ walletSheet: null }),

  setLatestOrder: (order) => set({ latestOrder: order }),
  setOrderRecordModalOpen: (open) => set({ isOrderRecordModalOpen: open }),

  resetCheckout: () =>
    set({
      checkout: null,
      activeStep: 1,
      completedSteps: [],
      customerData: defaultCustomerData,
      availableShippingMethods: [],
      selectedShippingMethod: null,
      serverNotice: null,
      paymentError: null,
      currentIdempotencyKey: generateIdempotencyKey('idem_pay'),
      stockResolutionModal: null,
      is3DSModalOpen: false,
      threeDSClientSecret: null,
      walletSheet: null,
    }),
}));
