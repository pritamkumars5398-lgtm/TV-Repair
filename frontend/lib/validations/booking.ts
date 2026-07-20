import { z } from 'zod';

export const step1Schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'),
  email: z.string().email('Enter a valid email address'),
  serviceType: z.enum(['TV_REPAIR', 'SPEAKER_REPAIR', 'HOME_VISIT', 'SPEAKER_INSTALL', 'HOME_THEATER']),
  preferredDate: z.string().min(1, 'Please select a preferred date'),
  preferredTime: z.string().min(1, 'Please select a time slot'),
  issueDescription: z.string().min(10, 'Please describe the issue (min 10 characters)'),
  tvBrand: z.string().optional(),
  tvSize: z.string().optional(),
  tvType: z.string().optional(),
  modelNumber: z.string().optional(),
});

export const step2Schema = z.object({
  address: z.string().min(5, 'Address is required'),
  area: z.string().min(2, 'Area/locality is required'),
  city: z.string().min(2, 'City is required'),
  pincode: z.string().regex(/^\d{6}$/, 'Enter a valid 6-digit pincode'),
  isPickup: z.boolean(),
});

export const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'),
  email: z.string().email('Enter a valid email').optional().or(z.literal('')),
  serviceType: z.string().min(1, 'Please select a service type'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
});

export type Step1Input = z.infer<typeof step1Schema>;
export type Step2Input = z.infer<typeof step2Schema>;
export type ContactInput = z.infer<typeof contactSchema>;
