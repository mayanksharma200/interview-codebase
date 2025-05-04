import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore.js";
import Navbar from "./Navbar";

export default function PrivateRoute({ children }) {
  const token = useAuthStore((state) => state.token);

  if (!token) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
