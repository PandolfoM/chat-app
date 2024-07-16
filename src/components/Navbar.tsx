import {
  faChevronLeft,
  faEllipsisV,
  faMagnifyingGlass,
  faPhone,
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
import { Input } from "./Input";
import { AppContext } from "../context/appContext";
import Status from "./Status";
import ProfilePicture from "./ProfilePicture";

function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { search, setSearch } = useContext(AppContext);
  const [isSearch, setIsSearch] = useState<boolean>(false);
  const { currentUser, setCurrentUser, currentUserDoc } =
    useContext(AuthContext);
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

  const onRoute = (route: string) => {
    setIsSearch(false);
    navigate(`/${route}`);
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
          {location.pathname !== "/chat" ? (
            <ProfilePicture className="h-12 w-12" />
          ) : (
            <ProfilePicture className="h-12 w-12" image={user?.pfp} />
          )}
          <div>
            {location.pathname !== "/chat" ? (
              <>
                <h3>{currentUser?.displayName}</h3>
                {currentUserDoc && <Status user={currentUserDoc} />}
              </>
            ) : (
              <>
                <h3>{user?.username}</h3>
                {user && <Status user={user} />}
              </>
            )}
          </div>
        </div>
        <div className="flex gap-5 items-center">
          {location.pathname !== "/settings" && (
            <>
              {location.pathname !== "/chat" ? (
                <FontAwesomeIcon
                  icon={faMagnifyingGlass}
                  onClick={() => setIsSearch(!isSearch)}
                />
              ) : (
                <FontAwesomeIcon icon={faPhone} />
              )}
            </>
          )}
          <DropdownMenu>
            {location.pathname !== "/settings" && (
              <DropdownMenuTrigger>
                <FontAwesomeIcon icon={faEllipsisV} />
              </DropdownMenuTrigger>
            )}
            <DropdownMenuContent>
              {location.pathname === "/" ? (
                <>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onRoute("settings")}>
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSignout()}>
                    Logout
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem
                    onClick={handleBlock}
                    className="cursor-pointer">
                    {isReceiverBlocked ? "Unblock" : "Block"}
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
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
