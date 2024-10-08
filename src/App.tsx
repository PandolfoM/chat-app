import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ReactNode, Suspense, useContext } from "react";
import Login from "./pages/Login";
import { AuthContext } from "./auth/context";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import NavBar from "./components/Navbar";
import Chat from "./pages/Chat";
import RegisterName from "./pages/RegisterName";
import Spinner from "./components/Spinner";
import Settings from "./pages/Settings";

function App() {
  const { currentUser, currentUserDoc, isLoading } = useContext(AuthContext);

  const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    if (isLoading) {
      return (
        <>
          <Spinner /> {children}
        </>
      );
    }

    if (!currentUser) {
      return <Navigate to="/login" />;
    }

    return children;
  };

  const PublicRoute = ({ children }: { children: ReactNode }) => {
    if (isLoading) {
      return (
        <>
          <Spinner /> {children}
        </>
      );
    }

    if (currentUserDoc) {
      if (!currentUserDoc?.displayName) {
        return <Navigate to="/registername" />;
      } else {
        return <Navigate to="/" />;
      }
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
              <Suspense fallback={<Spinner />}>
                <div className="w-full h-full flex flex-col">
                  <NavBar />
                  <Home />
                </div>
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Suspense fallback={<Spinner />}>
                <div className="w-full h-full flex flex-col">
                  <NavBar />
                  <Chat />
                </div>
              </Suspense>
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Suspense>
                <div className="w-full h-full flex flex-col">
                  <NavBar />
                  <Settings />
                </div>
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Suspense fallback={<Spinner />}>
                <Login />
              </Suspense>
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Suspense fallback={<Spinner />}>
                <Signup />
              </Suspense>
            </PublicRoute>
          }
        />
        <Route
          path="/registername"
          element={
            <ProtectedRoute>
              <Suspense fallback={<Spinner />}>
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
