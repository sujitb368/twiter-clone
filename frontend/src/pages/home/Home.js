// import dependencies and modules
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import { ToastContainer, toast } from "react-toastify";
import "./Home.css";

// icons import
import { BsList, BsXSquareFill } from "react-icons/bs";
import { API_BASE_URL } from "../../Constant";
import Sidebar from "../../components/sidebar/Sidebar";
import { FaHeart, FaReply, FaRetweet, FaTrashCan } from "react-icons/fa6";
import { useAuth } from "../../context/authContext";

const Home = () => {
  //state variables
  const [tweets, setTweets] = useState([]);
  const [tweetType, setTweetType] = useState("tweet");
  const [tweetId, setTweetId] = useState("");
  const [newTweetContent, setNewTweetContent] = useState("");

  const [liked, setLiked] = useState([]);
  const [showTweetModal, setShowTweetModal] = useState(false);
  //side bar toggler
  const [toggleSideBar, setToggleSideBar] = useState(false);

  //auth provider
  const { authState } = useAuth();

  //navigation hooks
  // const navigate = useNavigate();

  useEffect(() => {
    getTweets();
    //eslint-disable-next-line
  }, [authState.token]);

  // Fetch tweets your backend
  const getTweets = async () => {
    try {
      const response = await axios.get(`/tweet`);
      if (response?.data) {
        setTweets(response?.data?.tweet);
      }
    } catch (error) {
      console.error("Error fetching tweets:", error);
    }
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
        setLiked((pre) => [...pre, tweetId]);
        console.log("liked", liked);
        await getTweets();
        toast.success(response?.data?.message);
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

  //function to reply a tweet
  const handleReply = async (tweetId) => {
    try {
      // Make API request to post the new tweet
      const response = await axios.post(
        `/tweet/${tweetId}/reply`,
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
        //show success toast
        toast.success(response.data.message);

        // Refresh the tweet list
        getTweets();
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ??
          error?.message ??
          "Something went wrong in tweet posting"
      );
      setShowTweetModal(!showTweetModal);
    }
  };

  // function to delete a tweet
  const handleDelete = async (tweetId) => {
    try {
      // Make API request to delete the tweet
      const response = await axios.delete(`/tweet/${tweetId}`);

      if (response?.data?.success) {
        await getTweets();
        toast.success(response?.data?.message);
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

  // function for posting a new tweet
  const handleTweet = async () => {
    try {
      // Make API request to post the new tweet
      const endPoint =
        tweetType === "tweet"
          ? "/tweet"
          : tweetType === "retweet"
          ? `/tweet/${tweetId}/retweet`
          : `/tweet/${tweetId}/reply`;
      console.log("end point", endPoint);
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
        //show success toast
        toast.success(response.data.message);

        // Refresh the tweet list
        getTweets();
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ??
          error?.message ??
          "Something went wrong in tweet posting"
      );
      setShowTweetModal(!showTweetModal);
    }
  };

  const close = (setState) => {
    // Implement logic to handle retweeting
    setState(false);
  };

  // Function to handle sidebar toggle
  const handelSideBar = () => {
    setToggleSideBar(!toggleSideBar);
  };

  return (
    <div className="container">
      <div className="row col-lg-10 m-auto pt-3">
        {/* ToastContainer for displaying notifications */}
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss={false}
          draggable
          pauseOnHover={false}
          theme="light"
        />
        <div className="d-md-none d-flex justify-content-end py-2">
          {!toggleSideBar ? (
            <button className="btn bg-3" onClick={handelSideBar}>
              <BsList />
            </button>
          ) : (
            <button className="btn bg-3" onClick={handelSideBar}>
              <BsXSquareFill />
            </button>
          )}
        </div>

        {/* sidebar */}
        <div
          className={`col-10 col-md-4 pt-5 border side-bar-responsive bg-2 ${
            toggleSideBar ? "side-bar-responsive-toggle" : ""
          }`}
        >
          <Sidebar />
        </div>

        {/* Tweet List */}
        <div className="col-md-8 border p-2">
          <div className="d-flex justify-content-between mb-2">
            <h2 className="text-primary">Home</h2>

            {/* Tweet Button */}
            <button
              className="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#tweetModal"
              onClick={() => {
                setShowTweetModal(!showTweetModal);
                setTweetType("tweet");
              }}
            >
              Tweet
            </button>
          </div>

          <div className="border rounded">
            {tweets.map((tweet, index) => (
              <div
                className={`d-flex p-2 ${
                  index !== tweets.length - 1 ? "border-bottom" : ""
                } `}
                key={tweet._id}
              >
                <div className="col-md-2 pe-1">
                  <div
                    style={{ width: "50px", height: "50px" }}
                    className="border rounded-circle ms-auto"
                  >
                    <img
                      className="img-fluid p-2"
                      src={`${API_BASE_URL}/user/get-file/${tweet.tweetedBy.profilePicture}?jwtToken=${authState.token}`}
                      alt="User"
                    />
                  </div>
                </div>

                <div className="col-8 ">
                  <Link className="text-decoration-none text-dark" to="/login">
                    <p className="m-0 p-1">
                      {" "}
                      <span className="fw-bold">
                        {tweet.tweetedBy?.username}
                      </span>{" "}
                      - <span>{tweet.createdAt}</span>
                    </p>

                    <p>{tweet.content}</p>

                    {/* if image */}
                    {tweet.image?.length > 0 && (
                      <img src={tweet.image} alt="" />
                    )}
                  </Link>
                  {/* Like, Reply, Retweet buttons */}
                  <div className="d-flex">
                    <span className="me-1">
                      <FaHeart
                        className={`pointer ${
                          tweet.likes.includes(authState.user._id)
                            ? "text-danger"
                            : "text-muted"
                        }`}
                        onClick={() => handleLike(tweet._id)}
                      />
                      <span className="mx-1">{tweet.likes.length}</span>
                    </span>
                    <span className="me-1">
                      <FaReply
                        onClick={() => {
                          setShowTweetModal(!showTweetModal);
                          setTweetType("reply");
                          setTweetId(tweet._id);
                        }}
                        className="text-primary pointer"
                        data-bs-toggle="modal"
                        data-bs-target="#tweetModal"
                      />
                      <span className="mx-1">{tweet.reply.length}</span>
                    </span>

                    <span className="me-1">
                      <FaRetweet
                        className="text-primary pointer"
                        data-bs-toggle="modal"
                        data-bs-target="#tweetModal"
                        onClick={() => {
                          setShowTweetModal(!showTweetModal);
                          setTweetType("retweet");
                          setTweetId(tweet._id);
                        }}
                      />
                      <span className="mx-1">{tweet.retweetedBy.length}</span>
                    </span>

                    {/* Delete button (visible only to the tweet creator) */}
                    {authState.user &&
                      authState.user._id === tweet.tweetedBy._id && (
                        <span className="me-1">
                          <FaTrashCan
                            onClick={() => handleDelete(tweet._id)}
                            className="text-danger pointer"
                          />
                        </span>
                      )}
                  </div>
                </div>
              </div>
            ))}

            {/* List of Tweets */}
          </div>
        </div>
      </div>

      {/* Reply Dialog */}

      <div
        className={`modal ${showTweetModal ? "show" : ""}`}
        tabIndex="-1"
        role="dialog"
        id="tweetModal"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {tweetType === "tweet"
                  ? "Tweet"
                  : tweetType === "retweet"
                  ? "Re-tweet"
                  : "Reply"}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={(e) => close(setShowTweetModal)}
              ></button>
            </div>
            <div className="modal-body">
              <textarea
                className="form-control"
                placeholder="Add your comment"
                value={newTweetContent}
                onChange={(e) => setNewTweetContent(e.target.value)}
              ></textarea>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={(e) => close(setShowTweetModal)}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                data-bs-dismiss="modal"
                onClick={handleTweet}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
