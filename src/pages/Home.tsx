import { faComment } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NewChatDialog } from "../components/dialogs";
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { AuthContext, UserDocI } from "../auth/context";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { ChatI } from "../lib/interfaces";
import { ChatContext } from "../context/chatContext";
import { useNavigate } from "react-router-dom";
import ChatList from "../components/ChatList";
import { AppContext } from "../context/appContext";

export interface ChatPromiseData {
  chatId: string;
  lastMessage: string;
  receiverId: string;
  updatedAt: number;
  isSeen: boolean;
  user: UserDocI;
}

function Home() {
  const { search } = useContext(AppContext);
  const { currentUser } = useContext(AuthContext);
  const { changeChat } = useContext(ChatContext);
  const [chats, setChats] = useState<ChatPromiseData[] | []>([]);
  const navigate = useNavigate();

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
          setChats((prevChats) =>
            prevChats.length === chatData.length
              ? prevChats
              : chatData.sort((a, b) => b.updatedAt - a.updatedAt)
          );
        }
      }
    );

    return () => unsub();
  }, [currentUser?.uid]);

  const handleSelect = async (chat: ChatPromiseData) => {
    changeChat(chat.chatId, chat.user);
    navigate("/chat");

    const userChats = chats.map((item) => {
      const { user, ...rest } = item;
      return rest;
    });

    const chatIndex = userChats.findIndex(
      (item) => item.chatId === chat.chatId
    );

    userChats[chatIndex].isSeen = true;

    const userChatsRef = doc(db, "userchats", currentUser?.uid as string);

    try {
      await updateDoc(userChatsRef, {
        chats: userChats,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const filteredChats = chats.filter((c) =>
    c.user.username.toLowerCase().includes(search?.toLowerCase() as string)
  );

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
          <ChatList chats={filteredChats} handleSelect={handleSelect} />
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
