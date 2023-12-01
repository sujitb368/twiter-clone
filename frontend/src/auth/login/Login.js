import React, { useState } from "react";

import "./Login.css";
import axios from "axios";
import { useLocation, useNavigate, Link } from "react-router-dom";

import logo from "../../images/logo2.png";
import { useAuth } from "../../context/authContext";
import { toast } from "react-toastify";
//import loader
import Loader from "../../components/loader/Loader";
const Login = () => {
  //get from authDispatcher
  const { authDispatch } = useAuth();
  //sate variable for login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Hooks for navigation and location
  const navigate = useNavigate();
  const location = useLocation();

  //state variable to control loader
  const [showLoader, setShowLoader] = useState(false);

  /**
   * Function to handle the login process.
   * @param {Object} e - The event object.
   */
  const handleLogin = async (e) => {
    e.preventDefault();
    /* The code block you provided is handling the login process. Here's a breakdown of what it does: */
    try {
      //loader
      setShowLoader(true);

      //API call to login user
      const response = await axios.post(
        `/auth/login`,
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      //if login is successful enter inside if block
      // update state and perform necessary actions
      if (response?.data?.success) {
        //store the token, user into local storage
        // token and user received from the backend API response
        localStorage.setItem("token", response?.data?.token);
        localStorage.setItem("user", JSON.stringify(response?.data?.user));

        // Perform login logic, and if successful, dispatch the user data
        authDispatch({
          type: "AUTH_SUCCESS",
          payload: {
            user: response.data.user,
            token: response.data.token,
          },
        });

        //close loader
        setShowLoader(false);

        //after login redirect to home page
        navigate(location.state || "/");
      }
    } catch (error) {
      /* The code block you provided is handling the error that occurs during the login process. */
      console.log("Error while login", error.response);

      toast.error(
        error?.response?.data?.message ?? error?.message ?? "Error while login"
      );

      //close loader
      setShowLoader(false);
    }
  };
  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card d-flex p-0 flex-md-row  rounded">
        <div
          className={`col-12 col-md-5 d-flex flex-column justify-content-center align-items-center text-center mb-4 mb-md-0 p-2 bg-primary ${
            window.innerWidth < 764 ? "rounded-top" : "rounded-start"
          }`}
        >
          <h3 className="text-white">Welcome</h3>
          <h4 className="col-8 text-center">
            <img style={{ width: "50px" }} src={logo} alt="logo" />
          </h4>{" "}
        </div>
        <form className="col-12 col-md-7 p-2" onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter your password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Show loader component */}
          {showLoader && <Loader />}

          {/* hide login button while loading */}
          {!showLoader && (
            <button type="submit" className="btn btn-primary mt-1">
              Log In
            </button>
          )}
          <p className="text-dark fw-small fs-7 m-0">
            Not Registered yet ?{" "}
            <Link className=" p-1 rounded text-decoration-none" to="/signup">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
