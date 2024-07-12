import { onAuthStateChanged, User } from "firebase/auth";
import { createContext, ReactNode, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export interface UserDocI {
  email: string;
  username: string;
  id: string;
  blocked: string[];
}

type AuthContextType = {
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  currentUserDoc: UserDocI | null;
  setCurrenUserDoc: React.Dispatch<React.SetStateAction<UserDocI | null>>;
};

export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  setCurrentUser: () => {},
  currentUserDoc: null,
  setCurrenUserDoc: () => {},
});

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentUserDoc, setCurrenUserDoc] = useState<UserDocI | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        getUserDoc(user);
      }
    });

    return () => unsub();
  }, []);

  const getUserDoc = async (user: User) => {
    const userDoc = await getDoc(doc(db, "users", user.uid));

    if (userDoc.exists()) {
      setCurrenUserDoc(userDoc.data() as UserDocI);
    }
  };

  return (
    <AuthContext.Provider
      value={{ currentUser, setCurrentUser, currentUserDoc, setCurrenUserDoc }}>
      {children}
    </AuthContext.Provider>
  );
};
