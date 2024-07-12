import { faComment } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import User from "../components/User";
import { NewChatDialog } from "../components/dialogs";
import { useContext, useEffect, useState } from "react";
import { AuthContext, UserDocI } from "../auth/context";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { ChatI, UserChatsI } from "../lib/interfaces";

interface PromiseData {
  chatId: string;
  lastMessage: string;
  receiverId: string;
  updatedAt: number;
  user: UserDocI;
}

function Home() {
  const { currentUser } = useContext(AuthContext);
  const [chats, setChats] = useState<PromiseData[] | []>([]);

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, "userchats", currentUser?.uid as string),
      async (res) => {
        if (res.exists()) {
          const items = res.data().chats;

          const promises = items.map(async (item: ChatI) => {
            const UserDocRef = doc(db, "users", item.receiverId);
            const UserDocSnap = await getDoc(UserDocRef);

            const user = UserDocSnap.data();

            return { ...item, user };
          });

          const chatData = await Promise.all(promises);
          // @ts-ignore
          setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
        }
      }
    );

    return () => unsub();
  }, [currentUser?.uid]);

  return (
    <>
      <div className="flex flex-col gap-2 relative">
        {chats.length > 0 && (
          <h1 className="px-5 text-3xl font-extrabold">Chat</h1>
        )}
        <section className="bg-white rounded-2xl p-3 mx-1">
          {/* Pinned */}
          {/* <div className="rounded-t-2xl bg-white p-3 flex flex-col gap-3">
            <h3 className="opacity-60 text-sm">
              <FontAwesomeIcon icon={faThumbTack} /> Pinned
            </h3>
            <div className="flex flex-col gap-7">
              <Link to="/chat">
                <User />
              </Link>
              <User />
            </div>
          </div> */}
          {/* Chats */}
          {chats.length > 0 && (
            <div className="flex flex-col gap-3">
              <h3 className="opacity-60 text-sm">Conversation</h3>
              <div className="flex flex-col gap-7">
                {chats?.map((chat, i) => (
                  <User key={i} user={chat.user} />
                  // <p>{chat.user}</p>
                ))}
              </div>
            </div>
          )}
        </section>
        <section className="fixed right-1/2 translate-x-1/2 flex flex-col items-end bottom-5 w-[90%]">
          <NewChatDialog>
            <div className="rounded-full text-sm text-white disabled:bg-opacity-30 disabled:opacity-60 bg-primary flex items-center gap-2 w-fit py-4 px-7">
              <FontAwesomeIcon icon={faComment} /> New Chat
            </div>
          </NewChatDialog>
        </section>
      </div>
    </>
  );
}

export default Home;
