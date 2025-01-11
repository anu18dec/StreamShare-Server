import express from "express";
import http from "http";
import { Server } from "socket.io";
import SocketServices from "./services/socketServices.js";
import cors from "cors";
import dotenv from "dotenv";

const app = express();
const appServer = http.createServer(app);

dotenv.config({ path: ".env" });

// const corsOptions = {
//     origin: process.env.CLIENT_URL,
//     credentials: true,
//     optionsSuccessStatus: 200,
// };

// app.use(cors(corsOptions));

app.use(
    cors({
        origin: [process.env.CLIENT_URL],
        credentials: true,
    })
);

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", process.env.CLIENT_URL);
    res.header("Access-Control-Allow-Credentials", "true");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin,Content-Type, Authorization, x-id, Content-Length, X-Requested-With"
    );
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
});

const io = new Server(appServer, {
    cors: {
        origin: process.env.CLIENT_URL,
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"],
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
