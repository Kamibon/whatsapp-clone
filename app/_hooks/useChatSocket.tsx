import { SetStateAction, useEffect, useState } from "react";
import { DefaultEventsMap } from "socket.io";
import { io, Socket } from "socket.io-client";
import { addMessageToChat, findMessagesByChatId } from "../_redux/chatSlice";
import { useAppDispatch, useAppSelector } from "../_redux/store";
import { MessageType } from "../types/interfaces";

export const useChatSocket = (
  userId: string,
  setMessages: (args: SetStateAction<MessageType[]>) => void,
) => {
  const [input, setInput] = useState("");

  const [socket, setSocket] = useState<Socket<
    DefaultEventsMap,
    DefaultEventsMap
  > | null>(null);

  const dispatch = useAppDispatch();

  const chatState = useAppSelector((state) => state.chat);

  useEffect(() => {
    try {
      const socketInstance = io("http://localhost:3001", {
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        transports: ["websocket"],
        auth: {
          userId,
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
  }, [chatState.selectedChat]);

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
        dispatch(findMessagesByChatId(chatState.selectedChat!));
      }, 500);
      setInput("");
    } catch (error) {
      alert("Could not send message:" + error.message);
    }
  };

  return { send, socket, input, setInput };
};
