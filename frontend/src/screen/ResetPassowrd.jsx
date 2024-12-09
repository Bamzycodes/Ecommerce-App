import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Ensure axios is imported
import { toast } from "react-hot-toast"; // Ensure toast is imported

function ResetPasswordScreen() {
    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const userInfo = localStorage.getItem("userInfo"); 

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        try {
            const response = await axios.post('/api/user/reset-password', {
                userInfo,
                newPassword,
            });
            toast.success(response.data.message || 'Password reset successful');
            navigate('/signin');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to reset password');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="card w-full max-w-md bg-base-200 shadow-lg p-5">
                <h1 className="text-2xl font-bold text-center mb-5">Reset Password</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-control mb-3">
                        <label className="label" htmlFor="newPassword">
                            <span className="label-text">New Password</span>
                        </label>
                        <input
                            type="password"
                            id="newPassword"
                            className="input input-bordered"
                            required
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>

                    <div className="form-control mb-3">
                        <label className="label" htmlFor="confirmPassword">
                            <span className="label-text">Confirm Password</span>
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            className="input input-bordered"
                            required
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    <div className="form-control mb-3">
                        <button className="btn btn-primary w-full" type="submit">
                            Reset Password
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ResetPasswordScreen;
