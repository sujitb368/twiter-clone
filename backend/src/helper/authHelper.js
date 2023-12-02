// Import necessary libraries and modules
// Import bcrypt for password hashing,
// JWT for token generation, and the ForgotPasswordTokenModel.

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRY } from "../constant.js";

// Function to Hash Password
// asynchronous function named hashPassword to hash the given password with a salt round of 10.
const hashPassword = async (password) => {
  try {
    //salt round
    const saltRound = 10;
    //hash password with salt round 10
    const hashedPassword = await bcrypt.hash(password, saltRound);
    //return hashed password
    return hashedPassword;
  } catch (error) {
    console.log(`error while password hashing ${error}`);
  }
};

// Function to Remove Password
// asynchronous function named removePassword to exclude the password field from the user object.
const removePassword = async (obj) => {
  try {
    // Destructure the password field from the user object
    const { password, ...user } = obj._doc;

    // Return the user object without the password
    return user;
  } catch (error) {
    console.log("error in removePassword", error);
  }
};

// Function to Compare Password
// asynchronous function named comparePassword to compare a password with its hashed version.
const comparePassword = async (password, hashedPassword) => {
  try {
    console.log("password, hashedPassword", password, hashedPassword);

    // Use bcrypt to compare the provided password with the hashed password
    const result = await bcrypt.compare(password, hashedPassword);
    // Return the result of the comparison
    return result;
  } catch (error) {
    console.log("error in compare password", error);
  }
};

// Function to Generate Token
const generateToken = async (_id) => {
  try {
    // Generate a unique token using the user's email and the reset password secret key
    // const token = jwt.sign({ _id }, process.env.JWT_SECRET, {
    //   expiresIn: process.env.JWT_EXPIRY,
    // });
    const token = jwt.sign({ _id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRY,
    });
    return token;
  } catch (error) {
    console.log("Error in generateAndStoreToken ", error);
    return res.status(500).send({
      message: "Something went wrong during token generation",
      success: false,
      error,
    });
  }
};

// Export the password-related functions for use in other modules
export { hashPassword, removePassword, comparePassword, generateToken };
