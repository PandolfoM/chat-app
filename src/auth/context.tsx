import { onAuthStateChanged, User } from "firebase/auth";
import { createContext, ReactNode, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export interface UserDocI {
  email: string;
  username?: string;
  displayName?: string;
  id: string;
  blocked: string[];
  friends: string[];
  status: "online" | "offline" | "away" | "dnd";
  prevStatus: "online" | "offline" | "away" | "dnd";
  statusMsg: string;
  pfp: string;
  color: "#3e66fb" | "#dc3435" | "#72C96E" | "#E3B23C" | "#71717A";
}

type AuthContextType = {
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  currentUserDoc: UserDocI | null;
  setCurrentUserDoc: React.Dispatch<React.SetStateAction<UserDocI | null>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  setCurrentUser: () => {},
  currentUserDoc: null,
  setCurrentUserDoc: () => {},
  isLoading: true,
  setIsLoading: () => {},
});

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentUserDoc, setCurrentUserDoc] = useState<UserDocI | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        getUserDoc(user);
      } else {
        setIsLoading(false);
      }
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    const handleBeforeUnload = async () => {
      if (currentUserDoc) {
        await updateDoc(doc(db, "users", currentUserDoc.id), {
          status: "offline",
          prevStatus: currentUserDoc.status,
        });
        return;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [currentUserDoc]);

  const getUserDoc = async (user: User) => {
    const userDoc = await getDoc(doc(db, "users", user.uid));

    if (userDoc.exists()) {
      const userData = userDoc.data() as UserDocI;
      setCurrentUserDoc({
        ...userData,
        status: userData.prevStatus,
      });

      await updateDoc(doc(db, "users", userData.id), {
        status: userData.prevStatus,
      });
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        currentUserDoc,
        setCurrentUserDoc,
        isLoading,
        setIsLoading,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
