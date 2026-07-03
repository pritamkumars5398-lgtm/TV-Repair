import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import Cookies from 'js-cookie';

interface Customer {
  id: string;
  name: string;
  email: string;
}

interface CustomerState {
  customer: Customer | null;
  token: string | null;
  setAuth: (customer: Customer, token: string) => void;
  logout: () => void;
}

export const useCustomerStore = create<CustomerState>()(
  persist(
    (set) => ({
      customer: null,
      token: null,
      setAuth: (customer, token) => {
        Cookies.set('customerToken', token, { expires: 30, secure: process.env.NODE_ENV === 'production' });
        set({ customer, token });
      },
      logout: () => {
        Cookies.remove('customerToken');
        set({ customer: null, token: null });
      },
    }),
    {
      name: 'customer-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
