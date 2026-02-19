export interface User {
  id: string;
  username: string;
  password: string;
  displayName: string;
  phoneNumber: string;
  avatarUrl?: string;
  createdAt: Date;
}

export interface CreateUserRequest {
  username: string;
  password: string;
  displayName: string;
  phoneNumber: string;
  avatarUrl?: string;
}

export interface MessageType {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
  attachments?: Attachment[];
  readReceipts: ReadReceipt[]
}

export interface CreateMessage {
  chatId: string;
  senderId: string;
  content: string;
  attachments?: Attachment[];
}

export interface Attachment {
  id: string;
  messageId: string;
  type: "image" | "video" | "file";
  url: string;
  metadata?: Record<string, unknown>;
}

export interface Chat {
  id: string;
  type: "private" | "group";
  createdAt: Date;
  updatedAt: Date;
  participants: Participant[];
  messages: MessageType[]
}

export interface CreateChatRequest {
  userId1: string;
  userId2: string;
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
