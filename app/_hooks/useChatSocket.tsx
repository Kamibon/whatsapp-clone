import { SetStateAction, useEffect, useState } from "react";
import { DefaultEventsMap } from "socket.io";
import { io, Socket } from "socket.io-client";
import {
  addMessageToChat,
  findMessagesByChatId,
  setCurrentPage,
  setFindMessagesResponse,
} from "../_redux/chatSlice";
import { useAppDispatch, useAppSelector } from "../_redux/store";
import { MessageType } from "../types/interfaces";
import { useAuth } from "./useAuth";

export const useChatSocket = (
  setMessages: (args: SetStateAction<MessageType[]>) => void,
) => {
  const [input, setInput] = useState("");

  const [socket, setSocket] = useState<Socket<
    DefaultEventsMap,
    DefaultEventsMap
  > | null>(null);

  const dispatch = useAppDispatch();

  const chatState = useAppSelector((state) => state.chat);

  const serverUrl = process.env.SERVER_URL ?? "http://localhost:3001";

  const { userId, accessToken } = useAuth();

  useEffect(() => {
    if(!userId || !accessToken) return
    try {
      const socketInstance = io(serverUrl, {
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        transports: ["websocket"],
        auth: {
          token: accessToken,
        },
      });

      socketInstance.on("message", (msg) => {
        setMessages((prevMessages) => [...prevMessages, msg]);
      });

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSocket(socketInstance);

      return () => {
        socketInstance.disconnect();
      };
    } catch (error) {
      console.log(error);
    }
  }, [userId, accessToken]);

  const send = () => {
    if (!socket) return;

    try {
      socket.emit("message", {
        roomId: chatState.selectedChat,
        text: input,
        senderId: userId,
      });
      dispatch(
        addMessageToChat({
          chatId: chatState.selectedChat!,
          senderId: userId,
          content: input,
          readReceipts: [],
        }),
      );
      setTimeout(() => {
        dispatch(setFindMessagesResponse([]));
        dispatch(
          findMessagesByChatId({
            id: chatState.selectedChat!,
            page: 1,
            limit: chatState.numberOfMessagesLimit,
          }),
        );
        dispatch(setCurrentPage(1));
      }, 500);
      setInput("");
    } catch (error) {
      alert("Could not send message");
    }
  };

  return { send, socket, input, setInput };
};
