import { faThumbTack } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import User from "../components/User";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="px-5 text-3xl font-extrabold">Chat</h1>
      <section className="px-1">
        {/* Pinned */}
        <div className="rounded-t-2xl bg-white p-3 flex flex-col gap-3">
          <h3 className="opacity-60 text-sm">
            <FontAwesomeIcon icon={faThumbTack} /> Pinned
          </h3>
          <div className="flex flex-col gap-7">
            <Link to="/chat">
              <User />
            </Link>
            <User />
          </div>
        </div>
        {/* Chats */}
        <div className="rounded-b-2xl bg-white p-3 flex flex-col gap-3">
          <h3 className="opacity-60 text-sm pt-2">Conversation</h3>
          <div className="flex flex-col gap-7">
            <User />
            <User />
            <User />
            <User />
            <User />
            <User />
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
