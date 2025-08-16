import nodemailer from 'nodemailer';

export async function sendVerificationEmail(email, verificationCode) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.SENDER_EMAIL,
        clientId: process.env.OAUTH_CLIENT_ID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        refreshToken: process.env.OAUTH_REFRESH_TOKEN,
      },
    });

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: 'Expense Tracker | Verification Code',
      html: `<p>Your verification code is: <strong>${verificationCode}</strong></p>
      <p>Code is valid for 1 hour.</p>`,
    };

    await transporter.sendMail(mailOptions);
    return { success: true, message: 'Verification email sent successfully.' };
  } catch (error) {
    console.error('Error sending verification email:', error);
    return { success: false, message: 'Failed to send verification email.' };
  }
}