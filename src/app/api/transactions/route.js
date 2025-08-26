import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import Transaction from '@/models/Transaction';
import CategorySetup from '@/models/CategorySetup';

// POST function remains the same
export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  try {
    await dbConnect();
    const body = await request.json();
    await Transaction.create({ ...body, userId: session.user.id });
    return NextResponse.json(
      { message: `${body.type.charAt(0).toUpperCase() + body.type.slice(1)} added successfully!` },
      { status: 201 }
    );
  } catch (error) {
    if (error.name === 'ValidationError') {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    console.error('Error creating transaction:', error);
    return NextResponse.json(
      { message: 'An error occurred while adding the transaction.' },
      { status: 500 }
    );
  }
}

// --- UPDATED GET FUNCTION ---
export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const reportType = searchParams.get('type');
    
    const query = { userId: session.user.id };

    const setup = await CategorySetup.findOne({ userId: session.user.id });
    const creditCardNames = setup ? setup.creditCards.map(cc => cc.bankName) : [];

    if (reportType === 'expense') {
      query.type = 'expense';
      if (creditCardNames.length > 0) {
        query.category = { $nin: creditCardNames }; // Exclude credit card transactions
      }
    } else if (reportType === 'income') {
      query.type = 'income';
    } else if (reportType === 'credit-card') {
      query.type = 'expense';
      const selectedCard = searchParams.get('selectedCard');
      if (selectedCard) {
        query.category = selectedCard;
      } else {
        query.category = { $in: creditCardNames };
      }
    }

    const fromDate = searchParams.get('fromDate');
    const toDate = searchParams.get('toDate');
    if (fromDate || toDate) {
      query.date = {};
      if (fromDate) query.date.$gte = new Date(fromDate);
      if (toDate) query.date.$lte = new Date(toDate);
    }
    
    // These filters are now applied on top of the reportType logic
    const category = searchParams.get('category');
    if (category) query.category = category;
    const subcategory = searchParams.get('subcategory');
    if (subcategory) query.subcategory = subcategory;
    
    const transactions = await Transaction.find(query).sort({ date: -1 });
    return NextResponse.json(transactions);

  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json({ message: 'An error occurred.' }, { status: 500 });
  }
}
