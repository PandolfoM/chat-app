import { UserDocI } from "../auth/context";
import { cn, formatDate, getInitials } from "../lib/utils";
import { ChatPromiseData } from "../pages/Home";
import { format, isToday, isYesterday } from "date-fns";

type Props = {
  user: UserDocI;
  chat?: ChatPromiseData;
};

function User({ user, chat }: Props) {
  return (
    <div className="flex gap-3 w-full">
      <span className="w-11 h-11 aspect-square bg-primary text-white rounded-full flex items-center justify-center ring-2 ring-offset-2 ring-warning">
        {getInitials(user.username)}
      </span>
      <section className="flex items-center gap-2 w-full relative">
        <div
          className={cn(
            chat?.lastMessage !== "" && "pb-5",
            "flex flex-col w-full justify-end"
          )}>
          <span className="flex justify-between">
            <p className="text-sm font-semibold">{user.username}</p>
            {chat && (
              <p className="font-light text-xs text-black/60">
                {formatDate(chat.updatedAt)}
              </p>
            )}
          </span>
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
