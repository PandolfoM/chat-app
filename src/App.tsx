import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ReactNode, Suspense, useContext } from "react";
import Login from "./pages/Login";
import { AuthContext } from "./auth/context";
import Home from "./pages/Home";
import Signup from "./pages/Signup";

function App() {
  const { currentUser } = useContext(AuthContext);

  const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
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
                <Home />
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
