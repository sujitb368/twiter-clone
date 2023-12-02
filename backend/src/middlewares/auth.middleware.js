// Import necessary libraries and modules
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { JWT_SECRET, JWT_EXPIRY } from "../constant.js";

// Middleware for Checking User Login
const isLogin = (req, res, next) => {
  try {
    //get authorization token from request headers
    const { authorization } = req.headers;

    //if authorization token is not present then return with status code 401
    if (!authorization) {
      return res.status(401).send({ message: "token expired", success: false });
    }
    //if authorization token is present then get token
    const token = authorization.includes("Bearer")
      ? authorization.replace("Bearer ", "")
      : authorization;

    // verify authorization token
    // jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
    //   if (err) {
    //     return res.status(401).send({
    //       message: "token expired",
    //       success: false,
    //     });
    //   }
    jwt.verify(token, JWT_SECRET, async (err, payload) => {
      if (err) {
        return res.status(401).send({
          message: "token expired",
          success: false,
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

// Export the middleware functions for use in other modules
export { isLogin };
