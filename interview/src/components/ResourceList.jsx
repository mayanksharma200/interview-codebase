import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchLaunches } from "../api/spacex";
import { Link } from "react-router-dom";

const PAGE_SIZE = 10;

function getPageNumbers(currentPage, totalPages, maxButtons = 5) {
  const half = Math.floor(maxButtons / 2);
  let start = Math.max(1, currentPage - half);
  let end = Math.min(totalPages, currentPage + half);

  if (currentPage <= half) {
    end = Math.min(totalPages, maxButtons);
  } else if (currentPage + half >= totalPages) {
    start = Math.max(1, totalPages - maxButtons + 1);
  }

  const pages = [];
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      <td className="py-4 px-3">
        <div className="h-5 bg-gray-300 rounded w-28 sm:w-32"></div>
      </td>
      <td className="py-4 px-3">
        <div className="h-5 bg-gray-300 rounded w-20 sm:w-24"></div>
      </td>
      <td className="py-4 px-3">
        <div className="h-5 bg-gray-300 rounded w-16 sm:w-20"></div>
      </td>
    </tr>
  );
}

export default function ResourceList() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, error, refetch } = useQuery(
    ["launches", search, page],
    () =>
      fetchLaunches(
        search ? { name: { $regex: search, $options: "i" } } : {},
        PAGE_SIZE,
        page
      ),
    { keepPreviousData: true }
  );

  const launches = data?.docs || [];
  const {
    totalPages = 1,
    page: currentPage = 1,
    hasPrevPage,
    hasNextPage,
    prevPage,
    nextPage,
  } = data || {};

  const maxPageButtons = 5;
  const pageNumbers = getPageNumbers(currentPage, totalPages, maxPageButtons);

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4 sm:gap-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          SpaceX Launches
        </h1>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search launches by name"
            value={search}
            onChange={(e) => {
              setSearch(e.currentTarget.value);
              setPage(1);
            }}
            className="w-full sm:w-auto flex-1 px-4 py-2 sm:py-3 border border-gray-300 rounded-lg shadow-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 transition duration-300 text-sm sm:text-base"
            aria-label="Search launches by name"
          />
          <button
            onClick={() => {
              setPage(1);
              refetch();
            }}
            className="w-full sm:w-auto px-6 py-2 sm:py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-400 transition duration-300 text-sm sm:text-base"
            aria-label="Search launches"
          >
            Search
          </button>
        </div>
      </header>

      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-sm sm:text-base">
          <thead className="bg-indigo-600">
            <tr>
              <th className="py-3 px-4 text-left font-semibold text-white uppercase tracking-wide">
                Name
              </th>
              <th className="py-3 px-4 text-left font-semibold text-white uppercase tracking-wide">
                Date UTC
              </th>
              <th className="py-3 px-4 text-left font-semibold text-white uppercase tracking-wide">
                Details
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {isLoading ? (
              Array.from({ length: PAGE_SIZE }).map((_, idx) => (
                <SkeletonRow key={idx} />
              ))
            ) : launches.length > 0 ? (
              launches.map((launch) => (
                <tr
                  key={launch.id}
                  className="hover:bg-indigo-50 transition-colors duration-200 cursor-pointer"
                >
                  <td className="py-3 px-4 text-gray-900 font-medium whitespace-nowrap">
                    {launch.name}
                  </td>
                  <td className="py-3 px-4 text-gray-700 whitespace-nowrap">
                    {new Date(launch.date_utc).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </td>
                  <td className="py-3 px-4">
                    <Link
                      to={`/launch/${launch.id}`}
                      className="text-indigo-600 font-semibold hover:text-indigo-800 underline transition text-sm sm:text-base"
                      aria-label={`View details for ${launch.name}`}
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={3}
                  className="text-center py-8 text-gray-500 italic select-none"
                >
                  No launches found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <nav
        className="flex flex-wrap justify-center items-center space-x-1 sm:space-x-2 mt-6"
        aria-label="Pagination"
      >
        <button
          onClick={() => setPage(prevPage)}
          disabled={!hasPrevPage}
          className={`px-3 py-1 rounded-md font-semibold text-sm sm:text-base ${
            !hasPrevPage
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
          } transition`}
          aria-label="Previous page"
        >
          Previous
        </button>

        {/*1st page*/}
        {pageNumbers[0] > 1 && (
          <>
            <button
              onClick={() => setPage(1)}
              className="px-3 py-1 rounded-md font-semibold text-sm sm:text-base bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition"
            >
              1
            </button>
            {pageNumbers[0] > 2 && (
              <span className="px-2 select-none">...</span>
            )}
          </>
        )}

        {/* pageButtons */}
        {pageNumbers.map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => setPage(pageNum)}
            aria-current={currentPage === pageNum ? "page" : undefined}
            className={`px-3 py-1 rounded-md font-semibold text-sm sm:text-base transition ${
              currentPage === pageNum
                ? "bg-indigo-700 text-white shadow-lg"
                : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
            }`}
          >
            {pageNum}
          </button>
        ))}

        {/* endPage*/}
        {pageNumbers[pageNumbers.length - 1] < totalPages && (
          <>
            {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
              <span className="px-2 select-none">...</span>
            )}
            <button
              onClick={() => setPage(totalPages)}
              className="px-3 py-1 rounded-md font-semibold text-sm sm:text-base bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition"
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => setPage(nextPage)}
          disabled={!hasNextPage}
          className={`px-3 py-1 rounded-md font-semibold text-sm sm:text-base ${
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
