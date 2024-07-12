import { UserDocI } from "../auth/context";
import { cn } from "../lib/utils";

function User({ user, newChat }: { user: UserDocI; newChat?: boolean }) {
  return (
    <div className="flex gap-2 w-full">
      <span className="w-11 h-11 aspect-square bg-primary text-white rounded-full flex items-center justify-center ring-2 ring-offset-2 ring-warning">
        {getInitials(user.username)}
      </span>
      <section className="flex items-center gap-2 w-full relative">
        <div
          className={cn(
            !newChat && "pb-5",
            "flex flex-col w-full justify-end"
          )}>
          <span className="flex justify-between">
            <p className="text-sm font-semibold">{user.username}</p>
            {!newChat && (
              <p className="font-light text-xs text-black/60">8:44 PM</p>
            )}
          </span>
          {!newChat && (
            <span className="flex justify-between">
              <p className="text-sm font-light">wanna lunch with me?</p>
              <p className="text-xs text-white font-light bg-error max-w-fit min-w-5 h-5 p-1 rounded-full flex items-center justify-center">
                2
              </p>
            </span>
          )}
        </div>
        <hr className="border-none h-px bg-background absolute bottom-0 right-0 w-full" />
      </section>
    </div>
  );
}

const getInitials = (name: string) => {
  const words = name.split(" ");
  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  } else if (words.length >= 2) {
    return words[0].charAt(0).toUpperCase() + words[1].charAt(0).toUpperCase();
  }
  return "";
};

export default User;
