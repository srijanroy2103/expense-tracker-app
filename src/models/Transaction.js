import mongoose, { Schema } from 'mongoose';

const TransactionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['income', 'expense'], // The type must be one of these two values
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: [0.01, 'Amount must be positive'], // Amount cannot be negative or zero
  },
  category: {
    type: String,
    required: true,
  },
  subcategory: {
    type: String, // Subcategory is optional
  },
  date: {
    type: Date,
    required: true,
  },
  comment: {
    type: String,
    maxlength: 300,
  },
}, { timestamps: true });

export default mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);