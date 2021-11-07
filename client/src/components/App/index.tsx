import React from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import "tailwindcss/dist/base.min.css";
import { useAuth } from "../../context/Auth";
import Login from "../Login";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { EmailVerification } from "../EmailVerification";

export function RequireAuth({ children }: { children: JSX.Element }) {
  const auth = useAuth();
  const location = useLocation();

  if (!auth.user) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return children;
}

function App() {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <RequireAuth>
              <Route path="/" element={<h1>Home</h1>} />
            </RequireAuth>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/email/checked/:key" element={<EmailVerification />} />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
