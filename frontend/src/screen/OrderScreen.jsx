import axios from 'axios';
import { useContext, useEffect, useReducer } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Store } from '../Store';
import LoadingBox from '../mainpage/LoadingBox';
import MessageBox from '../mainpage/MessageBox';
import { getError } from '../utils';
import toast from "react-hot-toast";
import { PaystackButton } from 'react-paystack';


function reducer(state, action) {
  
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'PAY_REQUEST':
      return { ...state, loadingPay: true };
    case 'PAY_SUCCESS':
      return { ...state, loadingPay: false, successPay: true };
    case 'PAY_FAIL':
      return { ...state, loadingPay: false };
    case 'PAY_RESET':
      return { ...state, loadingPay: false, successPay: false };
    case 'DELIVER_REQUEST':
      return { ...state, loadingDeliver: true };
    case 'DELIVER_SUCCESS':
      return { ...state, loadingDeliver: false, successDeliver: true };
    case 'DELIVER_FAIL':
      return { ...state, loadingDeliver: false };
    case 'DELIVER_RESET':
      return { ...state, loadingDeliver: false, successDeliver: false };
    default:
      return state;
  }
}

 export default function OrderScreen() {
  const { state } = useContext(Store);
  const { userInfo } = state;

  const params = useParams();
  const { id: orderId } = params;
  const navigate = useNavigate();

  const [
    {
      loading,
      error,
      order,
      loadingDeliver,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    order: {},
    error: '',
    successPay: false,
    loadingPay: false,
  });

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/order/${orderId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
      if (!userInfo) {
        return navigate('/login');
      }
    };
    fetchOrder();
  }, [navigate, orderId, userInfo]);

  const handlePayment = async(reference) => {
    try {
      dispatch({ type: 'PAY_REQUEST' });
      const { data } = await axios.put(
        `/api/order/${order._id}/pay`,
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
  
      toast.success('Payment completed!')
      dispatch({ type: 'PAY_SUCCESS', payload: data });
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'PAY_FAIL', payload: getError(err) });
    }
  }
  
  
  const componentProps = {
    email: userInfo.email,
    amount: order.totalPrice * 100,
    publicKey: 'pk_test_008ea3d7df559967d256fa493c249e42aa5ec170',
    text: 'Pay Now',
    onSuccess: (reference) => handlePayment(reference),
    onClose: () => toast.error('Payment was not completed'),
  };

  async function deliverOrderHandler() {
    try {
      dispatch({ type: 'DELIVER_REQUEST' });
      const { data } = await axios.put(
        `/api/order/${order._id}/deliver`,
        {},
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: 'DELIVER_SUCCESS', payload: data });
      toast.success('Order is delivered');
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'DELIVER_FAIL' });
    }
  }

  return loading ? (
    <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-center items-center min-h-[50vh]">
    <LoadingBox />
  </div>
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div className="container mx-auto my-8 p-4">
      <h1 className="text-2xl font-bold my-3">Order {orderId}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-2">
          <div className="mb-4 bg-white shadow-lg rounded-lg">
            <div className="p-4">
              <h2 className="text-lg font-semibold">Shipping</h2>
              <p>
                <strong>Name:</strong> {order.shippingAddress.fullName} <br />
                <strong>Address: </strong> {order.shippingAddress.address},
                {order.shippingAddress.city}, {order.shippingAddress.phone},
                {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <MessageBox variant="success">
                  Delivered at {order.deliveredAt}
                </MessageBox>
              ) : (
                <MessageBox variant="danger">Not Delivered</MessageBox>
              )}
            </div>
          </div>
          <div className="mb-4 bg-white shadow-lg rounded-lg">
            <div className="p-4">
              <h2 className="text-lg font-semibold">Payment</h2>
              <p>
                <strong>Method:</strong> {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <MessageBox variant="success">
                  Paid at {order.paidAt}
                </MessageBox>
              ) : (
                <MessageBox variant="danger">Not Paid</MessageBox>
              )}
            </div>
          </div>
          <div className="mb-4 bg-white shadow-lg rounded-lg">
            <div className="p-4">
              <h2 className="text-lg font-semibold">Items</h2>
              <ul className="list-disc pl-5">
                {order.orderItems.map((item) => (
                  <li key={item._id} className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-lg mr-4"
                      />
                      <Link to={`/product/${item.slug}`} className="text-blue-500 hover:underline">
                        {item.name}
                      </Link>
                    </div>
                    <div className="flex space-x-4">
                      <span>Qty: {item.quantity}</span>
                      <span>₦{item.price.toFixed(2)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div>
          <div className="mb-4 bg-white shadow-lg rounded-lg">
            <div className="p-4">
              <h2 className="text-lg font-semibold">Order Summary</h2>
              <ul>
                <li className="flex justify-between">
                  <span>Items</span>
                  <span>₦{order.itemsPrice.toFixed(2)}</span>
                </li>
                <li className="flex justify-between">
                  <span>Shipping</span>
                  <span>₦{order.shippingPrice.toFixed(2)}</span>
                </li>
                <li className="flex justify-between">
                  <span>Tax</span>
                  <span>₦{order.taxPrice.toFixed(2)}</span>
                </li>
                <li className="flex justify-between font-bold">
                  <span>Order Total</span>
                  <span>₦{order.totalPrice.toFixed(2)}</span>
                </li>
              </ul>
              {!order.isPaid && (
                <div className="mt-4">
                    <PaystackButton 
                        {...componentProps} 
                        className="btn btn-success w-full" 
                    />
                </div>

              )}
              {userInfo.isAdmin && !order.isDelivered && (
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={deliverOrderHandler}
                    className="btn bg-amber-500 w-full"
                  >
                                {loadingDeliver ? (
                <>
               <span className="loading loading-dots text-white loading-lg"></span>
                </>
              ) : (
                'Deliver Order'
              )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
