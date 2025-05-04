import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore.js";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navLinks = [
    { name: "Launches", to: "/resources" },
    { name: "Rockets", to: "/rockets" },
  ];

  const iconVariants = {
    closed: { rotate: 0 },
    open: { rotate: 360, transition: { duration: 0.5, ease: "easeInOut" } },
  };

  const menuVariants = {
    hidden: {
      opacity: 0,
      height: 0,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
    visible: {
      opacity: 1,
      height: "auto",
      transition: { duration: 0.5, ease: "easeInOut" },
    },
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/*logo*/}
          <Link to="/resources" className="flex items-center space-x-2">
            <svg
              className="h-10 w-10 text-indigo-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 2l9 21H3L12 2z"
              />
            </svg>
            <span className="text-2xl font-extrabold text-gray-900 tracking-tight">
              SpaceXplorer
            </span>
          </Link>

          {/*menu*/}
          {token && (
            <>
              <div className="hidden md:flex space-x-10">
                {navLinks.map(({ name, to }) => (
                  <NavLink
                    key={name}
                    to={to}
                    className={({ isActive }) =>
                      `relative inline-block px-3 py-2 font-semibold text-gray-700 hover:text-indigo-600 transition ${
                        isActive
                          ? "text-indigo-600 after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-indigo-600"
                          : ""
                      }`
                    }
                  >
                    {name}
                  </NavLink>
                ))}
              </div>

              <div className="hidden md:flex items-center space-x-4">
                <button
                  onClick={handleLogout}
                  className="px-5 py-2 rounded-md text-indigo-600 font-semibold border-2 border-indigo-600 hover:bg-indigo-600 hover:text-white transition"
                >
                  Logout
                </button>
              </div>
            </>
          )}

          {/* sm screen button */}
          {token && (
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600"
              aria-expanded={menuOpen}
              aria-label="Toggle menu"
            >
              <motion.div
                variants={iconVariants}
                animate={menuOpen ? "open" : "closed"}
                style={{ originX: 0.5, originY: 0.5 }}
              >
                {menuOpen ? (
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 8h16M4 16h16"
                    />
                  </svg>
                )}
              </motion.div>
            </button>
          )}
        </div>
      </div>

      {/* sm screen*/}
      <AnimatePresence>
        {token && menuOpen && (
          <motion.div
            className="md:hidden bg-white border-t border-gray-200 shadow-lg overflow-hidden"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={menuVariants}
          >
            <div className="px-6 pt-4 pb-6 space-y-4">
              {navLinks.map(({ name, to }) => (
                <NavLink
                  key={name}
                  to={to}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-md font-semibold text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition ${
                      isActive ? "bg-indigo-100 text-indigo-600" : ""
                    }`
                  }
                >
                  {name}
                </NavLink>
              ))}
              <div className="pt-4 border-t border-gray-200 flex flex-col space-y-3">
                <button
                  onClick={handleLogout}
                  className="block px-5 py-2 rounded-md text-indigo-600 font-semibold border-2 border-indigo-600 hover:bg-indigo-600 hover:text-white transition text-center"
                >
                  Logout
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
