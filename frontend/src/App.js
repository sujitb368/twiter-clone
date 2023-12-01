/**
 * Main application component.
 *
 * This component serves as the entry point for this React application.
 * @component
 * @returns {JSX.Element} - The main application component.
 */
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import "react-toastify/dist/ReactToastify.css";

import { Route, Routes } from "react-router-dom";
import axios from "axios";
import Login from "./auth/login/Login";
import Signup from "./auth/signup/Signup";
import Home from "./pages/home/Home";
import { useEffect } from "react";
import { useAuth } from "./context/authContext";
import TweetDetails from "./pages/tweetDetails/TweetDetails";
import Profile from "./pages/profile/Profile";
import { ToastContainer } from "react-toastify";

function App() {
  const { authState, authDispatch } = useAuth();

  useEffect(() => {
    //get user cart from local storage
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    // Log in user if token and user exist
    if (token && user) {
      authDispatch({ type: "AUTH_SUCCESS", payload: { token, user } });
    }

    axios.defaults.baseURL = "http://localhost:8000/api/v1";
    axios.defaults.headers.common["Authorization"] = token;

    // eslint-disable-next-line
  }, []);
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme="light"
      />
      <Routes>
        {/* Private routes */}
        {authState.user._id ? (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/tweetDetails/:id" element={<TweetDetails />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/*" element={<Home />} />
          </>
        ) : (
          <>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            {/* // Redirect to login for any other URLs if user is not logged in */}
            <Route path="/*" element={<Login />} />
          </>
        )}
      </Routes>
    </>
  );
}

export default App;
