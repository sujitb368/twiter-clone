//import dependencies
// Import the Tweet model
import Tweet from "../models/tweet.model.js";

/**
 * Create a new tweet.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const createTweet = async (req, res) => {
  try {
    // destructure user id from request
    const { _id: loggedInUserId } = req.user;

    // Check if content is present in the request body
    const { content } = req.body;

    //if content is not present
    if (!content) {
      return res.status(400).send({
        message: "Content is required for a tweet",
        success: false,
      });
    }

    // Create a new tweet with content and tweetedBy data
    const newTweet = new Tweet({
      content,
      tweetedBy: loggedInUserId,
    });

    // Save the tweet into the database
    await newTweet.save();

    //send response with success message
    return res.status(201).send({
      message: "Tweet created successfully",
      tweet: newTweet,
      success: true,
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
 * Like a tweet.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const likeTweet = async (req, res) => {
  try {
    // destructure tweet id from request params
    const { _id: tweetId } = req.params;

    // Check if the user has already liked the tweet
    const { _id: loggedInUserId } = req.user;

    // Find the tweet by ID
    const tweet = await Tweet.findById(tweetId);

    // Check if the tweet exists
    if (!tweet) {
      return res
        .status(404)
        .send({ message: "Tweet not found", success: false });
    }

    if (tweet.likes.includes(loggedInUserId)) {
      return res
        .status(400)
        .send({ message: "You have already liked this tweet", success: false });
    }

    // Add the user's ID to the likes array in the tweet document
    tweet.likes.push(loggedInUserId);

    // Save the updated tweet data to the database
    await tweet.save();

    return res
      .status(200)
      .send({ message: "Tweet liked successfully", success: true, tweet });
  } catch (error) {
    // Handle errors
    console.error(error.message); // Log the error for debugging
    return res
      .status(500)
      .send({ message: "Internal Server Error", success: false, error });
  }
};

/**
 * Dislike a tweet.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const dislikeTweet = async (req, res) => {
  try {
    // destructure tweet id from request params
    const { _id: tweetId } = req.params;

    // destructure user id from request user
    const { _id: loggedInUserId } = req.user;

    // Find the tweet by ID
    const tweet = await Tweet.findById(tweetId);

    // Check if the tweet exists
    if (!tweet) {
      return res
        .status(404)
        .send({ message: "Tweet not found", success: false });
    }

    // Check if the user has already liked the tweet
    if (!tweet.likes.includes(loggedInUserId)) {
      return res.status(400).send({
        message: "You cannot dislike a tweet that you did not liked",
        success: false,
      });
    }

    // Remove the user's ID from the likes array in the tweet document
    tweet.likes = tweet.likes.filter(
      (likedUserId) => likedUserId.toString() !== loggedInUserId.toString()
    );

    // Save the updated tweet data to the database
    await tweet.save();

    return res
      .status(200)
      .send({ message: "Tweet disliked successfully", success: true, tweet });
  } catch (error) {
    // Handle errors
    console.error(error.message); // Log the error for debugging
    return res
      .status(500)
      .send({ message: "Internal Server Error", success: false });
  }
};

/**
 * Reply to a tweet.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const replyToTweet = async (req, res) => {
  try {
    // destructure from req
    // parent tweet id
    const { _id: parentTweetId } = req.params;
    // logged in user id
    const { _id: loggedInUserId } = req.user;
    //get the reply content
    const { content } = req.body;

    // Find the parent tweet by ID
    const parentTweet = await Tweet.findById(parentTweetId);

    // Check if the parent tweet exists
    if (!parentTweet) {
      return res
        .status(404)
        .send({ message: "Parent tweet not found", success: false });
    }

    // Create a new tweet for the reply
    const newReply = new Tweet({
      content,
      tweetedBy: loggedInUserId,
    });

    // Save the new reply tweet in the DB
    await newReply.save();

    // Add the new reply tweet id in the parent tweet's replies array
    parentTweet.reply.push(newReply._id);

    // Save the updated parent tweet data to the database
    await parentTweet.save();

    return res.status(201).send({
      message: "Reply tweet created successfully",
      success: true,
      tweet: newReply,
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
 * Get a single tweet detail.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const getSingleTweet = async (req, res) => {
  try {
    // destructure properties from request obj
    const { _id: tweetId } = req.params;

    // Find the tweet by ID and populate fields with references
    const tweet = await Tweet.findById(tweetId)
      .populate("tweetedBy", "_id name profilePicture username") // Populate 'tweetedBy' with selected fields
      .populate("retweetedBy", "_id name profilePicture username") // Populate 'tweetedBy' with selected fields
      .populate({
        path: "reply",
        model: "Tweet",
        populate: {
          path: "tweetedBy",
          model: "User",
          select: "_id name profilePicture username", // Select fields for the user who tweeted the reply
        },
      });

    // Check if the tweet exists
    if (!tweet) {
      return res.status(404).send({
        message: "Tweet not found",
        success: false,
      });
    }

    return res.status(200).send({
      message: "Successfully fetched tweet details",
      success: true,
      tweet,
    });
  } catch (error) {
    // Handle errors
    console.error(error.message); // Log the error for debugging
    return res.status(500).send({
      message: "Internal Server Error",
      success: false,
      error,
    });
  }
};

/**
 * Get a all tweet detail.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const getAllTweet = async (req, res) => {
  try {
    // Find all tweet in descending order and populate fields with references
    const tweet = await Tweet.find({})
      .populate("tweetedBy", "_id name profilePicture username") // Populate 'tweetedBy' with selected fields
      .populate("retweetedBy", "_id name profilePicture username") // Populate 'tweetedBy' with selected fields
      .populate({
        path: "reply",
        model: "Tweet",
        populate: {
          path: "tweetedBy",
          model: "User",
          select: "_id name profilePicture username", // Select fields for the user who tweeted the reply
        },
      })
      .sort({ createdAt: "desc" });

    // Check if the tweet exists
    if (!tweet) {
      return res.status(404).send({
        message: "Tweet not found",
        success: false,
      });
    }

    return res.status(200).send({
      message: "Successfully fetched tweet details",
      success: true,
      tweet,
    });
  } catch (error) {
    // Handle errors
    console.error(error.message); // Log the error for debugging
    return res.status(500).send({
      message: "Internal Server Error",
      success: false,
      error,
    });
  }
};

/**
 * Delete a tweet.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const deleteTweet = async (req, res) => {
  try {
    //destructure properties from request object
    // get tweet id
    const { _id: tweetId } = req.params;

    // get logged in user id
    const { _id: loggedInUserId } = req.user;

    // Find the tweet by ID
    const tweet = await Tweet.findById(tweetId);

    // Check if the tweet exists
    if (!tweet) {
      return res
        .status(404)
        .send({ message: "Tweet not found", success: false });
    }

    if (loggedInUserId.toString() !== tweet.tweetedBy.toString()) {
      return res
        .status(403)
        .send({
          message: "You do not have permission to delete this tweet",
          success: false,
        });
    }

    // Delete the replies associated with the tweet
    await Tweet.deleteMany({ _id: { $in: tweet.reply } });

    // Delete the main tweet from the user
    await tweet.deleteOne();

    return res
      .status(200)
      .send({ message: "Tweet deleted successfully", success: true });
  } catch (error) {
    // Handle errors
    console.error(error.message); // Log the error for debugging
    return res
      .status(500)
      .send({ message: "Internal Server Error", success: false, error });
  }
};

/**
 * Retweet a tweet.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const retweetTweet = async (req, res) => {
  try {
    //Destructure properties from req obj
    //Get tweet ID
    const { _id: tweetId } = req.params;
    //Get logged in user ID
    const { _id: loggedInUserId } = req.user;

    // Find the tweet by ID
    const tweet = await Tweet.findById(tweetId);

    // Check if the tweet exists
    if (!tweet) {
      return res
        .status(404)
        .send({ message: "Tweet not found", success: false });
    }

    if (tweet.retweetedBy.includes(loggedInUserId)) {
      return res.status(400).send({
        message: "You have already retweeted this tweet",
        success: false,
      });
    }

    // Add the user's ID to the retweets array in the tweet document
    tweet.retweetedBy.push(loggedInUserId);

    // Save the updated tweet data to the database
    await tweet.save();

    return res
      .status(200)
      .send({ message: "Tweet retweeted successfully", success: true, tweet });
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
const uploadTweetImage = async (req, res) => {
  try {
    const { _id: tweetId } = req.params;

    // Check if a file is present in the request
    if (!req.file) {
      return res
        .status(400)
        .send({ message: "No file uploaded", success: false });
    }

    // Check for id
    if (!tweetId) {
      return res
        .status(404)
        .send({ message: "Tweet not found", success: false });
    }

    // Find the tweet by ID
    const tweet = await Tweet.findById(tweetId);

    // Check if the tweet is exists
    if (!tweet) {
      return res
        .status(404)
        .send({ message: "Tweet not found", success: false });
    }

    // Update the user's profile picture field with the filename
    tweet.image = req.file.filename;

    // Save the updated user in the DB
    await tweet.save();

    return res.status(200).send({
      message: "Tweet image uploaded successfully",
      success: true,
      imagePath: req.file.filename,
    });
  } catch (error) {
    // Handle errors
    console.error(error.message); // Log the error for debugging
    return res
      .status(500)
      .send({ message: "Internal Server Error", success: false, error });
  }
};

// export controllers functions
export {
  createTweet,
  likeTweet,
  dislikeTweet,
  replyToTweet,
  getSingleTweet,
  getAllTweet,
  deleteTweet,
  retweetTweet,
  uploadTweetImage,
};
