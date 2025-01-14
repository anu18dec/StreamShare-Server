class SocketServices {
    constructor(io) {
        this.io = io;
        this.initializeSocket();
        this.rooms = new Map();
    }

    initializeSocket() {
        this.io.on("connection", (socket) => {
            console.log("New socket connection made: ", socket.id);

            this.createRoomEvents(socket);
            this.createChunkStreamingEvents(socket);
            this.createMemberRequestEvent(socket);
        });

        this.io.on("disconnect", (socket) => {
            console.log("Socket connection dropped: ", socket);
        });
    }

    createRoomEvents(socket) {
        socket.on("join-room", ({ username, roomId, socketId }) => {
            socket.join(roomId);

            console.log("Joined the room: ", username, roomId);

            this.setRoomMembers(roomId, { username, socketId });

            console.log(this.rooms.get(roomId));
            socket.to(roomId).emit("join-notification", this.getRoomMembers(roomId));
        });

        socket.on("leave-room", ({ username, roomId, socketId }) => {
            this.removeRoomMembers(roomId, { username, socketId });

            socket.leave(roomId);
            console.log("Left the room : ", username);

            socket.to(roomId).emit("left-notification", this.getRoomMembers(roomId));
        });
    }

    createChunkStreamingEvents(socket) {
        socket.on("send-chunk", (data) => {
            const { chunk, filename, isLastChunk, roomId } = data;

            socket.broadcast.to(roomId).emit("receive-chunk", {
                chunk,
                filename,
                isLastChunk,
            });
        });
    }

    createMemberRequestEvent(socket) {
        socket.on("req-members", (roomId) => {
            socket.emit("res-members", this.getRoomMembers(roomId));
        });
    }

    setRoomMembers(roomId, { username, socketId }) {
        if (this.rooms.has(roomId)) {
            this.rooms.get(roomId).set(username, socketId);
        } else {
            this.rooms.set(roomId, new Map().set(username, socketId));
        }
    }

    removeRoomMembers(roomId, { username, socketId }) {
        if (this.rooms.has(roomId)) {
            this.rooms.get(roomId).delete(username);
        }
    }

    destroyRoom(roomId) {
        this.rooms.delete(roomId);
    }

    getRoomMembers(roomId) {
        let members = [];
        if (this.rooms.has(roomId)) {
            this.rooms.get(roomId).forEach((value, key) => {
                console.log(key, value);
                members.push({ username: key, socketId: value });
            });
        }
        return members;
    }
}

export default SocketServices;
