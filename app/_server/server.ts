import express from "express";
import http from "http";
import { Server } from "socket.io";
import "dotenv/config";
import { decode } from "next-auth/jwt";
import { prisma } from "../lib/prisma";

const server = express();

const httpServer = http.createServer(server);

const appUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
const port = process.env.PORT ?? 3001;

const io = new Server(httpServer, {
  cors: {
    origin: appUrl,
    methods: ["GET", "POST"],
  },
});

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Token mancante"));
    }

    const decoded = await decode({
      token,
      secret: process.env.NEXTAUTH_SECRET!,
    });

    if (!decoded?.id) {
      return next(new Error("Token non valido"));
    }

    socket.data.userId = decoded.id;

    next();
  } catch (error) {
    next(new Error("Autenticazione fallita"));
  }
});

io.on("connection", (socket) => {
  const userId = socket.data.userId;

  console.log("Utente autenticato:", userId);

  socket.on("joinRoom", async ({ chatId }) => {
    if (!chatId || !userId) return;

    const participant = await prisma.participant.findUnique({
      where: {
        userId_chatId: {
          userId: socket.data.userId,
          chatId,
        },
      },
    });

    if (!participant) return;

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

   const userId = socket.data.userId;

    const participant = await prisma.participant.findUnique({
      where: {
        userId_chatId: {
          userId: socket.data.userId,
          chatId,
        },
      },
    });

    if (!participant) return;

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
