import React from "react";

function Pagination({ currentPage, totalPages, onPageChange }) {
  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <div className="flex justify-center items-center space-x-4 p-2">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        className={`px-2 py-1 rounded-md ${
          currentPage === 1
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-button text-text-heading hover:bg-button-hover cursor-pointer"
        }`}
      >
        Prev
      </button>
      <span className="text-text-body">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        className={`px-2 py-1 rounded-md ${
          currentPage === totalPages
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-button text-text-heading hover:bg-button-hover cursor-pointer"
        }`}
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;
