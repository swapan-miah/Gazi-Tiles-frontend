import React from "react";
import { Outlet } from "react-router-dom";
import Nav from "../../Components/Nav/Nav";
import Header from "../../Components/Header/Header";

const Main = () => {
  return (
    <div className="bg-neutral-300 to-red-600 darK:bg-neutral-300 dark:to-red-600 ">
      <Header></Header>
      {/* <Nav></Nav> */}
      <Outlet></Outlet>
      <div className=" h-[1px] "></div>
    </div>
  );
};

export default Main;
