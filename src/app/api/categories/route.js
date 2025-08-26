import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import CategorySetup from '@/models/CategorySetup';
import Transaction from '@/models/Transaction';

export async function POST(request) {
  // Get the user session to identify the logged-in user
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const { creditCards, categories } = await request.json();

    // Find the category setup for the current user and update it,
    // or create a new one if it doesn't exist.
    const categorySetupData = {
      userId: session.user.id, // Link to the user's ID from the session
      creditCards: creditCards,
      customCategories: categories,
    };

    await CategorySetup.findOneAndUpdate(
      { userId: session.user.id }, // Find by user ID
      categorySetupData,
      { upsert: true, new: true, setDefaultsOnInsert: true } // Options
    );

    return NextResponse.json(
      { message: 'Categories saved successfully!' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error saving categories:', error);
    return NextResponse.json(
      { message: 'An error occurred while saving categories.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();

    // 1. Find the user's category setup
    const setup = await CategorySetup.findOne({ userId: session.user.id });

    if (!setup) {
      // If user has no setup, return empty arrays
      return NextResponse.json({ creditCards: [], customCategories: [] });
    }

    // 2. Find all transactions for this user to check for usage
    const transactions = await Transaction.find({ userId: session.user.id });

    // 3. Create a quick-lookup set of used categories and subcategories
    const usedCategories = new Set();
    transactions.forEach(t => {
      usedCategories.add(t.category);
      if (t.subcategory) {
        // We create a unique key for subcategories to avoid conflicts
        usedCategories.add(`${t.category}::${t.subcategory}`);
      }
    });

    // 4. Add an 'isDeletable' flag to each category and subcategory
    const categoriesWithUsage = setup.customCategories.map(cat => {
      const isCategoryUsed = usedCategories.has(cat.name);
      const subcategoriesWithUsage = cat.subcategories.map(sub => ({
        ...sub.toObject(),
        isDeletable: !usedCategories.has(`${cat.name}::${sub.name}`),
      }));

      return {
        ...cat.toObject(),
        isDeletable: !isCategoryUsed, // A category is only deletable if it's not used directly
        subcategories: subcategoriesWithUsage,
      };
    });

    return NextResponse.json({
      creditCards: setup.creditCards,
      customCategories: categoriesWithUsage,
    });

  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { message: 'An error occurred while fetching categories.' },
      { status: 500 }
    );
  }
}