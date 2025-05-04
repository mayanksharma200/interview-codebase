import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchLaunchById, fetchRocketById } from "../api/spacex";
import { motion, AnimatePresence } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function ResourceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: launch, isLoading: loadingLaunch } = useQuery(
    ["launch", id],
    () => fetchLaunchById(id)
  );
  const rocketId = launch?.rocket;

  const { data: rocket, isLoading: loadingRocket } = useQuery(
    ["rocket", rocketId],
    () => fetchRocketById(rocketId),
    { enabled: !!rocketId }
  );

  if (loadingLaunch)
    return (
      <div className="flex justify-center items-center h-64">
        <motion.svg
          className="h-12 w-12 text-indigo-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-label="Loading spinner"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          ></path>
        </motion.svg>
      </div>
    );

  if (!launch)
    return (
      <motion.div
        className="max-w-3xl mx-auto mt-16 p-6 bg-red-50 border border-red-300 rounded-lg text-center text-red-700 font-semibold shadow-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Launch not found
      </motion.div>
    );

  return (
    <motion.div
      className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl border border-gray-100 p-10"
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
    >
      <nav className="text-sm mb-6" aria-label="Breadcrumb">
        <ol className="list-reset flex text-gray-600">
          <li>
            <Link
              to="/resources"
              className="hover:text-indigo-600 font-semibold underline"
            >
              Launches
            </Link>
          </li>

          <li>
            <span className="mx-2">/</span>
          </li>
          <li className="text-gray-900 font-semibold">{launch.name}</li>
        </ol>
      </nav>

      <motion.h2
        className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        {launch.name}
      </motion.h2>
      <motion.p
        className="text-gray-500 text-sm mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        Date:{" "}
        <time dateTime={launch.date_utc} className="font-medium text-gray-700">
          {new Date(launch.date_utc).toLocaleString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </time>
      </motion.p>

      <motion.section
        className="mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <h3 className="text-xl font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">
          Launch Details
        </h3>
        <p className="text-gray-700 leading-relaxed min-h-[80px]">
          {launch.details || (
            <span className="italic text-gray-400">No details available.</span>
          )}
        </p>
      </motion.section>

      <section className="mb-6">
        <AnimatePresence>
          {loadingRocket ? (
            <motion.div
              key="loading-rocket"
              className="flex justify-center items-center h-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.svg
                className="h-10 w-10 text-indigo-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-label="Loading spinner"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </motion.svg>
            </motion.div>
          ) : rocket ? (
            <motion.div
              key="rocket-details"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  Rocket Details
                </h3>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                    rocket.active
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {rocket.active ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Name</h4>
                  <p>{rocket.name}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Type</h4>
                  <p>{rocket.type}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Country</h4>
                  <p>{rocket.country}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Company</h4>
                  <p>{rocket.company}</p>
                </div>
                <div className="sm:col-span-2">
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Description
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    {rocket.description}
                  </p>
                </div>
              </div>
              <button
                onClick={() =>
                  navigate(`/rocket/${rocket.id}`, {
                    state: { launchId: launch.id, launchName: launch.name },
                  })
                }
                className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
                aria-label={`View full details for rocket ${rocket.name}`}
              >
                View Full Rocket Details
              </button>
            </motion.div>
          ) : (
            <motion.p
              key="no-rocket-info"
              className="text-gray-500 italic"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              No rocket information available.
            </motion.p>
          )}
        </AnimatePresence>
      </section>
    </motion.div>
  );
}
