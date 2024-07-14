import {
  faChevronLeft,
  faEllipsisV,
  faMagnifyingGlass,
  faPhone,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/context";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./Dropdown";
import { ChatContext } from "../context/chatContext";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { cn } from "../lib/utils";
import { Input } from "./Input";
import { AppContext } from "../context/appContext";

function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { search, setSearch } = useContext(AppContext);
  const [isSearch, setIsSearch] = useState<boolean>(false);
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const { user, changeBlock, isReceiverBlocked, isCurrentUserBlocked } =
    useContext(ChatContext);

  const handleSignout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  const handleBlock = async () => {
    if (!user) return;

    const userDocRef = doc(db, "users", currentUser?.uid as string);

    try {
      await updateDoc(userDocRef, {
        blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
      });
      changeBlock();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <nav className="flex flex-col items-center justify-between px-5 pt-5 pb-10 gap-4">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center justify-center gap-2">
          {location.pathname !== "/" && (
            <FontAwesomeIcon
              icon={faChevronLeft}
              size="lg"
              className="pr-2 cursor-pointer"
              onClick={() => navigate(-1)}
            />
          )}
          <div className="bg-primary h-12 aspect-square rounded-full flex items-center justify-center">
            <FontAwesomeIcon icon={faUser} size="xl" className="text-white" />
          </div>
          <div>
            {location.pathname === "/" ? (
              <h3>{currentUser?.displayName}</h3>
            ) : (
              <h3>{user?.username}</h3>
            )}
            {location.pathname === "/" ? (
              <p className="text-xs">💼 Working</p>
            ) : (
              <div className="text-xs flex items-center gap-1">
                <div
                  className={cn(
                    isCurrentUserBlocked || isReceiverBlocked
                      ? "bg-zinc-500"
                      : "bg-success",
                    "w-3 h-3 aspect-square rounded-full"
                  )}
                />
                {isCurrentUserBlocked || isReceiverBlocked
                  ? "Offline"
                  : "Online"}
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-5 items-center">
          {setIsSearch ? (
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              onClick={() => setIsSearch(!isSearch)}
            />
          ) : (
            <FontAwesomeIcon icon={faPhone} />
          )}
          {location.pathname === "/" ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <FontAwesomeIcon icon={faEllipsisV} />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSignout()}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <FontAwesomeIcon icon={faEllipsisV} />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={handleBlock}
                  className="cursor-pointer">
                  {isReceiverBlocked ? "Unblock" : "Block"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
      {isSearch && (
        <Input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
        />
      )}
    </nav>
  );
}

export default NavBar;
