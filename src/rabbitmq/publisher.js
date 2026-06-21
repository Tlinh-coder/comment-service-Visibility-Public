const amqp = require("amqplib");

const QUEUE = "comments";
const AMQP_URL = process.env.AMQP_URL || "amqp://localhost";

async function publishComment(commentData) {
  try {
    const connection = await amqp.connect(AMQP_URL);

    const channel = await connection.createChannel();

    await channel.assertQueue(QUEUE);

    channel.sendToQueue(
      QUEUE,
      Buffer.from(JSON.stringify(commentData))
    );

    console.log("📨 Comment sent to queue");

    setTimeout(() => {
      connection.close();
    }, 500);

  } catch (error) {
    console.error(error);
  }
}

module.exports = publishComment;