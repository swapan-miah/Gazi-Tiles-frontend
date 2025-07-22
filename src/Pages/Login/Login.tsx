import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import type { SubmitHandler, FieldValues } from "react-hook-form";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AuthContext } from "../../contexts/AuthProvider";
import type { AuthContextType } from "../../contexts/AuthProvider";

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
  const { signIn, GoogleSignIn } = useContext(AuthContext) as AuthContextType;
  const [loginError, setLoginError] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false); // State to toggle password visibility
  const location = useLocation();
  const navigate = useNavigate();

  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname || "/";

  const handleLogin: SubmitHandler<LoginFormInputs> = (data) => {
    setLoginError("");
    signIn(data.email, data.password)
      .then((result: { user: unknown }) => {
        const user = result.user;
        toast.success("User Login Successfully");
        navigate("/dashboard");
      })
      .catch((error: Error) => {
        console.log(error);
        setLoginError("Email or Password Not Match");
      });
  };

  return (
    <div className="h-[800px] flex justify-center items-center bg-gray-100">
      <div className="w-96 p-6 shadow-2xl rounded-lg bg-white text-black">
        <h3 className="text-2xl font-semibold text-center mt-2">Login</h3>
        <form
          onSubmit={handleSubmit(handleLogin)}
          className="card-body bg-white"
        >
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text text-black">Email</span>
            </label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              placeholder="Email"
              className="input input-bordered bg-white text-black"
              required
            />
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text text-black">Password</span>
            </label>
            <input
              type={showPassword ? "text" : "password"}
              {...register("password", {
                required: "Password is required",
              })}
              placeholder="Password"
              className="input input-bordered bg-white text-black"
              required
            />
            {errors.password && (
              <p className="text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div className="flex items-center mt-2">
            <input
              type="checkbox"
              className="mr-2"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
            <label className="text-black">Show Password</label>
          </div>

          <div className="form-control mt-3">
            <button
              className="btn bg-primary hover:bg-secondary text-white"
              type="submit"
            >
              Login
            </button>
          </div>

          {loginError && <p className="text-red-600">{loginError}</p>}

          <p className="text-center mt-4">
            New to Doctors Portal?{" "}
            <NavLink className="text-secondary" to="/signup">
              Create new account
            </NavLink>
          </p>

          <p className="text-center mt-2">
            <Link className="text-secondary" to="/forget-password">
              Forget Password?
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
