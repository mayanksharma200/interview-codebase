import React, { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchRocketById } from "../api/spacex";
import { motion } from "framer-motion";

export default function RocketDetail() {
  const { id } = useParams();
  const location = useLocation();

  const launchId = location.state?.launchId;
  const launchName = location.state?.launchName;

  const {
    data: rocket,
    isLoading,
    error,
  } = useQuery(["rocket", id], () => fetchRocketById(id), { enabled: !!id });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [rocket]);

  //carousel state
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!rocket?.flickr_images?.length) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % rocket.flickr_images.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [rocket]);

  //skel loader
  const skeletonVariants = {
    pulse: {
      opacity: [0.6, 1, 0.6],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  //fade
  const fadeVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.6 } },
    exit: { opacity: 0, transition: { duration: 0.4 } },
  };

  if (isLoading)
    return (
      <motion.div
        className="max-w-5xl mx-auto p-8 bg-white rounded-2xl shadow-xl border border-gray-100"
        variants={fadeVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <motion.div
          className="h-12 w-1/3 bg-gray-300 rounded mb-6"
          variants={skeletonVariants}
          animate="pulse"
        />

        <motion.div
          className="w-full h-96 rounded-xl bg-gray-300 mb-8"
          variants={skeletonVariants}
          animate="pulse"
        />

        <motion.div
          className="h-6 w-full bg-gray-300 rounded mb-4"
          variants={skeletonVariants}
          animate="pulse"
        />
        <motion.div
          className="h-6 w-full bg-gray-300 rounded mb-4"
          variants={skeletonVariants}
          animate="pulse"
        />
        <motion.div
          className="h-6 w-2/3 bg-gray-300 rounded mb-4"
          variants={skeletonVariants}
          animate="pulse"
        />
      </motion.div>
    );

  if (error)
    return (
      <motion.div
        className="p-8 text-center text-red-600"
        variants={fadeVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        Error loading rocket details.
      </motion.div>
    );
  if (!rocket)
    return (
      <motion.div
        className="p-8 text-center"
        variants={fadeVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        Rocket not found.
      </motion.div>
    );

  return (
    <motion.div
      className="max-w-5xl mx-auto p-8 bg-white rounded-2xl shadow-xl border border-gray-100"
      variants={fadeVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <nav className="text-sm mb-6" aria-label="Breadcrumb">
        <ol className="list-reset flex text-gray-600">
          {launchId && launchName ? (
            <>
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
              <li>
                <Link
                  to={`/launch/${launchId}`}
                  className="hover:text-indigo-600 font-semibold underline"
                >
                  {launchName}
                </Link>
              </li>
              <li>
                <span className="mx-2">/</span>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  to="/rockets"
                  className="hover:text-indigo-600 font-semibold underline"
                >
                  Rockets
                </Link>
              </li>
              <li>
                <span className="mx-2">/</span>
              </li>
            </>
          )}
          <li className="text-gray-900 font-semibold">{rocket.name}</li>
        </ol>
      </nav>

      <h1 className="text-4xl font-extrabold mb-6 text-gray-900">
        {rocket.name}
      </h1>

      <div className="relative w-full h-96 mb-8 rounded-xl overflow-hidden shadow-lg">
        {rocket.flickr_images.map((img, idx) => (
          <motion.img
            key={idx}
            src={img}
            alt={`${rocket.name} image ${idx + 1}`}
            className="absolute top-0 left-0 w-full h-full object-cover"
            initial={false}
            animate={{ opacity: idx === currentIndex ? 1 : 0 }}
            transition={{ duration: 0.5 }}
            style={{ pointerEvents: idx === currentIndex ? "auto" : "none" }}
          />
        ))}
      </div>

      <div className="space-y-4 text-gray-800">
        <p>{rocket.description}</p>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <strong>First Flight:</strong>{" "}
            {new Date(rocket.first_flight).toLocaleDateString()}
          </div>
          <div>
            <strong>Country:</strong> {rocket.country}
          </div>
          <div>
            <strong>Company:</strong> {rocket.company}
          </div>
          <div>
            <strong>Cost per Launch:</strong> $
            {rocket.cost_per_launch.toLocaleString()}
          </div>
          <div>
            <strong>Success Rate:</strong> {rocket.success_rate_pct}%
          </div>
          <div>
            <strong>Stages:</strong> {rocket.stages}
          </div>
          <div>
            <strong>Boosters:</strong> {rocket.boosters}
          </div>
          <div>
            <strong>Mass:</strong> {rocket.mass.kg.toLocaleString()} kg
          </div>
          <div>
            <strong>Height:</strong> {rocket.height.meters} m
          </div>
          <div>
            <strong>Diameter:</strong> {rocket.diameter.meters} m
          </div>
          <div>
            <strong>Landing Legs:</strong> {rocket.landing_legs.number} (
            {rocket.landing_legs.material || "N/A"})
          </div>
        </div>

        <a
          href={rocket.wikipedia}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-6 text-indigo-600 font-semibold hover:text-indigo-800 underline"
        >
          Wikipedia
        </a>
      </div>
    </motion.div>
  );
}
