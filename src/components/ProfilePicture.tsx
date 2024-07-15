import { useContext } from "react";
import { AuthContext } from "../auth/context";
import { cn, getInitials } from "../lib/utils";

function ProfilePicture({
  className,
  image,
  ...props
}: {
  className?: string;
  image?: any;
}) {
  const { currentUserDoc } = useContext(AuthContext);
  return (
    <div
      {...props}
      className={cn(
        "w-20 h-20 aspect-square text-3xl text-white rounded-full flex items-center justify-center shadow-xl overflow-hidden",
        currentUserDoc?.pfp ? "bg-transparent" : "bg-primary",
        className
      )}>
      {currentUserDoc && (
        <>
          {currentUserDoc.pfp ? (
            <img
              className="object-cover"
              src={image ? image : currentUserDoc.pfp}
              alt={`${currentUserDoc.username} profile picture`}
            />
          ) : (
            getInitials(currentUserDoc?.username as string)
          )}
        </>
      )}
    </div>
  );
}

export default ProfilePicture;
