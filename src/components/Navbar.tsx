import {
  faEllipsisV,
  faMagnifyingGlass,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function NavBar() {
  return (
    <nav className="flex items-center justify-between px-5 pt-5 pb-10">
      <div className="w-12 aspect-square bg-primary rounded-full flex items-center justify-center">
        <FontAwesomeIcon icon={faUser} size="xl" className="text-white" />
      </div>
      <div className="flex gap-5">
        <FontAwesomeIcon icon={faMagnifyingGlass} />
        <FontAwesomeIcon icon={faEllipsisV} />
      </div>
    </nav>
  );
}

export default NavBar;
