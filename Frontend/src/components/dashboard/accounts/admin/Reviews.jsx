import ReviewsHeader from "../../../common/DashboardHeader";
import ReviewsTable from "../../../dashboard/Table";
import { useEffect, useState } from "react";
import NoResult from "../../../../pages/NoResult";
import Loading from "../../../../pages/Loading";
import { useUser } from "../../../common/UserContext";
import { getAllReviews } from "../../../../services/operations/adminAndOwnerDashboardApi";

const headers = [
  { label: "S No.", width: "10%" },
  { label: "Name", width: "20%" },
  { label: "Email", width: "25%" },
  { label: "Date", width: "25%" },
  { label: "Rating", width: "20%" },
];

const getKeyFromLabel = (label) =>
  label.toLowerCase().replace(/\s+/g, "").replace(/\./g, "");

function Reviews() {
  const { user } = useUser();
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
  const numberOfEntries = 10;

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { searchQuery, selectedFilters, sortOrder } = filterState;

        const params = new URLSearchParams();
        if (searchQuery) params.append("search", searchQuery);
        if (selectedFilters) {
          if (selectedFilters["Date Interval"]) {
            const { startDate, endDate } = selectedFilters["Date Interval"];
            if (startDate) params.append("startDate", startDate);
            if (endDate) params.append("endDate", endDate);
          }
          if (selectedFilters["Rating"]) {
            params.append("rating", selectedFilters["Rating"]);
          }
        }
        if (sortOrder) params.append("sort", sortOrder);
        params.append("page", currentPage);
        params.append("limit", numberOfEntries);

        const response = await getAllReviews(user.token, params.toString());

        const { data } = response;
        setReviews(data.reviews);
        setTotalPages(response.totalPages);
        setTotalReviews(response.total);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setLoading(false);
      }
    };

    fetchReviews();
  }, [currentPage, filterState]);

  if (loading) return <Loading />;

  const transformedReviews = reviews.map((review, idx) => {
    const row = {};
    headers.forEach((header, i) => {
      const key = getKeyFromLabel(header.label);
      if (key === "sno") {
        row[key] = (currentPage - 1) * 9 + idx + 1;
      } else if (key === "date") {
        row[key] = new Date(review.createdAt).toDateString();
      } else if (key === "rating") {
        row[key] = review[key] || "-";
      } else {
        row[key] = review.user[key] || "-";
      }
    });

    row._id = review._id;
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

      {reviews.length > 0 ? (
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
