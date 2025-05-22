import useSafeNavigate from "../../utils/useSafeNavigate";
import RatingStars from "../common/RatingStars";
import Pagination from "../common/Pagination";

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

export default function Table({
  headers,
  data,
  currentPage,
  setCurrentPage,
  totalPages,
}) {
  const navigate = useSafeNavigate();

  const getKeyFromLabel = (label) =>
    label.toLowerCase().replace(/\s+/g, "").replace(/\./g, "");

  return (
    <div className="w-full pb-4">
      {/* For Desktop: Scrollable Grid View */}
      <div className="hidden md:block overflow-x-auto">
        <div className="min-w-max space-y-1">
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

          {/* Rows */}
          <div className="space-y-0.5">
            {data.map((item, idx) => (
              <div
                key={idx}
                onClick={() => navigate(item._id)}
                className="grid py-1 bg-primary-light text-text-heading shadow rounded-md hover:bg-secondary-light cursor-pointer transition px-3 hover:bg-primary-dark"
                style={{
                  gridTemplateColumns: headers.map((h) => h.width).join(" "),
                }}
              >
                {headers.map((header, i) => {
                  const key = getKeyFromLabel(header.label);
                  const value = item[key];

                  return (
                    <div key={i} className="px-2 py-1.5">
                      {key === "status" ? (
                        <span
                          className={`text-sm rounded-md border px-2 py-1 ${getStatusStyle(
                            value
                          )}`}
                        >
                          {value}
                        </span>
                      ) : key === "rating" ? (
                        <RatingStars Review_Count={value} />
                      ) : (
                        <span className="block">{value}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* For Mobile: Card View */}
      <div className="block md:hidden space-y-2">
        {data.map((item, idx) => (
          <div
            key={idx}
            onClick={() => navigate(item._id)}
            className="bg-primary-light text-text-heading shadow rounded-md p-4 hover:bg-primary-dark transition cursor-pointer"
          >
            {headers.map((header, i) => {
              const key = getKeyFromLabel(header.label);
              const value = item[key];

              return (
                <div key={i} className="mb-2 flex flex-wrap items-center">
                  <p className="text-xs font-semibold text-text-subtle">
                    {header.label}:
                  </p>
                  {key === "status" ? (
                    <span
                      className={`text-sm rounded-md border px-2 py-1 inline-block mt-1 ${getStatusStyle(
                        value
                      )}`}
                    >
                      {value}
                    </span>
                  ) : key === "rating" ? (
                    <div className="">
                      <RatingStars Review_Count={value} />
                    </div>
                  ) : (
                    <p className="text-sm ">{value}</p>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
