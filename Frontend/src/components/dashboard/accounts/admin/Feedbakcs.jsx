import { useEffect, useState } from "react";
import FeedbackHeader from "../../../common/DashboardHeader";
import { FaChevronDown, FaChevronUp, FaPen, FaTimes } from "react-icons/fa";
import NoResult from "../../../../pages/NoResult";
import Pagination from "../../../common/Pagination";

const feedbackList = [
  {
    id: "fdbk001",
    name: "Alice Crypto",
    email: "alice.crypto@example.com",
    subject: "Staking Delay - Not Reflected",
    message:
      "I staked 500 USDT but it's not showing up in my dashboard. Please assist.",
    date: new Date("2024-06-12").toLocaleDateString(),
    status: "Pending",
  },
  {
    id: "fdbk002",
    name: "Bob Miner",
    email: "bob.miner@example.com",
    subject: "Withdrawal Request Stuck",
    message:
      "My withdrawal request has been pending for over 24 hours. Kindly check.",
    date: new Date("2023-11-03").toLocaleDateString(),
    status: "Resolved",
  },
  {
    id: "fdbk003",
    name: "Carol Node",
    email: "carol.node@example.com",
    subject: "Reward Calculation Incorrect",
    message:
      "My weekly rewards seem lower than expected. Can someone review this?",
    date: new Date("2025-02-19").toLocaleDateString(),
    status: "Pending",
  },
  {
    id: "fdbk004",
    name: "Dave Ledger",
    email: "dave.ledger@example.com",
    subject: "UI Bug - Dashboard Crashing",
    message:
      "Whenever I visit the staking section, the app crashes. Kindly fix it.",
    date: new Date("2023-08-21").toLocaleDateString(),
    status: "Pending",
  },
  {
    id: "fdbk005",
    name: "Eva Wallet",
    email: "eva.wallet@example.com",
    subject: "Feedback - Smooth Onboarding",
    message: "The staking flow was super smooth. Kudos to the team!",
    date: new Date("2024-01-07").toLocaleDateString(),
    status: "Resolved",
  },
  {
    id: "fdbk006",
    name: "Frank Chain",
    email: "frank.chain@example.com",
    subject: "Suggestion - Add More Coins",
    message:
      "Can you support staking for ETH or BNB in future? That would be great!",
    date: new Date("2025-03-03").toLocaleDateString(),
    status: "Pending",
  },
  {
    id: "fdbk007",
    name: "Grace Vault",
    email: "grace.vault@example.com",
    subject: "Notification Bug",
    message:
      "Not getting any notifications for reward credits. Please check system logs.",
    date: new Date("2023-12-28").toLocaleDateString(),
    status: "Resolved",
  },
  {
    id: "fdbk008",
    name: "Hank Satoshi",
    email: "hank.satoshi@example.com",
    subject: "UI Improvement - Better History View",
    message:
      "It would be helpful to view staking and reward history more clearly.",
    date: new Date("2024-10-14").toLocaleDateString(),
    status: "Pending",
  },
  {
    id: "fdbk009",
    name: "Ivy Tron",
    email: "ivy.tron@example.com",
    subject: "Login Issue - OTP Delay",
    message:
      "Login OTPs are taking too long to arrive. Delays cause frustration.",
    date: new Date("2024-04-19").toLocaleDateString(),
    status: "Resolved",
  },
  {
    id: "fdbk010",
    name: "Jake Token",
    email: "jake.token@example.com",
    subject: "Feature Request - Multi-Account View",
    message: "I’d love to manage multiple staking accounts under one login.",
    date: new Date("2023-09-09").toLocaleDateString(),
    status: "Pending",
  },
];

function Feedbacks() {
  const [filterState, setFilterState] = useState({
    searchQuery: "",
    sortOrder: "asc",
    selectedFilters: [],
  });

  const [expandedFeedback, setExpandedFeedback] = useState(null);
  const [replyingFeedback, setReplyingFeedback] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [feedbacks, setFeedbacks] = useState(feedbackList);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Adjust as needed

  useEffect(() => {
    function fetchFeedbacks(query, filters) {
      let filtered = feedbackList;

      // Search filter
      if (query) {
        filtered = filtered.filter(
          !query ||
            user.name.toLowerCase().includes(query.toLowerCase()) ||
            user.email.toLowerCase().includes(query.toLowerCase())
        );
      }

      if (filters.status) {
        filtered = filtered.filter(
          (item) =>
            (filters.status === "pendingReview" && item.status === "Pending") ||
            (filters.status === "resolved" && item.status === "Resolved")
        );
      }

      // Date interval filters
      if (filters.startDate) {
        const start = new Date(filters.startDate);
        filtered = filtered.filter((item) => new Date(item.date) >= start);
      }

      if (filters.endDate) {
        const end = new Date(filters.endDate);
        filtered = filtered.filter((item) => new Date(item.date) <= end);
      }

      return filtered;
    }

    const filteredFeedbacks = fetchFeedbacks(
      filterState.searchQuery,
      filterState.selectedFilters
    );
    setFeedbacks(filteredFeedbacks);
  }, [filterState.searchQuery, filterState.selectedFilters]);

  const sortedFeedbacks = [...feedbacks].sort((a, b) => {
    return filterState.sortOrder === "asc"
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name);
  });

  const paginatedDeposits = sortedFeedbacks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(sortedFeedbacks.length / itemsPerPage);

  const handleReply = (id) => {
    setFeedbacks((feedbacks) =>
      feedbacks.map((feedback) =>
        feedback.id === id ? { ...feedback, status: "Resolved" } : feedback
      )
    );
    setReplyingFeedback(null);
    setReplyMessage("");
  };

  return (
    <div className=" p-2 bg-primary-light h-full overflow-y-auto scrollbar-hide">
      <FeedbackHeader
        title="Feedbacks"
        totalCount={paginatedDeposits.length}
        filterState={filterState}
        setFilterState={setFilterState}
        filterOptions={[
          {
            label: "Status",
            id: "status",
            children: [
              { label: "Pending", value: "pendingReview" },
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
      {paginatedDeposits.length > 0 ? (
        <>
          {paginatedDeposits.map((feedback) => (
            <div
              key={feedback.id}
              className="bg-primary rounded-2xl mb-2 shadow-lg p-6 border-t-2 border-button"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-text-heading mb-2">
                  {feedback.name}
                </h2>
                <button
                  onClick={() =>
                    setExpandedFeedback(
                      expandedFeedback === feedback.id ? null : feedback.id
                    )
                  }
                  className="text-text-heading hover:text-button transition cursor-pointer"
                >
                  {expandedFeedback === feedback.id ? (
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
                  <strong>Status:</strong> {feedback.status}
                </p>
              </div>

              {expandedFeedback === feedback.id && (
                <div className="flex flex-col p-4 rounded-md shadow-sm">
                  <p className="font-normal text-text-heading">
                    <strong>Message:</strong> {feedback.message}
                  </p>
                  <p className="font-normal text-text-heading">
                    <strong>Date:</strong> {feedback.date}
                  </p>
                </div>
              )}

              {replyingFeedback === feedback.id ? (
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
                      onClick={() => handleReply(feedback.id)}
                      className="px-4 py-2 bg-button text-white rounded-md hover:bg-button-hover cursor-pointer"
                    >
                      Send Reply
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-4 mt-4">
                  <button
                    onClick={() => setReplyingFeedback(feedback.id)}
                    disabled={feedback.status === "Resolved"}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg  ${
                      feedback.status === "Resolved"
                        ? " bg-gray-300 cursor-not-allowed"
                        : "bg-button text-white  hover:bg-button-hover cursor-pointer "
                    }`}
                  >
                    <FaPen size={16} /> Write Response
                  </button>
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
