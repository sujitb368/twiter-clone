// import dependencies and modules
import React, { useState, useEffect } from "react";
import axios from "axios";

import { toast } from "react-toastify";
import "./Home.css";

// icons import
import { BsList, BsXSquareFill } from "react-icons/bs";
import Sidebar from "../../components/sidebar/Sidebar";
import { useAuth } from "../../context/authContext";
import TweetCard from "../../components/tweetCard/TweetCard";

import Loader from "../../components/loader/Loader";
import { useNavigate } from "react-router-dom";

const Home = () => {
  //auth provider
  const { authState } = useAuth();

  //state variables for tweet
  const [tweets, setTweets] = useState([]);
  const [newTweetContent, setNewTweetContent] = useState("");
  const [postImage, setPostImage] = useState({
    preview: "",
    data: "",
  });
  //state variable to control loader
  const [showLoader, setShowLoader] = useState(true);

  //side bar toggler
  const [toggleSideBar, setToggleSideBar] = useState(false);

  //navigation hooks
  const navigate = useNavigate();

  useEffect(() => {
    getTweets();
    //eslint-disable-next-line
  }, [authState.token]);

  const tweetOperation = () => {
    //Get new tweets
    getTweets();
  };
  // Fetch tweets your backend
  const getTweets = async () => {
    try {
      const response = await axios.get(`/tweet`);
      if (response?.data?.success) {
        setTweets(response?.data?.tweet);
        setShowLoader(false);
      }
    } catch (error) {
      console.error("Error fetching tweets:", error);
      setShowLoader(false);
      if (error?.response?.data?.message.toLowerCase() === "token expired") {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/login");
      }
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
  const handleTweet = async () => {
    try {
      if (newTweetContent?.trim().length < 1) {
        toast.error("Tweet content is required");
      }
      setShowLoader(true);
      // Make API request to post the new tweet

      const response = await axios.post(
        `/tweet`,
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
          await uploadImage(response?.data?.tweet._id);
        }
        //remove loader
        setShowLoader(false);
        //show success toast
        toast.success(response.data.message);

        //reset image preview
        setPostImage({ preview: "", data: "" });
        //reset newTweetContent variable
        setNewTweetContent("");

        // Refresh the tweet list
        getTweets();
      }
    } catch (error) {
      console.log("error", error);
      toast.error(
        error?.response?.data?.message ??
          error?.message ??
          "Something went wrong in tweet posting"
      );
      // remove loader
      setShowLoader(false);

      if (error?.response?.data?.message.toLowerCase() === "token expired") {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  };

  // Function to handle sidebar toggle
  const handelSideBar = () => {
    setToggleSideBar(!toggleSideBar);
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

  return (
    <div className="container">
      <div className="row col-lg-10 m-auto pt-3">
        {/* ToastContainer for displaying notifications */}

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
          className={`
          col-10 col-md-4 pt-5 border border-end-0 side-bar-responsive bg-2 
          position-sticky top-0 start-0
          ${toggleSideBar ? "side-bar-responsive-toggle" : ""}`}
          style={{ height: "90vh" }}
        >
          <Sidebar />
        </div>

        {/* Tweet List */}
        <div className="col-md-8 border p-2">
          <div className="d-flex justify-content-between mb-2">
            <h2 className="text-primary">Home</h2>

            {/* Tweet Button */}
            {showLoader && <Loader />}
            {!showLoader && (
              <button
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#tweetModal"
              >
                Tweet
              </button>
            )}
          </div>

          {/* List of Tweets */}
          <div className="border rounded">
            {tweets.map((tweet, index) => (
              <div
                className={`d-flex p-2 ${
                  index !== tweets.length - 1 ? "border-bottom" : ""
                } `}
                key={tweet._id}
              >
                {/* cardId : {tweet._id} */}
                <TweetCard
                  key={tweet._id}
                  details={tweet}
                  tweetIdProps={tweet._id}
                  tweetOperation={tweetOperation}
                  index={index}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* tweet modal */}

      <div className={`modal`} tabIndex="-1" role="dialog" id="tweetModal">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Tweet</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <textarea
                className="form-control mb-2"
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
