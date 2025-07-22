import React, { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { getAuth, sendEmailVerification } from "firebase/auth";
import Swal from "sweetalert2";
import app from "../../firebase/firebase.config";
import { AuthContext } from "../../contexts/AuthProvider";

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
    <div className="h-[800px] flex justify-center items-center bg-gray-100">
      <div className="w-96 p-6 shadow-2xl rounded-lg bg-white text-black">
        <h3 className="text-2xl font-semibold text-center mt-2">Sign Up</h3>
        <form
          onSubmit={handleSubmit(handleSignUp)}
          className="card-body bg-white"
        >
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text text-black">Name</span>
            </label>
            <input
              {...register("name")}
              type="text"
              placeholder="Name"
              className="input input-bordered bg-white text-black"
              required
            />
            {errors.name && (
              <p className="text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text text-black">Email</span>
            </label>
            <input
              type="email"
              {...register("email")}
              placeholder="Email"
              className="input input-bordered bg-white text-black"
              required
            />
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text text-black">Password</span>
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
                    value: /(?=.*?[A-Z])(?=.*?[!@$%^&*+-_./])(?=.*?[0-9])/,
                    message:
                      "Password must contain an uppercase letter, special character, and number",
                  },
                })}
                placeholder="Password"
                className="input input-bordered bg-white text-black w-full pr-10"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div className="form-control mt-3">
            <button
              className="btn bg-primary hover:bg-secondary text-white"
              type="submit"
            >
              Sign Up
            </button>
          </div>

          {signUpError && <p className="text-red-600">{signUpError}</p>}

          <p className="text-center mt-4">
            Already have an account?{" "}
            <NavLink className="text-secondary" to="/login">
              Please Login
            </NavLink>{" "}
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
