import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import Transaction from '@/models/Transaction';

export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const { id } = params; // Get the transaction ID from the URL (e.g., /api/transactions/some-id)

    // Find and delete the transaction ONLY if the userId matches the logged-in user.
    // This is a critical security measure.
    const deletedTransaction = await Transaction.findOneAndDelete({
      _id: id,
      userId: session.user.id,
    });

    if (!deletedTransaction) {
      // If no transaction was found/deleted, it means it either didn't exist
      // or the user didn't have permission to delete it.
      return NextResponse.json({ message: 'Transaction not found or you do not have permission to delete it.' }, { status: 404 });
    }

    return NextResponse.json(
      { message: 'Transaction deleted successfully.' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error deleting transaction:', error);
    return NextResponse.json(
      { message: 'An error occurred while deleting the transaction.' },
      { status: 500 }
    );
  }
}
