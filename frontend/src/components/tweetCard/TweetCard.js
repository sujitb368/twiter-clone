import React, { useEffect, useState } from "react";

import { FaHeart, FaReply, FaRetweet, FaTrashCan } from "react-icons/fa6";
import { useAuth } from "../../context/authContext";

import { API_BASE_URL } from "../../Constant";

import { Link, useNavigate } from "react-router-dom";

import axios from "axios";
import { toast } from "react-toastify";

function TweetCard({ main, details, tweetOperation, tweetIdProps }) {
  const { authState } = useAuth();
  const [tweetType, setTweetType] = useState("tweet");
  const [newTweetContent, setNewTweetContent] = useState("");
  const [postImage, setPostImage] = useState({
    preview: "",
    data: "",
  });

  //tweet Id
  const [tweetId, setTweetId] = useState("");
  //tweet modal
  const [showReplyTweetModal, setShowReplyTweetModal] = useState("");
  const [showReplyTweetModalFor, setShowReplyTweetModalFor] = useState({
    tweetId: "",
    showModal: false,
  });

  //endpoint for reply
  const [endPoint, setEndPoint] = useState("");

  //navigate hooks
  const navigate = useNavigate();

  const handleTweetOperation = () => {
    tweetOperation();
  };

  const handleLike = async (tweetId) => {
    try {
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
    }
  };

  // function to delete a tweet
  const handleDelete = async (tweetId) => {
    try {
      // Make API request to delete the tweet
      const response = await axios.delete(`/tweet/${tweetId}`);

      if (response?.data?.success) {
        // await getTweets();
        toast.success(response?.data?.message);
        if (main === "true") navigate("/");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ??
          error?.message ??
          "Something went wrong in delete tweet"
      );
      console.log(`Error while deleting tweet`, error);
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
    }
  };

  // function for posting a new tweet
  const handleReply = async () => {
    try {
      console.log("tweetId ", details);
      // return;
      // Make API request to post the new tweet

      const response = await axios.post(
        endPoint,
        {
          content: newTweetContent,
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
          await uploadImage(response?.data?.details._id);
        }
        //show success toast
        toast.success(response.data.message);

        //reset image preview
        setPostImage({ preview: "", data: "" });

        //reset reply modal
        setNewTweetContent("");
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
      setShowReplyTweetModal(!showReplyTweetModal);
    }
  };

  const handleReTweet = async () => {
    try {
      const response = await axios.post(`tweet/${tweetId}/retweet`);

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
    }
  };
  const close = (setState) => {
    // Implement logic to handle retweeting
    setState(false);
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

  // useEffect(() => {
  //   // This code will be executed whenever tweetId changes
  //   setEndPoint((endPoint) => {
  //     endPoint = `/tweet/${tweetId}/reply`;
  //     console.log("local end point", endPoint);
  //     return endPoint;
  //   });

  // }, [tweetId, endPoint, tweetType]);

  return (
    <>
      <div
        className={`col-md-2 pe-1 ${
          details.retweetedBy?.length > 0 ? "pt-4" : ""
        }`}
      >
        <div
          style={{ width: "50px", height: "50px" }}
          className="border rounded-circle ms-auto"
        >
          <img
            className="img-fluid p-2"
            src={`${API_BASE_URL}/user/get-file/${details?.tweetedBy?.profilePicture}?jwtToken=${authState.token}`}
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
            className="text-decoration-none text-dark"
            to={`/tweetDetails/${details._id}`}
          >
            {" "}
            <span className="fw-bold">@{details.tweetedBy?.username}</span>
          </Link>
          - <span>{details.createdAt}</span>
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
              onClick={async () => {
                // setTweetType(details._id + "reply");
                setTweetId((pre) => details._id);
                // test(details._id);
                setShowReplyTweetModal(!showReplyTweetModal);
                setShowReplyTweetModalFor((prev) => {
                  console.log(
                    "showReplyTweetModalFor 1",
                    showReplyTweetModalFor
                  );
                  return [
                    {
                      ...prev,
                      tweetId: details._id,
                      showModal: true,
                    },
                  ];
                });
                console.log("showReplyTweetModalFor 2", showReplyTweetModalFor);
              }}
              className="text-primary pointer"
              data-bs-toggle="modal"
              data-bs-target="#replyRetweetModal"
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
      </div>
      <div
        className={`modal ${
          showReplyTweetModalFor.showModal === true &&
          showReplyTweetModalFor.tweetId === tweetIdProps
            ? "show"
            : ""
        }`}
        tabIndex="-1"
        role="dialog"
        id="replyRetweetModal"
        key={tweetIdProps}
        title={details._id}
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {tweetType === "retweet" ? "Re Tweet" : "Reply"}
                {/* id = {JSON.stringify(showReplyTweetModalFor)} */}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={(e) => close(setShowReplyTweetModal)}
              ></button>
            </div>
            <div className="modal-body">
              Content : {details.content}
              <textarea
                className="form-control mb-1"
                placeholder="Add your comment"
                value={newTweetContent}
                onChange={(e) => setNewTweetContent(e.target.value)}
              ></textarea>
              <div className="mb-3">
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
                onClick={(e) => close(setShowReplyTweetModal)}
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
    </>
  );
}

export default TweetCard;
