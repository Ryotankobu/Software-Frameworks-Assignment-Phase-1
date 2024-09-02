

const express = require("express");
const http = require("http");
const cors = require("cors");
const socketio = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "http://localhost:4200", // Angular app's URL
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files if you have any, e.g., index.html for a simple app
app.use(express.static(path.join(__dirname, "public")));


const loginRoutes = require("./routes/login");
loginRoutes.route(app);

// Import and use the socket handling logic
const socketRoutes = require("./routes/socket");
socketRoutes(io);

// Start the server using the listen function from listen.js
const listen = require("./routes/listen");
const PORT = process.env.PORT || 3000;
listen.listen(server, PORT);
