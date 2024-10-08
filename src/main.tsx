import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { AuthContextProvider } from "./auth/context";
import { ChatContextProvider } from "./context/chatContext";
import { AppContextProvider } from "./context/appContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AuthContextProvider>
      <ChatContextProvider>
        <AppContextProvider>
          <App />
        </AppContextProvider>
      </ChatContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
