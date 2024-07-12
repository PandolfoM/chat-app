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
import { auth } from "../firebase";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./Dropdown";

function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useContext(AuthContext);

  const handleSignout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      navigate("/login");
    } catch (error) {
      console.log(error);
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
          <h3>{currentUser?.displayName}</h3>
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
      </div>
    </nav>
  );
}

export default NavBar;
