import mongoose, { Schema } from 'mongoose';

const SubcategorySchema = new Schema({
  name: { type: String, required: true, maxlength: 20 },
});

const CreditCardSchema = new Schema({
  bankName: { type: String, required: true },
  limit: { type: Number, required: true },
  subcategories: [SubcategorySchema],
});

const CustomCategorySchema = new Schema({
  name: { type: String, required: true, maxlength: 20 },
  subcategories: [SubcategorySchema],
});

const CategorySetupSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Creates a link to the User model
    required: true,
    unique: true,
  },
  creditCards: [CreditCardSchema],
  customCategories: [CustomCategorySchema],
}, { timestamps: true });

export default mongoose.models.CategorySetup || mongoose.model('CategorySetup', CategorySetupSchema);