"use client";
import { useState } from "react";
import Avatar from "./_components/avatar";
import { ChatListElement } from "./_components/chatListElement";
import Searchbar from "./_components/searchBar";
import { MenuIcon } from "./_icons/menu";
import { Microphone } from "./_icons/microphone";
import { Paperclip } from "./_icons/paperclip";
import { Smile } from "./_icons/smile";
import {
  createChat,
  findMessagesByChatId,
  setCurrentPage,
  setSelectedChat,
} from "./_redux/chatSlice";

import EmojiPicker from "emoji-picker-react";
import { useAuth } from "./_hooks/useAuth";
import { useChat } from "./_hooks/useChat";
import { useChatSocket } from "./_hooks/useChatSocket";
import { useGenerateMessages } from "./_hooks/useGenerateMessages";
import { Logout } from "./_icons/logout";
import { MessageIcon } from "./_icons/message";
import { SendIcon } from "./_icons/send";

export default function Chat() {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [newChat, setNewChat] = useState(false);
  const [newGroupChat, setNewGroupChat] = useState(false);
  const [newGroupMembers, setNewGroupMembers] = useState<string[]>([]);
  const [filter, setFilter] = useState("");

  const [showChatOnMobile, setShowChatOnMobile] = useState(false);

  const {
    dispatch,
    messages,
    setMessages,
    currentChat,
    userState,
    chatState,
    messageContainerRef,
    messagesEndRef,
  } = useChat();
  const { userId } = useAuth();
  const { input, send, setInput, socket } = useChatSocket( setMessages);
  const { component } = useGenerateMessages(messages, currentChat!);

  return (
    <div className="h-[calc(100dvh-10rem)] min-h-[400px] w-full px-2 pb-2 sm:px-4 sm:pb-4">
      <div className="mx-auto flex h-full w-full max-w-7xl overflow-hidden rounded-xl shadow-xl">
        {/* Lista chat */}
        <aside
          className={`
        h-full w-full flex-col bg-white
        md:flex md:w-[360px] md:shrink-0
        ${showChatOnMobile ? "hidden" : "flex"}
      `}
        >
          <div className="flex h-16 shrink-0 items-center justify-between bg-gray-300 px-4">
            <Avatar size="md" />
            <button>
              <Logout />
            </button>
          </div>

          {newChat && (
            <div className="shrink-0">
              <Searchbar
                placeholder="Cerca tra gli utenti"
                onChangeText={(text) => setFilter(text)}
              />
            </div>
          )}

          <div className="min-h-0 flex-1 overflow-y-auto">
            {newChat ? (
              <>
                {Array.from(
                  new Map(
                    userState.findAllUsersResponse.map((user) => [
                      user.id,
                      user,
                    ]),
                  ).values(),
                )
                  .filter((user) =>
                    user.username.toLowerCase().includes(filter.toLowerCase()),
                  )
                  .map((item) => (
                    <ChatListElement
                      key={item.id}
                      onClick={() => {
                        if (!newGroupChat) {
                          dispatch(
                            createChat({
                              participants: [userId, item.id],
                            }),
                          );
                          setNewChat(false);
                          socket?.emit("joinRoom", item.id);
                        } else {
                          setNewGroupMembers((prev) =>
                            prev.includes(item.id)
                              ? prev.filter((id) => id !== item.id)
                              : [...prev, item.id],
                          );
                        }
                      }}
                      contactName={item.username}
                      selected={newGroupMembers.includes(item.id)}
                    />
                  ))}

                {!newGroupChat && (
                  <button
                    onClick={() => setNewGroupChat(true)}
                    className="w-full cursor-pointer p-3 font-semibold hover:bg-gray-100"
                  >
                    Crea chat di gruppo
                  </button>
                )}

                {newGroupMembers.length > 0 && (
                  <button
                    onClick={() => {
                      const groupName = window.prompt("Nome del gruppo:");
                      if (!groupName) return;

                      dispatch(
                        createChat({
                          name: groupName,
                          participants: [...newGroupMembers, userId],
                        }),
                      );
                      setNewGroupChat(false);
                      setNewGroupMembers([]);
                      setNewChat(false);
                    }}
                    className="w-full cursor-pointer p-3 font-semibold hover:bg-gray-100"
                  >
                    Crea gruppo
                  </button>
                )}
              </>
            ) : (
              Array.from(
                new Map(
                  chatState.findAllChatsResponse.map((chat) => [chat.id, chat]),
                ).values(),
              ).map((item) => (
                <ChatListElement
                  key={item.id}
                  onClick={() => {
                    dispatch(setSelectedChat(item.id));
                    socket?.emit("joinRoom", item.id);
                    setShowChatOnMobile(true);
                  }}
                  chatName={item.name}
                  contactName={
                    item.name ??
                    item.participants.find((elem) => elem.userId !== userId)!
                      .user.username
                  }
                  lastMessage={
                    item.messages.length > 0 ? item.messages[0].content : ""
                  }
                  lastMessageDate={
                    item.messages.length > 0
                      ? new Date(item.messages[0].createdAt).toLocaleTimeString(
                          [],
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )
                      : ""
                  }
                />
              ))
            )}
          </div>

          <button
            onClick={() => setNewChat((prev) => !prev)}
            aria-label={newChat ? "Chiudi nuova chat" : "Nuova chat"}
            className="absolute bottom-5 right-5 z-10 flex size-12 cursor-pointer items-center justify-center rounded-full bg-green-700 text-white shadow-lg hover:bg-green-600 md:bottom-6  md:right-auto"
          >
            <MessageIcon />
          </button>
        </aside>

        {/* Conversazione */}
        <section
          className={`
        h-full min-w-0 flex-1 flex-col bg-gray-500
        ${showChatOnMobile ? "flex" : "hidden"}
        md:flex
      `}
        >
          {chatState.selectedChat ? (
            <>
              <div className="flex min-h-16 shrink-0 items-center gap-2 bg-gray-400 px-3 sm:px-4">
                <button
                  type="button"
                  onClick={() => setShowChatOnMobile(false)}
                  className="mr-1 cursor-pointer md:hidden"
                  aria-label="Torna alle chat"
                >
                  ←
                </button>

                <Avatar size="md" />

                <div className="min-w-0 flex-1 pl-1">
                  <div className="truncate font-semibold">
                    {currentChat?.name ??
                      currentChat?.participants.find(
                        (elem) => elem.userId !== userId,
                      )?.user.username}
                  </div>

                  {currentChat?.type === "GROUP" && (
                    <div className="truncate text-xs">
                      {currentChat.participants
                        .map((item) => item.user.username)
                        .join(", ")}
                    </div>
                  )}
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  <Paperclip />
                  <MenuIcon />
                </div>
              </div>

              <div
                ref={messageContainerRef}
                onScroll={(e) => {
                  const div = e.currentTarget;

                  if (div.scrollTop === 0 && chatState.hasMoreMessages) {
                    dispatch(
                      findMessagesByChatId({
                        id: chatState.selectedChat!,
                        page: chatState.currentPage + 1,
                        limit: chatState.numberOfMessagesLimit,
                      }),
                    );
                    dispatch(setCurrentPage(chatState.currentPage + 1));
                  }
                }}
                className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto bg-green-300 px-3 py-3"
              >
                {component}
                <div ref={messagesEndRef} />
              </div>

              <div className="relative flex min-h-16 shrink-0 items-center gap-2 bg-gray-200 px-2 py-2 sm:px-4">
                {isPickerOpen && (
                  <div className="absolute bottom-full left-0 z-20 max-w-full">
                    <EmojiPicker
                      onEmojiClick={(e) =>
                        setInput((prev) => prev.concat(e.emoji))
                      }
                    />
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setIsPickerOpen((prev) => !prev)}
                  aria-label="Apri emoji"
                  className="shrink-0"
                >
                  <Smile />
                </button>

                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") send();
                  }}
                  placeholder="Scrivi un messaggio..."
                  className="h-10 min-w-0 flex-1 rounded-2xl bg-white px-3 text-gray-700 outline-none"
                />

                <button
                  type="button"
                  onClick={() => send()}
                  aria-label="Invia messaggio"
                  className="shrink-0"
                >
                  <SendIcon />
                </button>

                <div className="shrink-0">
                  <Microphone />
                </div>
              </div>
            </>
          ) : (
            <div className="flex min-h-0 flex-1 items-center justify-center p-4 text-center">
              <span>Inizia una conversazione</span>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
