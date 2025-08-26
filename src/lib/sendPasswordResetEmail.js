import nodemailer from 'nodemailer';

export async function sendPasswordResetEmail(email, resetToken) {
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

    // Construct the full URL for the reset link
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: 'Expense Tracker | Password Reset Request',
      html: `<p>You requested a password reset. Click the link below to reset your password:</p>
             <a href="${resetUrl}" target="_blank" style="color: white; background-color: #2563eb; padding: 10px 15px; text-decoration: none; border-radius: 5px;">Reset Password</a>
             <p>This link will expire in 1 hour.</p>
             <p>If you did not request this, please ignore this email.</p>`,
    };

    await transporter.sendMail(mailOptions);
    return { success: true, message: 'Password reset email sent.' };
  } catch (error)
  {
    console.error('Error sending password reset email:', error);
    return { success: false, message: 'Failed to send password reset email.' };
  }
}