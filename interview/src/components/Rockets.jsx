import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchRockets } from "../api/spacex";
import { useNavigate } from "react-router-dom";

const PAGE_SIZE = 10;

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      <td className="py-4 px-6" colSpan={4}>
        <div className="h-24 bg-gray-300 rounded w-full"></div>
      </td>
    </tr>
  );
}

export default function Rockets() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const { data, isLoading, error, refetch } = useQuery(
    ["rockets", search, page],
    () =>
      fetchRockets(
        search ? { name: { $regex: search, $options: "i" } } : {},
        PAGE_SIZE,
        page
      ),
    { keepPreviousData: true }
  );

  const rockets = data?.docs || [];
  const {
    totalPages = 1,
    page: currentPage = 1,
    hasPrevPage,
    hasNextPage,
    prevPage,
    nextPage,
  } = data || {};

  return (
    <div className="max-w-6xl mx-auto p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Rockets</h1>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-6">
        <input
          type="text"
          placeholder="Search rockets by name"
          value={search}
          onChange={(e) => {
            setSearch(e.currentTarget.value);
            setPage(1);
          }}
          className="flex-1 px-5 py-3 border border-gray-300 rounded-lg shadow-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 transition duration-300"
          aria-label="Search rockets by name"
        />
        <button
          onClick={() => {
            setPage(1);
            refetch();
          }}
          className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-400 transition duration-300"
          aria-label="Search rockets"
        >
          Search
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-indigo-600">
            <tr>
              <th className="py-4 px-6 text-left text-sm font-semibold text-white uppercase tracking-wide">
                Name
              </th>
              <th className="py-4 px-6 text-left text-sm font-semibold text-white uppercase tracking-wide">
                Type
              </th>
              <th className="py-4 px-6 text-left text-sm font-semibold text-white uppercase tracking-wide">
                Active
              </th>
              <th className="py-4 px-6 text-left text-sm font-semibold text-white uppercase tracking-wide">
                View Details
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {isLoading ? (
              Array.from({ length: PAGE_SIZE }).map((_, idx) => (
                <SkeletonRow key={idx} />
              ))
            ) : rockets.length > 0 ? (
              rockets.map((rocket) => (
                <tr
                  key={rocket.id}
                  className="hover:bg-indigo-50 transition-colors duration-200"
                >
                  <td className="py-4 px-6 text-gray-900 font-medium whitespace-nowrap">
                    {rocket.name}
                  </td>
                  <td className="py-4 px-6 text-gray-700 whitespace-nowrap">
                    {rocket.type}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                        rocket.active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {rocket.active ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => navigate(`/rocket/${rocket.id}`)}
                      className="text-indigo-600 font-semibold hover:text-indigo-800 underline transition"
                      aria-label={`View details for ${rocket.name}`}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="text-center py-8 text-gray-500 italic select-none"
                >
                  No rockets found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <nav
        className="flex justify-center items-center space-x-2 mt-8"
        aria-label="Pagination"
      >
        <button
          onClick={() => setPage(prevPage)}
          disabled={!hasPrevPage}
          className={`px-4 py-2 rounded-md font-semibold ${
            !hasPrevPage
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
          } transition`}
          aria-label="Previous page"
        >
          Previous
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => setPage(pageNum)}
            aria-current={currentPage === pageNum ? "page" : undefined}
            className={`px-4 py-2 rounded-md font-semibold transition ${
              currentPage === pageNum
                ? "bg-indigo-700 text-white shadow-lg"
                : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
            }`}
          >
            {pageNum}
          </button>
        ))}

        <button
          onClick={() => setPage(nextPage)}
          disabled={!hasNextPage}
          className={`px-4 py-2 rounded-md font-semibold ${
            !hasNextPage
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
          } transition`}
          aria-label="Next page"
        >
          Next
        </button>
      </nav>
    </div>
  );
}
