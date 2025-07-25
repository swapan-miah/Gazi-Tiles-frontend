import { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { getAuth, sendEmailVerification } from "firebase/auth";
import Swal from "sweetalert2";
import app from "../../firebase/firebase.config";
import { AuthContext } from "../../contexts/AuthProvider";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const SignUp = () => {
  const auth = getAuth(app);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { createUser, updateUser } = useContext(AuthContext);
  const [signUpError, setSignUpError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // New state for password visibility
  const navigate = useNavigate();

  const emailVerifyMessage = () => {
    Swal.fire({
      title: "Please check your email. We sent a verification link.",
      showClass: {
        popup: `
          animate__animated
          animate__fadeInUp
          animate__faster
        `,
      },
      hideClass: {
        popup: `
          animate__animated
          animate__fadeOutDown
          animate__faster
        `,
      },
    });
  };

  const handleSignUp = (data) => {
    createUser(data.email, data.password)
      .then((result) => {
        const user = result.user;
        toast.success("User Created Successfully");
        const userInfo = { displayName: data.name };
        sendEmailVerification(auth.currentUser).then(() => {
          emailVerifyMessage();
        });
        updateUser(userInfo)
          .then(() => {
            saveUser(data.name, data.email);
          })
          .catch((err) => console.log(err));
      })
      .catch((error) => {
        console.log(error);
        setSignUpError("This email is already in use by another account");
      });
  };

  const saveUser = (name, email) => {
    const user = { name, email };
    const key = import.meta.env.VITE_Front_Backend_Key;
    fetch("https://isoft4.washingmachinerepairqa.com/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify(user),
    })
      .then((res) => res.json())
      .then(() => {
        navigate("/login");
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
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Sign Up</h2>
        <p className="text-gray-500 mb-6 text-center">
          Create your account to get started.
        </p>
        <form
          onSubmit={handleSubmit(handleSignUp)}
          className="w-full space-y-4"
        >
          <div>
            <label className="block text-gray-700 font-medium mb-1">Name</label>
            <input
              {...register("name")}
              type="text"
              placeholder="Enter your name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none bg-white text-black"
              required
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.name.message as string}
              </p>
            )}
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              {...register("email")}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none bg-white text-black"
              required
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message as string}
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
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least six characters",
                  },
                  pattern: {
                    value: /(?=.*?[A-Z])(?=.*?[!@$%^&*+-_./])(?=.*?[0-9])/, // at least one uppercase, special char, number
                    message:
                      "Password must contain an uppercase letter, special character, and number",
                  },
                })}
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
                {errors.password.message as string}
              </p>
            )}
          </div>
          {signUpError && (
            <p className="text-red-600 text-center text-sm">{signUpError}</p>
          )}
          <button
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition duration-200"
            type="submit"
          >
            Sign Up
          </button>
          <div className="flex justify-center items-center mt-2">
            <span className="text-gray-500 text-sm">
              Already have an account?
            </span>
            <NavLink
              className="text-indigo-500 hover:underline text-sm ml-2"
              to="/login"
            >
              Please Login
            </NavLink>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
