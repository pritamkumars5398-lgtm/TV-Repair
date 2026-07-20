import { apiClient } from './axios';
import type { ApiResponse, TechnicianDashboardStats, Job } from '@/types';

export const technicianApi = {
  getDashboard: () =>
    apiClient.get<ApiResponse<TechnicianDashboardStats>>('/technician/dashboard').then((r) => r.data),

  getJobs: (params?: { status?: string; technicianId?: string }) =>
    apiClient.get<ApiResponse<Job[]>>('/technician/jobs', { params }).then((r) => r.data),

  getJobDetail: (ticketId: string) =>
    apiClient.get<ApiResponse<Job & { statusHistory: { status: string; note?: string; createdAt: string }[] }>>(`/technician/jobs/${ticketId}`).then((r) => r.data),

  updateJobStatus: (ticketId: string, data: { status: string; note?: string }) =>
    apiClient.put<ApiResponse<Job>>(`/technician/jobs/${ticketId}/status`, data).then((r) => r.data),

  addRepairNote: (ticketId: string, note: string) =>
    apiClient.post<ApiResponse<{ id: string }>>(`/technician/jobs/${ticketId}/notes`, { note }).then((r) => r.data),

  createEstimate: (ticketId: string, data: { amount: number; breakdown: string }) =>
    apiClient.post<ApiResponse<{ estimateId: string }>>(`/technician/jobs/${ticketId}/estimate`, data).then((r) => r.data),

  uploadPhoto: (ticketId: string, formData: FormData) =>
    apiClient.post<ApiResponse<{ url: string }>>(`/technician/jobs/${ticketId}/photos`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data),

  markOnTheWay: (ticketId: string) =>
    apiClient.post<ApiResponse<{ otp: string }>>(`/technician/jobs/${ticketId}/on-the-way`).then((r) => r.data),

  verifyPickupOtp: (ticketId: string, otp: string) =>
    apiClient.post<ApiResponse<Job>>(`/technician/jobs/${ticketId}/verify-pickup`, { otp }).then((r) => r.data),

  notifyPickup: (ticketId: string) =>
    apiClient.post<ApiResponse<any>>(`/technician/jobs/${ticketId}/notify-pickup`).then((r) => r.data),
};
