import ReviewsHeader from "../../../common/DashboardHeader";
import ReviewsTable from "../../../dashboard/Table";
import { useEffect, useState } from "react";
import NoResult from "../../../../pages/NoResult";

const reivewsData = Array.from({ length: 50 }, (_, i) => ({
  id: (i + 1).toString(),
  name: ["John Doe", "Jane Smith", "Sam Wilson", "Lucy Heart"][i % 4],
  email: [
    "john@example.com",
    "jane@example.com",
    "sam@example.com",
    "lucy@example.com",
  ][i % 4],
  date: `2024-03-${(i % 30) + 1}`.padStart(10, "0"),
  rating: [4, 5, 4.5][i % 3],
}));

const headers = [
  { label: "S No.", width: "10%" },
  { label: "Name", width: "25%" },
  { label: "Email", width: "25%" },
  { label: "Date", width: "20%" },
  { label: "Rating", width: "20%" },
];

function Reviews() {
  const [filterState, setFilterState] = useState({
    searchQuery: "",
    sortOrder: "asc",
    selectedFilters: [],
  });

  const [reviews, setReviews] = useState(reivewsData);

  useEffect(() => {
    function fetchReviews(query) {
      return reivewsData.filter(
        (review) =>
          review &&
          review.name &&
          review.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    const filteredReviews = fetchReviews(filterState.searchQuery);
    setReviews(filteredReviews);
  }, [filterState.searchQuery, filterState.selectedFilters]);

  const sortedReviews = [...reviews].sort((a, b) => {
    return filterState.sortOrder === "asc"
      ? new Date(a.date) - new Date(b.date)
      : new Date(b.date) - new Date(a.date);
  });

  return (
    <div className="px-4 py-4 h-full overflow-y-auto scrollbar-hide bg-[var(--primary)]">
      <ReviewsHeader
        title="Reviews"
        totalCount={sortedReviews.length}
        filterState={filterState}
        setFilterState={setFilterState}
        filterOptions={[
          {
            label: "Rating",
            children: [
              { label: "Above 1", value: "above_1" },
              { label: "Above 2", value: "above_2" },
              { label: "Above 3", value: "above_3" },
              { label: "Above 4", value: "above_4" },
            ],
          },
          {
            label: "Date Interval",
            children: [
              { label: "Start Date", value: "startDate", type: "date" },
              { label: "End Date", value: "endDate", type: "date" },
            ],
          },
        ]}
      />

      {sortedReviews.length > 0 ? (
        <ReviewsTable
          headers={headers}
          data={sortedReviews}
          itemsPerPage={9}
          rowClassName="text-text-body"
          headerClassName="text-text-heading bg-primary"
        />
      ) : (
        <NoResult />
      )}
    </div>
  );
}

export default Reviews;
