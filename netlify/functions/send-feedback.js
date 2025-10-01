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
    const { dateId, rating, feedback, timestamp } = JSON.parse(event.body);

    // Initialize Twilio client
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID || 'YOUR_ACCOUNT_SID_HERE',
      process.env.TWILIO_AUTH_TOKEN || 'YOUR_AUTH_TOKEN_HERE'
    );

    // Create rating emoji
    const ratingEmojis = {
      '1': '😢',
      '2': '😕', 
      '3': '😐',
      '4': '😊',
      '5': '😍'
    };

    const ratingEmoji = ratingEmojis[rating] || '😐';
    const dateName = dateId === 'commis' ? 'Commis in Collingwood' : 'Sleepy\'s Cafe & Wine Bar';

    // Send SMS
    const smsMessage = `💭 Harley's Feedback for ${dateName}\n\nRating: ${ratingEmoji} (${rating}/5)\n\nComments: ${feedback || 'No additional comments'}\n\nTime: ${new Date(timestamp).toLocaleString()}`;
    
    await client.messages.create({
      body: smsMessage,
      from: process.env.TWILIO_PHONE_NUMBER || 'YOUR_TWILIO_PHONE_NUMBER_HERE',
      to: process.env.RECIPIENT_PHONE || '+61488202027'
    });

    // SMS feedback sent successfully
    console.log('SMS feedback sent successfully');

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true, 
        message: 'Feedback sent successfully' 
      })
    };

  } catch (error) {
    console.error('Error sending feedback:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to send feedback',
        details: error.message 
      })
    };
  }
};
