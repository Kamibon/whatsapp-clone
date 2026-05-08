import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {
  Chat,
  ChatCreatedResponse,
  CreateChatRequest,
  CreateMessageRequest,
  MessageType,
  PromiseStatus,
} from "../types/interfaces";
import { create, findAll, findById } from "./service";

interface State {
  selectedChat: string | null;
  findAllChatsResponse: Chat[];
  findAllChatsStatus: PromiseStatus;
  createChatStatus: PromiseStatus;
  createChatResponse?: Chat;
  addMessageToChatStatus: PromiseStatus;
  findMessagesByChatResponse: MessageType[];
  findMessagesByChatStatus: PromiseStatus;
}

const initialState: State = {
  selectedChat: null,
  findAllChatsResponse: [],
  findAllChatsStatus: "idle",
  createChatStatus: "idle",
  addMessageToChatStatus: "idle",
  findMessagesByChatResponse: [],
  findMessagesByChatStatus: "idle",
};

const url = "/api/chats";

export const findAllChats = createAsyncThunk(
  "chat/findAll",
  async (id: string) => {
    return findAll<Chat>(url, id);
  },
);

export const createChat = createAsyncThunk(
  "chat/create",
  async (body: CreateChatRequest) => {
    return create<CreateChatRequest, ChatCreatedResponse>(url, body);
  },
);

export const findMessagesByChatId = createAsyncThunk(
  "chat/findMessages",
  async (id: string) => {
    return findById<MessageType[]>(url + "/messages/", id);
  },
);

export const addMessageToChat = createAsyncThunk(
  "chat/createMessage",
  async (body: CreateMessageRequest) => {
    try {
      await axios.post(url + "/messages/" + body.chatId, body);
    } catch (error) {
      console.log(error);
    }
  },
);

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setSelectedChat: (state, action) => {
      state.selectedChat = action.payload;
    },
    setCreateChatStatus: (state, action) => {
      state.createChatStatus = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(findAllChats.fulfilled, (state, action) => {
      state.findAllChatsResponse = action.payload;
      state.findAllChatsStatus = "success";
    });
    builder.addCase(findAllChats.pending, (state) => {
      state.findAllChatsStatus = "loading";
    });
    builder.addCase(findAllChats.rejected, (state) => {
      state.findAllChatsStatus = "failed";
    });
    builder.addCase(createChat.fulfilled, (state, action) => {
      state.createChatStatus = "success";
      state.createChatResponse = action.payload.chat;
    });
    builder.addCase(createChat.pending, (state) => {
      state.createChatStatus = "loading";
    });
    builder.addCase(createChat.rejected, (state) => {
      state.createChatStatus = "failed";
    });
    builder.addCase(addMessageToChat.fulfilled, (state) => {
      state.addMessageToChatStatus = "success";
    });
    builder.addCase(addMessageToChat.pending, (state) => {
      state.addMessageToChatStatus = "loading";
    });
    builder.addCase(addMessageToChat.rejected, (state) => {
      state.addMessageToChatStatus = "failed";
    });
    builder.addCase(findMessagesByChatId.fulfilled, (state, action) => {
      state.findMessagesByChatResponse = action.payload;
      state.findMessagesByChatStatus = "success";
    });
    builder.addCase(findMessagesByChatId.pending, (state) => {
      state.findMessagesByChatStatus = "loading";
    });
    builder.addCase(findMessagesByChatId.rejected, (state) => {
      state.findMessagesByChatStatus = "failed";
    });
  },
});

export const { setCreateChatStatus, setSelectedChat } = chatSlice.actions;
export default chatSlice.reducer;
