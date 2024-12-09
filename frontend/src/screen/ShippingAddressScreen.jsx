import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store } from '../Store';
import toast from 'react-hot-toast';


export default function ShippingAddressScreen() {
    const navigate = useNavigate();
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const {
        cart: { shippingAddress },
    } = state;
    const [fullName, setFullName] = useState(shippingAddress.fullName || '');
    const [address, setAddress] = useState(shippingAddress.address || '');
    const [city, setCity] = useState(shippingAddress.city || '');
    const [country, setCountry] = useState(shippingAddress.country || '');
    const [phone, setPhone] = useState(shippingAddress.phone || '');

    const submitHandler = (e) => {
        
        e.preventDefault();
        if (!phone || isNaN(phone)) {
            toast.error("Phone must be a valid number");
            return;
          }
        ctxDispatch({
            type: 'SAVE_SHIPPING_ADDRESS',
            payload: {
                fullName,
                address,
                city,
                country,
                phone,
            },
        });
        localStorage.setItem(
            'shippingAddress',
            JSON.stringify({
                fullName,
                address,
                city,
                country,
                phone,
            })
        );
        navigate('/payment');
    };

    return (
        <div className="p-4">
            <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
                <h1 className="text-2xl font-bold mb-4">Shipping Address</h1>
                <form onSubmit={submitHandler}>
                    <div className="mb-4">
                        <label htmlFor="fullName" className="block text-sm font-medium mb-2">Full Name</label>
                        <input
                            id="fullName"
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                            className="input input-bordered w-full"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="address" className="block text-sm font-medium mb-2">Address</label>
                        <input
                            id="address"
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                            className="input input-bordered w-full"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="city" className="block text-sm font-medium mb-2">City</label>
                        <input
                            id="city"
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            required
                            className="input input-bordered w-full"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="country" className="block text-sm font-medium mb-2">Country</label>
                        <input
                            id="country"
                            type="text"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            required
                            className="input input-bordered w-full"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="phone" className="block text-sm font-medium mb-2">Phone Number</label>
                        <input
                            id="phone"
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                            className="input input-bordered w-full"
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn bg-amber-500 w-full"
                    >
                        Continue
                    </button>
                </form>
            </div>
        </div>
    );
}
