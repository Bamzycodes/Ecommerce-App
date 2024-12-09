import axios from 'axios';
import { useState, useContext } from 'react';
import { Store } from '../Store';
import { getError } from '../utils';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

function AdminProductCreate() {
  
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(false);

  const { state } = useContext(Store);
  const { userInfo } = state;

  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [countInStock, setCountInStock] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [rating, setRating] = useState("");
  const [numReviews, setNumRevies] = useState("");
  const [res, setRes] = useState({});

  const submitHandler = async (e) => {
    e.preventDefault();
  
    // Validation for rating
    if (!file) {
      toast.error("Image is required");
      return;
    }

    if (!price || isNaN(price)) {
      toast.error("Price must be a valid number");
      return;
    }
    
    if (!countInStock || isNaN(countInStock)) {
      toast.error("Stock count must be a valid number");
      return;
    }
    
    if (!description.trim()) {
      toast.error("Description is required");
      return;
    }
    
    if (!category) {
      toast.error("Category is required");
      return;
    } 
    
    if (!rating || isNaN(rating) || rating > 5 || rating < 1) {
      toast.error("Rating must be a number between 1 and 5");
      return;
    }
    
    if (!numReviews || isNaN(numReviews)) {
      toast.error( "Number of reviews must be a valid number" );
      return;
    }

    setIsLoading(true);
  
    try {
      const formData = new FormData();
      formData.append('my_file', file);
      formData.append('name', name);
      formData.append('slug', slug);
      formData.append('brand', brand);
      formData.append('price', price);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('countInStock', countInStock);
      formData.append('rating', rating);
      formData.append('numReviews', numReviews);
  
      const res = await axios.post(
        '/api/product/images', 
        formData, 
        {
          headers: { 
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${userInfo.token}`
          }
        }
      );
      
      setRes(res.data);
      toast.success('Product created successfully');
      navigate("/admin/products");
    } catch (err) {
      toast.error(getError(err));
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="p-6">
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
      <h1 className="text-2xl font-bold mb-4">Create Product</h1>
  
      <form onSubmit={submitHandler} className="space-y-4">
        {/* File Upload */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Image</span>
          </label>
          <input
            type="file"
            className="file-input file-input-bordered w-full"
            onChange={(e) => setFile(e.target.files[0])}
            required
          />
        </div>
  
        {/* Product Name */}
        <div className="form-control">
        <label className="label">
            <span className="label-text">Product Name</span>
          </label>
          <input
            type="text"
            placeholder="Name"
            className="input input-bordered w-full"
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
  
        {/* Slug */}
        <div className="form-control">
        <label className="label">
            <span className="label-text">Product Slug</span>
          </label>
          <input
            type="text"
            placeholder="Slug"
            className="input input-bordered w-full"
            onChange={(e) => setSlug(e.target.value)}
            required
          />
        </div>
  
        {/* Brand */}
        <div className="form-control">
        <label className="label">
            <span className="label-text">Product Brand</span>
          </label>
          <input
            type="text"
            placeholder="Brand"
            className="input input-bordered w-full"
            onChange={(e) => setBrand(e.target.value)}
            required
          />
        </div>
  
        {/* Price */}
        <div className="form-control">
        <label className="label">
            <span className="label-text">Product Price</span>
          </label>
          <input
            type="text"
            placeholder="Price"
            className="input input-bordered w-full"
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
  
        {/* Count In Stock */}
        <div className="form-control">
        <label className="label">
            <span className="label-text">Product In-Stock</span>
          </label>
          <input
            type="text"
            placeholder="Count in stock"
            className="input input-bordered w-full"
            onChange={(e) => setCountInStock(e.target.value)}
            required
          />
        </div>
  
        {/* Description */}
        <div className="form-control">
        <label className="label">
            <span className="label-text">Product Description</span>
          </label>
          <input
            type="text"
            placeholder="Short Description"
            className="input input-bordered w-full"
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
  
        {/* Category Dropdown */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Category</span>
          </label>
          <select
            className="select select-bordered w-full"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="books">Books</option>
            <option value="accessories">Accessories</option>
            <option value="accessories">Beauty</option>
            <option value="accessories">Other</option>
          </select>
        </div>
  
        {/* Rating Dropdown */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Rating</span>
          </label>
          <select
            className="select select-bordered w-full"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            required
          >
            <option value="">Select Rating</option>
            <option value="1">1 - Poor</option>
            <option value="2">2 - Fair</option>
            <option value="3">3 - Good</option>
            <option value="4">4 - Very Good</option>
            <option value="5">5 - Excellent</option>
          </select>
        </div>
  
        {/* Number of Reviews */}
        <div className="form-control">
        <label className="label">
            <span className="label-text">Product Number of Reviews</span>
          </label>
          <input
            type="text"
            placeholder="Number of Reviews"
            className="input input-bordered w-full"
            onChange={(e) => setNumRevies(e.target.value)}
            required
          />
        </div>
  
        {/* Submit Button */}
        <div>
        <button 
              type="submit" 
              className="btn bg-amber-500 w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
               <span className="loading loading-dots text-amber-500 loading-lg"></span>
                </>
              ) : (
                'Create Product'
              )}
            </button>
        </div>
      </form>
    </div>
  </div>
  
  );
}

export default AdminProductCreate;

