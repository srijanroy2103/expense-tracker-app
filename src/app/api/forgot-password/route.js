import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import crypto from 'crypto';
import { sendPasswordResetEmail } from '@/lib/sendPasswordResetEmail';

export async function POST(request) {
  try {
    await dbConnect();
    const { email } = await request.json();
    const user = await User.findOne({ email, emailVerified: true });

    // IMPORTANT: For security, always send a generic success response
    // This prevents attackers from checking which emails are registered.
    if (!user) {
      return NextResponse.json({ message: 'If an account with that email exists, a reset link has been sent.' }, { status: 200 });
    }

    // Generate a secure, random token for the user
    const resetToken = crypto.randomBytes(32).toString('hex');
    // Hash the token before saving it to the database
    user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.passwordResetTokenExpires = Date.now() + 3600000; // Expires in 1 hour

    await user.save();

    // Send the original (unhashed) token to the user's email
    await sendPasswordResetEmail(email, resetToken);
    
    return NextResponse.json({ message: 'If an account with that email exists, a reset link has been sent.' }, { status: 200 });

  } catch (error) {
    console.error('Forgot Password Error:', error);
    return NextResponse.json({ message: 'An error occurred.' }, { status: 500 });
  }
}