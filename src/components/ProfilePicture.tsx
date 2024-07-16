import { useContext } from "react";
import { AuthContext } from "../auth/context";
import { cn, getInitials } from "../lib/utils";
import { useLocation } from "react-router-dom";
import { ChatContext } from "../context/chatContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

function ProfilePicture({
  className,
  image,
  ...props
}: {
  className?: string;
  image?: any;
}) {
  const { currentUserDoc } = useContext(AuthContext);
  const { user } = useContext(ChatContext);
  const location = useLocation();

  return (
    <div
      {...props}
      className={cn(
        "w-20 h-20 aspect-square text-3xl text-white rounded-full flex items-center justify-center shadow-xl overflow-hidden",
        currentUserDoc?.pfp ? "bg-transparent" : "bg-primary",
        !image && location.pathname === "/chat" && "bg-primary",
        className
      )}>
      {(currentUserDoc || image) && (
        <>
          {location.pathname === "/chat" ? (
            <>
              {image ? (
                <img
                  className="object-cover"
                  src={image ? image : ""}
                  alt={`${user?.username} profile picture`}
                />
              ) : (
                // getInitials(user?.username as string)
                <FontAwesomeIcon icon={faUser} size="sm" />
              )}
            </>
          ) : (
            <>
              {currentUserDoc?.pfp || image ? (
                <img
                  className="object-cover"
                  src={image ? image : currentUserDoc?.pfp}
                  alt={`${currentUserDoc?.username} profile picture`}
                />
              ) : (
                // getInitials(currentUserDoc?.username as string)
                <FontAwesomeIcon icon={faUser} size="sm" />
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default ProfilePicture;
