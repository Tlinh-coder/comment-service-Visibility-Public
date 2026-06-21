require("dotenv").config();

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const commentRoutes = require("./routes/commentRoutes");
const connectDB = require("./config/db");
const startConsumer = require("./rabbitmq/consumer");
const { initSocket } = require("./socket");

// 1. tạo app TRƯỚC
const app = express();
const server = http.createServer(app);

// 2. middleware
app.use(cors());
app.use(express.json());

// 3. routes
app.use("/comments", commentRoutes);

// 4. socket
const io = new Server(server, {
  cors: { origin: "*" },
});

initSocket(io);

io.on("connection", (socket) => {
  console.log("⚡ Client connected:", socket.id);
});

// 5. DB + queue
connectDB();
startConsumer();

// 6. test route
app.get("/", (req, res) => {
  res.send("Comment Service Running");
});

// 7. start server
const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});