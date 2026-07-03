import { apiClient } from './axios';
import type {
  ApiResponse,
  BookingFormData,
  BookingResponse,
  BookingVerifyResponse,
  ContactFormData,
  TrackTicketResponse,
} from '@/types';

export const publicApi = {
  getProducts: () =>
    apiClient.get('/products').then((r) => r.data),

  submitLead: (data: ContactFormData) =>
    apiClient.post<ApiResponse<{ leadId: string }>>('/public/leads', data).then((r) => r.data),

  submitInquiry: (data: ContactFormData & { productInterest: string }) =>
    apiClient.post<ApiResponse<{ inquiryId: string }>>('/public/inquiries', data).then((r) => r.data),

  createBooking: (data: BookingFormData) =>
    apiClient.post<ApiResponse<BookingResponse>>('/public/bookings', data).then((r) => r.data),

  verifyPayment: (payload: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    bookingId: string;
  }) =>
    apiClient
      .post<ApiResponse<BookingVerifyResponse>>('/public/bookings/verify-payment', payload)
      .then((r) => r.data),

  trackTicket: (ticketId: string) =>
    apiClient
      .get<ApiResponse<TrackTicketResponse>>(`/public/track/${ticketId}`)
      .then((r) => r.data),

  submitRating: (data: { ticketId: string; rating: number; comment?: string }) =>
    apiClient.post<ApiResponse<{ ratingId: string }>>('/public/ratings', data).then((r) => r.data),

  // Blogs
  getBlogs: () =>
    apiClient.get<any[]>('/blogs').then((r) => r.data),

  getBlogBySlug: (slug: string) =>
    apiClient.get<any>(`/blogs/slug/${slug}`).then((r) => r.data),

  // Feedbacks
  submitFeedback: (data: { name: string; email?: string; rating: number; message: string }) =>
    apiClient.post<ApiResponse<any>>('/feedbacks', data).then((r) => r.data),

  // Customer Auth
  registerCustomer: (data: any) =>
    apiClient.post<any>('/customer-auth/register', data).then((r) => r.data),
  
  loginCustomer: (data: any) =>
    apiClient.post<any>('/customer-auth/login', data).then((r) => r.data),
};
