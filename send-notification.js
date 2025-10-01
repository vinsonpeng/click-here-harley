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
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    // Send SMS
    const smsMessage = `🌟 Harley's Response: ${type.toUpperCase()}\n\n${message}\n\nTime: ${new Date(timestamp).toLocaleString()}`;
    
    await client.messages.create({
      body: smsMessage,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: process.env.RECIPIENT_PHONE
    });

    // Send email using Netlify's built-in email
    const emailData = {
      to: process.env.RECIPIENT_EMAIL,
      from: 'noreply@your-site.netlify.app',
      subject: `🌟 Harley's Response: ${type.toUpperCase()}`,
      text: message + `\n\nTime: ${new Date(timestamp).toLocaleString()}`
    };

    // For now, we'll just log the email (Netlify doesn't have built-in email)
    console.log('Email would be sent:', emailData);

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
