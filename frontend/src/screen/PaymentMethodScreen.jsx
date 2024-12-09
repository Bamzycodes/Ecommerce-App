import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store } from '../Store';


export default function PaymentMethodScreen() {
  
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { shippingAddress, paymentMethod },
  } = state;

  const [paymentMethodName, setPaymentMethod] = useState(
    paymentMethod || 'Paystack'
  );

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    ctxDispatch({ type: 'SAVE_PAYMENT_METHOD', payload: paymentMethodName });
    localStorage.setItem('paymentMethod', paymentMethodName);
    navigate('/placeorder');
  };

  return (
    <div className="container mx-auto my-8 p-4">
      <h1 className="text-2xl font-bold my-3">Payment Method</h1>
      <form onSubmit={submitHandler} className="space-y-4">
        <div>
          <input
            type="radio"
            id="paystack"
            value="paystack"
            checked={paymentMethodName === 'paystack'}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="mr-2"
          />
          <label htmlFor="paystack" className="text-lg">
            Paystack
          </label>
        </div>
        <div>
          <button
            type="submit"
            className="btn bg-amber-500 w-full mt-4"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
}
