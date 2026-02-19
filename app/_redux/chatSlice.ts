import { Message } from "@/generated/prisma/client";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Chat, CreateChatRequest, CreateMessage, PromiseStatus } from "../types/interfaces";
import axios from "axios";

interface State {
  selectedChat: string | null;
  findAllChatsResponse: Chat[];
  findAllChatsStatus: PromiseStatus;
  createChatStatus: PromiseStatus;
  createChatResponse?: Chat 
  addMessageToChatStatus: PromiseStatus
  findMessagesByChatResponse: Message[]
  findMessagesByChatStatus: PromiseStatus
}

const initialState: State = {
  selectedChat: null,
  findAllChatsResponse: [],
  findAllChatsStatus: "idle",
  createChatStatus: "idle",
  addMessageToChatStatus: "idle",
  findMessagesByChatResponse: [],
  findMessagesByChatStatus: "idle"
};

const url = "/api/chats";

export const findAllChats = createAsyncThunk(
  "chat/findAll",
  async (id: string) => {
    const res = await axios.get(url + "/" + id);

    return res.data;
  },
);

export const createChat = createAsyncThunk(
  "chat/create",
  async (body: CreateChatRequest) => {
    const res = await axios.post(url, body);
    return res.data;
  },
);

export const findMessagesByChatId = createAsyncThunk(
  "chat/findMessages", 
  async(id:string)=>{
    const res = await axios.get(url + "/messages/" + id);

    return res.data;
  }
)

export const addMessageToChat = createAsyncThunk(
  "chat/createMessage",
  async (body: CreateMessage) => {
    try {
      const res = await axios.post(url + "/messages/" + body.chatId, body);
      console.log(res)
    } catch (error) {
      console.log(error)
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
    setCreateChatStatus: (state, action)=>{
      state.createChatStatus = action.payload
    }
  },
  extraReducers(builder) {
    builder.addCase(findAllChats.fulfilled, (state, action) => {
      state.findAllChatsResponse = action.payload;
      state.findAllChatsStatus = "success";
    });
    builder.addCase(findAllChats.pending, (state, action) => {
      state.findAllChatsStatus = "loading";
    });
    builder.addCase(findAllChats.rejected, (state, action) => {
      state.findAllChatsStatus = "failed";
    });
    builder.addCase(createChat.fulfilled, (state, action) => {
      state.createChatStatus = "success";
      state.createChatResponse = action.payload.chat
    });
    builder.addCase(createChat.pending, (state, action) => {
      state.createChatStatus = "loading";
    });
    builder.addCase(createChat.rejected, (state, action) => {
      state.createChatStatus = "failed";
    });
    builder.addCase(addMessageToChat.fulfilled, (state, action) => {
      state.addMessageToChatStatus = "success";
    });
    builder.addCase(addMessageToChat.pending, (state, action) => {
      state.addMessageToChatStatus = "loading";
    });
    builder.addCase(addMessageToChat.rejected, (state, action) => {
      state.addMessageToChatStatus = "failed";
    });
    builder.addCase(findMessagesByChatId.fulfilled, (state, action) => {
      state.findMessagesByChatResponse = action.payload
      state.findMessagesByChatStatus = 'success'
    });
    builder.addCase(findMessagesByChatId.pending, (state, action) => {
      state.findMessagesByChatStatus = "loading";
    });
    builder.addCase(findMessagesByChatId.rejected, (state, action) => {
      state.findMessagesByChatStatus = "failed";
    });
  },
});

export const { setCreateChatStatus, setSelectedChat } = chatSlice.actions;
export default chatSlice.reducer;
