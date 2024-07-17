import { useContext, useEffect, useState } from "react";
import ChatList from "../../components/ChatList";
import { ChatContext } from "../../context/chatContext";
import { AuthContext, UserDocI } from "../../auth/context";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { ChatI } from "../../lib/interfaces";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/appContext";

export interface ChatPromiseData {
  chatId: string;
  lastMessage: string;
  receiverId: string;
  updatedAt: number;
  isSeen: boolean;
  user: UserDocI;
}

function Chats() {
  const { search } = useContext(AppContext);
  const { changeChat } = useContext(ChatContext);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [chats, setChats] = useState<ChatPromiseData[] | []>([]);

  useEffect(() => {
    if (!currentUser?.uid) return;

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
              ? chatData
              : chatData.sort((a, b) => b.updatedAt - a.updatedAt)
          );
        } else return;
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
    c.user.username?.toLowerCase().includes(search?.toLowerCase() as string)
  );

  return (
    <>
      <h1 className="px-5 text-3xl font-extrabold">Chat</h1>
      <section className="bg-backgroundSecondary flex-1 rounded-t-2xl p-3">
        {chats.length > 0 && (
          <>
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
          </>
        )}
      </section>
    </>
  );
}

export default Chats;
