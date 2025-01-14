import express from "express";
import http from "http";
import { Server } from "socket.io";
import SocketServices from "./services/socketServices.js";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const appServer = http.createServer(app);

dotenv.config({ path: ".env" });

const corsOptions = {
    origin: process.env.CLIENT_URL,
    credentials: true,
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

const io = new Server(appServer, {
    cors: {
        origin: process.env.CLIENT_URL,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type"],
        credentials: true,
    },
});
app.use("/public", express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.send("Server is running...");
});

const socketServices = new SocketServices(io);

const PORT = process.env.PORT || 6221;

appServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...`);
});
