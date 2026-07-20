export type UserRole = 'customer' | 'technician' | 'manager' | 'admin';

export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

export type ServiceType =
  | 'TV_REPAIR'
  | 'SPEAKER_REPAIR'
  | 'HOME_VISIT'
  | 'SPEAKER_INSTALL'
  | 'HOME_THEATER';

export type LeadSource =
  | 'WEBSITE'
  | 'WHATSAPP'
  | 'CHATBOT'
  | 'PHONE_CALL'
  | 'FACEBOOK'
  | 'GOOGLE'
  | 'REFERRAL';

export type TicketStatus =
  | 'tv_received'
  | 'diagnosis_completed'
  | 'parts_ordered'
  | 'repair_in_progress'
  | 'quality_check'
  | 'ready_for_delivery'
  | 'delivered';

export type LeadStatus =
  | 'NEW'
  | 'CONTACTED'
  | 'INSPECTION_SCHEDULED'
  | 'TV_RECEIVED'
  | 'REPAIR_IN_PROGRESS'
  | 'QUALITY_CHECK'
  | 'READY'
  | 'DELIVERED'
  | 'CLOSED';

export type PaymentStatus = 'PENDING' | 'CAPTURED' | 'FAILED' | 'REFUNDED';

export interface Ticket {
  id: string;
  ticketId: string;
  serviceType: ServiceType;
  status: TicketStatus;
  device: string;
  customerName: string;
  customerPhone: string;
  address: string;
  scheduledAt: string;
  preferredDate?: string;
  preferredTime?: string;
  createdAt: string;
  technicianName?: string;
  technicianPhone?: string;
  issueDescription?: string;
  repairNotes?: string;
  estimateAmount?: number;
  estimateBreakdown?: string;
  techAssessmentAmount?: number;
  techAssessmentBreakdown?: string;
  adminEstimateAmount?: number;
  adminEstimateBreakdown?: string;
  estimateStatus?: string;
  invoiceAmount?: number;
}

export interface StatusHistoryEntry {
  status: TicketStatus;
  note?: string;
  createdAt: string;
}

export interface TrackTicketResponse {
  ticketId: string;
  serviceType: string;
  status: TicketStatus;
  statusHistory: StatusHistoryEntry[];
  adminEstimateAmount?: number;
  adminEstimateBreakdown?: string;
  estimateStatus?: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  source: LeadSource;
  status: LeadStatus;
  serviceType?: ServiceType;
  message?: string;
  assignedTo?: string;
  assignedToName?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface BookingFormData {
  name: string;
  phone: string;
  email: string;
  serviceType: ServiceType;
  preferredDate: string;
  preferredTime: string;
  issueDescription: string;
  tvBrand?: string;
  tvSize?: string;
  tvType?: string;
  modelNumber?: string;
  photos: File[];
  address: string;
  area: string;
  city: string;
  pincode: string;
  isPickup: boolean;
}

export interface ContactFormData {
  name: string;
  phone: string;
  email?: string;
  serviceType: string;
  message: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  specifications: string[];
  priceRange: string;
  imageUrl?: string;
}

export interface Testimonial {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  serviceType: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface BookingResponse {
  razorpayOrderId: string;
  bookingId: string;
  amount: number;
}

export interface BookingVerifyResponse {
  ticketId: string;
  success: boolean;
}

// Auth
export interface LoginPayload {
  phone: string;
  otp: string;
  role?: UserRole;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface OtpResponse {
  success: boolean;
  message: string;
}

// Customer Portal
export interface CustomerDashboardStats {
  activeTickets: number;
  completedRepairs: number;
  pendingPayments: number;
  totalSpent: number;
}

export interface Payment {
  id: string;
  ticketId: string;
  amount: number;
  status: PaymentStatus;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  createdAt: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  ticketId: string;
  amount: number;
  tax: number;
  total: number;
  status: 'DRAFT' | 'SENT' | 'PAID';
  createdAt: string;
  pdfUrl?: string;
}

export interface Query {
  id: string;
  subject: string;
  message: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  replies: QueryReply[];
  createdAt: string;
}

export interface QueryReply {
  id: string;
  message: string;
  isStaff: boolean;
  createdAt: string;
}

// Admin
export interface AdminDashboardStats {
  newLeadsToday: number;
  activeTickets: number;
  techniciansOnField: number;
  revenueThisMonth: number;
  pendingPayments: number;
  completedJobsToday: number;
}

export interface RevenueDataPoint {
  date: string;
  revenue: number;
}

export interface LeadSourceDataPoint {
  source: string;
  count: number;
}

export interface Technician {
  id: string;
  name: string;
  phone: string;
  email?: string;
  specialization: string;
  photo?: string;
  isActive: boolean;
  jobsCompleted: number;
  rating?: number;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  totalRepairs: number;
  totalSpent: number;
  createdAt: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  sku: string;
  quantity: number;
  reorderLevel: number;
  unitPrice: number;
  status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
  updatedAt: string;
}

// Technician
export interface TechnicianDashboardStats {
  todayJobs: number;
  pendingJobs: number;
  completedToday: number;
  rating: number;
}

export interface Job {
  id: string;
  ticketId: string;
  customerName: string;
  customerPhone: string;
  address: string;
  serviceType: ServiceType;
  status: TicketStatus;
  scheduledAt: string;
  issueDescription?: string;
  repairNotes?: string;
  estimateAmount?: number;
  photos?: string[];
}
