import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  image: { type: String, required: true},
  brand: { type: String, required: true },
  price: { type: Number, required: true },
  countInStock: { type: Number, required: true },
  description: { type: String, required: true },
  category: {
    type: String,
    required: true,
    enum: ['electronics', 'clothing', 'books', 'accessories', 'beauty', 'other'],
},
  rating: { type: Number, required: true },
  numReviews: { type: Number, required: true },
  reviews: [
    {
      name: String,
      rating: Number,
      comment: String,
    },
  ],
},
{
  timestamps: true,
}
);

const Product = mongoose.model('Product', productSchema);
export default Product;
