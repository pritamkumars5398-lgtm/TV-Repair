/**
 * MSG91 OneAPI Flow SMS Integration for RepairCart
 * Powered by MSG91 Flow API and registered Airtel DLT Templates
 */

export interface SMSOptions {
  phone: string;
  message: string;
}

export interface FlowPayloadVariables {
  [key: string]: { value: string };
}

const MSG91_DEFAULT_AUTH_KEY = '581212Adp2eEkd8a6acf17d1P1';
const DEFAULT_FRONTEND_URL = 'https://repaircart.co.in';

/**
 * Normalizes phone numbers to standard 12-digit Indian format (91XXXXXXXXXX)
 */
export const normalizePhone = (phone: string): string => {
  if (!phone) return '';
  const digits = phone.toString().replace(/\D/g, '');

  if (digits.length === 10) {
    return `91${digits}`;
  }
  if (digits.length === 11 && digits.startsWith('0')) {
    return `91${digits.slice(1)}`;
  }
  if (digits.length === 12 && digits.startsWith('91')) {
    return digits;
  }
  return digits;
};

/**
 * DLT {#numeric#} variables accept digits only — a "+91", space or text like "Support" makes the SMS get rejected.
 * Returns a 10-digit mobile number, falling back to the RepairCart support number.
 */
const SUPPORT_PHONE_DIGITS = '8586887887';
const toNumericPhone = (phone: string | undefined | null): string => {
  const digits = (phone || '').toString().replace(/\D/g, '');
  return digits.length >= 10 ? digits.slice(-10) : SUPPORT_PHONE_DIGITS;
};

/**
 * Generates tracking URL for customer ticket
 */
export const getTrackUrl = (ticketId: string): string => {
  const baseUrl = process.env.FRONTEND_URL || DEFAULT_FRONTEND_URL;
  return `${baseUrl.replace(/\/$/, '')}/track?id=${ticketId}`;
};

/**
 * Dispatches an SMS via MSG91 OneAPI Flow endpoint
 */
export const sendMSG91Flow = async (
  flowId: string,
  phone: string,
  variables: Record<string, string | number | undefined | null>
): Promise<{ success: boolean; data?: any; error?: string }> => {
  if (!process.env.MSG91_AUTH_KEY) {
    console.warn('[MSG91] MSG91_AUTH_KEY env is not set, using built-in fallback key. Set it in the server environment.');
  }
  const authKey = process.env.MSG91_AUTH_KEY || MSG91_DEFAULT_AUTH_KEY;
  const normalizedRecipient = normalizePhone(phone);

  if (!normalizedRecipient) {
    console.warn(`[MSG91] Skipped dispatch for flow '${flowId}': Invalid recipient phone '${phone}'`);
    return { success: false, error: 'Invalid phone number' };
  }

  // Format variables according to MSG91 OneAPI schema: { varName: { value: "varVal" } }
  const formattedVariables: FlowPayloadVariables = {};
  for (const [key, value] of Object.entries(variables)) {
    formattedVariables[key] = { value: String(value ?? '') };
  }

  const payload = {
    data: {
      sendTo: [
        {
          to: [
            {
              mobiles: normalizedRecipient,
              variables: formattedVariables,
            },
          ],
          variables: formattedVariables,
        },
      ],
    },
  };

  try {
    const url = `https://control.msg91.com/api/v5/oneapi/api/flow/${flowId}/run`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authkey: authKey,
      },
      body: JSON.stringify(payload),
    });

    const data: any = await response.json().catch(() => ({}));

    // MSG91 only confirms the request was queued; treat anything other than an explicit success as a failure.
    if (response.ok && data?.status === 'success' && !data?.hasError) {
      console.log(
        `[MSG91 Flow Sent] Flow: ${flowId} | To: ${normalizedRecipient} | ReqID: ${
          data?.data?.request_id || 'ok'
        }`
      );
      return { success: true, data };
    } else {
      console.error(
        `[MSG91 Flow Error] Flow: ${flowId} | To: ${normalizedRecipient} | Errors:`,
        `HTTP ${response.status}`,
        data?.errors || data?.message
      );
      return { success: false, error: JSON.stringify(data?.errors || data?.message || `HTTP ${response.status}`) };
    }
  } catch (err: any) {
    console.error(`[MSG91 Network Error] Flow: ${flowId} | To: ${normalizedRecipient}:`, err.message);
    return { success: false, error: err.message };
  }
};

/**
 * 1. repaircart-otp
 * Template: "Dear Customer, your RC RepairCart verification code is {#otp#}. Valid for 10 minutes. Please do not share this OTP with anyone. - RC RepairCart"
 */
export const sendOTP = async (phone: string, otp: string): Promise<boolean> => {
  const result = await sendMSG91Flow('repaircart-otp', phone, { otp });
  return result.success;
};

/**
 * 2. repaircart-booking-received
 * Template: "Dear {#name#}, thank you for choosing RC RepairCart. Your repair request ({#ticket#}) for {#item#} has been registered successfully. Track status: {#url#}"
 */
export const sendBookingReceived = async (
  phone: string,
  data: { name: string; ticket: string; item: string; url?: string }
): Promise<boolean> => {
  const url = data.url || getTrackUrl(data.ticket);
  const result = await sendMSG91Flow('repaircart-booking-received', phone, {
    name: data.name,
    ticket: data.ticket,
    item: data.item,
    url,
  });
  return result.success;
};

/**
 * 3. repaircart-booking-payment-confirm
 * Template: "Dear {#name#}, payment for repair ticket {#ticket#} is confirmed. Our technician will visit your location shortly. Track live updates: {#url#} - RC RepairCart"
 */
export const sendBookingPaymentConfirm = async (
  phone: string,
  data: { name: string; ticket: string; url?: string }
): Promise<boolean> => {
  const url = data.url || getTrackUrl(data.ticket);
  const result = await sendMSG91Flow('repaircart-booking-payment-confirm', phone, {
    name: data.name,
    ticket: data.ticket,
    url,
  });
  return result.success;
};

/**
 * 4. repaircart-technician-assigned
 * Template: "Dear {#name#}, technician {#tech_name#} ({#tech_phone#}) has been assigned to your repair request ({#ticket#}) and will contact you shortly. - RC RepairCart"
 */
export const sendTechnicianAssigned = async (
  phone: string,
  data: { name: string; tech_name: string; tech_phone: string; ticket: string }
): Promise<boolean> => {
  const result = await sendMSG91Flow('repaircart-technician-assigned', phone, {
    name: data.name,
    tech_name: data.tech_name,
    tech_phone: toNumericPhone(data.tech_phone),
    ticket: data.ticket,
  });
  return result.success;
};

/**
 * 5. repaircart-pickup-otp
 * Template: "Dear {#name#}, technician {#tech_name#} is on the way for TV pickup. Please share Pickup OTP: {#otp#} only upon handover. Contact: {#contact#}. - RC RepairCart"
 */
export const sendPickupOTP = async (
  phone: string,
  data: { name: string; tech_name: string; otp: string; contact: string }
): Promise<boolean> => {
  const result = await sendMSG91Flow('repaircart-pickup-otp', phone, {
    name: data.name,
    tech_name: data.tech_name,
    otp: data.otp,
    contact: toNumericPhone(data.contact),
  });
  return result.success;
};

/**
 * 6. repaircart-admin-pickup-alert
 * Template: "[RC Alert] Ticket #{#ticket#}: TV safely picked up by Tech {#tech_name#}. Customer: {#customer_name#}. Status: Received."
 */
export const sendAdminPickupAlert = async (
  phone: string,
  data: { ticket: string; tech_name: string; customer_name: string }
): Promise<boolean> => {
  const result = await sendMSG91Flow('repaircart-admin-pickup-alert', phone, {
    ticket: data.ticket,
    tech_name: data.tech_name,
    customer_name: data.customer_name,
  });
  return result.success;
};

/**
 * 7. repaircart-ticket-status-update
 * Template: "Dear {#name#}, your repair ticket {#ticket#} status has been updated to: {#status#}. Note: {#note#}. Track live: {#url#} - RC RepairCart"
 */
export const sendTicketStatusUpdate = async (
  phone: string,
  data: { name: string; ticket: string; status: string; note: string; url?: string }
): Promise<boolean> => {
  const url = data.url || getTrackUrl(data.ticket);
  const result = await sendMSG91Flow('repaircart-ticket-status-update', phone, {
    name: data.name,
    ticket: data.ticket,
    status: data.status,
    note: data.note,
    url,
  });
  return result.success;
};

/**
 * 8. repaircart-estimate-quotation
 * Template: "Dear {#name#}, inspection for ticket {#ticket#} is complete. Estimated cost: Rs.{#cost#}. Details: {#details#}. Please review & approve to start repair: {#url#} - RC RepairCart"
 */
export const sendEstimateQuotation = async (
  phone: string,
  data: { name: string; ticket: string; cost: string | number; details: string; url?: string }
): Promise<boolean> => {
  const url = data.url || getTrackUrl(data.ticket);
  const result = await sendMSG91Flow('repaircart-estimate-quotation', phone, {
    name: data.name,
    ticket: data.ticket,
    cost: String(Math.round(Number(String(data.cost).replace(/[^\d.]/g, '')) || 0)),
    details: data.details,
    url,
  });
  return result.success;
};

/**
 * 9. repaircart-delivery-date-update
 * Template: "Dear {#name#}, expected delivery date for your repair ticket {#ticket#} has been rescheduled to {#date#}. Track live updates: {#url#} - RC RepairCart"
 */
export const sendDeliveryDateUpdate = async (
  phone: string,
  data: { name: string; ticket: string; date: string }
): Promise<boolean> => {
  const result = await sendMSG91Flow('repaircart-delivery-date-update', phone, {
    name: data.name,
    ticket: data.ticket,
    date: data.date,
  });
  return result.success;
};

/**
 * 10. repaircart-lead-inquiry-received
 * Template: "Dear {#name#}, thank you for contacting RC RepairCart. We have received your inquiry regarding {#inquiry#}. Our specialist will get in touch with you shortly."
 */
export const sendLeadInquiryReceived = async (
  phone: string,
  data: { name: string; inquiry: string }
): Promise<boolean> => {
  const result = await sendMSG91Flow('repaircart-lead-inquiry-received', phone, {
    name: data.name,
    inquiry: data.inquiry,
  });
  return result.success;
};

/**
 * Backward compatibility wrapper for generic sendSMS calls
 */
export const sendSMS = async (options: SMSOptions): Promise<void> => {
  console.log(`[SMS Log] Recipient: ${options.phone} | Content: ${options.message}`);
};
