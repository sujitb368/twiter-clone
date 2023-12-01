//import dependencies

import User from "../models/user.model.js";
import {
  comparePassword,
  generateToken,
  hashPassword,
  removePassword,
} from "../helper/authHelper.js";

/**
 * Controller function to handle user sign-up.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const register = async (req, res) => {
  try {
    // destructure register data from req body
    const { name, email, password, username, profilePicture, dob, location } =
      req.body;

    //validation
    //if any of this are not provided, then return with status code 400
    if (!name || !email || !password || !username || !dob) {
      return res.status(400).send({
        message: "All fields are required",
        success: false,
      });
    }
    //find user by email to check if user already exists
    const isUserExist = await User.findOne({ email });

    //if user exist already then return with status code 400
    if (isUserExist) {
      return res.status(400).send({
        message: "User all ready exists",
        success: false,
      });
    }
    //hash password to store in db
    const hashedPassword = await hashPassword(password);

    //user details
    const user = new User({
      name,
      email,
      username,
      password: hashedPassword,
      profilePicture,
      dob,
      location,
    });

    //save user to database
    await user.save();

    //user details object without password filed
    const userDetails = await removePassword(user);

    return res.status(201).send({
      success: true,
      message: "User successfully created",
      user: userDetails,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message ?? "Something went wrong unable to create user",
      error,
      success: false,
    });
  }
};

/**
 * Controller function to handle user login.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const login = async (req, res) => {
  try {
    //destructure user login credentials from request body
    const { email, password } = req.body;

    //validate email and password
    if (!email || !password) {
      return res.status(400).send({
        message: "please enter your email and password",
        success: false,
      });
    }

    //find user by email
    const user = await User.findOne({ email });

    //check if user provided password is correct or not
    const checkPassword = await comparePassword(password, user.password);

    //if user provided password is correct
    if (checkPassword) {
      //user details object without password field
      const userDetails = await removePassword(user);

      //generate token
      const token = await generateToken(user._id);

      return res.status(200).send({
        success: true,
        message: "login successful",
        token,
        user: userDetails,
      });
    } else {
      return res
        .status(404)
        .send({ message: "Email or password is incorrect", success: false });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "Something went wrong", error, success: false });
  }
};

export { register, login };
