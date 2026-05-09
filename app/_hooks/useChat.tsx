import { useEffect, useMemo, useRef, useState } from "react";
import {
  findAllChats,
  findMessagesByChatId,
  setCreateChatStatus,
  setCurrentPage,
  setSelectedChat,
} from "../_redux/chatSlice";
import { useAppDispatch, useAppSelector } from "../_redux/store";
import { findAllUsers } from "../_redux/userSlice";
import { MessageType } from "../types/interfaces";
import { useAuth } from "./useAuth";

export const useChat = () => {
  const messagesEndRef = useRef(null);
  const messageContainerRef = useRef(null)

  const dispatch = useAppDispatch();

  const { userId } = useAuth();

  const [messages, setMessages] = useState<MessageType[]>([]);

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
    if (userId) dispatch(findAllChats(userId));
  }, [userId]);

  useEffect(() => {
    dispatch(setCurrentPage(1));
    if (chatState.selectedChat) {
      dispatch(
        findMessagesByChatId({
          id: chatState.selectedChat!,
          page: 1,
          limit: chatState.numberOfMessagesLimit,
        }),
      );
    }
  }, [chatState.selectedChat]);

  useEffect(() => {
    if (chatState.findMessagesByChatStatus === "success") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMessages(chatState.findMessagesByChatResponse);
    }
  }, [chatState.findMessagesByChatStatus]);

  useEffect(() => {
    if (messagesEndRef.current && chatState.currentPage === 1) {
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
    messageContainerRef,
    messagesEndRef,
  };
};
