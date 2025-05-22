import ReviewsHeader from "../../../common/DashboardHeader";
import ReviewsTable from "../../../dashboard/Table";
import { useEffect, useState } from "react";
import NoResult from "../../../../pages/NoResult";
import Loading from "../../../../pages/Loading";

const reivewsData = Array.from({ length: 10 }, (_, i) => ({
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

const getKeyFromLabel = (label) =>
  label.toLowerCase().replace(/\s+/g, "").replace(/\./g, "");

function Reviews() {
  const [filterState, setFilterState] = useState({
    searchQuery: "",
    sortOrder: "asc",
    selectedFilters: [],
  });

  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { searchQuery, selectedFilters } = filterState;

        // const params = new URLSearchParams();
        // if (searchQuery) params.append("search", searchQuery);
        // if (selectedFilters.length > 0)
        //   params.append("selectedFilters", selectedFilters.join(","));
        // params.append("page", currentPage);
        // params.append("limit", 3);

        // const response = await getAllReviews(params.toString()); // ← You need to have this API function

        // const { data } = response;
        setReviews(reivewsData);
        setTotalPages(reivewsData.totalPages);
        setTotalReviews(reivewsData.total);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setLoading(false);
      }
    };

    fetchReviews();
  }, [currentPage, filterState]);

  if (loading) return <Loading />;

  const sortedReviews = [...reviews].sort((a, b) => {
    return filterState.sortOrder === "asc"
      ? a.name?.localeCompare(b.name) // if review has a user name
      : b.name?.localeCompare(a.name);
  });

  const transformedReviews = sortedReviews.map((review, idx) => {
    const row = {};
    headers.forEach((header, i) => {
      const key = getKeyFromLabel(header.label);
      if (key === "sno") {
        row[key] = (currentPage - 1) * 9 + idx + 1;
      } else if (key === "lastvisit") {
        row[key] = new Date(review.updatedAt).toDateString();
      } else {
        row[key] = review[key] || "-";
      }
    });

    row._id = review.id;
    return row;
  });

  return (
    <div className="px-4 py-4 h-full overflow-y-auto scrollbar-hide bg-[var(--primary)]">
      <ReviewsHeader
        title="Reviews"
        totalCount={totalReviews}
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
          data={transformedReviews}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
        />
      ) : (
        <NoResult />
      )}
    </div>
  );
}

export default Reviews;
