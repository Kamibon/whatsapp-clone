"use client";
import { useState } from "react";
import Avatar from "./_components/avatar";
import { ChatListElement } from "./_components/chatListElement";
import Searchbar from "./_components/searchBar";
import { MenuIcon } from "./_icons/menu";
import { Microphone } from "./_icons/microphone";
import { Paperclip } from "./_icons/paperclip";
import { Smile } from "./_icons/smile";
import { createChat, setSelectedChat } from "./_redux/chatSlice";

import EmojiPicker from "emoji-picker-react";
import React from "react";
import { Message } from "./_components/message";
import { useChat } from "./_hooks/useChat";
import { useChatSocket } from "./_hooks/useChatSocket";
import { Logout } from "./_icons/logout";
import { MessageIcon } from "./_icons/message";
import { SendIcon } from "./_icons/send";
import { isDifferentDay } from "./lib/utils";
import { useAuth } from "./_hooks/useAuth";
import { useGenerateMessages } from "./_hooks/useGenerateMessages";

export default function Chat() {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [newChat, setNewChat] = useState(false);
  const [filter, setFilter] = useState("");

  const {
    dispatch,
    messages,
    setMessages,
    currentChat,
    userState,
    chatState,
    messagesEndRef,
  } = useChat();
  const { userId } = useAuth();
  const { input, send, setInput, socket } = useChatSocket(userId, setMessages);
  const {component} = useGenerateMessages(messages, currentChat!)

  return (
    <div className="min-h-screen mt-[-25%] sm:mt-[-8%] flex justify-center fixed px-4 w-full z-20">
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
              {component}
              <div ref={messagesEndRef} />
            </div>
            <div className="h-[10%] bg-gray-200 flex items-center gap-2 overflow-x-scroll  px-2 relative">
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
              <button className="ml-[-18%] sm:ml-0" onClick={() => send()}>
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
