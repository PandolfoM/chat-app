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
    image: yup
      .mixed()
      .nullable()
      .notRequired()
      .test("fileSize", "File size is too large", (value: any) => {
        // Skip validation if no file is provided
        if (!value) return true;
        return value.size <= 8 * 1024 * 1024; // 8 MB
      })
      .test("fileType", "Unsupported file format", (value: any) => {
        // Skip validation if no file is provided
        if (!value) return true;
        return ["image/jpeg", "image/png"].includes(value.type);
      }),
  })
  .required();
type FormData = yup.InferType<typeof schema>;

interface ChatMessage {
  text: string;
  createdAt: number;
  senderId: string;
}
interface ChatData {
  createdAt: Date;
  messages: ChatMessage[];
}

function Chat() {
  const { register, handleSubmit, watch, setValue, reset } = useForm({
    resolver: yupResolver(schema),
  });
  const { currentUser } = useContext(AuthContext);
  const msgValue = watch("msg");
  const endRef = useRef<HTMLDivElement>(null);
  const [chat, setChat] = useState<ChatData | null>(null);
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } =
    useContext(ChatContext);
  const navigate = useNavigate();

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "instant" });
  }, [chat]);

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

          reset({ msg: "" });

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
    <div className="flex flex-col overflow-hidden h-full gap-2">
      <section
        className={cn(
          isCurrentUserBlocked || isReceiverBlocked
            ? "overflow-y-hidden"
            : "overflow-y-auto",
          "rounded-2xl bg-backgroundSecondary p-3 flex flex-col gap-3 w-full h-full relative"
        )}>
        {(isCurrentUserBlocked || isReceiverBlocked) && (
          <div className="absolute bottom-0 right-0 top-0 left-0 bg-background/60 h-full w-full z-10 flex items-center justify-center">
            <h3>
              {isCurrentUserBlocked
                ? `${user?.username} has blocked you`
                : `You have blocked ${user?.username}`}
            </h3>
          </div>
        )}
        {chat?.messages.map((msg, i) => (
          <div
            key={i}
            className={cn(
              currentUser?.uid === msg.senderId
                ? "bg-primary self-end text-white"
                : "bg-white text-black",
              "w-fit max-w-[75%] px-3 py-1 rounded-2xl"
            )}>
            <p
              className={cn(
                isCurrentUserBlocked || isReceiverBlocked ? "blur-sm" : "blur-0"
              )}>
              {msg.text}
            </p>
            <p
              className={cn(
                currentUser?.uid === msg.senderId ? "text-right" : "text-left ",
                isCurrentUserBlocked || isReceiverBlocked
                  ? "blur-sm"
                  : "blur-0",
                "text-xs opacity-60 pt-1"
              )}>
              {formatDate(msg.createdAt)}
            </p>
          </div>
        ))}
        <div ref={endRef} className="py-1" />
      </section>
      <section className="m-5">
        <form
          className="bg-backgroundSecondary flex items-center gap-3 rounded-2xl px-5"
          onSubmit={handleSubmit(handleSend)}>
          <DropdownMenu>
            <DropdownMenuTrigger
              disabled={isCurrentUserBlocked || isReceiverBlocked}>
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
              placeholder={
                isCurrentUserBlocked || isReceiverBlocked
                  ? "Cannot send a message"
                  : "Type message..."
              }
              value={msgValue}
              className="bg-transparent border-l-2 rounded-none my-5 resize-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (!isCurrentUserBlocked && !isReceiverBlocked) {
                    handleSubmit(handleSend)();
                  }
                }
              }}
              minHeight={20}
              maxHeight={200}
              disabled={isCurrentUserBlocked || isReceiverBlocked}
              {...register("msg", {
                onChange: (e) => setValue("msg", e.target.value),
              })}
            />
          </div>
          {msgValue ? (
            <Button
              variant="ghost"
              type="submit"
              className="bg-primary w-5 h-5 p-3 rounded-full flex items-center justify-center text-white transition-all"
              disabled={isCurrentUserBlocked || isReceiverBlocked}>
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
