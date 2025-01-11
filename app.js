import express from "express";
import http from "http";
import { Server } from "socket.io";
import SocketServices from "./services/socketServices.js";

const app = express();
const appServer = http.createServer(app);

const io = new Server(appServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true,
    },
});

app.get("/", (req, res) => {
    res.send("Server is running...");
});

const socketServices = new SocketServices(io);

const PORT = process.env.PORT || 5005;

appServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...`);
});
