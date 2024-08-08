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
  endAt,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  startAt,
  updateDoc,
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
  const [users, setUsers] = useState<UserDocI[] | null>(null);
  const { currentUserDoc } = useContext(AuthContext);

  const handleSearch = async (data: FormData) => {
    try {
      if (data.username.toLowerCase() === currentUserDoc?.username) {
        return;
      }

      const userRef = collection(db, "users");
      const q = query(
        userRef,
        orderBy("username"),
        startAt(data.username),
        endAt(data.username + "\uf8ff")
      );

      const querySnapShot = await getDocs(q);
      const usersArr: any = [];

      querySnapShot.forEach((doc) => {
        if (doc.data().id === currentUserDoc?.id) return;
        usersArr.push(doc.data());
      });

      setUsers(usersArr);
    } catch (err) {
      console.log(err);
    }
  };

  const handleAdd = async (user: UserDocI) => {
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
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="px-3 flex flex-col max-h-[80%]">
        <DialogTitle>New Chat</DialogTitle>
        <form
          autoComplete="off"
          autoCapitalize="off"
          onSubmit={handleSubmit(handleSearch)}
          className="flex flex-col gap-4 items-center w-full h-full m-auto overflow-hidden">
          <Input
            placeholder="Username"
            className="w-full"
            {...register("username")}
          />
          {users && (
            <div className="overflow-y-auto w-full flex-col flex h-full">
              {users.map((user) => (
                <Button
                  key={user.id}
                  variant="ghost"
                  className="px-3"
                  onClick={() => handleAdd(user)}>
                  <User key={user.id} user={user} />
                </Button>
              ))}
            </div>
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
