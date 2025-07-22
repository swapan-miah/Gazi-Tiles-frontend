import React, { useContext, useEffect, useState } from "react";
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { AuthContext } from "../../contexts/AuthProvider";
import useAdmin from "../../hooks/useRole";
import Header from "../../Pages/Dashboard/Header/Header";

const DashboardLayout = () => {
  const { user } = useContext(AuthContext);
  const [isAdmin] = useAdmin(user?.email);
  const navigate = useNavigate();
  const location = useLocation();
  // if ((location.pathname = "/dashboard")) {
  // }

  return (
    <div className="bg-white text-black min-h-screen">
      <Header />
      <div className="drawer lg:drawer-open h-auto">
        <input
          id="dashboard-drawer"
          type="checkbox"
          className="drawer-toggle"
        />
        <div className="drawer-content py-8 px-3 bg-gray-100">
          {/* Page content here */}
          <Outlet />
        </div>
        <div className="drawer-side opacity-100 h-screen">
          <label
            htmlFor="dashboard-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <div className="bg-white text-black min-h-screen">
            <ul className="menu p-4 w-60">
              <>
                {location.pathname === "/dashboard" ? (
                  <li>
                    <NavLink to="/dashboard">Sale Form / Invoice</NavLink>
                  </li>
                ) : (
                  <li>
                    <NavLink to="/dashboard/sell-form">
                      Sale Form / Invoice
                    </NavLink>
                  </li>
                )}

                <li>
                  <NavLink to="/dashboard/sell-history">Sale History</NavLink>
                </li>
                <li>
                  <NavLink to="/dashboard/return-history">
                    Return History
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/dashboard/due-invoice-history">
                    Due Invoice History
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/dashboard/write-off-history">
                    Write Off History
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/dashboard/store">My Stock</NavLink>
                </li>
                <li>
                  <NavLink to="/dashboard/godown-status">Godown Status</NavLink>
                </li>
                <li>
                  <NavLink to="/dashboard/damage">Damage</NavLink>
                </li>

                <li className="pt-5">
                  <hr />
                </li>
                {/* Customer Section */}
                <li>
                  <NavLink to="/dashboard/add-customer-and-list">
                    Add Customer & List
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/dashboard/customer-report">
                    Customer Report
                  </NavLink>
                </li>

                <li className="pt-5">
                  <hr />
                </li>

                <li>
                  <NavLink to="/dashboard/add-catagory">Add Catagory</NavLink>
                </li>
                <li>
                  <NavLink to="/dashboard/add-product">Add Product</NavLink>
                </li>
                <li>
                  <NavLink to="/dashboard/purchase-product">
                    Purchase Product
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/dashboard/purchase-history">
                    Purchase History
                  </NavLink>
                </li>

                <li>
                  <NavLink to="/dashboard/add-company-measurement">
                    Add Company Measurement
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/dashboard/company-measurement-feet">
                    Company Measurement (Feet)
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/dashboard/company-commission-from">
                    Company Commission Form
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/dashboard/company-commission-report">
                    Company Commission Report
                  </NavLink>
                </li>

                <li className="pt-5">
                  <hr />
                </li>

                {/* Supplier Section */}
                <li>
                  <NavLink to="/dashboard/add-supplier-and-show">
                    Add Supplier & List
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/dashboard/supplier-advance-payment">
                    Supplier Advance Payment
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/dashboard/supplier-payment">
                    Supplier Payment
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/dashboard/supplier-report">
                    Supplier Report
                  </NavLink>
                </li>
                <li className="pt-5">
                  <hr />
                </li>

                {/* Expense Section */}
                <li>
                  <NavLink to="/dashboard/add-cost">Add Cost</NavLink>
                </li>
                <li>
                  <NavLink to="/dashboard/cost-report">Cost Report</NavLink>
                </li>
                <li className="pt-5">
                  <hr />
                </li>

                {/* Bank Section */}
                <li>
                  <NavLink to="/dashboard/add-bank-and-list">
                    Add Bank & List
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/dashboard/bank-transaction-form">
                    Bank Transaction Form
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/dashboard/bank-report">Bank Report</NavLink>
                </li>
                <li className="pt-5">
                  <hr />
                </li>

                <li>
                  <NavLink to="/dashboard/daily-cash-in-and-out-form">
                    Cash In/Out Form
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/dashboard/daily-cash-in-and-out-record">
                    Cash In/Out Record
                  </NavLink>
                </li>
                <li className="pt-5">
                  <hr />
                </li>

                {/* {isAdmin && (
                  <li>
                    <NavLink to="/dashboard/my-cash-summery">
                      My Cash Summery
                    </NavLink>
                  </li>
                )} */}
                {isAdmin && (
                  <li>
                    <NavLink to="/dashboard/profit">Profit</NavLink>
                  </li>
                )}
                {isAdmin && (
                  <li>
                    <NavLink to="/dashboard/daily-account">
                      Daily Account
                    </NavLink>
                  </li>
                )}
                {isAdmin && (
                  <li>
                    <NavLink to="/dashboard/users">Users Manage</NavLink>
                  </li>
                )}
                <li className="pt-5">
                  <hr />
                </li>
                <li>
                  <NavLink to="/dashboard/isoft">Isoft Corporation</NavLink>
                </li>
              </>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
