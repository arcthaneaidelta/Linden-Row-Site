import { z } from 'zod';

export const customerDetailsSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().regex(/^[+0-9\s-]{10,15}$/, 'Please enter a valid phone number (min 10 digits)'),
  addressLine1: z.string().min(1, 'Street address is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  postcode: z.string().regex(/^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i, 'Please enter a valid UK postcode (e.g. BS1 5TQ, SW1A 1AA)'),
  country: z.string().default('United Kingdom'),
  billingSameAsShipping: z.boolean().default(true),
  billingAddressLine1: z.string().optional(),
  billingCity: z.string().optional(),
  billingPostcode: z.string().optional(),
});

export type CustomerDetails = z.infer<typeof customerDetailsSchema>;

export const cardPaymentSchema = z.object({
  cardNumber: z.string().min(15, 'Please enter a valid 16-digit card number').max(19),
  expiry: z.string().regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, 'Format MM/YY'),
  cvc: z.string().regex(/^[0-9]{3,4}$/, '3 or 4 digits'),
  nameOnCard: z.string().min(2, 'Name on card is required'),
});

export type CardPayment = z.infer<typeof cardPaymentSchema>;

export const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Please enter a valid email address'),
  message: z.string().min(5, 'Please enter a short message'),
});

export type ContactFormData = z.infer<typeof contactSchema>;
