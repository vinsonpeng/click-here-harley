const twilio = require('twilio');

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { type, message, timestamp } = JSON.parse(event.body);

    // Initialize Twilio client
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID || 'YOUR_ACCOUNT_SID_HERE',
      process.env.TWILIO_AUTH_TOKEN || 'YOUR_AUTH_TOKEN_HERE'
    );

    // Send SMS
    const smsMessage = `🌟 Harley's Response: ${type.toUpperCase()}\n\n${message}\n\nTime: ${new Date(timestamp).toLocaleString()}`;
    
    await client.messages.create({
      body: smsMessage,
      from: process.env.TWILIO_PHONE_NUMBER || 'YOUR_TWILIO_PHONE_NUMBER_HERE',
      to: process.env.RECIPIENT_PHONE || '+61488202027'
    });

    // SMS notification sent successfully
    console.log('SMS notification sent successfully');

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true, 
        message: 'Notification sent successfully' 
      })
    };

  } catch (error) {
    console.error('Error sending notification:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to send notification',
        details: error.message 
      })
    };
  }
};
