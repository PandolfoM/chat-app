import {
  faChevronLeft,
  faEllipsisV,
  faMagnifyingGlass,
  faPhone,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext } from "react";
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

function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const { user, changeBlock, isReceiverBlocked } = useContext(ChatContext);

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
    <nav className="flex items-center justify-between px-5 pt-5 pb-10">
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
              <div className="w-3 h-3 aspect-square rounded-full bg-success" />
              Online
            </div>
          )}
        </div>
      </div>
      <div className="flex gap-5 items-center">
        {location.pathname === "/" ? (
          <FontAwesomeIcon icon={faMagnifyingGlass} />
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
    </nav>
  );
}

export default NavBar;
