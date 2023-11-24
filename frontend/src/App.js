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

function App() {
  const { authState, authDispatch } = useAuth();

  useEffect(() => {
    //get user cart from local storage
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    console.log("in app user and token", user, token);

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
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/home" element={<Home />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
      </Routes>
    </>
  );
}

export default App;
