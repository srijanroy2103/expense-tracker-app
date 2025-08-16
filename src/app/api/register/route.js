import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from '@/lib/sendVerificationEmail';

export async function POST(request) {
  try {
    await dbConnect();
    const { name, email, password } = await request.json();

    const existingVerifiedUser = await User.findOne({ email, emailVerified: true });
    if (existingVerifiedUser) {
      return NextResponse.json({ message: 'User is already verified.' }, { status: 400 });
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const codeExpiry = Date.now() + 3600000;
    const hashedPassword = await bcrypt.hash(password, 10);

    // --- NEW DEBUGGING LOGS (SAVING) ---
    console.log('--- SAVING USER DATA ---');
    const userDataToSave = {
      name,
      password: hashedPassword,
      verificationCode,
      verificationCodeExpires: codeExpiry,
      emailVerified: false,
    };
    console.log('Data object being sent to database:', userDataToSave);
    console.log('Expiry timestamp being saved:', codeExpiry, '(Type:', typeof codeExpiry, ')');

    const savedUser = await User.findOneAndUpdate(
      { email },
      userDataToSave,
      { upsert: true, new: true }
    );
    console.log('User document returned from database after save:', savedUser);
    console.log('--------------------------');
    // --- END OF NEW DEBUGGING LOGS ---

    const emailResponse = await sendVerificationEmail(email, verificationCode);
    if (!emailResponse.success) {
      return NextResponse.json({ message: emailResponse.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Verification code sent.' }, { status: 200 });

  } catch (error) {
    console.error('Registration Error:', error);
    return NextResponse.json({ message: 'An error occurred.' }, { status: 500 });
  }
}