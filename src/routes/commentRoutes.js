const express = require("express");
const router = express.Router();

const controller = require("../controllers/commentController");

router.post("/", controller.createComment);

router.get("/:productId", controller.getCommentsByProduct);

router.put("/:id", controller.updateComment);

router.delete("/:id", controller.deleteComment);

router.post("/:id/like", controller.likeComment);

// Seller reply comment
router.post("/:id/reply", controller.replyComment);

module.exports = router;
