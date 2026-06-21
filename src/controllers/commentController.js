const Comment = require("../models/Comment");

// CREATE COMMENT
exports.createComment = async (req, res) => {
  try {
    const comment = await Comment.create(req.body);
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET COMMENTS + BUILD TREE
exports.getCommentsByProduct = async (req, res) => {
    try {
      const comments = await Comment.find({
        productId: req.params.productId,
      }).sort({ createdAt: 1 });
  
      const map = {};
      const result = [];
  
      comments.forEach((comment) => {
        const obj = comment.toObject();
        obj.replies = [];
        map[obj._id] = obj;
      });
  
      comments.forEach((comment) => {
        const obj = map[comment._id];
  
        if (obj.parentId) {
          if (map[obj.parentId]) {
            map[obj.parentId].replies.push(obj);
          }
        } else {
          result.push(obj);
        }
      });
  
      return res.json(result);
  
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };
// UPDATE
exports.updateComment = async (req, res) => {
  try {
    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { content: req.body.content },
      { new: true }
    );
    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE
exports.deleteComment = async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// LIKE
exports.likeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: "Not found" });
    }

    comment.likes += 1;
    await comment.save();

    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.replyComment = async (req, res) => {
    try {
      const parentComment = await Comment.findById(
        req.params.id
      );
  
      if (!parentComment) {
        return res.status(404).json({
          message: "Comment not found",
        });
      }
  
      const reply = await Comment.create({
        productId: parentComment.productId,
        userId: req.body.userId,
        username: req.body.username,
        content: req.body.content,
        role: "seller",
        parentId: parentComment._id.toString(),
      });
  
      res.status(201).json(reply);
  
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };