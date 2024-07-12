import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ReactNode, Suspense, useContext } from "react";
import Login from "./pages/Login";
import { AuthContext } from "./auth/context";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import NavBar from "./components/Navbar";
import Chat from "./pages/Chat";
import RegisterName from "./pages/RegisterName";

function App() {
  const { currentUser } = useContext(AuthContext);

  const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    }

    if (!currentUser.displayName) {
      return <Navigate to="/registername" />;
    }

    return children;
  };

  const PublicRoute = ({ children }: { children: ReactNode }) => {
    if (currentUser) {
      return <Navigate to="/" />;
    }

    return children;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Suspense fallback={<p>Loading...</p>}>
                <NavBar />
                <Home />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Suspense fallback={<p>Loading...</p>}>
                <div className="w-full h-full flex flex-col">
                  <NavBar />
                  <Chat />
                </div>
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Suspense fallback={<p>Loading...</p>}>
                <Login />
              </Suspense>
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Suspense fallback={<p>Loading...</p>}>
                <Signup />
              </Suspense>
            </PublicRoute>
          }
        />
        <Route
          path="/registername"
          element={
            <ProtectedRoute>
              <Suspense fallback={<p>Loading...</p>}>
                <RegisterName />
              </Suspense>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
