import { UserDocI } from "../auth/context";

export interface ChatI {
  chatId: string;
  lastMessage: string;
  receiverId: string;
  updatedAt: number;
}

export interface UserChatsI {
  chats: [ChatI];
}

export interface UserRequestsI {
  requests: [RequestsI];
}
export interface RequestsI {
  date: number;
  status: "outgoing" | "incoming";
  to: string | UserDocI;
}
