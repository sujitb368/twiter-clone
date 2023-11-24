import React from "react";

import "./Sidebar.css";
import { FaArrowRightFromBracket, FaHouse, FaPerson } from "react-icons/fa6";

import { useNavigate } from "react-router-dom";

import logo from "../../images/logo.png";
import { API_BASE_URL } from "../../Constant";
function Sidebar() {
  const userData = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  //navigation hooks
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem("user");
    // Redirect to login
    navigate("/login");
  };
  return (
    <div
      style={{ minHeight: "75vh" }}
      className="d-flex flex-column justify-content-between pb-2"
    >
      {/* App logo */}
      <div>
        <h4 className="col-8 text-center">
          <img style={{ width: "50px" }} src={logo} alt="logo" />
        </h4>
        {/* User details */}
        {/* Navigation links */}
        <nav className="col-8 col-md-10">
          <p className="m-0 w-50 pointer p-1 mb-1 sidebar-link m-auto border rounded">
            <FaHouse /> <span>Home</span>
          </p>
          <p className="m-0 w-50 pointer p-1 mb-1 sidebar-link m-auto border rounded">
            <FaPerson /> <span>Profile</span>
          </p>
          <p
            className="m-0 w-50 pointer p-1 mb-1 sidebar-link m-auto border rounded"
            onClick={handleLogout}
          >
            {userData ? (
              <>
                <FaArrowRightFromBracket /> <span>Logout</span>
              </>
            ) : (
              <span>Login</span>
            )}
          </p>
        </nav>
      </div>

      <div>
        <div className="d-flex align-items-center col-lg-8 col-md-10">
          <div
            style={{ width: "50px", height: "50px" }}
            className="border rounded-circle ms-auto"
          >
            <img
              className="img-fluid p-2"
              src={`${API_BASE_URL}/user/get-file/${userData.profilePicture}`}
              alt="User"
            />
          </div>
          <span className="ms-1">{userData.name}</span>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
