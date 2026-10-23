import { Request, Response } from 'express';
import Ticket from '../models/Ticket';
import { sendPickupOTP, sendAdminPickupAlert } from '../utils/sendSMS';
import Notification from '../models/Notification';
import Technician from '../models/Technician';
import { uploadToCloudinary } from '../utils/cloudinary';

// @desc    Get technician dashboard stats
// @route   GET /api/v1/technician/dashboard
// @access  Private/Technician
export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const technicianId = req.user._id;

    // Get today's jobs (simplified: just active jobs not yet delivered)
    const activeTickets = await Ticket.find({
      technicianId,
      status: { $nin: ['delivered', 'cancelled'] },
    });

    const pendingJobs = activeTickets.length;

    // Completed today (mocked logic or approximate based on statusHistory)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const completedToday = await Ticket.countDocuments({
      technicianId,
      status: 'delivered',
      updatedAt: { $gte: today },
    });

    const technician = await Technician.findById(technicianId);

    res.json({
      success: true,
      data: {
        todayJobs: pendingJobs, // Active jobs assigned
        pendingJobs: pendingJobs,
        completedToday: completedToday,
        rating: technician?.rating || 0,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

// @desc    Get technician's jobs
// @route   GET /api/v1/technician/jobs
// @access  Private/Technician
export const getTechnicianJobs = async (req: Request, res: Response): Promise<void> => {
  try {
    const technicianId = req.user._id;

    const statusFilter = req.query.status as string;
    let query: any = { technicianId };

    if (statusFilter === 'active') {
      query.status = { $nin: ['delivered', 'cancelled'] };
    } else if (statusFilter === 'completed') {
      query.status = 'delivered';
    }

    const jobs = await Ticket.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: jobs,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

// @desc    Mark job as 'On the Way' and generate Pickup OTP
// @route   POST /api/v1/technician/jobs/:ticketId/on-the-way
// @access  Private/Technician
export const markOnTheWay = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ticketId } = req.params;

    const ticket = await Ticket.findOne({ ticketId });
    if (!ticket) {
      res.status(404).json({ success: false, message: 'Ticket not found' });
      return;
    }

    // Generate 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    ticket.pickupOtp = otp;
    
    // In a real app, send OTP via SMS/WhatsApp here.

    ticket.statusHistory.push({
      status: ticket.status,
      note: 'Technician is on the way. OTP generated.',
    });

    await ticket.save();

    // Send OTP via SMS (MSG91 Flow: repaircart-pickup-otp)
    if (ticket.customerPhone) {
      try {
        await sendPickupOTP(ticket.customerPhone, {
          name: ticket.customerName,
          tech_name: ticket.technicianName || 'Our Technician',
          otp,
          contact: ticket.technicianPhone || 'Support',
        });
      } catch (err: any) {
        console.error(`Failed to send OTP SMS to ${ticket.customerPhone}:`, err.message);
      }
    }

    res.json({
      success: true,
      message: 'Status updated. OTP sent to customer.',
      otp, // For demo purposes, we return it
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

// @desc    Verify Pickup OTP and mark as Picked Up
// @route   POST /api/v1/technician/jobs/:ticketId/verify-pickup
// @access  Private/Technician
export const verifyPickupOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ticketId } = req.params;
    const { otp } = req.body;

    const ticket = await Ticket.findOne({ ticketId });
    if (!ticket) {
      res.status(404).json({ success: false, message: 'Ticket not found' });
      return;
    }

    if (ticket.pickupOtp !== otp) {
      res.status(400).json({ success: false, message: 'Invalid OTP' });
      return;
    }

    // Valid OTP
    ticket.status = 'tv_received'; // or "tv_picked_up" if you want to add an intermediate state
    ticket.pickupOtp = ''; // clear it
    
    ticket.statusHistory.push({
      status: 'tv_received',
      note: 'TV Picked Up successfully by technician.',
    });

    await ticket.save();

    // 1. Create a Notification for the Admin
    await Notification.create({
      title: 'Product Received',
      message: `Technician ${ticket.technicianName} has successfully picked up the TV for ticket ${ticket.ticketId}.`,
      type: 'SUCCESS',
      link: '/admin/tickets',
    });

    // 2. Send SMS to Admin (MSG91 Flow: repaircart-admin-pickup-alert)
    const adminPhone = process.env.ADMIN_PHONE || '918586887887';
    try {
      await sendAdminPickupAlert(adminPhone, {
        ticket: ticket.ticketId,
        tech_name: ticket.technicianName || 'Technician',
        customer_name: ticket.customerName,
      });
    } catch (err: any) {
      console.error('Failed to send pickup notification to admin:', err.message);
    }

    res.json({
      success: true,
      message: 'Pickup verified successfully',
      data: ticket,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

// @desc    Notify Admin about Product Pickup
// @route   POST /api/v1/technician/jobs/:ticketId/notify-pickup
// @access  Private/Technician
export const notifyPickup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ticketId } = req.params;
    const ticket = await Ticket.findOne({ ticketId });
    
    if (!ticket) {
      res.status(404).json({ success: false, message: 'Ticket not found' });
      return;
    }

    ticket.statusHistory.push({
      status: ticket.status,
      note: 'Product collected from customer by technician.',
    });
    
    await ticket.save();

    await Notification.create({
      title: 'Product Collected',
      message: `Technician ${ticket.technicianName || 'your technician'} has picked up the product from customer ${ticket.customerName}.`,
      type: 'INFO',
      link: '/admin/tickets',
    });

    res.json({
      success: true,
      message: 'Admin notified successfully',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

// @desc    Create Estimate
// @route   POST /api/v1/technician/jobs/:ticketId/estimate
// @access  Private/Technician
export const createEstimate = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ticketId } = req.params;
    const { amount, breakdown } = req.body;

    const ticket = await Ticket.findOne({ ticketId });
    if (!ticket) {
      res.status(404).json({ success: false, message: 'Ticket not found' });
      return;
    }

    ticket.techAssessmentAmount = amount;
    ticket.techAssessmentBreakdown = breakdown;
    ticket.estimateStatus = 'pending_admin_review';
    
    ticket.statusHistory.push({
      status: ticket.status,
      note: `Assessment sent to Admin. Estimated: ₹${amount}. Breakdown: ${breakdown}`,
    });

    await ticket.save();

    // Create a notification for the Admin
    await Notification.create({
      title: 'Assessment Submitted',
      message: `Technician ${ticket.technicianName || 'your technician'} has submitted a repair assessment for ticket ${ticket.ticketId}. Cost: ₹${amount}.`,
      type: 'INFO',
      link: '/admin/tickets',
    });

    res.json({
      success: true,
      message: 'Assessment submitted to Admin successfully',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};


// @desc    Get Job Detail
// @route   GET /api/v1/technician/jobs/:ticketId
// @access  Private/Technician
export const getJobDetail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ticketId } = req.params;
    const ticket = await Ticket.findOne({ ticketId });
    if (!ticket) {
      res.status(404).json({ success: false, message: 'Ticket not found' });
      return;
    }
    res.json({ success: true, data: ticket });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

// @desc    Update Job Status
// @route   PUT /api/v1/technician/jobs/:ticketId/status
// @access  Private/Technician
export const updateJobStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ticketId } = req.params;
    const { status, note } = req.body;

    const ticket = await Ticket.findOne({ ticketId });
    if (!ticket) {
      res.status(404).json({ success: false, message: 'Ticket not found' });
      return;
    }

    ticket.status = status;
    ticket.statusHistory.push({
      status,
      note: note || `Status updated to ${status}`,
    });

    await ticket.save();

    // If status is updated to 'tv_received', notify the admin
    if (status === 'tv_received') {
      await Notification.create({
        title: 'Product Received',
        message: `Technician ${ticket.technicianName} has received the product for ticket ${ticket.ticketId}.`,
        type: 'SUCCESS',
        link: '/admin/tickets',
      });

      const adminPhone = process.env.ADMIN_PHONE || '918586887887';
      await sendAdminPickupAlert(adminPhone, {
        ticket: ticket.ticketId,
        tech_name: ticket.technicianName || 'Technician',
        customer_name: ticket.customerName,
      }).catch((err) => console.error('Failed to notify admin:', err.message));
    }

    res.json({ success: true, data: ticket });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

// @desc    Add Repair Note
// @route   POST /api/v1/technician/jobs/:ticketId/notes
// @access  Private/Technician
export const addRepairNote = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ticketId } = req.params;
    const { note } = req.body;

    const ticket = await Ticket.findOne({ ticketId });
    if (!ticket) {
      res.status(404).json({ success: false, message: 'Ticket not found' });
      return;
    }

    // You can also push to a separate 'notes' array if you have one, 
    // or just append to notes
    ticket.notes = ticket.notes ? `${ticket.notes}\n\n${new Date().toLocaleString('en-IN')}: ${note}` : `${new Date().toLocaleString('en-IN')}: ${note}`;
    
    // Also push an invisible status history or just save
    await ticket.save();

    res.json({ success: true, data: ticket });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

// @desc    Upload Job Photos
// @route   POST /api/v1/technician/jobs/:ticketId/photos
// @access  Private/Technician
export const uploadJobPhotos = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ticketId } = req.params;
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      res.status(400).json({ success: false, message: 'No images provided' });
      return;
    }

    const ticket = await Ticket.findOne({ ticketId });
    if (!ticket) {
      res.status(404).json({ success: false, message: 'Ticket not found' });
      return;
    }

    const uploadPromises = files.map(file => uploadToCloudinary(file.buffer, 'ticket_photos'));
    const imageUrls = await Promise.all(uploadPromises);

    ticket.photos = [...(ticket.photos || []), ...imageUrls];
    ticket.statusHistory.push({
      status: ticket.status,
      note: `Uploaded ${imageUrls.length} photo(s)`,
    });

    await ticket.save();

    res.json({ success: true, message: 'Photos uploaded successfully', urls: imageUrls });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Upload failed' });
  }
};
