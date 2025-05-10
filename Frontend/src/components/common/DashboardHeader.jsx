import { ArrowLeft, ArrowUp, ArrowDown, Search } from "lucide-react";
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
  const navigate = useSafeNavigate();
  const [query, setQuery] = useState(filterState.searchQuery || "");

  if (totalCount <= 0) {
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
    <div className="flex items-center justify-between bg-[var(--primary)] border border-[var(--secondary2)] p-3 rounded-md shadow-sm mb-2 w-full">
      <div className="flex items-center space-x-4">
        {title !== "Recent Platform Updates" && (
          <button
            onClick={() => navigate(-1)}
            className="bg-[var(--button)] hover:bg-[var(--button-hover)] text-white p-2 rounded-full shadow-md transition cursor-pointer h-9 w-9 flex items-center justify-center"
          >
            <ArrowLeft className="w-4 h-4 text-[var(--text-heading)]" />
          </button>
        )}

        <h3 className="text-lg font-semibold text-[var(--text-subheading)]">
          {title}: {totalCount}
        </h3>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="text"
          placeholder={`Search ${title.toLowerCase()}`}
          value={query}
          onChange={(e) => {
            const value = e.target.value;
            setQuery(value);
            if (value === "") {
              setFilterState((prevState) => ({
                ...prevState,
                searchQuery: "",
              }));
            }
          }}
          className="bg-[var(--primary-light)] border border-[var(--secondary2)] px-3 py-1.5 rounded-md text-sm w-64 focus:border-[var(--button-hover)] text-[var(--text-body)] outline-none h-9"
        />
        <button
          onClick={() =>
            setFilterState((prevState) => ({
              ...prevState,
              searchQuery: query,
            }))
          }
          className="bg-[var(--button)] hover:bg-[var(--button-hover)] text-white px-3 py-1.5 rounded-md shadow-md flex cursor-pointer items-center h-9"
        >
          <Search className="w-4 h-4 text-[var(--text-heading)]" />
        </button>

        <button
          onClick={() => {
            setFilterState((prevState) => ({
              ...prevState,
              sortOrder: prevState.sortOrder === "asc" ? "desc" : "asc",
            }));
          }}
          className="bg-[var(--button)] hover:bg-[var(--button-hover)] text-white px-3 py-1.5 rounded-md shadow-md h-9 cursor-pointer"
        >
          {filterState.sortOrder === "asc" ? (
            <ArrowUp className="w-4 h-4 text-[var(--text-heading)]" />
          ) : (
            <ArrowDown className="w-4 h-4 text-[var(--text-heading)]" />
          )}
        </button>

        {filterOptions && (
          <FilterDropdown
            options={filterOptions}
            selectedFilters={filterState.selectedFilters}
            setSelectedFilters={setFilterState}
            style={{ width: "w-48", maxHeight: "max-h-64" }}
          />
        )}
      </div>
    </div>
  );
}

export default DashboardHeader;
