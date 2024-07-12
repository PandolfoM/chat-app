import { onAuthStateChanged, User } from "firebase/auth";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { AuthContext } from "../auth/context";

export interface UserDocI {
  email: string;
  username: string;
  id: string;
  blocked: string[];
}

type ChatContextType = {
  chatId: string;
  setChatId: React.Dispatch<React.SetStateAction<string>>;
  user: UserDocI | null;
  setUser: React.Dispatch<React.SetStateAction<UserDocI | null>>;
  isCurrentUserBlocked: boolean;
  setIsCurrentUserBlocked: React.Dispatch<React.SetStateAction<boolean>>;
  isReceiverBlocked: boolean;
  setIsReceiverBlocked: React.Dispatch<React.SetStateAction<boolean>>;
  changeChat: (chatId: string, user: UserDocI) => void;
  changeBlock: () => void;
};

export const ChatContext = createContext<ChatContextType>({
  chatId: "",
  setChatId: () => {},
  user: null,
  setUser: () => {},
  isCurrentUserBlocked: false,
  setIsCurrentUserBlocked: () => {},
  isReceiverBlocked: false,
  setIsReceiverBlocked: () => {},
  changeChat: () => {},
  changeBlock: () => {},
});

export const ChatContextProvider = ({ children }: { children: ReactNode }) => {
  const [chatId, setChatId] = useState<string>("");
  const [user, setUser] = useState<UserDocI | null>(null);
  const [isCurrentUserBlocked, setIsCurrentUserBlocked] =
    useState<boolean>(false);
  const [isReceiverBlocked, setIsReceiverBlocked] = useState<boolean>(false);
  const { currentUserDoc } = useContext(AuthContext);

  const changeChat = (chatId: string, user: UserDocI) => {
    if (!currentUserDoc) {
      return;
    }

    // Check if current user is blocked
    if (user.blocked.includes(currentUserDoc?.id as string)) {
      setChatId(chatId);
      setUser(null);
      setIsCurrentUserBlocked(true);
      setIsReceiverBlocked(false);
      return;
    }
    // Check if receiver is blocked
    else if (currentUserDoc?.blocked.includes(currentUserDoc?.id as string)) {
      setChatId(chatId);
      setUser(user);
      setIsCurrentUserBlocked(false);
      setIsReceiverBlocked(true);
      return;
    } else {
      setChatId(chatId);
      setUser(user);
      setIsCurrentUserBlocked(false);
      setIsReceiverBlocked(false);
    }
  };

  const changeBlock = () => {
    setIsReceiverBlocked(!isReceiverBlocked);
  };

  return (
    <ChatContext.Provider
      value={{
        chatId,
        setChatId,
        isCurrentUserBlocked,
        setIsCurrentUserBlocked,
        isReceiverBlocked,
        setIsReceiverBlocked,
        user,
        setUser,
        changeChat,
        changeBlock,
      }}>
      {children}
    </ChatContext.Provider>
  );
};
