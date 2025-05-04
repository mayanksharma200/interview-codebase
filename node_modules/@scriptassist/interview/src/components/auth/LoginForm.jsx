import React, { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function LoginForm() {
  const login = useAuthStore((state) => state.login);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) throw new Error("Invalid credentials");
      const data = await response.json();
      login(data.token);
      navigate("/resources");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Loader animation variants
  const loaderVariants = {
    animate: {
      rotate: 360,
      transition: {
        repeat: Infinity,
        duration: 1,
        ease: "linear",
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-black bg-opacity-70 backdrop-blur-3xl rounded-3xl shadow-2xl max-w-xl w-full p-12"
      >
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-12 text-center drop-shadow-lg select-none">
          SpaceX Explorer
        </h1>
        <form onSubmit={handleSubmit} noValidate className="space-y-8">
          <div>
            <label
              htmlFor="username"
              className="block mb-2 text-gray-300 font-semibold select-none"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="admin@spacex.com"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
              className="w-full rounded-xl bg-gray-800 bg-opacity-60 px-5 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-shadow shadow-md"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-gray-300 font-semibold select-none"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="spacex123"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="w-full rounded-xl bg-gray-800 bg-opacity-60 px-5 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-shadow shadow-md"
            />
          </div>

          {error && (
            <p className="text-red-500 text-center font-semibold select-none">
              {error}
            </p>
          )}

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.05 }}
            whileTap={{ scale: loading ? 1 : 0.95 }}
            className={`w-full py-4 rounded-xl text-white font-extrabold shadow-lg transition-shadow ${
              loading
                ? "bg-cyan-600 cursor-not-allowed"
                : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:shadow-xl"
            }`}
          >
            {loading ? (
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                className="mx-auto h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                variants={loaderVariants}
                animate="animate"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </motion.svg>
            ) : (
              "Log In"
            )}
          </motion.button>
        </form>

        <p className="mt-10 text-center text-gray-400 text-sm select-none">
          Don't have an account?{" "}
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="text-cyan-400 font-semibold hover:underline cursor-pointer"
          >
            Contact Admin
          </a>
        </p>
      </motion.div>
    </div>
  );
}
