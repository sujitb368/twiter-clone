// Import necessary modules and controllers for managing users
import express from "express";

//importing user controller
import {
  downloadFile,
  editUserDetails,
  followUser,
  getSingleUser,
  unfollowUser,
  uploadProfilePicture,
} from "../controllers/user.controller.js";
import { isLogin } from "../middlewares/auth.middleware.js";
import User from "../models/user.model.js";
import { upload } from "../middlewares/file.middleware.js";

//router object
const router = express.Router();

router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    return res.status(200).send({
      users,
      success: true,
      message: "All users",
    });
  } catch (error) {
    console.log("error");
    return res.status(500).send({
      error,
      success: false,
      message: "Internal server error",
    });
  }
});

//get single user | get by id
/**
 * get single user.
 * @param {string} id - req.params.
 */
router.get("/:id", isLogin, getSingleUser);

/**
 * follow a user.
 * @param {string} userToFollowId - req.params.
 */
router.post("/follow/:userToFollowId", isLogin, followUser);

/**
 * unfollow a user.
 * @param {string} userToUnFollowId - req.params.
 */
router.post("/unfollow/:userToUnFollowId", isLogin, unfollowUser);

/**
 * edit user details.
 * @param {string} _id - req.params.
 */
router.put("/edit", isLogin, editUserDetails);

/**
 * upload profile picture.
 * @param {string} file - req.params.
 */
router.post(
  "/:_id/uploadProfilePic",
  isLogin,
  upload.single("file"),
  uploadProfilePicture
);

/**
 * downloading a file by filename
 * @param {string} filename - req.params.
 */
// Route for downloading a file by filename
router.get("/get-file/:filename", downloadFile);

//export routes
export default router;
