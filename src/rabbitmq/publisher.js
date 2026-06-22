const amqp = require("amqplib");

const QUEUE = "comments";

async function publishComment(commentData) {
    try {
      const connection = await amqp.connect(
        process.env.RABBITMQ_URL
      );

    const channel = await connection.createChannel();

    await channel.assertQueue(QUEUE);

    channel.sendToQueue(
      QUEUE,
      Buffer.from(JSON.stringify(commentData))
    );

    console.log(" Comment sent to queue");

    setTimeout(() => {
      connection.close();
    }, 500);

  } catch (error) {
    console.error(error);
  }
}

module.exports = publishComment;