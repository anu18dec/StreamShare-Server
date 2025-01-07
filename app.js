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

const socketServices = new SocketServices(io);

appServer.listen(5002, () => {
    console.log("Server is running on port 5002...");
});
