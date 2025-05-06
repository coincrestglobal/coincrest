import useSafeNavigate from "../../utils/useSafeNavigate";
import { useState } from "react";
import RatingStars from "../common/RatingStars";

function getStatusStyle(status) {
  switch (status) {
    case "paid":
    case "completed":
      return "bg-primary-light text-text-heading border-primary-dark px-2 py-1 rounded";
    case "pending":
    case "ongoing":
      return "bg-secondary-light text-secondary-dark border-secondary px-2 py-1 rounded";
    case "failed":
    case "rejected":
      return "bg-red-200 text-red-800 border-red-500 px-2 py-1 rounded";
    case "refunded":
    case "upcoming":
      return "bg-blue-200 text-blue-800 border-blue-500 px-2 py-1 rounded";
    case "free":
      return "bg-gray-200 text-text-body border-gray-500 px-2 py-1 rounded";
    default:
      return "bg-red-200 text-red-800 border-red-500 px-2 py-1 rounded";
  }
}

export default function Table({ headers, data, itemsPerPage = 5 }) {
  const navigate = useSafeNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const currentRows = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="w-full pb-4">
      {/* Scrollable Table Wrapper */}
      <div className="overflow-x-auto">
        <div className="min-w-max space-y-1 ">
          {/* Header */}
          <div
            className="grid bg-primary-light text-text-heading font-semibold rounded-md px-3 py-1"
            style={{
              gridTemplateColumns: headers
                .map((header) => `minmax(${header.width}, 1fr)`)
                .join(" "),
            }}
          >
            {headers.map((header, index) => (
              <div key={index} className="p-2">
                {header.label}
              </div>
            ))}
          </div>

          {/* Body */}
          <div className="space-y-0.5">
            {currentRows.map((item, idx) => (
              <div
                key={idx}
                onClick={() => navigate(item.id)}
                className="grid py-1 bg-primary-light text-text-heading shadow rounded-md hover:bg-secondary-light cursor-pointer transition px-3"
                style={{
                  gridTemplateColumns: headers
                    .map((header) => header.width)
                    .join(" "),
                }}
              >
                {Object.values(item).map((value, i) => (
                  <div key={i} className="px-2 py-1.5">
                    {i === 0 ? ( // First column -> Serial Number (S. No.)
                      <span className="block font-semibold">
                        {(currentPage - 1) * itemsPerPage + idx + 1}
                      </span>
                    ) : headers[i].label.toLowerCase() === "status" ? ( // Status column with styles
                      <span
                        className={`text-sm rounded-md border px-2 py-1 ${getStatusStyle(
                          value
                        )}`}
                      >
                        {value}
                      </span>
                    ) : headers[i].label.toLowerCase() === "rating" ? ( // Rating column
                      <RatingStars Review_Count={value} />
                    ) : (
                      <span className="block">{value}</span> // Default case
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pagination (Outside Scrollable Area) */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-2 py-1 rounded-md ${
              currentPage === 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-button text-text-heading hover:bg-button-hover cursor-pointer"
            }`}
          >
            Prev
          </button>
          <span className="text-text-link font-semibold">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-2 py-1 rounded-md ${
              currentPage === totalPages
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-button text-text-heading hover:bg-button-hover cursor-pointer"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
