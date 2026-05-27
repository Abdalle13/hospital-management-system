import mongoose from 'mongoose';

const medicineSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true },
    stock: { type: Number, required: true, default: 0 },
    lowStockThreshold: { type: Number, default: 10 },
    expiryDate: { type: Date, required: true },
    price: { type: Number, required: true },
    manufacturer: { type: String },
    description: { type: String },
  },
  { timestamps: true }
);

const Medicine = mongoose.model('Medicine', medicineSchema);
export default Medicine;
