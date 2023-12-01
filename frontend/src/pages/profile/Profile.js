import React, { useEffect, useState } from "react";
import { BsList, BsXSquareFill } from "react-icons/bs";
import Sidebar from "../../components/sidebar/Sidebar";

import "./Profile.css";
import { FaCalendarDays, FaLocationDot, FaRegCalendar } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../Constant";

import { nameFunction } from "../../util";

import moment from "moment";
import TweetCard from "../../components/tweetCard/TweetCard";
moment().format();

function Profile() {
  //auth context
  const { authState, authDispatch } = useAuth();
  //side bar toggler
  const [toggleSideBar, setToggleSideBar] = useState(false);

  // State variables for user details modification
  const [name, setName] = useState(authState.user.name); // it should not be empty
  const [dob, setDob] = useState("");
  const [location, setLocation] = useState("");
  const [profileImage, setProfileImage] = useState({
    preview: "",
    data: "",
  });

  //state variable for user details
  const [user, setUser] = useState({});

  //state variable for user details
  const [tweets, setTweets] = useState([]);

  //get user id from params
  const { id: userId } = useParams();

  //navigate hook
  const navigate = useNavigate();

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
      setProfileImage(img);
    } catch (error) {
      console.log("error: " + error);
    }
  };

  const getUserDetails = async () => {
    try {
      const response = await axios.get(`/user/${userId}`);

      //if get user data
      if (response?.data?.success) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.log(`Error in get user details ${error}`);

      //show error toast message
      toast.error(
        error?.response?.data?.message ??
          error?.message ??
          "Error in get user details"
      );
      if (error?.response?.data?.message.toLowerCase() === "token expired") {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  };

  const getUserTweets = async () => {
    try {
      const response = await axios.get(`/user/${userId}/tweets`);

      //if get user data
      if (response?.data?.success) {
        toast.success(response.data.message);
        setTweets(response.data.tweets);
      }
    } catch (error) {
      console.log(`Error in get user tweets ${error}`);

      //show error toast message
      toast.error(
        error?.response?.data?.message ??
          error?.message ??
          "Error in get user tweets"
      );

      if (error?.response?.data?.message.toLowerCase() === "token expired") {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  };

  const uploadProfilePhoto = async () => {
    try {
      const formData = new FormData();
      formData.append("file", profileImage.data);
      const response = await axios.post(
        `/user/${authState.user._id}/uploadProfilePic`,
        formData
      );

      //if get user data
      if (response?.data?.success) {
        toast.success(response.data.message);

        //update user in local storage
        const token = localStorage.getItem("user");
        const user = JSON.parse(localStorage.getItem("user"));
        user.profilePicture = response.data.imagePath;

        //update authState using authDispatcher
        authDispatch({
          type: "AUTH_SUCCESS",
          payload: {
            user,
            token,
          },
        });

        localStorage.setItem("user", JSON.stringify(user));

        //reset variables
        setProfileImage({
          preview: "",
          data: "",
        });
      }
    } catch (error) {
      console.log(`Error in get user details ${error}`);

      //show error toast message
      toast.error(
        error?.response?.data?.message ??
          error?.message ??
          "Error in get user details"
      );

      if (error?.response?.data?.message.toLowerCase() === "token expired") {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  };

  const editProfile = async () => {
    try {
      const response = await axios.put(
        `/user/edit`,
        {
          name,
          dob,
          location,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      //if get user data
      if (response?.data?.success) {
        toast.success(response.data.message);
        setUser(response.data.user);

        //update user in local storage
        localStorage.setItem("user", JSON.stringify(response.data.user));

        //update authState using authDispatcher
        authDispatch({
          type: "AUTH_SUCCESS",
          payload: {
            user: response.data.user,
            token: authState.token,
          },
        });

        //reset input of modal
        setName(response.data.user.name);
        setLocation("");
        setDob("");
      }
    } catch (error) {
      console.log(`Error in get user details ${error}`);

      //show error toast message
      toast.error(
        error?.response?.data?.message ??
          error?.message ??
          "Error in get user details"
      );
      if (error?.response?.data?.message.toLowerCase() === "token expired") {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  };

  // Function to handle file selection
  const follow = async () => {
    try {
      const response = await axios.post(
        `/user/follow/${userId}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      //if get user data
      if (response?.data?.success) {
        toast.success(response.data.message);
        getUserDetails();
      }
    } catch (error) {
      console.log(`Error in get user details ${error}`);

      //show error toast message
      toast.error(
        error?.response?.data?.message ??
          error?.message ??
          "Error in get user details"
      );

      if (error?.response?.data?.message.toLowerCase() === "token expired") {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  };
  // Function to handle file selection
  const unFollow = async () => {
    try {
      const response = await axios.post(
        `/user/unfollow/${userId}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      //if get user data
      if (response?.data?.success) {
        toast.success(response.data.message);
        getUserDetails();
      }
    } catch (error) {
      console.log(`Error in get user details ${error}`);

      //show error toast message
      toast.error(
        error?.response?.data?.message ??
          error?.message ??
          "Error in get user details"
      );
      if (error?.response?.data?.message.toLowerCase() === "token expired") {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  };

  const tweetOperation = () => {
    //Get new tweets
    getUserTweets();
  };

  useEffect(() => {
    getUserDetails();
    getUserTweets();
    //eslint-disable-next-line
  }, []);
  return (
    <div className="container position-relative">
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

        {/* profile */}
        <div className="col-md-8 border p-2">
          <div className="d-flex justify-content-between mb-2">
            <h2 className="text-primary">Profile</h2>
          </div>

          {/* header */}
          <div className="bottom-div">
            {/* <!-- Rounded Image --> */}
            <div className="rounded-image d-flex">
              <img
                style={{ width: "90%", objectFit: "cover" }}
                src={`${API_BASE_URL}/user/get-file/${authState.user.profilePicture}`}
                alt="Rounded"
                className="d-block m-auto"
              />
            </div>
          </div>
          {/* follow | unfollow | edit */}
          <div className="d-flex justify-content-end mt-3">
            {authState.user._id === userId ? (
              <>
                <button
                  className="btn btn-dark btn-sm me-1"
                  data-bs-toggle="modal"
                  data-bs-target="#uploadProfilePhotoModal"
                >
                  Upload profile photo
                </button>
                <button
                  className="btn btn-dark btn-sm me-1"
                  data-bs-toggle="modal"
                  data-bs-target="#editProfileModal"
                >
                  Edit
                </button>
              </>
            ) : user?.followers?.includes(authState.user._id) ? (
              <button onClick={unFollow} className="btn btn-dark btn-sm me-1">
                Unfollow
              </button>
            ) : (
              <button onClick={follow} className="btn btn-dark btn-sm me-1">
                Follow
              </button>
            )}
          </div>
          <div className="row mt-5 px-3">
            <p className="m-0 ps-3 text-dark fw-bold">
              {nameFunction(user.name)}
            </p>
            <p className="m-0 ps-3">@{user.username}</p>
          </div>

          <div className="row mt-2 px-3">
            <p className="m-0 ps-3 text-dark">
              <span className="me-3">
                <FaCalendarDays /> {moment(user.dob).format("ddd Do MMM YYYY")}
              </span>
              <span>
                <FaLocationDot /> {user.location}
              </span>
            </p>
            <p className="m-0 ps-3 text-dark">
              <span>
                <FaRegCalendar />{" "}
                {moment(user.createdAt).format("ddd MMM Do YYYY")}
              </span>
            </p>
          </div>

          <div className="row mt-2 px-3">
            <p className="m-0 ps-3 fw-bold text-dark">
              <span className="me-2">{user?.followers?.length} Followers</span>
              <span>{user?.following?.length} Following</span>
            </p>
          </div>

          {/* tweets of user */}
          <div className="mt-3">
            <h4 className="text-center">Tweets and Replies</h4>
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
                    tweetOperation={tweetOperation}
                    index={index}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* modal */}

      {/* Edit user details modal */}

      <div
        className={`modal`}
        tabIndex="-1"
        role="dialog"
        id="editProfileModal"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Profile</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Name :</label>

                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Enter name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Location :</label>

                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Enter location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Date of birth :</label>

                <input
                  type="date"
                  className="form-control mb-2"
                  placeholder="Select date of birth"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
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
                onClick={editProfile}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`modal`}
        tabIndex="-1"
        role="dialog"
        id="uploadProfilePhotoModal"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Profile</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                {profileImage.preview.length > 0 && (
                  <div className="col-10 m-auto">
                    {" "}
                    <img
                      style={{ width: "90%", objectFit: "contain" }}
                      src={profileImage.preview}
                      alt="post"
                    />{" "}
                  </div>
                )}
                <p className="p-3 bg-primary rounded bg-opacity-25 fw-bold text-primary">
                  Note:The image should be square in shape
                </p>
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
                onClick={uploadProfilePhoto}
              >
                Save Profile pic
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
