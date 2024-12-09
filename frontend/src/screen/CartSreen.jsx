import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Store } from "../Store";
import MessageBox from "../mainpage/MessageBox";
import axios from "axios";


export default function CartScreen() {
    
    const navigate = useNavigate();
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const {
        cart: { cartItems },
    } = state;

    console.log("Cart items:", cartItems); // Log current cart items

    const updateCartHandler = async (item, quantity) => {
        const { data } = await axios.get(`/api/product/${item._id}`);
        if (data.countInStock < quantity) {
            window.alert('Sorry, product is out of stock');
            return;
        }
        ctxDispatch({
            type: 'CART_ADD_ITEM',
            payload: { ...item, quantity },
        });
    };

    const removeItemHandler = (item) => {
        ctxDispatch({ type: 'CART_REMOVE_ITEM', payload: item });
    };

    const checkoutHandler = () => {
      if (!state.userInfo) {
          // If user is not logged in, redirect to signin page
          navigate('/signin?redirect=/shipping');
      } else {
          // If user is logged in, go directly to the shipping address screen
          navigate('/shipping');
      }
  };
  

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                    {cartItems.length === 0 ? (
                        <MessageBox>
                            Cart is empty. <Link to="/">Go Shopping </Link>
                        </MessageBox>
                    ) : (
                        <div className="bg-white shadow-md rounded-lg">
                            {cartItems.map((item) => (
                                <div key={item._id} className="flex items-center justify-between p-4 border-b">
                                    <div className="flex items-center">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-16 h-16 object-cover rounded-md mr-4"
                                        />
                                        <Link to={`/product/${item.slug}`} className="text-blue-600 hover:underline">
                                            {item.name}
                                        </Link>
                                    </div>
                                    <div className="flex items-center">
                                        <button
                                            className="btn btn-outline"
                                            onClick={() => updateCartHandler(item, item.quantity - 1)}
                                            disabled={item.quantity === 1}
                                        >
                                            <i className="fas fa-minus-circle"></i>
                                        </button>
                                        <span className="mx-2">{item.quantity}</span>
                                        <button
                                            className="btn btn-outline"
                                            onClick={() => updateCartHandler(item, item.quantity + 1)}
                                            disabled={item.quantity === item.countInStock}
                                        >
                                            <i className="fas fa-plus-circle"></i>
                                        </button>
                                    </div>
                                    <div className="text-lg">₦{item.price}</div>
                                    <div>
                                        <button
                                            className="btn btn-outline text-red-600"
                                            onClick={() => removeItemHandler(item)}
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div>
                    <div className="bg-white shadow-md rounded-lg">
                        <div className="p-4">
                            <h3 className="text-xl font-semibold">
                                Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)} items): ₦
                                {cartItems.reduce((a, c) => a + c.price * c.quantity, 0)}
                            </h3>
                        </div>
                        <div className="p-4">
                            <button
                                className="btn bg-amber-500 w-full"
                                type="button"
                                onClick={checkoutHandler}
                                disabled={cartItems.length === 0}
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
