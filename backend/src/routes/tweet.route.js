// Import necessary modules and controllers for managing users
import express from "express";
import { isLogin } from "../middlewares/auth.middleware.js";
import {
  createTweet,
  deleteTweet,
  dislikeTweet,
  getAllTweet,
  getSingleTweet,
  likeTweet,
  replyToTweet,
  retweetTweet,
} from "../controllers/tweet.controller.js";

//router object
const router = express.Router();

//tweet creation routes
router.post("/", isLogin, createTweet);

//get all tweet route
router.get("/", isLogin, getAllTweet);

//tweet like routes | _id => tweet id
router.post("/:_id/like", isLogin, likeTweet);

//tweet like routes | _id => tweet id
router.post("/:_id/dislike", isLogin, dislikeTweet);

//replay tweet route | _id => parent tweet id to which assign the reply
router.post("/:_id/reply", isLogin, replyToTweet);

//get single tweet route | _id => tweet id
router.get("/:_id", isLogin, getSingleTweet);

//delete single tweet route | _id => tweet id
router.delete("/:_id", isLogin, deleteTweet);

//retweet route | _id => tweet id
router.post("/:_id/retweet", isLogin, retweetTweet);

export default router;
