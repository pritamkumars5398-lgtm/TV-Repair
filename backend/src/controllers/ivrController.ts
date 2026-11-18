import { Request, Response } from 'express';
import { sendBookingReceived } from '../utils/sendSMS';

// Support escalation phone number for RepairCart (Imran Khan / Operations)
const SUPPORT_FORWARD_NUMBER = process.env.SUPPORT_FORWARD_NUMBER || '+918586887887';
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://repaircart.co.in';

/**
 * Handle incoming call from Plivo
 * Returns Plivo XML (IVR Welcome Menu)
 */
export const handleIncomingCall = (req: Request, res: Response) => {
  const callerNumber = req.body?.From || req.query?.From || 'Customer';
  const callUUID = req.body?.CallUUID || req.query?.CallUUID;
  console.log(`[IVR] Inbound call received from: ${callerNumber} (CallUUID: ${callUUID})`);

  // Build the action callback URL dynamically or fallback to relative/absolute
  const host = req.get('host') || 'tv-repair-lac.vercel.app';
  const protocol = req.protocol === 'https' || req.get('x-forwarded-proto') === 'https' ? 'https' : 'http';
  const actionUrl = `${protocol}://${host}/api/v1/ivr/menu`;

  // Plivo XML Response
  const responseXml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <GetDigits action="${actionUrl}" method="POST" numDigits="1" timeout="7" retries="1">
    <Speak voice="Polly.Aditi" language="en-IN">
      Welcome to RepairCart, your trusted doorstep Smart, LED, and LCD TV repair specialists. 
      We provide genuine spare parts, transparent pricing, and doorstep warranty.
      Press 1 to receive a direct booking link on your mobile for doorstep inspection.
      Press 2 to speak directly with our service manager.
      Press 3 to track your existing repair ticket status.
    </Speak>
  </GetDigits>
  <Speak voice="Polly.Aditi" language="en-IN">
    We did not receive any input. For online bookings, visit repaircart.co.in. Thank you for calling RepairCart. Goodbye!
  </Speak>
</Response>`;

  res.set('Content-Type', 'application/xml');
  return res.status(200).send(responseXml);
};

/**
 * Handle user's keypad (DTMF) selection from the IVR menu
 */
export const handleMenuSelection = async (req: Request, res: Response) => {
  const digits = (req.body?.Digits || req.query?.Digits || '').toString().trim();
  const callerNumber = (req.body?.From || req.query?.From || '').toString().trim();
  const toPlivoNumber = req.body?.To || req.query?.To || '';

  console.log(`[IVR] Menu Selection: Digit '${digits}' pressed by caller ${callerNumber}`);

  let responseXml = '';

  switch (digits) {
    case '1': {
      // Option 1: Book Doorstep TV Repair
      // Send direct booking link SMS via MSG91
      try {
        if (callerNumber) {
          const cleanPhone = callerNumber.replace(/\D/g, '');
          const bookingUrl = `${FRONTEND_URL}/book`;
          console.log(`[IVR] Sending booking link SMS to: ${cleanPhone}`);
          await sendBookingReceived(cleanPhone, {
            name: 'Valued Customer',
            ticket: 'RC-NEW',
            item: 'TV Repair Inspection',
            url: bookingUrl,
          });
        }
      } catch (smsErr: any) {
        console.error('[IVR] Failed to send booking SMS:', smsErr.message);
      }

      responseXml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Speak voice="Polly.Aditi" language="en-IN">
    Thank you! We have sent a direct booking link to your mobile number via SMS. 
    Please tap the link to confirm your TV brand and doorstep address. 
    Our certified technician will contact you shortly. Goodbye!
  </Speak>
</Response>`;
      break;
    }

    case '2': {
      // Option 2: Live Call Forwarding to Real Person (Service Manager)
      responseXml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Speak voice="Polly.Aditi" language="en-IN">
    Please hold while we connect your call to our service manager.
  </Speak>
  <Dial callerId="${toPlivoNumber}">
    <Number>${SUPPORT_FORWARD_NUMBER}</Number>
  </Dial>
</Response>`;
      break;
    }

    case '3': {
      // Option 3: Track Repair Status
      const trackUrl = `${FRONTEND_URL}/track`;
      responseXml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Speak voice="Polly.Aditi" language="en-IN">
    You can track your real-time TV repair status and estimate online anytime at repaircart.co.in slash track. 
    A link has also been sent to your phone. Thank you for calling RepairCart!
  </Speak>
</Response>`;
      break;
    }

    default: {
      // Invalid input or timeout fallback -> offer transfer to manager
      responseXml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Speak voice="Polly.Aditi" language="en-IN">
    Invalid option selected. Let us connect you directly with our service manager.
  </Speak>
  <Dial callerId="${toPlivoNumber}">
    <Number>${SUPPORT_FORWARD_NUMBER}</Number>
  </Dial>
</Response>`;
      break;
    }
  }

  res.set('Content-Type', 'application/xml');
  return res.status(200).send(responseXml);
};

/**
 * Handle call status / CDR (Call Detail Record) callback
 */
export const handleCallStatus = (req: Request, res: Response) => {
  const { CallUUID, From, To, CallStatus, Duration, BillRate } = req.body;
  console.log(`[IVR CDR] Call ${CallUUID}: ${From} -> ${To} | Status: ${CallStatus} | Duration: ${Duration}s | Bill: ${BillRate}`);
  return res.status(200).json({ status: 'ok', logged: true });
};
