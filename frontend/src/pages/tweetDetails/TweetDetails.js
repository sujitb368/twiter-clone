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

import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Sidebar from "../../components/sidebar/Sidebar";
import TweetCard from "../../components/tweetCard/TweetCard";

function TweetDetails() {
  //get tweet id from url params
  const { id } = useParams();

  const [tweetDetails, setTweetDetails] = useState([]);

  //side bar toggler
  const [toggleSideBar, setToggleSideBar] = useState(false);

  // function for posting a new tweet
  const getTweetDetails = async () => {
    try {
      // Make API request to get single tweet with its details

      const response = await axios.get(`/tweet/${id}`);

      console.log(response);
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
    }
  };

  // Function to handle sidebar toggle
  const handelSideBar = () => {
    setToggleSideBar(!toggleSideBar);
  };

  const tweetOperation = () => {
    //Get new tweets
    getTweetDetails();
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
          <div className="border rounded">
            <p>Main</p>
            <div className="d-flex p-2 border-bottom">
              <TweetCard
                main="true"
                tweet={tweetDetails}
                tweetOperation={tweetOperation}
              />
            </div>

            <>
              {tweetDetails?.reply?.length > 0 && <p>reply</p>}
              {tweetDetails?.reply?.length > 0 &&
                tweetDetails.reply.map((tweet, index) => (
                  <div
                    className={`d-flex p-2 ${
                      index !== tweetDetails.length - 1 ? "border-bottom" : ""
                    } `}
                    key={tweet._id}
                  >
                    <TweetCard tweet={tweet} tweetOperation={tweetOperation} />
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
