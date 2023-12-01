//this is tweet details page

// design this page as pointed below

// Tweet Details
// - In this page show a tweet details and all the replies in that tweet
// - Since reply is a tweet itself it will appear the same as tweet with all the same buttons and operations.
// - at top show show parent tweet
// below show child tweet
import axios from "axios";
import React, { useEffect, useState } from "react";
import { BsList, BsXSquareFill } from "react-icons/bs";

import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Sidebar from "../../components/sidebar/Sidebar";
import TweetCard from "../../components/tweetCard/TweetCard";

function TweetDetails() {
  //get tweet id from url params
  const { id } = useParams();

  const [replyTweetContent, setReplyTweetContent] = useState("");
  const [postImage, setPostImage] = useState({
    preview: "",
    data: "",
  });

  //tweet modal
  const [showReplyModal, setShowReplyModal] = useState(false);

  const [tweetId, setTweetId] = useState();

  const [tweetDetails, setTweetDetails] = useState([]);

  //side bar toggler
  const [toggleSideBar, setToggleSideBar] = useState(false);

  //navigate hook
  const navigate = useNavigate();
  // function for posting a new tweet
  const getTweetDetails = async () => {
    try {
      // Make API request to get single tweet with its details

      const response = await axios.get(`/tweet/${id}`);

      console.log("is here ", response);
      //if tweet posting is successful
      if (response?.data?.success) {
        //update tweetDetails state variable for UI update
        setTweetDetails(response.data.tweet);
        //show success toast
        toast.success(response.data.message);
      }
    } catch (error) {
      console.log("error", error);
      toast.error(
        error?.response?.data?.message ??
          error?.message ??
          "Something went wrong in tweet posting"
      );
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

  const tweetOperation = (isReply = null, tweetId = null) => {
    //Get new tweets
    if (isReply === "reply") {
      //set tweet id
      setTweetId(tweetId);
    } else {
      //Get new tweets
      getTweetDetails();
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

  useEffect(() => {
    getTweetDetails();
    //eslint-disable-next-line
  }, [id]);

  return (
    <div className="container">
      <div className="row col-lg-10 m-auto pt-3">
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
          <div className=" rounded">
            <p className="fw-bold m-0 ">Tweet</p>
            <div className="d-flex p-2 mb-4">
              <TweetCard
                main="true"
                details={tweetDetails}
                tweetOperation={tweetOperation}
              />
            </div>

            <>
              {tweetDetails?.reply?.length > 0 && (
                <p className="m-0 fw-bold">Replies</p>
              )}
              {tweetDetails?.reply?.length > 0 &&
                tweetDetails.reply.map((tweet, index) => (
                  <div className={`d-flex p-2 border`} key={tweet._id}>
                    <TweetCard
                      details={tweet}
                      tweetOperation={tweetOperation}
                    />
                  </div>
                ))}
            </>

            {/* List of Tweets */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TweetDetails;
