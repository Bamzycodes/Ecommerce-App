import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import toast from "react-hot-toast";
import { getError } from '../utils';


export default function AdminRegisterScreen() {
  
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
       await axios.post('/api/admin/signup', {
        name,
        email,
        password,
      });
      toast.success('User Registered Successfully');
      navigate('/signin');
    } catch (err) {
      toast.error(getError(err));
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
      <form onSubmit={submitHandler} className="space-y-4">
        {/* Name Input */}
        <div className="form-control">
          <label className="label" htmlFor="name">
            <span className="label-text">Name</span>
          </label>
          <input
            type="text"
            id="name"
            className="input input-bordered w-full"
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* Email Input */}
        <div className="form-control">
          <label className="label" htmlFor="email">
            <span className="label-text">Email</span>
          </label>
          <input
            type="email"
            id="email"
            className="input input-bordered w-full"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password Input */}
        <div className="form-control">
          <label className="label" htmlFor="password">
            <span className="label-text">Password</span>
          </label>
          <input
            type="password"
            id="password"
            className="input input-bordered w-full"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Confirm Password Input */}
        <div className="form-control">
          <label className="label" htmlFor="confirmPassword">
            <span className="label-text">Confirm Password</span>
          </label>
          <input
            type="password"
            id="confirmPassword"
            className="input input-bordered w-full"
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        {/* Submit Button */}
        <div>
          <button type="submit" className="btn btn-primary w-full">
            Sign Up
          </button>
        </div>

        {/* Link to Sign In */}
        <div className="text-sm text-center">
          Already have an account?{' '}
          <Link to="/signin" className="text-blue-500 hover:underline">
            Sign In
          </Link>
        </div>

      </form>
    </div>
  );
}
