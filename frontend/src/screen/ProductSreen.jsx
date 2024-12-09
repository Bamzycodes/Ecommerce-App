import axios from "axios";
import { useContext, useEffect, useReducer, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getError } from "../utils";
import LoadingBox from "../mainpage/LoadingBox";
import MessageBox from "../mainpage/MessageBox";
import { Store } from "../Store";
import toast from "react-hot-toast";
import Rating from "../mainpage/Rating";


const reducer = (state, action) => {
    
    switch (action.type) {
        case "REFRESH_PRODUCT":
            return { ...state, product: action.payload };
        case "CREATE_REQUEST":
            return { ...state, loadingCreateReview: true };
        case "CREATE_SUCCESS":
            return { ...state, loadingCreateReview: false };
        case "CREATE_FAIL":
            return { ...state, loadingCreateReview: false };
        case "FETCH_REQUEST":
            return { ...state, loading: true };
        case "FETCH_SUCCESS":
            return { ...state, product: action.payload, loading: false };
        case "FETCH_FAIL":
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

function ProductScreen() {
    let reviewsRef = useRef();

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");

    const params = useParams();
    const { slug } = params;

    const [{ loading, error, product, loadingCreateReview }, dispatch] = useReducer(reducer, {
        product: [],
        loading: true,
        error: "",
    });

    useEffect(() => {
        const fetchData = async () => {
            dispatch({ type: "FETCH_REQUEST" });
            try {
                const result = await axios.get(`/api/product/slug/${slug}`);
                dispatch({ type: "FETCH_SUCCESS", payload: result.data });
            } catch (err) {
                dispatch({ type: "FETCH_FAIL", payload: getError(err) });
            }
        };
        fetchData();
    }, [slug]);

    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { cart, userInfo } = state;

    const addToCartHandler = async () => {
        const existItem = cart.cartItems.find((x) => x._id === product._id);
        const quantity = existItem ? existItem.quantity + 1 : 1;
        const { data } = await axios.get(`/api/product/${product._id}`);
        if (data.countInStock < quantity) {
            toast.error("Sorry, product is out of stock");
            return;
        }
        ctxDispatch({
            type: "CART_ADD_ITEM",
            payload: { ...product, quantity },
        });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!comment || !rating) {
            toast.error("Please enter comment and rating");
            return;
        }
        try {
            const { data } = await axios.post(
                `/api/product/${product._id}/reviews`,
                { rating, comment, name: userInfo.name },
                {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                }
            );

            dispatch({
                type: "CREATE_SUCCESS",
            });
            toast.success("Review submitted successfully");
            product.reviews.unshift(data.review);
            product.numReviews = data.numReviews;
            product.rating = data.rating;
            dispatch({ type: "REFRESH_PRODUCT", payload: product });
            window.scrollTo({
                behavior: "smooth",
                top: reviewsRef.current.offsetTop,
            });
        } catch (error) {
            toast.error(getError(error));
            dispatch({ type: "CREATE_FAIL" });
        }
    };

    return loading ? (
        <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-center items-center min-h-[50vh]">
        <LoadingBox />
      </div>
    ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
    ) : (
        <div key={product.slug} className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                    <img className="w-full h-auto" src={product.image} alt={product.name} />
                </div>
                <div className="md:col-span-1">
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h1 className="text-2xl font-bold">{product.name}</h1>
                        <Rating rating={product.rating} numReviews={product.numReviews} />
                        <p className="mt-2 text-lg">Price: ₦{product.price}</p>
                        <p className="mt-2">Description:</p>
                        <p className="mt-1">{product.description}</p>
                    </div>
                </div>
                <div className="md:col-span-1">
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h2 className="text-lg font-semibold">Product Details</h2>
                        <div className="mt-2">
                            <p>
                                <strong>Price:</strong> ${product.price}
                            </p>
                            <p>
                                <strong>Status:</strong>{" "}
                                {product.countInStock > 0 ? (
                                    <span className="text-green-600">In Stock</span>
                                ) : (
                                    <span className="text-red-600">Out of Stock</span>
                                )}
                            </p>
                        </div>
                        {product.countInStock > 0 && (
                            <button
                                onClick={addToCartHandler}
                                className="mt-4 w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition"
                            >
                                Add to Cart
                            </button>
                        )}
                    </div>
                </div>
            </div>
            <div className="my-4">
                <h2 ref={reviewsRef} className="text-xl font-semibold">Reviews</h2>
                <div className="mb-3">
                    {product.reviews.length === 0 && <MessageBox variant="danger">There are no reviews</MessageBox>}
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md">
                    {product.reviews.map((review) => (
                        <div key={review._id} className="mb-4 border-b pb-2">
                            <strong>{review.name}</strong>
                            <Rating rating={review.rating} caption=" " />
                            <p className="text-sm text-gray-600">{review.createdAt.substring(0, 10)}</p>
                            <p>{review.comment}</p>
                        </div>
                    ))}
                </div>
                <div className="my-4">
                    {userInfo ? (
                        <form onSubmit={submitHandler} className="bg-white p-4 rounded-lg shadow-md">
                            <h2 className="text-lg font-semibold">Write a customer review</h2>
                            <div className="mb-3">
                                <label htmlFor="rating" className="block text-sm font-medium">
                                    Rating
                                </label>
                                <select
                                    id="rating"
                                    className="mt-1 block w-full p-2 border rounded-md"
                                    value={rating}
                                    onChange={(e) => setRating(e.target.value)}
                                >
                                    <option value="">Select...</option>
                                    <option value="1">1 - Poor</option>
                                    <option value="2">2 - Fair</option>
                                    <option value="3">3 - Good</option>
                                    <option value="4">4 - Very Good</option>
                                    <option value="5">5 - Excellent</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="comment" className="block text-sm font-medium">
                                    Comments
                                </label>
                                <textarea
                                    id="comment"
                                    className="mt-1 block w-full p-2 border rounded-md"
                                    placeholder="Leave a comment here"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <button
                                    disabled={loadingCreateReview}
                                    type="submit"
                                    className="w-full bg-amber-500 text-white p-2 rounded-md hover:bg-black transition"
                                >
                                                                    {loading ? (
                <>
               <span className="loading loading-dots text-white loading-lg"></span>
                </>
              ) : (
                'Submit Review'
              )}
                                </button>
                                {loadingCreateReview && <LoadingBox />}
                            </div>
                        </form>
                    ) : (
                        <MessageBox>
                            Please{" "}
                            <Link to={`/signin?redirect=/product/${product.slug}`} className="text-blue-600">
                                Sign In
                            </Link>{" "}
                            to write a review
                        </MessageBox>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProductScreen;
