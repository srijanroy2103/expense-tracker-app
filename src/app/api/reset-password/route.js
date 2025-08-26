import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    await dbConnect();
    const { token, password } = await request.json();

    // Hash the incoming token from the user to match the hashed version in the database
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find the user by the hashed token and check if it's not expired
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetTokenExpires: { $gt: Date.now() }, // $gt = "greater than"
    });

    if (!user) {
      return NextResponse.json({ message: 'Invalid or expired password reset token.' }, { status: 400 });
    }

    // Hash the new password and update the user's document
    user.password = await bcrypt.hash(password, 10);
    // Clear the reset token fields so it cannot be used again
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    
    await user.save();

    return NextResponse.json({ message: 'Password has been reset successfully!' }, { status: 200 });

  } catch (error) {
    console.error('Reset Password Error:', error);
    return NextResponse.json({ message: 'An error occurred.' }, { status: 500 });
  }
}