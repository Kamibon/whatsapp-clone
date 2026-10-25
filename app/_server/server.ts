import express from "express";
import http from "http";
import { Server } from "socket.io";
import "dotenv/config";

const server = express();

const httpServer = http.createServer(server);

const appUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000"
const port = process.env.PORT ?? 3001

function generateRoomId(user1: string, user2: string) {
  return [user1, user2].sort().join("_");
}

const io = new Server(httpServer, {
  cors: {
    origin: appUrl,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
 // Da sostituire con un'identità autenticata e verificata
  const userId = socket.data.userId;

  console.log("Utente connesso:", userId);

  socket.on("joinRoom", async ({ chatId }) => {
    // TODO: verifica nel database che l'utente autenticato sia un partecipante della chat.
    if (!chatId || !userId) return;

    socket.join(chatId);
    console.log(`Utente ${userId} entrato nella chat ${chatId}`);
  });

  socket.on("message", async ({ chatId, text }) => {
    if (
      typeof chatId !== "string" ||
      typeof text !== "string" ||
      !text.trim()
    ) {
      return;
    }

    // TODO: verifica che userId appartenga a chatId prima di accettare e distribuire il messaggio.

    io.to(chatId).emit("message", {
      chatId,
      text: text.trim(),
      senderId: userId,
    });
  });

  socket.on("disconnect", () => {
    console.log("Un utente si è disconnesso");
  });

 
});

httpServer.listen(port, () => {
  console.log("Server in ascolto sulla porta:", port);
});
