import nodemailer from 'nodemailer';

interface EmailOptions {
  email: string;
  subject: string;
  message: string;
  html?: string;
}

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587');
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || 'no-reply@tvrepair.com';

  // If credentials are placeholder or empty, log locally
  if (!host || !user || !pass || user.includes('your_email') || user === '') {
    console.log('\n======================================================');
    console.log('WARNING: SMTP is not configured in backend/.env.');
    console.log(`Email Subject: ${options.subject}`);
    console.log(`To: ${options.email}`);
    console.log(`Content:\n${options.message}`);
    console.log('Please set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS in backend/.env to send real emails.');
    console.log('======================================================\n');
    return;
  }

  // Create transporter
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });

  const mailOptions = {
    from: `"TV Repair Support" <${from}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html || `<p>${options.message}</p>`,
  };

  await transporter.sendMail(mailOptions);
};
