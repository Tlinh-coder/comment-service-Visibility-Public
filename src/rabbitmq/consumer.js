const amqp = require("amqplib");
const Comment = require("../models/Comment");
const redisClient = require("../config/redis");
const { getIO } = require("../socket");

const QUEUE = "comments";
const AMQP_URL = process.env.AMQP_URL || "amqp://localhost";

async function startConsumer() {
  const connection = await amqp.connect(AMQP_URL);
  const channel = await connection.createChannel();

  await channel.assertQueue(QUEUE);

  console.log("🎧 Waiting for comments...");

  channel.consume(QUEUE, async (msg) => {
    try {
      const data = JSON.parse(msg.content.toString());

      const comment = await Comment.create(data);
      console.log("💾 Comment saved");

      // cache invalidation
      await redisClient.del(`comments:${data.productId}`);
      console.log("🧹 Cache cleared");

      // realtime push
      const io = getIO();
      io.emit("newComment", comment);

      channel.ack(msg);
    } catch (error) {
      console.error("❌ Consumer error:", error.message);
      // requeue = false so we don't loop on a bad message
      channel.nack(msg, false, false);
    }
  });
}

module.exports = startConsumer;