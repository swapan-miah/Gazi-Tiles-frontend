import { Outlet } from "react-router-dom";

const Main = () => {
  return (
    <div className="bg-neutral-300 to-red-600 darK:bg-neutral-300 dark:to-red-600 ">
      <Outlet></Outlet>
      <div className=" h-[1px] "></div>
    </div>
  );
};

export default Main;
