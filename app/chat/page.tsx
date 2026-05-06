"use client";
import Searchbar from "../_components/searchBar";
import Avatar from "../_components/avatar";
import { useRef, useState } from "react";
import { ChatListElement } from "../_components/chatListElement";
import { Paperclip } from "../_icons/paperclip";
import { MenuIcon } from "../_icons/menu";
import { Smile } from "../_icons/smile";
import { Microphone } from "../_icons/microphone";
import { useAppDispatch, useAppSelector } from "../_redux/store";
import { useEffect } from "react";
import { findAllUsers } from "../_redux/userSlice";
import { useSession } from "next-auth/react";
import io, { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io";
import {
  addMessageToChat,
  createChat,
  findAllChats,
  findMessagesByChatId,
  setCreateChatStatus,
  setSelectedChat,
} from "../_redux/chatSlice";

import { MessageType } from "../types/interfaces";
import { Message } from "../_components/message";
import { SendIcon } from "../_icons/send";
import { Logout } from "../_icons/logout";
import React from "react";
import { isDifferentDay } from "../lib/utils";
import EmojiPicker from "emoji-picker-react";
import { MessageIcon } from "../_icons/message";

export default function Chat() {
  const userState = useAppSelector((state) => state.user);
  const chatState = useAppSelector((state) => state.chat);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [socket, setSocket] = useState<Socket<
    DefaultEventsMap,
    DefaultEventsMap
  > | null>(null);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [newChat, setNewChat] = useState(false);
  const [filter, setFilter] = useState("");

  const messagesEndRef = useRef(null);

  const session = useSession();
  const dispatch = useAppDispatch();

  const userId = session ? session.data?.user?.id : "";
  const currentChat = chatState.selectedChat
    ? chatState.findAllChatsResponse.find(
        (i) => i.id === chatState.selectedChat,
      )
    : null;

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
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (session.data?.user?.id.trim()) dispatch(findAllChats(userId));
  }, [session]);

  useEffect(() => {
    if (chatState.selectedChat)
      dispatch(findMessagesByChatId(chatState.selectedChat));
  }, [chatState.selectedChat]);

  useEffect(() => {
    if (chatState.findMessagesByChatStatus === "success") {
      setMessages(chatState.findMessagesByChatResponse);
    }
  }, [chatState.findMessagesByChatStatus]);

  useEffect(() => {
    try {
      const socketInstance = io("http://localhost:3001", {
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        transports: ["websocket"],
        auth: {
          userId: userId,
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
        }),
      );
      setTimeout(() => {
        dispatch(findMessagesByChatId(chatState.selectedChat!));
      }, 500);
      setInput("");
    } catch (error) {
      alert("Could not send message", error.message);
    }
  };

  return (
    <div className="min-h-screen mt-[-10%] lg:mt-[-5%] flex justify-center fixed px-4 w-full z-20">
      <div className=" h-150 flex flex-row z-20 w-full">
        <div className="bg-white w-[40%] relative">
          <div className="h-[15%] bg-gray-300 flex items-center justify-between px-4">
            <Avatar size="md" />
            <button>
              <Logout />
            </button>
          </div>
          {newChat && (
            <Searchbar
              placeholder="Cerca tra gli utenti"
              onChangeText={(text) => setFilter(text)}
            />
          )}
          {newChat &&
            userState.findAllUsersResponse
              .filter((user) =>
                user.username.toLowerCase().includes(filter.toLowerCase()),
              )
              .map((item) => (
                <ChatListElement
                  onClick={() => {
                    dispatch(createChat({ userId1: userId, userId2: item.id }));
                    setNewChat(false);
                    socket?.emit("joinRoom", item.id);
                  }}
                  contactName={
                    userState.findAllUsersResponse.find((i) => i.id === item.id)
                      ?.username ?? ""
                  }
                  key={item.id}
                />
              ))}
          {!newChat &&
            chatState.findAllChatsResponse.map((item) => (
              <ChatListElement
                onClick={() => {
                  dispatch(setSelectedChat(item.id));
                  socket?.emit("joinRoom", item.id);
                }}
                contactName={
                  item.participants.find((elem) => elem.userId !== userId)!.user
                    .username
                }
                lastMessage={
                  item.messages.length > 0 ? item.messages[0].content : ""
                }
                lastMessageDate={
                  item.messages.length > 0
                    ? new Date(item.messages[0].createdAt).toLocaleTimeString(
                        [],
                        { hour: "2-digit", minute: "2-digit" },
                      )
                    : ""
                }
                key={item.id}
              />
            ))}
          <button
            onClick={() => setNewChat((prev) => !prev)}
            className="size-12 cursor-pointer hover:bg-green-600 bg-green-700 flex items-center justify-center rounded-full absolute bottom-4 right-4"
          >
            <MessageIcon />
          </button>
        </div>
        {chatState.selectedChat && (
          <div className="bg-gray-500 w-[60%]">
            <div className="h-[15%] bg-gray-400 flex items-center px-4">
              <Avatar size="md" />
              <div className="grow flex items-center justify-between pl-2">
                <div className="flex flex-col  gap-1">
                  <span className="font-semibold">
                    {
                      currentChat?.participants.find(
                        (elem) => elem.userId !== userId,
                      )!.user.username
                    }
                  </span>
                </div>
                <div className="flex items-center gap-3 ">
                  <Paperclip />
                  <MenuIcon />
                </div>
              </div>
            </div>
            <div className="h-[75%] bg-green-300 flex flex-col gap-2 px-3 py-2 overflow-y-scroll">
              {messages.map((item, index) => (
                <React.Fragment key={item.id}>
                  {((messages[index - 1] &&
                    isDifferentDay(
                      new Date(messages[index - 1].createdAt),
                      new Date(messages[index].createdAt),
                    )) ||
                    !messages[index - 1]) && (
                    <div className="  flex items-center justify-center">
                      <div className="rounded-xl bg-blue-300 text-center px-1 py-2 text-blue-500">
                        {new Date(messages[index].createdAt).toLocaleDateString(
                          "it-IT",
                        )}
                      </div>
                    </div>
                  )}
                  <Message
                    fromSender={item.senderId !== userId}
                    text={item.content}
                    sentAtTime={`${new Date(item.createdAt).getHours().toString()}: 
                    ${new Date(item.createdAt).getMinutes().toString().padStart(2, "0")} `}
                    seen={item.readReceipts.some(
                      (receipt) =>
                        receipt.userId ===
                        currentChat?.participants.filter(
                          (p) => p.userId !== userId,
                        )[0].userId,
                    )}
                  />
                </React.Fragment>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="h-[10%] bg-gray-200 flex items-center gap-2 px-2 relative">
              {isPickerOpen && (
                <div className="absolute bottom-full left-0 z-10">
                  <EmojiPicker
                    onEmojiClick={(e) => setInput(input.concat(e.emoji))}
                  />
                </div>
              )}
              <div onClick={() => setIsPickerOpen((prev) => !prev)}>
                <Smile />
              </div>

              <input
                value={input}
                onSubmit={() => send()}
                onKeyDown={(e) => {
                  if (e.key === "Enter") send();
                }}
                onChange={(e) => setInput(e.target.value)}
                className="grow bg-white font-thin h-[75%] px-3 rounded-2xl text-gray-500"
              />
              <button onClick={() => send()}>
                <SendIcon />
              </button>
              <Microphone />
            </div>
          </div>
        )}
        {!chatState.selectedChat && (
          <div className="bg-gray-500 flex items-center justify-center w-[60%]">
            <span>Inizia una conversazione</span>
          </div>
        )}
      </div>
    </div>
  );
}
