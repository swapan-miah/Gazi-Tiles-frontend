import React, { useState, useContext, useEffect } from "react";
import type { FormEvent } from "react";
import { getAuth } from "firebase/auth";
import { sendPasswordResetEmail } from "firebase/auth";
import app from "../../firebase/firebase.config";
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthProvider";

const Forget_Password: React.FC = () => {
  const auth = getAuth(app);
  const { user } = useContext(AuthContext) as {
    user: { email?: string } | null;
  };
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (user && user.email) {
      setEmail(user.email);
    }
    // No return value
  }, [user]);

  const handlePasswordReset = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent! Please check your inbox.");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200 py-8 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center">
        {/* Logo Placeholder */}
        <div className="mb-6">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
            <span className="text-3xl font-bold text-indigo-600">GT</span>
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Forgot Password?
        </h2>
        <p className="text-gray-500 mb-6 text-center">
          Enter your email address and we’ll send you a link to reset your
          password.
        </p>
        <form onSubmit={handlePasswordReset} className="w-full space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-gray-700 font-medium mb-1"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none bg-white text-black"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition duration-200"
          >
            Send Reset Link
          </button>
        </form>
        {message && (
          <p className="text-green-600 mt-4 text-center font-medium">
            {message}
          </p>
        )}
        {error && (
          <p className="text-red-600 mt-4 text-center font-medium">{error}</p>
        )}
        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="text-indigo-500 hover:underline font-medium"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Forget_Password;
