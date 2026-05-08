import { useSession } from "next-auth/react";
import { useRef, useMemo, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../_redux/store";
import {
  setSelectedChat,
  setCreateChatStatus,
  findAllChats,
  findMessagesByChatId,
} from "../_redux/chatSlice";
import { findAllUsers } from "../_redux/userSlice";
import { useRouter } from "next/navigation";
import { MessageType } from "../types/interfaces";
import { useAuth } from "./useAuth";

export const useChat = () => {
  const messagesEndRef = useRef(null);

  
  const dispatch = useAppDispatch();

  const {session, userId} = useAuth()

  const [messages, setMessages] = useState<MessageType[]>([]);

  const router = useRouter();

  const userState = useAppSelector((state) => state.user);
  const chatState = useAppSelector((state) => state.chat);

  const currentChat = useMemo(() => {
    return chatState.selectedChat
      ? chatState.findAllChatsResponse.find(
          (i) => i.id === chatState.selectedChat,
        )
      : null;
  }, [chatState.selectedChat, chatState.findAllChatsResponse]);

  useEffect(() => {
    if (
      chatState.createChatStatus === "success" &&
      chatState.createChatResponse
    ) {
      dispatch(setSelectedChat(chatState.createChatResponse.id));
      dispatch(setCreateChatStatus("idle"));
    }
  }, [chatState.createChatResponse, chatState.createChatStatus]);

  useEffect(() => {
    dispatch(findAllUsers());
  }, []);

  useEffect(() => {
    if (
      chatState.createChatStatus === "success" &&
      chatState.createChatResponse
    ) {
      dispatch(setSelectedChat(chatState.createChatResponse.id));
      dispatch(setCreateChatStatus("idle"));
    }
  }, [chatState.createChatResponse, chatState.createChatStatus]);

  useEffect(() => {
    if (session.status === "unauthenticated") router.replace("/login");
    if (session.data?.user?.id.trim()) dispatch(findAllChats(userId));
  }, [session]);

  useEffect(() => {
    if (chatState.selectedChat)
      dispatch(findMessagesByChatId(chatState.selectedChat));
  }, [chatState.selectedChat]);

  useEffect(() => {
    if (chatState.findMessagesByChatStatus === "success") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMessages(chatState.findMessagesByChatResponse);
    }
  }, [chatState.findMessagesByChatStatus]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return {
    dispatch,
    messages,
    setMessages,
    currentChat,
    userState,
    chatState,
    messagesEndRef,
  };
};
