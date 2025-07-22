import React, { useContext } from "react";
import Login from "../Login/Login";
import { AuthContext } from "../../contexts/AuthProvider";
import useRole from "../../hooks/useRole";
import Loading from "../../Components/Loading/Loading";
import { NavLink } from "react-router-dom";

const Home = () => {
  const { user } = useContext(AuthContext);
  const [role, loading] = useRole(user?.email);

  // if (loading) {
  //   return <Loading></Loading>;
  // }

  // console.log("I am from home page ", role);

  return (
    <div className=" h-screen flex justify-center items-center">
      {role ? (
        <button className="  text-xl btn btn-success ">
          {" "}
          <li className=" list-none">
            <NavLink to="/dashboard">Go To Dashboard</NavLink>
          </li>
        </button>
      ) : (
        <Login></Login>
      )}
    </div>
  );
};

export default Home;
