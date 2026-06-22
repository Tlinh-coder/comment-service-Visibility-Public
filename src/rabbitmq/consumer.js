const amqp = require("amqplib");
const Comment = require("../models/Comment");

const QUEUE = "comments";

const RABBITMQ_URL =
  process.env.RABBITMQ_URL || "amqp://localhost";

async function startConsumer() {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    await channel.assertQueue(QUEUE);

    console.log("Waiting for comments...");

    channel.consume(QUEUE, async (msg) => {
      if (msg !== null) {
        try {
          const data = JSON.parse(msg.content.toString());

          if (
            !data.productId ||
            !data.userId ||
            !data.username ||
            !data.content
          ) {
            console.error("Invalid comment data:", data);
            channel.ack(msg);
            return;
          }

          const comment = new Comment({
            productId: data.productId,
            userId: data.userId,
            username: data.username,
            content: data.content,
            role: "user",
            parentId: null,
          });

          await comment.save();

          console.log("Comment saved");

          channel.ack(msg);
        } catch (error) {
          console.error("Consumer error:", error.message);
          channel.ack(msg);
        }
      }
    });
  } catch (error) {
    console.error("RabbitMQ connection error:", error.message);
  }
}

module.exports = startConsumer;