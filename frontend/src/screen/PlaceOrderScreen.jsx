import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";
import { getError } from '../utils';
import { Store } from '../Store';
import LoadingBox from '../mainpage/LoadingBox';


const reducer = (state, action) => {
  
  switch (action.type) {
    case 'CREATE_REQUEST':
      return { ...state, loading: true };
    case 'CREATE_SUCCESS':
      return { ...state, loading: false };
    case 'CREATE_FAIL':
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default function PlaceOrderScreen() {
  const navigate = useNavigate();

  const [{ loading }, dispatch] = useReducer(reducer, {
    loading: false,
  });

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;
  cart.itemsPrice = round2(
    cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
  );
  cart.shippingPrice = cart.itemsPrice > 100 ? round2(0) : round2(10);
  cart.taxPrice = round2(0.15 * cart.itemsPrice);
  cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;

  const placeOrderHandler = async () => {
    try {
      dispatch({ type: 'CREATE_REQUEST' });

      const { data } = await axios.post(
        '/api/order',
        {
          orderItems: cart.cartItems,
          shippingAddress: cart.shippingAddress,
          paymentMethod: cart.paymentMethod,
          itemsPrice: cart.itemsPrice,
          shippingPrice: cart.shippingPrice,
          taxPrice: cart.taxPrice,
          totalPrice: cart.totalPrice,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      ctxDispatch({ type: 'CART_CLEAR' });
      dispatch({ type: 'CREATE_SUCCESS' });
      localStorage.removeItem('cartItems');
      toast.success('Order Placed Successfully');
      navigate(`/order/${data.order._id}`);
    } catch (err) {
      dispatch({ type: 'CREATE_FAIL' });
      toast.error(getError(err));
      alert(getError(err));
    }
  };

  useEffect(() => {
    if (!cart.paymentMethod) {
      navigate('/payment');
    }
  }, [cart, navigate]);

  return (
    <div className="container mx-auto my-8 p-4">

      <h1 className="text-2xl font-bold my-3">Preview Order</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-2">
          <div className="mb-3 p-4 border rounded-lg shadow-md bg-white">
            <h2 className="text-xl font-semibold">Shipping</h2>
            <p>
              <strong>Name:</strong> {cart.shippingAddress.fullName} <br />
              <strong>Address:</strong> {cart.shippingAddress.address},
              {cart.shippingAddress.city}, {cart.shippingAddress.phone},
              {cart.shippingAddress.country}
            </p>
            <Link to="/shipping" className="text-blue-500 hover:underline">
              Edit
            </Link>
          </div>

          <div className="mb-3 p-4 border rounded-lg shadow-md bg-white">
            <h2 className="text-xl font-semibold">Payment</h2>
            <p>
              <strong>Method:</strong> {cart.paymentMethod}
            </p>
          </div>

          <div className="mb-3 p-4 border rounded-lg shadow-md bg-white">
            <h2 className="text-xl font-semibold">Items</h2>
            <ul className="space-y-4">
              {cart.cartItems.map((item) => (
                <li key={item._id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg mr-4"
                    />
                    <Link to={`/product/${item.slug}`} className="text-blue-500 hover:underline">
                      {item.name}
                    </Link>
                  </div>
                  <span>{item.quantity}</span>
                  <span>₦{item.price}</span>
                </li>
              ))}
            </ul>
            <Link to="/cart" className="text-blue-500 hover:underline">
              Edit
            </Link>
          </div>
        </div>
        <div>
          <div className="p-4 border rounded-lg shadow-md bg-white">
            <h2 className="text-xl font-semibold">Order Summary</h2>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span>Items</span>
                <span>₦{cart.itemsPrice.toFixed(2)}</span>
              </li>
              <li className="flex justify-between">
                <span>Shipping</span>
                <span>₦{cart.shippingPrice.toFixed(2)}</span>
              </li>
              <li className="flex justify-between">
                <span>Tax</span>
                <span>₦{cart.taxPrice.toFixed(2)}</span>
              </li>
              <li className="flex justify-between font-bold">
                <span>Order Total</span>
                <span>₦{cart.totalPrice.toFixed(2)}</span>
              </li>
            </ul>
            <div className="mt-4">
              <button
                className="btn bg-amber-500 w-full"
                type="button"
                onClick={placeOrderHandler}
                disabled={cart.cartItems.length === 0}
              >
                           {loading ? (
                <>
               <span className="loading loading-dots text-white loading-lg"></span>
                </>
              ) : (
                'Place Order'
              )}
              </button>
              {/* {loading && <LoadingBox />} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
