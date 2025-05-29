import { useEffect, useState } from "react";
import FeedbackHeader from "../../../common/DashboardHeader";
import { FaChevronDown, FaChevronUp, FaPen, FaTimes } from "react-icons/fa";
import NoResult from "../../../../pages/NoResult";
import Pagination from "../../../common/Pagination";
import {
  getAllFeedbacks,
  respondToFeedback,
} from "../../../../services/operations/adminAndOwnerDashboardApi";
import { useUser } from "../../../common/UserContext";
import Loading from "../../../../pages/Loading";

function Feedbacks() {
  const { user } = useUser();
  const [filterState, setFilterState] = useState({
    searchQuery: "",
    sortOrder: "asc",
    selectedFilters: [],
  });

  const [expandedFeedback, setExpandedFeedback] = useState(null);
  const [replyingFeedback, setReplyingFeedback] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [feedbacks, setFeedbacks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalFeedbacks, setTotalFeedbacks] = useState(0);
  const [loading, setLoading] = useState(true);
  const numberOfEntries = 5;

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        setLoading(true);
        const { searchQuery, selectedFilters, sortOrder } = filterState;

        const params = new URLSearchParams();
        if (searchQuery) params.append("search", searchQuery);
        if (selectedFilters) {
          if (selectedFilters["Date Interval"]) {
            const { startDate, endDate } = selectedFilters["Date Interval"];
            if (startDate) params.append("startDate", startDate);
            if (endDate) params.append("endDate", endDate);
          }
          if (selectedFilters["Status"]) {
            params.append("status", selectedFilters["Status"]);
          }
        }
        if (sortOrder) params.append("sort", sortOrder);
        params.append("page", currentPage);
        params.append("limit", numberOfEntries);
        const response = await getAllFeedbacks(user.token, params.toString());
        const { data } = response;
        setFeedbacks(data.feedbacks);
        setTotalPages(response.totalPages);
        setTotalFeedbacks(response.total);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, [currentPage, filterState]);

  const handleReply = async (id) => {
    try {
      setLoading(true);
      const response = await respondToFeedback(id, replyMessage, user.token);
      setReplyingFeedback(null);
      setReplyMessage("");
    } catch {
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className=" p-2 bg-primary-light h-full overflow-y-auto scrollbar-hide">
      <FeedbackHeader
        title="Feedbacks"
        totalCount={totalFeedbacks}
        filterState={filterState}
        setFilterState={setFilterState}
        filterOptions={[
          {
            label: "Status",
            id: "status",
            children: [
              { label: "Pending", value: "unresolved" },
              { label: "Resolved", value: "resolved" },
            ],
          },
          {
            label: "Date Interval",
            id: "date-interval",
            children: [
              { label: "Start Date", value: "startDate", type: "date" },
              { label: "End Date", value: "endDate", type: "date" },
            ],
          },
        ]}
      />
      {feedbacks.length > 0 ? (
        <>
          {feedbacks.map((feedback, index) => (
            <div
              key={index}
              className="bg-primary rounded-2xl mb-2 shadow-lg p-6 border-t-2 border-button"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-text-heading mb-2">
                  {feedback.name}
                </h2>
                <button
                  onClick={() =>
                    setExpandedFeedback(
                      expandedFeedback === feedback._id ? null : feedback._id
                    )
                  }
                  className="text-text-heading hover:text-button transition cursor-pointer"
                >
                  {expandedFeedback === feedback._id ? (
                    <FaChevronUp size={20} />
                  ) : (
                    <FaChevronDown size={20} />
                  )}
                </button>
              </div>

              <div className="flex bg-primary-dark justify-between text-text-heading p-2  rounded-md  shadow-sm">
                <p className="text-text-body rounded-md shadow-sm">
                  {feedback.subject}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  {feedback.isResolved ? "Resolved" : "Pending"}
                </p>
              </div>

              {expandedFeedback === feedback._id && (
                <div className="flex flex-col p-4 rounded-md shadow-sm">
                  <p className="font-normal text-text-heading">
                    <strong>Message:</strong> {feedback.message}
                  </p>
                  <p className="font-normal text-text-heading">
                    <strong>Date:</strong>{" "}
                    {new Date(feedback.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              )}

              {replyingFeedback === feedback._id ? (
                <div className="relative p-4  bg-primary-dark border border-button rounded-md shadow space-y-4 mt-4">
                  <button
                    onClick={() => setReplyingFeedback(null)}
                    className="absolute top-2 right-2 "
                  >
                    <FaTimes size={18} className="text-button" />
                  </button>
                  <div className="space-y-2">
                    <p className="text-text-heading font-semibold ">
                      Write your response:
                    </p>
                    <textarea
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      rows="3"
                      placeholder="Enter your reply here..."
                      className="w-full bg-primary text-text-heading p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-button"
                    />
                    <button
                      onClick={() => handleReply(feedback._id)}
                      className="px-4 py-2 bg-button text-white rounded-md hover:bg-button-hover cursor-pointer"
                    >
                      Send Reply
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-4 mt-4">
                  {!feedback.isResolved && (
                    <button
                      onClick={() => setReplyingFeedback(feedback._id)}
                      disabled={feedback.isResolved}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-button text-white  hover:bg-button-hover cursor-pointer 
                    "
                    >
                      <FaPen size={16} /> Write Response
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      ) : (
        <NoResult />
      )}
    </div>
  );
}

export default Feedbacks;
