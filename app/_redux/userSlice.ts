import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CreateUserRequest, PromiseStatus, User } from "../types/interfaces";
import { create, findAll, findById, remove } from "./service";

interface State {
  findAllUsersResponse: User[];
  findAllUsersStatus: PromiseStatus;
  findUserByIdResponse?: User;
  findUserByIdStatus: PromiseStatus;
  createUserStatus: PromiseStatus;
}

const initialState: State = {
  findAllUsersResponse: [],
  findAllUsersStatus: "idle",
  findUserByIdStatus: "idle",
  createUserStatus: "idle",
};

const url = "/api/users";

export const findAllUsers = createAsyncThunk("user/findAll", async () => {
  return findAll<User>(url);
});

export const findUserById = createAsyncThunk(
  "user/findById",
  async (id: string) => {
    return findById<User>(url, id);
  },
);

export const createUser = createAsyncThunk(
  "user/create",
  async (request: CreateUserRequest) => {
    return create<CreateUserRequest, User>(url, request);
  },
);

export const deleteUser = createAsyncThunk(
  "user/delete",
  async (id: string) => {
    return remove<User>(url, id);
  },
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(findAllUsers.fulfilled, (state, action) => {
      state.findAllUsersResponse = action.payload;
      state.findAllUsersStatus = "success";
    });
    builder.addCase(findAllUsers.rejected, (state) => {
      state.findAllUsersStatus = "failed";
    });
    builder.addCase(findAllUsers.pending, (state) => {
      state.findAllUsersStatus = "loading";
    });
    builder.addCase(findUserById.fulfilled, (state, action) => {
      state.findUserByIdResponse = action.payload;
      state.findUserByIdStatus = "success";
    });
    builder.addCase(findUserById.rejected, (state) => {
      state.findUserByIdStatus = "failed";
    });
    builder.addCase(findUserById.pending, (state) => {
      state.findUserByIdStatus = "loading";
    });
    builder.addCase(createUser.fulfilled, (state, action) => {
      state.createUserStatus = "success";
    });
    builder.addCase(createUser.rejected, (state) => {
      state.createUserStatus = "failed";
    });
    builder.addCase(createUser.pending, (state) => {
      state.createUserStatus = "loading";
    });
  },
});

export const {} = userSlice.actions;
export default userSlice.reducer;
