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

function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

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
      <div className="flex gap-5">
        {location.pathname === "/" ? (
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        ) : (
          <FontAwesomeIcon icon={faPhone} />
        )}
        <FontAwesomeIcon icon={faEllipsisV} />
      </div>
    </nav>
  );
}

export default NavBar;
