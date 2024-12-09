import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Store } from "../Store";
import { getError } from '../utils';
import toast from "react-hot-toast";


export default function SigninScreen() {
  
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      
      const { data } = await axios.post('/api/user/signin', {
        email,
        password,
      });
      ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      toast.success('User Logged In Successfully');
      navigate('/');
    } catch (err) {
      toast.error(getError(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate('/');
    }
  }, [navigate, userInfo]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="card w-full max-w-md bg-base-200 shadow-lg bg-white p-5">
        <h1 className="text-2xl font-bold text-center mb-5">Sign In</h1>
        <form onSubmit={submitHandler}>
          <div className="form-control mb-3">
            <label className="label" htmlFor="email">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              id="email"
              className="input input-bordered"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-control mb-3">
            <label className="label" htmlFor="password">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              id="password"
              className="input input-bordered"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="form-control mb-3">
            <button className="btn bg-amber-500 w-full" type="submit">
            {isLoading ? (
                <>
               <span className="loading loading-dots text-white loading-lg"></span>
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </div>
        </form>

        <div className="text-center mt-3">
          <p className="text-sm">
            <div className="text-sm text-center">
            Don't have an account?{' '}
          <Link to="/signup" className="text-blue-500 hover:underline">
           click here to sign up.
          </Link>
        </div>
          </p>
        </div>
      </div>
    </div>
  );
}
