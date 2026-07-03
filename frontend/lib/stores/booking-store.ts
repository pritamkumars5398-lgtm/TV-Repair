import { create } from 'zustand';
import type { BookingFormData, ServiceType } from '@/types';

interface BookingStore {
  step: number;
  formData: Partial<BookingFormData>;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateFormData: (data: Partial<BookingFormData>) => void;
  reset: () => void;
}

const initialData: Partial<BookingFormData> = {
  photos: [],
  isPickup: false,
  serviceType: 'TV_REPAIR',
};

export const useBookingStore = create<BookingStore>((set) => ({
  step: 1,
  formData: initialData,
  setStep: (step) => set({ step }),
  nextStep: () => set((s) => ({ step: Math.min(s.step + 1, 3) })),
  prevStep: () => set((s) => ({ step: Math.max(s.step - 1, 1) })),
  updateFormData: (data) =>
    set((s) => ({ formData: { ...s.formData, ...data } })),
  reset: () => set({ step: 1, formData: initialData }),
}));
