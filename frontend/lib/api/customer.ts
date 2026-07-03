import { apiClient } from './axios';
import type {
  ApiResponse,
  PaginatedResponse,
  CustomerDashboardStats,
  Ticket,
  Payment,
  Invoice,
  Query,
  User,
} from '@/types';

export const customerApi = {
  getDashboard: () =>
    apiClient.get<ApiResponse<CustomerDashboardStats>>('/customer/dashboard').then((r) => r.data),

  getRepairs: (params?: { status?: string; page?: number; limit?: number }) =>
    apiClient.get<ApiResponse<PaginatedResponse<Ticket>>>('/customer/tickets', { params }).then((r) => r.data),

  getRepairDetail: (ticketId: string) =>
    apiClient.get<ApiResponse<Ticket & { statusHistory: { status: string; note?: string; createdAt: string }[] }>>(`/customer/tickets/${ticketId}`).then((r) => r.data),

  getPayments: () =>
    apiClient.get<ApiResponse<Payment[]>>('/customer/payments').then((r) => r.data),

  createPaymentOrder: (ticketId: string) =>
    apiClient.post<ApiResponse<{ razorpayOrderId: string; amount: number }>>('/customer/payments/order', { ticketId }).then((r) => r.data),

  verifyPayment: (payload: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) =>
    apiClient.post<ApiResponse<{ success: boolean }>>('/customer/payments/verify', payload).then((r) => r.data),

  getInvoices: () =>
    apiClient.get<ApiResponse<Invoice[]>>('/customer/invoices').then((r) => r.data),

  getQueries: () =>
    apiClient.get<ApiResponse<Query[]>>('/customer/queries').then((r) => r.data),

  createQuery: (data: { subject: string; message: string }) =>
    apiClient.post<ApiResponse<Query>>('/customer/queries', data).then((r) => r.data),

  replyQuery: (queryId: string, message: string) =>
    apiClient.post<ApiResponse<{ id: string }>>(`/customer/queries/${queryId}/reply`, { message }).then((r) => r.data),

  getProfile: () =>
    apiClient.get<ApiResponse<User>>('/customer/profile').then((r) => r.data),

  updateProfile: (data: Partial<User>) =>
    apiClient.put<ApiResponse<User>>('/customer/profile', data).then((r) => r.data),
};
