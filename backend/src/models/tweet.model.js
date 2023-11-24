//tweet model schema

import mongoose from "mongoose";

const { Schema } = mongoose;

const tweetSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    tweetedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    retweetedBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    image: {
      type: String,
      default: "",
    },
    reply: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tweet",
      },
    ],
  },
  { timestamps: true }
);

const Tweet = mongoose.model("Tweet", tweetSchema);

export default Tweet;
