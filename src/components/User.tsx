import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { UserDocI } from "../auth/context";
import { cn, formatDate } from "../lib/utils";
import { faCheck, faUser, faX } from "@fortawesome/free-solid-svg-icons";
import ProfilePicture from "./ProfilePicture";
import { ChatPromiseData } from "../pages/HomePages/Chats";
import Button from "./Button";
import { RequestsI } from "../lib/interfaces";

type Props = {
  user: UserDocI;
  chat?: ChatPromiseData;
  acceptFunc?: () => void;
  denyFunc?: () => void;
  cancelFunc?: () => void;
  friendReq?: RequestsI;
};

function User({
  user,
  chat,
  acceptFunc,
  denyFunc,
  cancelFunc,
  friendReq,
}: Props) {
  return (
    <div className="flex gap-3 w-full overflow-x-visible">
      <span
        className={cn(
          `w-12 h-12 aspect-square text-white rounded-full flex items-center justify-center ring-2 ring-offset-2 ring-success ring-opacity-60`,
          user.status === "online" && "ring-success",
          user.status === "away" && "ring-warning",
          user.status === "offline" && "ring-zinc-500",
          user.status === "dnd" && "ring-error"
        )}
        style={{ backgroundColor: user.pfp ? "transparent" : user.color }}>
        {user.pfp ? (
          <ProfilePicture image={user.pfp} />
        ) : (
          <FontAwesomeIcon icon={faUser} size="lg" />
        )}
      </span>
      <section className="flex items-center gap-2 w-full relative">
        <div
          className={cn(
            chat?.lastMessage !== "" && "pb-5",
            "flex flex-col w-full justify-end relative"
          )}>
          <span className="flex justify-between">
            <p className="text-sm font-semibold">{user.displayName}</p>

            {chat && (
              <p className="font-light text-xs text-black/60">
                {formatDate(chat.updatedAt)}
              </p>
            )}
          </span>
          {friendReq && (
            <span className="flex justify-between">
              <p className="font-light text-xs text-black/60 capitalize">
                {friendReq?.status}
              </p>
            </span>
          )}
          {(acceptFunc || denyFunc || cancelFunc) && (
            <span className="flex justify-end items-center gap-3 absolute right-0 top-1/2 -translate-y-1/2">
              {cancelFunc ? (
                <Button
                  variant="ghost"
                  className="p-0 bg-customGrey w-8 h-8"
                  onClick={cancelFunc}>
                  <FontAwesomeIcon icon={faX} />
                </Button>
              ) : (
                <>
                  {acceptFunc && (
                    <Button
                      variant="ghost"
                      className="p-0 bg-success w-8 h-8"
                      onClick={acceptFunc}>
                      <FontAwesomeIcon icon={faCheck} />
                    </Button>
                  )}
                  {denyFunc && (
                    <Button
                      variant="ghost"
                      className="p-0 bg-customGrey w-8 h-8"
                      onClick={denyFunc}>
                      <FontAwesomeIcon icon={faX} />
                    </Button>
                  )}
                </>
              )}
            </span>
          )}
          {chat && (
            <span className="flex justify-between items-center">
              <p className="text-sm font-light">{chat.lastMessage}</p>
              {!chat.isSeen && (
                <div className="text-xs text-white font-light bg-error max-w-fit w-4 h-4 aspect-square p-1 rounded-full flex items-center justify-center" />
              )}
            </span>
          )}
        </div>
        <hr className="border-none h-px bg-background absolute bottom-0 right-0 w-full" />
      </section>
    </div>
  );
}

export default User;
