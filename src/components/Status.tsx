import { useContext, useEffect, useState } from "react";
import { AuthContext, UserDocI } from "../auth/context";
import { useLocation } from "react-router-dom";
import { ChatContext } from "../context/chatContext";
import { cn } from "../lib/utils";

function Status({ user }: { user: UserDocI }) {
  const location = useLocation();
  const { isCurrentUserBlocked, isReceiverBlocked } = useContext(ChatContext);

  return (
    <>
      {location.pathname !== "/chat" ? (
        <div className="text-xs flex items-center gap-1">
          <div
            className={cn(
              user?.status === "online"
                ? "bg-success"
                : user?.status === "offline"
                ? "bg-zinc-500"
                : user?.status === "away"
                ? "bg-warning"
                : "bg-error",
              "w-3 h-3 aspect-square rounded-full"
            )}
          />
          <p className={cn(user?.status && "capitalize")}>
            {user?.status === "dnd"
              ? "Do Not Disturb"
              : user?.status
              ? user.status
              : user?.statusMsg}
          </p>
        </div>
      ) : (
        // <p className="text-xs cursor-default">💼 Working</p>
        <div className="text-xs flex items-center gap-1">
          <div
            className={cn(
              isCurrentUserBlocked || isReceiverBlocked
                ? "bg-zinc-500"
                : user?.status === "online"
                ? "bg-success"
                : user?.status === "offline"
                ? "bg-zinc-500"
                : user?.status === "away"
                ? "bg-warning"
                : "bg-error",
              "w-3 h-3 aspect-square rounded-full"
            )}
          />
          {isCurrentUserBlocked || isReceiverBlocked ? (
            "Offline"
          ) : (
            <p className={cn(user?.status && "capitalize")}>
              {user?.status === "dnd"
                ? "Do Not Disturb"
                : user?.status
                ? user.status
                : user?.statusMsg}
            </p>
          )}
        </div>
      )}
    </>
  );
}

export default Status;
