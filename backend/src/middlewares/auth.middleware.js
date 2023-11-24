// Import necessary libraries and modules
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// Middleware for Checking User Login
const isLogin = (req, res, next) => {
  try {
    //get authorization token from request headers
    const { authorization } = req.headers;

    //if authorization token is not present then return with status code 401
    if (!authorization) {
      return res
        .status(400)
        .send({ message: "No token unauthorized user", success: false });
    }
    //if authorization token is present then get token
    const token = authorization.includes("Bearer")
      ? authorization.replace("Bearer ", "")
      : authorization;

    // verify authorization token
    jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
      if (err) {
        console.log("is log in", err);
        return res.status(401).send({
          message: err.message ?? "unauthorized user",
          success: false,
          test: "testing",
        });
      }

      // if token is valid find user and add to request object
      const { _id } = payload;

      if (_id) {
        const user = await User.findById(_id).select("-password");
        req.user = user;
      }

      next();
    });
  } catch (error) {
    console.log("error in isLogin middleware", error);
    return res.status(500).send({
      message: "error in isLogin middleware",
      error,
      success: false,
    });
  }
};

// Middleware for Checking Admin Status
const isAdmin = async (req, res, next) => {
  try {
    // get role of login user from request body
    const { role } = req.user;

    //check role of user from DB
    //get user by id
    const user = await userModel.findById(req.user._id);

    // If the user's role does not match the expected role, return with status code 200
    if (parseInt(role) !== user.role) {
      return res.status(200).send({
        message: "Not a admin user",
        success: false,
      });
    } else {
      // If the user is an admin, proceed to the next middleware
      next();
    }
  } catch (error) {
    console.log("error in isAdmin middleware", error);
    return res.status(500).send({
      message: "error in isAdmin middleware",
      error,
      success: false,
    });
  }
};

// Function to Validate Token
const isValidToken = async (token, secret) => {
  try {
    jwt.verify(token, secret, async (err, payload) => {
      if (err) {
        return res.status(401).send({ message: err, success: false });
      }
    });
    return true;
  } catch (error) {
    console.log("Error while validating token", error);
    return res.status(500).send({
      message: "Error while validating token",
      success: false,
      error,
    });
  }
};

// Export the middleware functions for use in other modules
export { isLogin, isAdmin, isValidToken };
