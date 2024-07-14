import { ReactNode, useContext, useState } from "react";
import Button from "../Button";
import { Input } from "../Input";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./Dialog";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import { AuthContext, UserDocI } from "../../auth/context";
import User from "../User";

const schema = yup
  .object({
    username: yup.string().required(),
  })
  .required();
type FormData = yup.InferType<typeof schema>;

function NewChatDialog({ children }: { children: ReactNode }) {
  const { register, handleSubmit } = useForm({ resolver: yupResolver(schema) });
  const [user, setUser] = useState<UserDocI | null>(null);
  const { currentUserDoc } = useContext(AuthContext);

  const handleSearch = async (data: FormData) => {
    try {
      const userRef = collection(db, "users");
      const q = query(userRef, where("username", "==", data.username));

      const querySnapShot = await getDocs(q);

      if (!querySnapShot.empty) {
        setUser(querySnapShot.docs[0].data() as UserDocI);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleAdd = async () => {
    const chatRef = collection(db, "chats");
    const userChatsRef = collection(db, "userchats");

    try {
      const newChatRef = doc(chatRef);

      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        messages: [],
      });

      await updateDoc(doc(userChatsRef, user?.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: currentUserDoc?.id,
          updatedAt: Date.now(),
        }),
      });

      await updateDoc(doc(userChatsRef, currentUserDoc?.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: user?.id,
          updatedAt: Date.now(),
        }),
      });
    } catch (err) {}
  };

  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogTitle>New Chat</DialogTitle>
        <form
          onSubmit={handleSubmit(handleSearch)}
          className="flex flex-col gap-4 items-center w-9/12 m-auto">
          <Input
            placeholder="Username"
            className="w-full"
            {...register("username")}
          />
          {user && (
            <Button variant="ghost" className="px-0" onClick={handleAdd}>
              <User key={user.id} user={user} />
            </Button>
          )}
          <Button variant="filled" className="w-full" type="submit">
            Search
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default NewChatDialog;
