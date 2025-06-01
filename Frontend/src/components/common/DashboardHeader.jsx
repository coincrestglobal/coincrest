import { ArrowLeft, ArrowUp, ArrowDown, Search } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import useSafeNavigate from "../../utils/useSafeNavigate";
import FilterDropdown from "./FilterDropdown";
import { useState } from "react";

function DashboardHeader({
  title,
  totalCount,
  filterState,
  setFilterState,
  filterOptions,
}) {
  const location = useLocation();
  const navigate = useSafeNavigate();
  const [query, setQuery] = useState(filterState.searchQuery || "");
  const isClosurePage =
    location.pathname ===
    "/dashboard/owner/control-pannel/investment-closure-requests";

  if (totalCount <= 0 && !isClosurePage) {
    return (
      <div className="bg-[var(--primary)] border border-[var(--secondary2)] p-3 rounded-md shadow-sm mb-2 w-full">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="bg-[var(--button)] hover:bg-[var(--button-hover)] text-white p-2 rounded-full shadow-md transition cursor-pointer h-9 w-9 flex items-center justify-center"
          >
            <ArrowLeft className="w-4 h-4 text-[var(--text-heading)]" />
          </button>
          <h3 className="text-lg font-semibold text-[var(--text-subheading)]">
            No Results
          </h3>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--primary)] border border-[var(--secondary2)] p-3 rounded-md shadow-sm mb-2 w-full flex flex-col lg:flex-row justify-between gap-3">
      {/* Title and Back */}
      <div className="flex items-center space-x-3 flex-shrink-0">
        {title !== "Recent Platform Updates" && (
          <button
            onClick={() => navigate(-1)}
            className="bg-[var(--button)] hover:bg-[var(--button-hover)] text-white p-2 rounded-full shadow-md transition cursor-pointer h-9 w-9 flex items-center justify-center"
          >
            <ArrowLeft className="w-4 h-4 text-[var(--text-heading)]" />
          </button>
        )}
        <h3 className="text-base sm:text-lg font-semibold text-[var(--text-subheading)]">
          {title}: {totalCount}
        </h3>
      </div>

      {/* Controls container */}
      <div className="flex flex-col sm:flex-row lg:items-center w-full gap-2">
        {/* Search input with button */}
        <div className="flex flex-1">
          <input
            type="text"
            placeholder={`Search ${title.toLowerCase()}`}
            value={query}
            onChange={(e) => {
              const value = e.target.value;
              setQuery(value);
              if (value === "") {
                setFilterState((prev) => ({
                  ...prev,
                  searchQuery: "",
                }));
              }
            }}
            className="bg-[var(--primary-light)] border border-[var(--secondary2)] px-3 py-1.5 rounded-l-md text-sm w-full focus:border-[var(--button-hover)] text-[var(--text-body)] outline-none h-9"
          />
          <button
            onClick={() =>
              setFilterState((prev) => ({
                ...prev,
                searchQuery: query,
              }))
            }
            className="bg-[var(--button)] hover:bg-[var(--button-hover)] text-white px-3 py-1.5 rounded-r-md shadow-md flex items-center h-9"
          >
            <Search className="w-4 h-4 text-[var(--text-heading)]" />
          </button>
        </div>

        {/* Sort & Filter buttons */}
        <div className="flex items-center gap-2 justify-end">
          <button
            onClick={() => {
              setFilterState((prev) => ({
                ...prev,
                sortOrder: prev.sortOrder === "asc" ? "desc" : "asc",
              }));
            }}
            className="bg-[var(--button)] hover:bg-[var(--button-hover)] text-white px-3 py-1.5 rounded-md shadow-md h-9"
          >
            {filterState.sortOrder === "asc" ? (
              <ArrowUp className="w-4 h-4 text-[var(--text-heading)]" />
            ) : (
              <ArrowDown className="w-4 h-4 text-[var(--text-heading)]" />
            )}
          </button>

          {filterOptions && (
            <div className="w-full sm:w-auto">
              <FilterDropdown
                options={filterOptions}
                selectedFilters={filterState.selectedFilters}
                setSelectedFilters={setFilterState}
                style={{ width: "w-48", maxHeight: "max-h-64" }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardHeader;
