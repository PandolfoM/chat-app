import { createContext, ReactNode, useState } from "react";

type AppContextType = {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
};

export const AppContext = createContext<AppContextType>({
  search: "",
  setSearch: () => {},
});

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [search, setSearch] = useState<string>("");

  return (
    <AppContext.Provider
      value={{
        search,
        setSearch,
      }}>
      {children}
    </AppContext.Provider>
  );
};
