import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    await dbConnect();
    const { email, code } = await request.json();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: 'User not found.' }, { status: 404 });
    }

    // --- SIMPLIFIED LOGIC ---
    // We only check if the code is valid. The expiration check is removed.
    const isCodeValid = user.verificationCode === code;

    if (isCodeValid) {
      // Mark user as verified and remove the code
      user.emailVerified = true;
      user.verificationCode = undefined;
      user.verificationCodeExpires = undefined; // Also remove the old expiry field
      await user.save();

      return NextResponse.json(
        { message: 'Account verified successfully!' },
        { status: 200 }
      );
    } else {
      // If the code is not valid, return an error.
      return NextResponse.json(
        { message: 'Incorrect verification code.' },
        { status: 400 }
      );
    }
    
  } catch (error) {
    console.error('Error verifying code:', error);
    return NextResponse.json(
      { message: 'Error verifying code.' },
      { status: 500 }
    );
  }
}
