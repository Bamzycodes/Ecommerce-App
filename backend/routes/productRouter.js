import express from 'express';
import cloudinary from '../cloudinary.js';
import multer from 'multer';
import Product from '../model/productModel.js';
import { isAuth, isAdmin } from '../utils.js';
import expressAsyncHandler from 'express-async-handler';

const router = express.Router();
const PAGE_SIZE = 3;

const storage = new multer.memoryStorage();
const upload = multer({ storage });

async function handleUpload(file) {
  const res = await cloudinary.uploader.upload(file, {
    resource_type: "auto",
    folder: "products",
    timestamp: Math.round(new Date().getTime() / 1000)
  });
  return res;
}

// Upload product with image
router.post('/images', upload.single("my_file"), expressAsyncHandler(async (req, res) => {
  const b64 = Buffer.from(req.file.buffer).toString("base64");
  const dataURI = "data:" + req.file.mimetype + ";base64," + b64;
  
  const cldRes = await handleUpload(dataURI);
  
  if (!cldRes) {
    return res.status(400).json({ message: 'Image upload failed' });
  }

  const product = new Product({
    image: cldRes.secure_url,
    name: req.body.name,
    slug: req.body.slug,
    brand: req.body.brand,
    price: req.body.price,
    countInStock: req.body.countInStock,
    description: req.body.description,
    category: req.body.category,
    rating: req.body.rating,
    numReviews: req.body.numReviews
  });

  const savedProducts = await product.save();
  res.status(201).json(savedProducts);
}));

// Get all products
router.get('/getProduct', expressAsyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.status(200).json(products);
}));

// Delete product
router.delete('/:id', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product Not Found' });
  }
  await product.deleteOne();
  res.status(200).json({ message: 'Product Deleted Successfully' });
}));

// Add product review
router.post('/:id/reviews', isAuth, expressAsyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product Not Found' });
  }

  if (product.reviews.find((x) => x.name === req.user.name)) {
    return res.status(400).json({ message: 'You already submitted a review' });
  }

  const review = {
    name: req.user.name,
    rating: Number(req.body.rating),
    comment: req.body.comment,
  };

  product.reviews.push(review);
  product.numReviews = product.reviews.length;
  product.rating = product.reviews.reduce((a, c) => c.rating + a, 0) / product.reviews.length;

  const updatedProduct = await product.save();
  res.status(201).json({
    message: 'Review Created Successfully',
    review: updatedProduct.reviews[updatedProduct.reviews.length - 1],
    numReviews: product.numReviews,
    rating: product.rating,
  });
}));

// Search products
router.get('/search', expressAsyncHandler(async (req, res) => {
  const { query } = req;
  const pageSize = query.pageSize || PAGE_SIZE;
  const page = query.page || 1;
  const category = query.category || '';
  const price = query.price || '';
  const order = query.order || '';
  const searchQuery = query.query || '';

  const queryFilter = searchQuery && searchQuery !== 'all'
    ? { name: { $regex: searchQuery, $options: 'i' } }
    : {};
  const categoryFilter = category && category !== 'all' ? { category } : {};
  const priceFilter = price && price !== 'all'
    ? { price: { $gte: Number(price.split('-')[0]), $lte: Number(price.split('-')[1]) } }
    : {};
  const sortOrder = {
    featured: { featured: -1 },
    lowest: { price: 1 },
    highest: { price: -1 },
    toprated: { rating: -1 },
    newest: { createdAt: -1 },
    default: { _id: -1 }
  }[order] || { _id: -1 };

  const products = await Product.find({
    ...queryFilter,
    ...categoryFilter,
    ...priceFilter,
  })
    .sort(sortOrder)
    .skip(pageSize * (page - 1))
    .limit(pageSize);

  const countProducts = await Product.countDocuments({
    ...queryFilter,
    ...categoryFilter,
    ...priceFilter,
  });

  res.status(200).json({
    products,
    countProducts,
    page,
    pages: Math.ceil(countProducts / pageSize),
  });
}));

// Get categories
router.get('/categories', expressAsyncHandler(async (req, res) => {
  const categories = await Product.find().distinct('category');
  res.status(200).json(categories);
}));

// Get product by slug
router.get('/slug/:slug', expressAsyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug });
  if (!product) {
    return res.status(404).json({ message: 'Product Not Found' });
  }
  res.status(200).json(product);
}));

// Get product by ID
router.get('/:id', expressAsyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product Not Found' });
  }
  res.status(200).json(product);
}));

export default router;
