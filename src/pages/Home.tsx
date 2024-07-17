import {
  faComment,
  faCommentDots,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NewChatDialog } from "../components/dialogs";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "../components/Tabs";
import Chats from "./HomePages/Chats";
import Friends from "./HomePages/Friends";

enum Page {
  Chats = "chats",
  Friends = "friends",
}

function Home() {
  const [page, setPage] = useState<Page>(Page.Chats);

  return (
    <>
      <div className="flex flex-col gap-2 relative h-full">
        <>{page === Page.Chats ? <Chats /> : <Friends />}</>
        <section className="fixed right-1/2 translate-x-1/2 flex flex-col items-end bottom-5 w-[90%] gap-3">
          {page === Page.Chats && (
            <NewChatDialog>
              <div className="rounded-full text-sm text-white disabled:bg-opacity-30 disabled:opacity-60 bg-primary flex items-center gap-2 w-fit py-4 px-7">
                <FontAwesomeIcon icon={faComment} /> New Chat
              </div>
            </NewChatDialog>
          )}
          <Tabs
            defaultValue={Page.Chats}
            onValueChange={(value) => setPage(value as Page)}
            className="w-full h-full overflow-hidden p-2 bg-white rounded-2xl shadow-[0_0_8px_0px_rgba(0,0,0,0.2)] flex items-center">
            <TabsList className="h-16 flex gap-4 items-center justify-start w-full">
              <TabsTrigger
                value={Page.Chats}
                className="w-16 h-16 aspect-square p-2 rounded-2xl flex flex-col gap-1 group">
                <FontAwesomeIcon icon={faCommentDots} size="xl" />
                <p className="text-xs hidden group-data-[state=active]:block transition-all ease-in-out duration-500">
                  Chat
                </p>
              </TabsTrigger>
              <TabsTrigger
                value={Page.Friends}
                className="w-16 h-16 aspect-square p-2 rounded-2xl flex flex-col gap-1 group">
                <FontAwesomeIcon icon={faUsers} size="xl" />
                <p className="text-xs hidden group-data-[state=active]:block transition-all ease-in-out duration-500">
                  Friends
                </p>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </section>
      </div>
    </>
  );
}

export default Home;
