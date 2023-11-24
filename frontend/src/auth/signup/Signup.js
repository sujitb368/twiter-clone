import React, { useState } from "react";
import "./Signup.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
function Signup() {
  // State variables for user registration details
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [dob, setDob] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");

  //eslint-disable-next-line
  const [loding, setLoding] = useState("");

  // Navigation hook
  const navigate = useNavigate();

  /**
   * Function to handle user signup.
   * @param {Object} e - The event object.
   */
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      // API call to register user
      const response = await axios.post(
        `/auth/register`,
        { name, email, password, username, location, dob },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Check if signup is successful and display appropriate message
      if (response?.data?.success) {
        //   Message({ type: "success", message: response.data.message });
        navigate("/login");
      } else {
        //   Message({ type: "error", message: response?.data?.message });
      }
    } catch (error) {
      console.log("Error while signing up", error);
      //   Message({ type: "success", message: error.response.data.message });
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card d-flex p-0 flex-md-row rounded col-md-6">
        <div
          className={`col-12 col-md-4 d-flex flex-column justify-content-center align-items-center text-center mb-4 mb-md-0 p-2 bg-primary ${
            window.innerWidth < 764 ? "rounded-top" : "rounded-start"
          }`}
        >
          <h3>Welcome</h3>
          <h5>icon</h5>
          {/* Add your icon here */}
        </div>
        <form className="col-12 col-md-8 p-2" onSubmit={handleSignup}>
          <div className="row">
            <div className="form-group col-md-6">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                placeholder="Enter your name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Enter your email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="username">User Name</label>
              <input
                type="text"
                className="form-control"
                id="username"
                placeholder="Enter your username..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Enter your password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="password">dob</label>
              <input
                type="date"
                className="form-control"
                id="dob"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                required
              />
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="password">Location</label>
              <input
                type="text"
                placeholder="Enter your location..."
                className="form-control"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary mt-1">
            Sign up
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
