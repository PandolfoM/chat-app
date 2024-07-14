import React from "react";
import { ChatPromiseData } from "../pages/Home";
import Button from "./Button";
import User from "./User";

const ChatList = React.memo(
  ({
    chats,
    handleSelect,
  }: {
    chats: ChatPromiseData[];
    handleSelect: (chat: ChatPromiseData) => void;
  }) => {
    return (
      <>
        {chats.length > 0 && (
          <div className="flex flex-col gap-3">
            <h3 className="opacity-60 text-sm">Conversation</h3>
            <div className="flex flex-col gap-7">
              {chats.map((chat) => (
                <Button
                  variant="ghost"
                  key={chat.chatId}
                  onClick={() => handleSelect(chat)}>
                  <User user={chat.user} chat={chat} />
                </Button>
              ))}
            </div>
          </div>
        )}
      </>
    );
  }
);

export default ChatList;
