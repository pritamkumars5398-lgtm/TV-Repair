import { apiClient } from './axios';
import type {
  ApiResponse,
  PaginatedResponse,
  AdminDashboardStats,
  Lead,
  Ticket,
  Customer,
  Technician,
  InventoryItem,
  Payment,
  RevenueDataPoint,
  LeadSourceDataPoint,
} from '@/types';

export const adminApi = {
  // Dashboard
  getDashboard: () =>
    apiClient.get<ApiResponse<AdminDashboardStats>>('/admin/dashboard').then((r) => r.data),

  getRevenueChart: (days = 30) =>
    apiClient.get<ApiResponse<RevenueDataPoint[]>>('/admin/reports/revenue', { params: { days } }).then((r) => r.data),

  getLeadSourceChart: () =>
    apiClient.get<ApiResponse<LeadSourceDataPoint[]>>('/admin/reports/lead-sources').then((r) => r.data),

  // Leads
  getLeads: (params?: { page?: number; limit?: number; status?: string; source?: string; search?: string; serviceType?: string; excludeServiceType?: string }) =>
    apiClient.get<ApiResponse<PaginatedResponse<Lead>>>('/leads', { params }).then((r) => r.data),

  createLead: (data: Partial<Lead>) =>
    apiClient.post<ApiResponse<Lead>>('/leads', data).then((r) => r.data),

  updateLead: (id: string, data: Partial<Lead>) =>
    apiClient.put<ApiResponse<Lead>>(`/leads/${id}`, data).then((r) => r.data),

  assignLead: (id: string, technicianId: string) =>
    apiClient.put<ApiResponse<Lead>>(`/leads/${id}/assign`, { technicianId }).then((r) => r.data),

  // Tickets
  getTickets: (params?: { status?: string; page?: number; limit?: number; search?: string }) =>
    apiClient.get<ApiResponse<PaginatedResponse<Ticket>>>('/tickets', { params }).then((r) => r.data),

  updateTicket: (id: string, data: { status?: string; technicianId?: string; notes?: string }) =>
    apiClient.put<ApiResponse<Ticket>>(`/tickets/${id}`, data).then((r) => r.data),

  assignTechnicianToTicket: (ticketId: string, technicianId: string) =>
    apiClient.post<ApiResponse<Ticket>>(`/admin/tickets/${ticketId}/assign`, { technicianId }).then((r) => r.data),

  sendEstimateToCustomer: (ticketId: string, data: { amount: number; breakdown: string }) =>
    apiClient.post<ApiResponse<any>>(`/admin/tickets/${ticketId}/send-estimate`, data).then((r) => r.data),

  sendMessageToCustomer: (ticketId: string, data: { message: string; date?: string }) =>
    apiClient.post<ApiResponse<any>>(`/admin/tickets/${ticketId}/send-message`, data).then((r) => r.data),

  // Customers
  getCustomers: (params?: { page?: number; limit?: number; search?: string }) =>
    apiClient.get<ApiResponse<PaginatedResponse<Customer>>>('/admin/customers', { params }).then((r) => r.data),

  // Technicians
  getTechnicians: (params?: { page?: number; limit?: number }) =>
    apiClient.get<ApiResponse<PaginatedResponse<Technician>>>('/admin/technicians', { params }).then((r) => r.data),

  createTechnician: (data: Partial<Technician>) =>
    apiClient.post<ApiResponse<Technician>>('/admin/technicians', data).then((r) => r.data),

  updateTechnician: (id: string, data: Partial<Technician>) =>
    apiClient.put<ApiResponse<Technician>>(`/admin/technicians/${id}`, data).then((r) => r.data),

  uploadImage: (formData: FormData) =>
    apiClient.post<{ success: boolean; imageUrl: string }>('/admin/upload-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data),

  // Inventory
  getInventory: (params?: { page?: number; limit?: number; search?: string }) =>
    apiClient.get<ApiResponse<PaginatedResponse<InventoryItem>>>('/admin/inventory', { params }).then((r) => r.data),

  updateStock: (id: string, data: { quantity: number; type: 'IN' | 'OUT' }) =>
    apiClient.put<ApiResponse<InventoryItem>>(`/admin/inventory/${id}/stock`, data).then((r) => r.data),

  // Products
  createProduct: (data: any) =>
    apiClient.post<ApiResponse<any>>('/products', data).then((r) => r.data),

  updateProduct: (id: string, data: any) =>
    apiClient.put<ApiResponse<any>>(`/products/${id}`, data).then((r) => r.data),

  deleteProduct: (id: string) =>
    apiClient.delete<ApiResponse<any>>(`/products/${id}`).then((r) => r.data),

  // Payments
  getPayments: (params?: { status?: string; page?: number; limit?: number }) =>
    apiClient.get<ApiResponse<PaginatedResponse<Payment>>>('/payments', { params }).then((r) => r.data),

  // Reports
  getReports: (params: { from: string; to: string; type: string }) =>
    apiClient.get<ApiResponse<Record<string, unknown>>>('/admin/reports', { params }).then((r) => r.data),

  // Blogs
  getBlogs: (params?: { page?: number; limit?: number }) =>
    apiClient.get<PaginatedResponse<any>>('/blogs/admin', { params }).then((r) => r.data),

  createBlog: (data: any) =>
    apiClient.post<ApiResponse<any>>('/blogs', data).then((r) => r.data),

  uploadBlogImage: (formData: FormData) =>
    apiClient.post<{ imageUrl: string }>('/blogs/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data),

  updateBlog: (id: string, data: any) =>
    apiClient.put<ApiResponse<any>>(`/blogs/${id}`, data).then((r) => r.data),

  deleteBlog: (id: string) =>
    apiClient.delete<ApiResponse<any>>(`/blogs/${id}`).then((r) => r.data),

  // Feedbacks
  getFeedbacks: (params?: { page?: number; limit?: number }) =>
    apiClient.get<PaginatedResponse<any>>('/feedbacks/admin', { params }).then((r) => r.data),

  // Customers (Secondary endpoint or duplicate)
  getCustomersList: (params?: { page?: number; limit?: number; search?: string }) =>
    apiClient.get<PaginatedResponse<any>>('/customers', { params }).then((r) => r.data),

  // Notifications
  getNotifications: () =>
    apiClient.get<ApiResponse<any[]>>('/admin/notifications').then((r) => r.data),
    
  markNotificationRead: (id: string) =>
    apiClient.put<ApiResponse<any>>(`/admin/notifications/${id}/read`).then((r) => r.data),
};
