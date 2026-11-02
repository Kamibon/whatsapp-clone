import { DefaultSession } from "next-auth";

export interface User {
  id: string;
  username: string;
  password: string;
  displayName: string;
  phoneNumber: string;
  avatarUrl: string | null;
  createdAt: Date;
}

export type CreateUserRequest = Omit<User, "id" | "createdAt">;

export type UserResponse = Omit<User, "password">;

export interface MessageType {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
  attachments?: Attachment[];
  readReceipts: ReadReceipt[];
}

export type CreateMessageRequest = Omit<
  MessageType,
  "id" | "createdAt" | "updatedAt"
>;

export interface Attachment {
  id: string;
  messageId: string;
  type: "image" | "video" | "file";
  url: string;
  metadata?: Record<string, unknown>;
}

export interface Chat {
  id: string;
  name?: string
  type: "PRIVATE" | "GROUP";
  createdAt: Date;
  updatedAt: Date;
  participants: Participant[];
  messages: MessageType[];
}

export interface CreateChatRequest {
  participants: string[];
  name?: string
}

export interface ChatCreatedResponse {
  message: string;
  chat: Chat;
}

export interface Participant {
  userId: string;
  chatId: string;
  user: User;
  role: "member" | "admin";
  joinedAt: Date;
}

export interface TypingEvent {
  chatId: string;
  userId: string;
  isTyping: boolean;
  timestamp: Date;
}

export interface ReadReceipt {
  messageId: string;
  userId: string;
  readAt: Date;
}

export type PromiseStatus = "idle" | "loading" | "failed" | "success";

export interface PaginatedResponse<T> {
  data: T[];
  hasMore: boolean;
  page: number;
  limit: number;
}

export interface ParamsWithId {
  params: Promise<{ id: string }>;
}

export interface DefaultSessionWithId extends DefaultSession {
  id: number;
}
