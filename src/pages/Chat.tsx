import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUp,
  faCamera,
  faImage,
  faMicrophone,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { Textarea } from "../components/Textarea";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "../components/Button";
import { db } from "../firebase";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../auth/context";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { ChatContext } from "../context/chatContext";
import { useNavigate } from "react-router-dom";
import { cn, formatDate } from "../lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/Dropdown";

const schema = yup
  .object({
    msg: yup.string().required(),
  })
  .required();
type FormData = yup.InferType<typeof schema>;

interface ChatMessage {
  text: string;
  // name: currentUser?.displayName, //! wont update if user changes their name or pfp?
  // avatar: currentUser?.photoURL,
  createdAt: number;
  senderId: string;
}
interface ChatData {
  createdAt: Date;
  messages: ChatMessage[];
}

function Chat() {
  const { register, handleSubmit, watch, setValue } = useForm({
    resolver: yupResolver(schema),
  });
  const { currentUser } = useContext(AuthContext);
  const msgValue = watch("msg");
  const endRef = useRef<HTMLDivElement>(null);
  const [chat, setChat] = useState<ChatData | null>(null);
  const { chatId, user } = useContext(ChatContext);
  const navigate = useNavigate();

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "instant" });
  }, []);

  useEffect(() => {
    if (!chatId) return navigate("/");

    const unsub = onSnapshot(doc(db, "chats", chatId), (res) => {
      setChat(res.data() as ChatData);
    });

    return () => unsub();
  }, [chatId]);

  const handleSend = async (data: FormData) => {
    try {
      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser?.uid,
          text: data.msg,
          createdAt: Date.now(),
        }),
      });

      const userIds = [currentUser?.uid, user?.id];
      userIds.forEach(async (id) => {
        const userChatsRef = doc(db, "userchats", id as string);
        const userChatsSnap = await getDoc(userChatsRef);

        if (userChatsSnap.exists()) {
          const userChatsData = userChatsSnap.data();
          const chatIndex = userChatsData.chats.findIndex(
            (c: any) => c.chatId === chatId
          );

          userChatsData.chats[chatIndex].lastMessage = data.msg;
          userChatsData.chats[chatIndex].isSeen =
            id === currentUser?.uid ? true : false;
          userChatsData.chats[chatIndex].updatedAt = Date.now();

          await updateDoc(userChatsRef, {
            chats: userChatsData.chats,
          });
        }
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex flex-col overflow-hidden h-full">
      <section className="rounded-2xl bg-backgroundSecondary p-3 flex flex-col gap-3 overflow-y-auto w-full h-full relative">
        {chat?.messages.map((msg, i) => (
          <div
            key={i}
            className={cn(
              currentUser?.uid === msg.senderId
                ? "bg-primary self-end text-white"
                : "bg-white text-black",
              "w-fit max-w-[75%] px-3 py-1 rounded-2xl"
            )}>
            {msg.text}
            <p
              className={cn(
                currentUser?.uid === msg.senderId ? "text-right" : "text-left ",
                "text-xs opacity-60 pt-1"
              )}>
              {formatDate(msg.createdAt)}
            </p>
          </div>
        ))}

        <div ref={endRef}></div>
      </section>
      <section className="m-5">
        <form
          className="bg-backgroundSecondary flex items-center gap-3 rounded-2xl px-5"
          onSubmit={handleSubmit(handleSend)}>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <FontAwesomeIcon icon={faPlus} />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem className="flex gap-2">
                <FontAwesomeIcon icon={faCamera} /> Camera
              </DropdownMenuItem>
              <DropdownMenuItem className="flex gap-2">
                <FontAwesomeIcon icon={faImage} /> Photos
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="flex-1">
            <Textarea
              placeholder="Type message..."
              className="bg-transparent border-l-2 rounded-none my-5 resize-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(handleSend)();
                }
              }}
              minHeight={20}
              maxHeight={200}
              {...register("msg", {
                onChange: (e) => setValue("msg", e.target.value),
              })}
            />
          </div>
          {msgValue ? (
            <Button
              variant="ghost"
              type="submit"
              className="bg-primary w-5 h-5 p-3 rounded-full flex items-center justify-center text-white transition-all">
              <FontAwesomeIcon icon={faArrowUp} size="sm" />
            </Button>
          ) : (
            <div className="w-5 h-5 p-3 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faMicrophone} />
            </div>
          )}
        </form>
      </section>
    </div>
  );
}

export default Chat;
