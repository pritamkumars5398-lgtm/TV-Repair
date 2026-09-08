interface SMSOptions {
  phone: string;
  message: string;
}

export const sendSMS = async (options: SMSOptions): Promise<void> => {
  const provider = process.env.SMS_PROVIDER || 'FAST2SMS';
  const apiKey = process.env.SMS_API_KEY;

  if (!apiKey) {
    console.log('\n======================================================');
    console.log('WARNING: SMS_API_KEY is not configured in backend/.env.');
    console.log(`To Phone: ${options.phone}`);
    console.log(`Message:\n${options.message}`);
    console.log('Please set SMS_API_KEY in backend/.env to send real SMS via Fast2SMS.');
    console.log('======================================================\n');
    return;
  }

  try {
    if (provider === 'FAST2SMS') {
      const url = `https://www.fast2sms.com/dev/bulkV2?authorization=${apiKey}&route=q&message=${encodeURIComponent(options.message)}&flash=0&numbers=${options.phone}`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.return === false) {
        throw new Error(data.message || 'Fast2SMS API failed');
      }
      console.log(`[SMS Sent] To: ${options.phone} successfully.`);
    } else {
      console.log(`[SMS Sent locally - Unknown provider] To: ${options.phone} | Msg: ${options.message}`);
    }
  } catch (error: any) {
    console.error('Failed to send SMS:', error.message);
  }
};
