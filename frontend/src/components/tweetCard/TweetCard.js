import React, { useState } from "react";

import { FaHeart, FaReply, FaRetweet, FaTrashCan } from "react-icons/fa6";
import { useAuth } from "../../context/authContext";

import { API_BASE_URL } from "../../Constant";

import { Link, useNavigate } from "react-router-dom";

import axios from "axios";
import { toast } from "react-toastify";
import moment from "moment";

import Loader from "../../components/loader/Loader";

function TweetCard({ main, details, tweetOperation, index }) {
  const { authState } = useAuth();

  const [replyTweetContent, setReplyTweetContent] = useState("");

  const [postImage, setPostImage] = useState({
    preview: "",
    data: "",
  });

  //state variable to control loader
  const [showLoader, setShowLoader] = useState(false);

  //tweet id from props
  const tweetId = details._id;

  //navigate hooks
  const navigate = useNavigate();

  const handleTweetOperation = () => {
    tweetOperation();
  };

  const handleLike = async (tweetId) => {
    try {
      setShowLoader(true);
      //API call to like the tweet
      const response = await axios.post(
        `/tweet/${tweetId}/like`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setShowLoader(false);

      if (response?.data?.success) {
        // await getTweets();
        toast.success(response?.data?.message);
        handleTweetOperation();
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ??
          error?.message ??
          "Something went wrong in like"
      );
      console.log(`Error while like tweet`, error);
      setShowLoader(false);

      if (error?.response?.data?.message.toLowerCase() === "token expired") {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  };

  // function to delete a tweet
  const handleDelete = async (tweetId) => {
    try {
      setShowLoader(true);
      // Make API request to delete the tweet
      const response = await axios.delete(`/tweet/${tweetId}`);

      setShowLoader(false);
      if (response?.data?.success) {
        toast.success(response?.data?.message);
        if (main === "true") navigate("/");
        //reset th page content
        handleTweetOperation();
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ??
          error?.message ??
          "Something went wrong in delete tweet"
      );
      console.log(`Error while deleting tweet`, error);
      setShowLoader(false);
      if (error?.response?.data?.message.toLowerCase() === "token expired") {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  };

  const handleReTweet = async () => {
    try {
      setShowLoader(true);
      const response = await axios.post(`tweet/${tweetId}/retweet`);
      setShowLoader(false);
      if (response?.data?.success) {
        toast.success(response.data.message);
        tweetOperation();
      }
    } catch (error) {
      console.log("error", error);
      toast.error(
        error?.response?.data?.message ??
          error?.message ??
          "Something went wrong in tweet posting"
      );
      setShowLoader(false);
      if (error?.response?.data?.message.toLowerCase() === "token expired") {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  };

  // Function to handle file selection
  const handleFileSelect = (event) => {
    try {
      const img = {
        preview: URL.createObjectURL(event.target.files[0]),
        data: event.target.files[0],
      };
      //set the value of state variable `image` with `img` from above object
      setPostImage(img);
    } catch (error) {
      console.log("error: " + error);
    }
  };

  //function to upload image
  const uploadImage = async (id) => {
    try {
      // Create a FormData object to handle file upload
      const formData = new FormData();
      formData.append("file", postImage.data);

      //upload API call
      const response = await axios.post(`/tweet/${id}/image`, formData);
      if (response?.data?.success) {
        return response.data.imagePath;
      }
    } catch (error) {
      console.log("error in upload", error);
      toast.error(
        error?.response?.data?.message ??
          error?.message ??
          "Something went wrong in tweet's image posting"
      );
      if (error?.response?.data?.message.toLowerCase() === "token expired") {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  };

  // function for posting a new tweet
  const handleReply = async () => {
    try {
      if (replyTweetContent?.trim().length < 1) {
        toast.error("Tweet content is required");
      }
      setShowLoader(true);
      // Make API request to post the new tweet

      const response = await axios.post(
        `/tweet/${tweetId}/reply`,
        {
          content: replyTweetContent,
        },
        {
          headers: {
            "content-type": "application/json",
          },
        }
      );

      //if tweet posting is successful
      if (response?.data?.success) {
        //upload image if have

        if (postImage.preview.length) {
          //pass the tweet id to upload image
          await uploadImage(response?.data?.tweet._id);
        }
        setShowLoader(false);

        //show success toast
        toast.success(response.data.message);

        //reset necessary variables
        //reset image upload
        setPostImage({ preview: "", data: "" });
        //reset reply modal
        setReplyTweetContent("");

        // Refresh the tweet list
        tweetOperation();
      }
    } catch (error) {
      console.log("error", error);
      toast.error(
        error?.response?.data?.message ??
          error?.message ??
          "Something went wrong in tweet posting"
      );
      setShowLoader(false);
      if (error?.response?.data?.message.toLowerCase() === "token expired") {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  };

  return (
    <>
      <div
        className={`col-md-2 pe-1 ${
          details.retweetedBy?.length > 0 ? "pt-4" : ""
        }`}
      >
        <div
          style={{ width: "50px", height: "50px" }}
          className="border rounded-circle ms-auto d-flex"
        >
          <img
            style={{ objectFit: "cover" }}
            className="img-fluid p-2"
            src={`${API_BASE_URL}/user/get-file/${details?.tweetedBy?.profilePicture}`}
            alt="User"
          />
        </div>
      </div>

      <div className="col-8 ">
        {details.retweetedBy?.length > 0 && (
          <p className="m-0">
            <span className="">
              <FaRetweet className="text-primary" />
              <span className="mx-1">
                Re-Tweet By {details.retweetedBy[0].name}
              </span>
            </span>
          </p>
        )}
        <p className="m-0 p-1">
          <Link
            className="text-decoration-none text-dark me-1"
            to={`/profile/${details.tweetedBy?._id}`}
          >
            {" "}
            <span className="fw-bold">@{details.tweetedBy?.username}</span>
          </Link>
          -{" "}
          <span className="fs-7 fw-bold">
            {moment(details.createdAt).format("MMM Do YY")}
          </span>
        </p>
        <Link
          className="text-decoration-none text-dark"
          to={`/tweetDetails/${details._id}`}
        >
          <p>{details.content}</p>

          {/* if image */}
          {details.image?.length > 0 && (
            <img
              style={{
                width: "80%",
                height: "300px",
                objectFit: "contain",
              }}
              src={`${API_BASE_URL}/tweet/get-file/${details.image}`}
              alt="tweet preview"
              className="m-auto d-block"
            />
          )}
        </Link>
        {showLoader && <Loader />}
        {/* Like, Reply, Retweet buttons */}
        <div className="d-flex">
          <span className="me-1">
            <FaHeart
              className={`pointer ${
                details.likes?.includes(authState.user._id)
                  ? "text-danger"
                  : "text-muted"
              }`}
              onClick={() => handleLike(details._id)}
              key={details._id + "like"}
            />
            <span className="mx-1">{details.likes?.length}</span>
          </span>

          <span className="me-1">
            <FaReply
              key={details._id + "reply"}
              className="text-primary pointer"
              data-bs-toggle="modal"
              data-bs-target={`#replyRetweetModal${index}`}
            />
            <span className="mx-1">{details.reply?.length}</span>
          </span>

          <span className="me-1">
            <FaRetweet
              className="text-primary pointer"
              onClick={() => {
                handleReTweet();
              }}
              key={details._id + "reTweet"}
            />
            <span className="mx-1">{details.retweetedBy?.length}</span>
          </span>

          {/* Delete button (visible only to the tweet creator) */}
          {authState.user && authState.user._id === details.tweetedBy?._id && (
            <span className="me-1">
              <FaTrashCan
                onClick={() => handleDelete(details._id)}
                className="text-danger pointer"
              />
            </span>
          )}
        </div>

        {/* reply modal */}
        <div
          className={`modal`}
          tabIndex="-1"
          role="dialog"
          id={`replyRetweetModal${index}`}
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Reply</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                {postImage.preview.length > 0 && (
                  <div className="col-10 m-auto">
                    {" "}
                    <img
                      style={{ width: "90%", objectFit: "contain" }}
                      src={postImage.preview}
                      alt="post"
                    />{" "}
                  </div>
                )}

                <textarea
                  className="form-control mb-1"
                  placeholder="Add your comment"
                  value={replyTweetContent}
                  onChange={(e) => setReplyTweetContent(e.target.value)}
                ></textarea>
                <div className="mb-3">
                  <input
                    className="form-control form-control-sm"
                    id="formFileSm"
                    type="file"
                    onChange={(e) => handleFileSelect(e)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  data-bs-dismiss="modal"
                  onClick={() => handleReply()}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TweetCard;
