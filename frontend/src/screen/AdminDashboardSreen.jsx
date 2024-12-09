


import { useContext, useEffect, useReducer } from 'react';
import axios from 'axios';
import { Store } from '../Store';
import { getError } from '../utils';
import LoadingBox from '../mainpage/LoadingBox';
import MessageBox from '../mainpage/MessageBox';
import { Link } from 'react-router-dom';


const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, summary: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function AdminDashboardScreen() {
  const [{ loading, summary, error }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });
  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get('/api/order/summary', {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [userInfo]);

  const pendingOrders = summary?.orders?.filter(order => !order.isPaid) || [];
  const paidOrders = summary?.orders?.filter(order => order.isPaid) || [];
  const totalRevenue = paidOrders.reduce((sum, order) => sum + order.totalPrice, 0);

  return (
    <div className="p-8 bg-gray-900 text-white min-h-screen">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-white mt-1">Welcome back, {userInfo.name}</p>
      </header>

      {loading ? (
                            <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-center items-center min-h-[50vh]">
                            <LoadingBox />
                          </div>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Stats cards with updated styling */}
            <div className=" rounded-xl shadow-sm border text-white border-gray-100 p-6 transition-shadow hover:shadow-md">
              <div className="flex items-center">
                <div className="p-3 rounded-full  text-blue-200 bg-blue-600">
                  <i className="fas fa-users text-xl"></i>
                </div>
                <div className="ml-4">
                  <p className="text-white text-sm">Total Users</p>
                  <h3 className="text-2xl font-bold text-white">{summary.users?.length || 0}</h3>
                </div>
              </div>
            </div>
            <div className=" p-6 rounded-lg shadow-sm border ">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100 text-green-600">
                    <i className="fas fa-dollar-sign text-2xl"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-white">Total Revenue</p>
                    <h3 className="text-2xl font-bold">₦{totalRevenue.toFixed(2)}</h3>
                  </div>
                </div>
              </div>

              <div className=" p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                    <i className="fas fa-clock text-2xl"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-white">Pending Orders</p>
                    <h3 className="text-2xl font-bold text-white">{pendingOrders.length}</h3>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                    <i className="fas fa-box text-2xl"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-black">Total Products</p>
                    <h3 className="text-2xl font-bold text-black">{summary.products?.length || 0}</h3>
                  </div>
                </div>
              </div>
            </div>
          {/* Recent Orders and Products Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
  <div className="p-6 border-b border-gray-200">
    <h2 className="text-xl font-semibold text-black">Recent Orders</h2>
  </div>
  <div className="p-6">
    <div className="max-h-[400px] overflow-y-auto scrollbar">
      {summary.orders?.slice(0, 5).map((order) => (
        <div key={order._id} className="mb-4 p-4 border rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold text-black">Order #{order._id}</p>
              <p className="text-sm text-gray-500">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <span className={`px-3 py-1 rounded-full text-sm ${
                order.isPaid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {order.isPaid ? 'Paid' : 'Pending'}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
    <Link to="/admin/orders" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
      View all orders →
    </Link>
  </div>
</div>


              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-black">Recent Products</h2>
                </div>
                <div className="p-6">
                  {summary.products?.slice(0, 5).map((product) => (
                    <div key={product._id} className="mb-4 p-4 border rounded-lg">
                      <div className="flex items-center">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="ml-4">
                          <p className="font-semibold">{product.name}</p>
                          <p className="text-sm text-gray-500">₦{product.price}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Link to="/admin/products" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View all products →
                  </Link>
                </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
