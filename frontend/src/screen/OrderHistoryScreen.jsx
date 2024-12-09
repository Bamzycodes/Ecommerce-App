import React, { useContext, useEffect, useReducer } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LoadingBox from '../mainpage/LoadingBox';
import MessageBox from '../mainpage/MessageBox';
import { Store } from '../Store';
import { getError } from '../utils';


const reducer = (state, action) => {
  
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, orders: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function OrderHistoryScreen() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();

  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await axios.get(`/api/order/mine`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(error),
        });
      }
    };
    fetchData();
  }, [userInfo]);

  return (
    <div className="container mx-auto my-8 p-4">
      <h1 className="text-2xl font-bold mb-4">Order History</h1>
      {loading ? (
        <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-center items-center min-h-[50vh]">
        <LoadingBox />
      </div>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="py-2 px-4 text-left">DATE</th>
                <th className="py-2 px-4 text-left">TOTAL</th>
                <th className="py-2 px-4 text-left">PAID</th>
                <th className="py-2 px-4 text-left">DELIVERED</th>
                <th className="py-2 px-4 text-left">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b">
                  <td className="py-2 px-4">{order.createdAt.substring(0, 10)}</td>
                  <td className="py-2 px-4">₦{order.totalPrice.toFixed(2)}</td>
                  <td className="py-2 px-4">
                    {order.isPaid ? order.paidAt.substring(0, 10) : 'No'}
                  </td>
                  <td className="py-2 px-4">
                    {order.isDelivered ? order.deliveredAt.substring(0, 10) : 'No'}
                  </td>
                  <td className="py-2 px-4">
                    <button
                      type="button"
                      className="btn btn-light"
                      onClick={() => {
                        navigate(`/order/${order._id}`);
                      }}
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
