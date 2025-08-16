import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    await dbConnect();
    const { email, code } = await request.json();

    const user = await User.findOne({ email });
    console.log('--- DEBUGGING VERIFICATION CODE ---');
console.log('Code expires at (timestamp from DB):', user.verificationCodeExpires);
console.log('Current time is (timestamp now):', Date.now());
console.log('Type of expiry value from DB:', typeof user.verificationCodeExpires);
console.log('Is code expired?', user.verificationCodeExpires <= Date.now());
console.log('-----------------------------------');
    if (!user) {
      return NextResponse.json(
        { message: 'User not found.' },
        { status: 404 }
      );
    }

    const isCodeValid = user.verificationCode === code;
    const isCodeNotExpired = user.verificationCodeExpires > Date.now;

    if (isCodeValid && isCodeNotExpired) {
      // Mark user as verified and remove the code
      user.emailVerified = true;
      user.verificationCode = undefined; // As requested, delete the code
      user.verificationCodeExpires = undefined; // And the expiry
      await user.save();

      return NextResponse.json(
        { message: 'Account verified successfully!' },
        { status: 200 }
      );
    } else if (!isCodeNotExpired) {
      return NextResponse.json(
        { message: 'Verification code has expired. Please sign up again to get a new code.' },
        { status: 400 }
      );
    } else {
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