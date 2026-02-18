import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const server = express();

const httpServer = http.createServer(server);

function generateRoomId(user1: string, user2: string) {
  return [user1, user2].sort().join("_");
}

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  const userId = socket.handshake.auth.userId;
  socket.join(userId);

  console.log("Un utente si è connesso con id:", userId);

  socket.on("message", ({ roomId, text, senderId }) => {
    console.log("Messaggio ricevuto:", text);
    io.to(roomId).emit("message", {
      text,
      senderId,
    });
  });

  socket.on("disconnect", () => {
    console.log("Un utente si è disconnesso");
  });

  socket.on("joinRoom", ({ otherUserId }) => {
    const roomId = generateRoomId(userId, otherUserId);
    socket.join(roomId);
  });
});

httpServer.listen(3001, () => {
  console.log("Server in ascolto sulla porta 3001");
});
