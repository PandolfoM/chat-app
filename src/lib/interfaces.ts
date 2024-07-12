export interface ChatI {
  chatId: string;
  lastMessage: string;
  receiverId: string;
  updatedAt: number;
}

export interface UserChatsI {
  chats: [ChatI];
}
