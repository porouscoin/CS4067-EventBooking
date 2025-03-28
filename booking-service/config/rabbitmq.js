const amqp = require("amqplib");

let channel;

async function connectRabbitMQ() {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL || "amqp://localhost"); // Added fallback URL
    channel = await connection.createChannel();
    console.log("✅ RabbitMQ Connected");

    // Create a queue for booking notifications
    const queue = "booking_notifications";
    await channel.assertQueue(queue, { durable: true });
  } catch (error) {
    console.error("❌ RabbitMQ Connection Failed", error);
  }
}

function getChannel() {
  if (!channel) {
    throw new Error("RabbitMQ channel not initialized");
  }
  return channel;
}

// Automatically initialize RabbitMQ when this file is imported
connectRabbitMQ();

module.exports = { getChannel };
