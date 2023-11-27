//import dependencies

import User from "../models/user.model.js";
import { __dirname } from "../config.js";
/**
 * Get a single user's details.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const getSingleUser = async (req, res) => {
  try {
    //destructure user from request params
    const { id } = req.params;

    // Find the user by ID and select the fields to include/exclude
    const user = await User.findById(id)
      .select("-password") // Exclude password field
      .populate("followers", "_id name") // Populate followers with selected fields
      .populate("following", "_id name"); // Populate following with selected fields

    if (!user) {
      // User not found
      return res
        .status(404)
        .send({ message: "User not found", success: false });
    }

    // Respond with complete user data
    return res.status(200).json({
      message: "User data",
      success: true,
      user,
    });
  } catch (error) {
    // Handle errors
    console.error(error.message); // Log the error for debugging
    return res
      .status(500)
      .send({ message: "Internal Server Error", success: false, error });
  }
};

/**
 * Follow a user.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const followUser = async (req, res) => {
  try {
    // get logged in user _id from request object
    const { _id: loggedInUserId } = req.user;

    //get user id from request params -> to follow
    const { userToFollowId } = req.params;
    // Check if the user is trying to follow themselves
    if (loggedInUserId.toString() === userToFollowId) {
      return res.status(400).send({
        success: false,
        message: "You cannot follow yourself",
      });
    }

    // Find the logged-in user and the user to follow
    const [loggedInUser, userToFollow] = await Promise.all([
      User.findById(loggedInUserId),
      User.findById(userToFollowId),
    ]);

    // Check if both users exist
    if (!loggedInUser || !userToFollow) {
      return res
        .status(404)
        .send({ message: "User not found", success: false });
    }

    // Check if the logged-in user is already following the user to follow
    if (loggedInUser.following.includes(userToFollowId)) {
      return res.status(400).send({
        message: "You are already following this user",
        success: false,
      });
    }

    // Update the following array of the logged-in user
    loggedInUser.following.push(userToFollowId);

    // Update the followers array of the user to follow
    userToFollow.followers.push(loggedInUserId);

    // Save both users
    await Promise.all([loggedInUser.save(), userToFollow.save()]);

    return res.status(200).json({ message: "User followed successfully" });
  } catch (error) {
    // Handle errors
    console.error(error.message); // Log the error for debugging
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Unfollow a user.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const unfollowUser = async (req, res) => {
  try {
    // get logged in user _id from request object
    const { _id: loggedInUserId } = req.user;

    //get user id from request params -> to follow
    const { userToUnFollowId } = req.params;

    // Check if the user is trying to unfollow themselves
    if (loggedInUserId.toString() === userToUnFollowId) {
      return res
        .status(400)
        .send({ message: "You cannot unfollow yourself", success: false });
    }

    // Find the logged-in user and the user to unfollow
    const [loggedInUser, userToUnfollow] = await Promise.all([
      User.findById(loggedInUserId),
      User.findById(userToUnFollowId),
    ]);

    // Check if both users exist
    if (!loggedInUser || !userToUnfollow) {
      return res
        .status(404)
        .send({ message: "User not found", success: false });
    }

    // Check if the logged-in user is already not following the user to unfollow
    if (!loggedInUser.following.includes(userToUnFollowId)) {
      return res
        .status(400)
        .send({ message: "You are not following this user", success: false });
    }

    // Remove the user to unfollow from the following array of the logged-in user
    loggedInUser.following = loggedInUser.following.filter(
      (followedId) => followedId.toString() !== userToUnFollowId
    );

    // Remove the logged-in user from the followers array of the user to unfollow
    userToUnfollow.followers = userToUnfollow.followers.filter(
      (followerId) => followerId.toString() !== loggedInUserId.toString()
    );

    // Save both users
    await Promise.all([loggedInUser.save(), userToUnfollow.save()]);

    return res
      .status(200)
      .send({ message: "User unfollowed successfully", success: true });
  } catch (error) {
    // Handle errors
    console.error(error.message); // Log the error for debugging
    return res
      .status(500)
      .send({ message: "Internal Server Error", success: false });
  }
};

/**
 * Edit user details.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const editUserDetails = async (req, res) => {
  try {
    //destructure user id from req params
    const { _id: userId } = req.user;

    // Find the user by ID
    const user = await User.findById(userId);

    // Check if the user exists
    if (!user) {
      return res
        .status(404)
        .send({ message: "User not found", success: false });
    }

    // Allow editing of name, date of birth, and location data only
    const { name, dob, location } = req.body;

    /**
     * Update user details if provided in the request body
     * name, dob(date of birth), and location
     */
    //update name if name provide in req body
    if (name !== undefined) {
      user.name = name;
    }

    //update dob if dob provide in req body
    if (dob !== undefined) {
      user.dob = dob;
    }

    //update location if location provide in req body
    if (location !== undefined) {
      user.location = location;
    }

    // Save the edited user in the DB
    await user.save();

    return res
      .status(200)
      .send({ message: "User details updated successfully", success: true });
  } catch (error) {
    // Handle errors
    console.error(error.message); // Log the error for debugging
    return res
      .status(500)
      .send({ message: "Internal Server Error", success: false, error });
  }
};

/**
 * Get all tweets tweeted by a user.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const getUserTweets = async (req, res) => {
  try {
    const { _id: userId } = req.user;

    if (!userId) {
      return res.status(400).send({
        message: "Invalid user id",
        success: false,
      });
    }

    // Find all tweets where the 'tweetedBy' field matches the user ID
    const tweets = await Tweet.find({ tweetedBy: userId }).populate(
      "tweetedBy",
      "_id name"
    ); // Populate 'tweetedBy' with selected fields

    return res.status(200).send({
      message: "Successfully fetched tweets",
      success: true,
      tweets,
    });
  } catch (error) {
    // Handle errors
    console.error(error.message); // Log the error for debugging
    return res
      .status(500)
      .send({ message: "Internal Server Error", success: false, error });
  }
};

/**
 * Upload user profile picture.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const uploadProfilePicture = async (req, res) => {
  try {
    const { _id: userId } = req.params;

    // Check if a file is present in the request
    if (!req.file) {
      return res
        .status(400)
        .send({ message: "No file uploaded", success: false });
    }

    // Find the user by ID
    const user = await User.findById(userId);

    // Check if the user exists
    if (!user) {
      return res
        .status(404)
        .send({ message: "User not found", success: false });
    }

    // Update the user's profile picture field with the filename
    user.profilePicture = req.file.filename;

    // Save the updated user in the DB
    await user.save();

    return res.status(200).json({
      message: "Profile picture uploaded successfully",
      success: true,
      imagePath: req.file.filename,
    });
  } catch (error) {
    // Handle errors
    console.error(error.message); // Log the error for debugging
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false, error });
  }
};

// Function to download a file
const downloadFile = (req, res) => {
  const { filename } = req.params;
  const path = __dirname + "/images/";

  // Download the file
  res.download(path + filename, (error) => {
    if (error) {
      res.status(500).send({
        success: false,
        message: "File cannot be downloaded " + error,
      });
    }
  });
};

export {
  getSingleUser,
  followUser,
  unfollowUser,
  editUserDetails,
  getUserTweets,
  uploadProfilePicture,
  downloadFile,
};
