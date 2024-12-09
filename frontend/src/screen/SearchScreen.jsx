import React, { useEffect, useReducer, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import toast from "react-hot-toast";
import Rating from "../mainpage/Rating";
import { getError } from '../utils';
import LoadingBox from '../mainpage/LoadingBox';
import MessageBox from '../mainpage/MessageBox';
import Product from '../mainpage/Product';


const reducer = (state, action) => {
  
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        products: action.payload.products,
        page: action.payload.page,
        pages: action.payload.pages,
        countProducts: action.payload.countProducts,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

const prices = [
  { name: '₦1000 to ₦5000', value: '1-50' },
  { name: '₦5100 to ₦20000', value: '51-200' },
  { name: '₦2010 to ₦10000', value: '201-1000' },
];

export const ratings = [
  { name: '4stars & up', rating: 4 },
  { name: '3stars & up', rating: 3 },
  { name: '2stars & up', rating: 2 },
  { name: '1stars & up', rating: 1 },
];

export default function SearchScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const category = sp.get('category') || 'all';
  const query = sp.get('query') || 'all';
  const price = sp.get('price') || 'all';
  const rating = sp.get('rating') || 'all';
  const order = sp.get('order') || 'newest';
  const page = sp.get('page') || 1;

  const [{ loading, error, products, pages, countProducts }, dispatch] = 
    useReducer(reducer, { loading: true, error: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `/api/product/search?page=${page}&query=${query}&category=${category}&price=${price}&rating=${rating}&order=${order}`
        );
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, [category, order, page, price, query, rating]);

  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/product/categories`);
        setCategories(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, []);

  const getFilterUrl = (filter, skipPathname) => {
    const filterPage = filter.page || page;
    const filterCategory = filter.category || category;
    const filterQuery = filter.query || query;
    const filterRating = filter.rating || rating;
    const filterPrice = filter.price || price;
    const sortOrder = filter.order || order;
    return `${skipPathname ? '' : '/search?'}category=${filterCategory}&query=${filterQuery}&price=${filterPrice}&rating=${filterRating}&order=${sortOrder}&page=${filterPage}`;
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold">Department</h3>
          <ul>
            <li>
              <Link className={category === 'all' ? 'font-bold' : ''} to={getFilterUrl({ category: 'all' })}>
                Any
              </Link>
            </li>
            {categories.map((c) => (
              <li key={c}>
                <Link className={c === category ? 'font-bold' : ''} to={getFilterUrl({ category: c })}>
                  {c}
                </Link>
              </li>
            ))}
          </ul>

          <h3 className="text-lg font-semibold mt-4">Price</h3>
          <ul>
            <li>
              <Link className={price === 'all' ? 'font-bold' : ''} to={getFilterUrl({ price: 'all' })}>
                Any
              </Link>
            </li>
            {prices.map((p) => (
              <li key={p.value}>
                <Link to={getFilterUrl({ price: p.value })} className={p.value === price ? 'font-bold' : ''}>
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>

          <h3 className="text-lg font-semibold mt-4">Avg. Customer Review</h3>
          <ul>
            {ratings.map((r) => (
              <li key={r.name}>
                <Link to={getFilterUrl({ rating: r.rating })} className={String(r.rating) === String(rating) ? 'font-bold' : ''}>
                  <Rating caption={' & up'} rating={r.rating} />
                </Link>
              </li>
            ))}
            <li>
              <Link to={getFilterUrl({ rating: 'all' })} className={rating === 'all' ? 'font-bold' : ''}>
                <Rating caption={' & up'} rating={0} />
              </Link>
            </li>
          </ul>
        </div>

        <div className="col-span-2">
          {loading ? (
           <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-center items-center min-h-[50vh]">
           <LoadingBox />
         </div>
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <>
              <div className="flex justify-between mb-4">
                <div>
                  {countProducts === 0 ? 'No' : countProducts} Results
                  {query !== 'all' && ' : ' + query}
                  {category !== 'all' && ' : ' + category}
                  {price !== 'all' && ' : Price ' + price}
                  {rating !== 'all' && ' : Rating ' + rating + ' & up'}
                  {(query !== 'all' || category !== 'all' || rating !== 'all' || price !== 'all') && (
                    <button
                      className="ml-4 text-amber-500 hover:underline"
                      onClick={() => navigate('/search')}
                    >
                      <i className="fas fa-times-circle"></i>
                    </button>
                  )}
                </div>
                <div>
                  Sort by{' '}
                  <select
                    value={order}
                    onChange={(e) => {
                      navigate(getFilterUrl({ order: e.target.value }));
                    }}
                    className="ml-2 border rounded p-1"
                  >
                    <option value="newest">Newest Arrivals</option>
                    <option value="lowest">Price: Low to High</option>
                    <option value="highest">Price: High to Low</option>
                    <option value="toprated">Avg. Customer Reviews</option>
                  </select>
                </div>
              </div>
              {products.length === 0 && <MessageBox variant="danger">No Product Found</MessageBox>}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                  <Product key={product._id} product={product} />
                ))}
              </div>

              <div className="mt-4">
                {[...Array(pages).keys()].map((x) => (
                  <Link key={x + 1} className="mx-1" to={getFilterUrl({ page: x + 1 }, true)}>
                    <button className={`btn ${Number(page) === x + 1 ? 'font-bold' : ''} btn-light`}>
                      {x + 1}
                    </button>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
