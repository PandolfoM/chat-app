import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUp,
  faCamera,
  faImage,
  faMicrophone,
  faPlus,
  faX,
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
import { Input } from "../components/Input";
import upload from "../lib/upload";
import ImageDialog from "../components/dialogs/ImageDialog";

const schema = yup
  .object({
    msg: yup.string().optional(),
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
  img: string;
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
  const imgValue = watch("image");
  const endRef = useRef<HTMLDivElement>(null);
  const [chat, setChat] = useState<ChatData | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
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

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      setValue("image", file);
      reader.onload = () => {
        setImageSrc(reader.result as string);
      };
      reader.onerror = (error) => {
        console.error("Error reading file:", error);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async (data: FormData) => {
    let imgUrl = null;
    try {
      if (data.image && data.image instanceof File) {
        imgUrl = await upload(data.image, "chatImages", Date.now().toString());
      }

      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser?.uid,
          text: data.msg ? data.msg : "",
          createdAt: Date.now(),
          ...(imgUrl && { img: imgUrl }),
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

          reset({ msg: "", image: null });
          setImageSrc(null);

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
              msg.img && !msg.text && "bg-transparent",
              "w-fit max-w-[75%] px-3 py-1 rounded-2xl relative"
            )}>
            <div>
              {msg.img && (
                <ImageDialog image={msg.img}>
                  <img
                    src={msg.img}
                    alt=""
                    className="max-h-60 object-cover rounded-2xl"
                  />
                </ImageDialog>
              )}
              {msg.text && (
                <p
                  className={cn(
                    isCurrentUserBlocked || isReceiverBlocked
                      ? "blur-sm"
                      : "blur-0"
                  )}>
                  {msg.text}
                </p>
              )}
            </div>
            <p
              className={cn(
                currentUser?.uid === msg.senderId ? "text-right" : "text-left ",
                isCurrentUserBlocked || isReceiverBlocked
                  ? "blur-sm"
                  : "blur-0",
                msg.img &&
                  !msg.text &&
                  "absolute -bottom-1 right-6 text-black dark:text-white",
                "text-xs opacity-60 pt-1 "
              )}>
              {formatDate(msg.createdAt)}
            </p>
          </div>
        ))}
        <div ref={endRef} className="py-1" />
      </section>
      <section className="m-5 flex flex-col gap-2">
        {imageSrc && (
          <div className="group w-fit relative bg-red-500">
            <img src={imageSrc} alt="" className="z-10 max-h-40 w-fit " />
            <FontAwesomeIcon
              icon={faX}
              className="absolute top-0 left-0 bg-background rounded-full w-3 h-3 p-2 m-1 font-bold cursor-pointer"
              onClick={() => {
                setImageSrc(null), reset({ image: null });
              }}
            />
          </div>
        )}
        <form
          className="bg-backgroundSecondary flex items-center gap-3 rounded-2xl px-5"
          onSubmit={handleSubmit(handleSend)}>
          <DropdownMenu open={isOpen}>
            <DropdownMenuTrigger
              onClick={() => setIsOpen(!isOpen)}
              disabled={isCurrentUserBlocked || isReceiverBlocked}>
              <FontAwesomeIcon icon={faPlus} />
            </DropdownMenuTrigger>
            <DropdownMenuContent onInteractOutside={() => setIsOpen(false)}>
              <DropdownMenuItem className="flex gap-2">
                <FontAwesomeIcon icon={faCamera} /> Camera
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex gap-2"
                onClick={handleButtonClick}>
                <FontAwesomeIcon icon={faImage} /> Photos
                <Input
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                />
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
          {msgValue || imgValue ? (
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
