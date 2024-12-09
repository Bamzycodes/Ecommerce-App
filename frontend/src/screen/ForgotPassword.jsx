import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios"; 
import { toast } from "react-hot-toast"; 

function ForgotPasswordScreen() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false); // State to manage loading

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        setLoading(true); // Start loading

        try {
            const response = await axios.post('/api/user/forgot-password', { email });
            toast.success(response.data.message || 'OTP sent to your email');
            navigate('/reset-password');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send OTP');
        } finally {
            setLoading(false); // Stop loading
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="card w-full max-w-md bg-base-200 shadow-lg p-5">
                <h1 className="text-2xl font-bold text-center mb-5">Forgot Password</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-control mb-3">
                        <label className="label" htmlFor="email">
                            <span className="label-text">Email</span>
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="input input-bordered"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className="form-control mb-3">
                        <button 
                            className={`btn btn-primary w-full ${loading ? 'loading' : ''}`} // Conditional loading class
                            type="submit"
                            disabled={loading} // Disable button while loading
                        >
                            {loading ? 'Sending...' : 'Send OTP'}
                        </button>
                    </div>
                </form>

                <div className="text-center mt-3">
                    <p className="text-sm">
                        New customer?{' '}
                        <Link to="/signup" className="text-primary">
                            Create your account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default ForgotPasswordScreen;
