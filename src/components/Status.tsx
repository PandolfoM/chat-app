import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../auth/context";
import { useLocation } from "react-router-dom";
import { ChatContext } from "../context/chatContext";
import { cn } from "../lib/utils";

function Status() {
  const location = useLocation();
  const { currentUserDoc } = useContext(AuthContext);
  const { isCurrentUserBlocked, isReceiverBlocked } = useContext(ChatContext);

  return (
    <>
      {location.pathname !== "/chat" ? (
        <div className="text-xs flex items-center gap-1">
          <div
            className={cn(
              currentUserDoc?.status === "online"
                ? "bg-success"
                : currentUserDoc?.status === "offline"
                ? "bg-zinc-500"
                : currentUserDoc?.status === "away"
                ? "bg-warning"
                : "bg-error",
              "w-3 h-3 aspect-square rounded-full"
            )}
          />
          <p className={cn(currentUserDoc?.status && "capitalize")}>
            {currentUserDoc?.status === "dnd"
              ? "Do Not Disturb"
              : currentUserDoc?.status
              ? currentUserDoc.status
              : currentUserDoc?.statusMsg}
          </p>
        </div>
      ) : (
        // <p className="text-xs cursor-default">💼 Working</p>
        <div className="text-xs flex items-center gap-1">
          <div
            className={cn(
              isCurrentUserBlocked || isReceiverBlocked
                ? "bg-zinc-500"
                : "bg-success",
              "w-3 h-3 aspect-square rounded-full"
            )}
          />
          {isCurrentUserBlocked || isReceiverBlocked ? "Offline" : "Online"}
        </div>
      )}
    </>
  );
}

export default Status;
