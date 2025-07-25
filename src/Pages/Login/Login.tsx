import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { Link, NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AuthContext } from "../../contexts/AuthProvider";
import type { AuthContextType } from "../../contexts/AuthProvider";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

interface LoginFormInputs {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();
  const { signIn } = useContext(AuthContext) as AuthContextType;
  const [loginError, setLoginError] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false); // State to toggle password visibility
  // const location = useLocation(); // Removed unused variable
  const navigate = useNavigate();

  const handleLogin: SubmitHandler<LoginFormInputs> = (data) => {
    setLoginError("");
    signIn(data.email, data.password)
      .then(() => {
        toast.success("User Login Successfully");
        navigate("/dashboard");
      })
      .catch((error: Error) => {
        console.log(error);
        setLoginError("Email or Password Not Match");
      });
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
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Login</h2>
        <p className="text-gray-500 mb-6 text-center">
          Welcome back! Please login to your account.
        </p>
        <form onSubmit={handleSubmit(handleLogin)} className="w-full space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none bg-white text-black"
              required
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", { required: "Password is required" })}
                placeholder="Enter your password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none bg-white text-black pr-12"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          {loginError && (
            <p className="text-red-600 text-center text-sm">{loginError}</p>
          )}
          <button
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition duration-200"
            type="submit"
          >
            Login
          </button>
          <div className="flex justify-between items-center mt-2">
            <Link
              className="text-indigo-500 hover:underline text-sm"
              to="/forget-password"
            >
              Forgot Password?
            </Link>
            <NavLink
              className="text-indigo-500 hover:underline text-sm"
              to="/signup"
            >
              Create new account
            </NavLink>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
