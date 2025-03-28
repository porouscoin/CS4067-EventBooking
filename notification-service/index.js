const amqp = require("amqplib");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const Notification = require("./models/Notification");
require("dotenv").config();

// 🔌 Connect to MongoDB
async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("✅ MongoDB Connected (Notification Service)");
    } catch (err) {
        console.error("❌ MongoDB Connection Error:", err);
        process.exit(1);
    }
}

connectDB();

// 📧 Send Email Function
async function sendEmail(to, message) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject: "Booking Confirmation",
        text: message,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent to ${to}`);
    } catch (error) {
        console.error("❌ Email Sending Failed:", error);
    }
}

// 📥 Consume Messages from RabbitMQ
async function consumeQueue() {
    try {
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();
        const queue = "booking_notifications";

        await channel.assertQueue(queue, { durable: true });

        console.log("📥 Waiting for messages in queue...");

        channel.consume(queue, async (msg) => {
            if (msg !== null) {
                const data = JSON.parse(msg.content.toString());
                console.log("📩 Received message:", data);

                const { user_email, booking_id, status } = data;

                const message = `Your booking (ID: ${booking_id}) has been confirmed! 🎟️`;

                // Send Email
                await sendEmail(user_email, message);

                // Save Notification to Database
                try {
                    const notification = new Notification({ user_email, message });
                    await notification.save();
                    console.log(`✅ Notification saved for ${user_email}`);
                } catch (error) {
                    console.error("❌ Failed to save notification to DB:", error);
                }

                channel.ack(msg);
            }
        });
    } catch (error) {
        console.error("❌ RabbitMQ Consumer Error:", error);
    }
}

consumeQueue();
