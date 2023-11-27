import React from "react";

import "./Sidebar.css";
import { FaArrowRightFromBracket, FaHouse, FaPerson } from "react-icons/fa6";

import { Link, useNavigate } from "react-router-dom";

import logo from "../../images/logo.png";
import { API_BASE_URL } from "../../Constant";
import { useAuth } from "../../context/authContext";
function Sidebar() {
  // auth provider
  const { authState, authDispatch } = useAuth();
  //navigation hooks
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    // Redirect to login
    navigate("/login");
    authDispatch({
      type: "AUTH_FAILED",
      payload: {
        user: "",
        token: "",
      },
    });
  };
  return (
    <div
      style={{ minHeight: "80vh" }}
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
          <Link className="text-decoration-none text-dark" to="/">
            <p className="m-0 w-50 pointer p-1 mb-1 sidebar-link m-auto border rounded">
              <FaHouse /> <span>Home</span>
            </p>
          </Link>
          <Link className="text-decoration-none text-dark" to="/profile">
            <p className="m-0 w-50 pointer p-1 mb-1 sidebar-link m-auto border rounded">
              <FaPerson /> <span>Profile</span>
            </p>
          </Link>
          {authState.token ? (
            <p
              className="m-0 w-50 pointer p-1 mb-1 sidebar-link m-auto border rounded"
              onClick={handleLogout}
            >
              <>
                <FaArrowRightFromBracket /> <span>Logout</span>
              </>
            </p>
          ) : (
            <Link className="text-decoration-none text-dark" to="/login">
              <p
                className="m-0 w-50 pointer p-1 mb-1 sidebar-link m-auto border rounded"
                onClick={handleLogout}
              >
                <span>Login</span>
              </p>
            </Link>
          )}
        </nav>
      </div>

      <div>
        <div className="d-flex justify-content-center align-items-center col-lg-8 col-md-10">
          <div
            style={{ width: "50px", height: "50px" }}
            className="border rounded-circle"
          >
            <img
              className="img-fluid p-2"
              src={`${API_BASE_URL}/user/get-file/${authState.user.profilePicture}`}
              alt="User"
            />
          </div>
          <span className="ms-1">{authState.user.name}</span>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
