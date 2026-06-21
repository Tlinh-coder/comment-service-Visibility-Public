const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
    },

    userId: {
      type: String,
      required: true,
    },

    username: {
      type: String,
      required: true,
    },

    content: {
      type: String,
      required: true,
    },

    likes: {
      type: Number,
      default: 0,
    },

    parentId: {
      type: String,
      default: null,
    },

    role: {
      type: String,
      enum: ["user", "seller"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Comment", commentSchema);