class SocketServices {
    constructor(io) {
        this.io = io;
        this.initializeSocket();
    }

    initializeSocket() {
        this.io.on("connection", (socket) => {
            console.log("New socket connection made: ", socket);

            this.createRoomEvents(socket);
            this.createChunkStreamingEvents(socket);
        });

        this.io.on("disconnect", (socket) => {
            console.log("Socket connection dropped: ", socket);
        });
    }

    createRoomEvents(socket) {
        socket.on("join-room", ({ username, roomId }) => {
            socket.join(data.roomId);
            console.log("Joined the room: ", username);

            socket.broadcast.to(roomId).emit("join-notification", `${username} joined the room.`);
        });

        socket.on("leave-room", ({ username, roomId }) => {
            socket.leave(roomId);
            console.log("Left the room : ", username);

            socket.broadcast.to(roomId).emit("left-notification", `${username} left the room.`);
        });
    }

    createChunkStreamingEvents(socket) {
        socket.on("send-chunk", ({ roomId }) => {
            const { chunk, filename, isLastChunk } = data;

            socket.broadcast.to(roomId).emit("receive-chunk", {
                chunk,
                filename,
                isLastChunk,
            });
        });
    }
}

export default SocketServices;
