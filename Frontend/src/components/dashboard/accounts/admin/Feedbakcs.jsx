import { useEffect, useState } from "react";
import FeedbackHeader from "../../../common/DashboardHeader";
import { FaChevronDown, FaChevronUp, FaPen, FaTimes } from "react-icons/fa";
import NoResult from "../../../../pages/NoResult";

const feedbackList = [
  {
    id: "fdbk001",
    name: "Alice Crypto",
    email: "alice.crypto@example.com",
    subject: "Staking Delay - Not Reflected",
    message:
      "I staked 500 USDT but it's not showing up in my dashboard. Please assist.",
    date: new Date().toLocaleDateString(),
    status: "Pending",
  },
  {
    id: "fdbk002",
    name: "Bob Miner",
    email: "bob.miner@example.com",
    subject: "Withdrawal Request Stuck",
    message:
      "My withdrawal request has been pending for over 24 hours. Kindly check.",
    date: new Date().toLocaleDateString(),
    status: "Resolved",
  },
  {
    id: "fdbk003",
    name: "Carol Node",
    email: "carol.node@example.com",
    subject: "Reward Calculation Incorrect",
    message:
      "My weekly rewards seem lower than expected. Can someone review this?",
    date: new Date().toLocaleDateString(),
    status: "Pending",
  },
  {
    id: "fdbk004",
    name: "Dave Ledger",
    email: "dave.ledger@example.com",
    subject: "UI Bug - Dashboard Crashing",
    message:
      "Whenever I visit the staking section, the app crashes. Kindly fix it.",
    date: new Date().toLocaleDateString(),
    status: "Pending",
  },
  {
    id: "fdbk005",
    name: "Eva Wallet",
    email: "eva.wallet@example.com",
    subject: "Feedback - Smooth Onboarding",
    message: "The staking flow was super smooth. Kudos to the team!",
    date: new Date().toLocaleDateString(),
    status: "Resolved",
  },
  {
    id: "fdbk006",
    name: "Frank Chain",
    email: "frank.chain@example.com",
    subject: "Suggestion - Add More Coins",
    message:
      "Can you support staking for ETH or BNB in future? That would be great!",
    date: new Date().toLocaleDateString(),
    status: "Pending",
  },
  {
    id: "fdbk007",
    name: "Grace Vault",
    email: "grace.vault@example.com",
    subject: "Notification Bug",
    message:
      "Not getting any notifications for reward credits. Please check system logs.",
    date: new Date().toLocaleDateString(),
    status: "Resolved",
  },
  {
    id: "fdbk008",
    name: "Hank Satoshi",
    email: "hank.satoshi@example.com",
    subject: "UI Improvement - Better History View",
    message:
      "It would be helpful to view staking and reward history more clearly.",
    date: new Date().toLocaleDateString(),
    status: "Pending",
  },
  {
    id: "fdbk009",
    name: "Ivy Tron",
    email: "ivy.tron@example.com",
    subject: "Login Issue - OTP Delay",
    message:
      "Login OTPs are taking too long to arrive. Delays cause frustration.",
    date: new Date().toLocaleDateString(),
    status: "Resolved",
  },
  {
    id: "fdbk010",
    name: "Jake Token",
    email: "jake.token@example.com",
    subject: "Feature Request - Multi-Account View",
    message: "I’d love to manage multiple staking accounts under one login.",
    date: new Date().toLocaleDateString(),
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

  // const [users, setUsers] = useState(usersData);

  useEffect(() => {
    function fetchFeedbacks(query) {
      return feedbackList.filter(
        (user) =>
          user &&
          user.name &&
          user.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    const filteredFeedbacks = fetchFeedbacks(filterState.searchQuery);
    setFeedbacks(filteredFeedbacks);
  }, [filterState.searchQuery, filterState.selectedFilters]);

  const sortedFeedbacks = [...feedbacks].sort((a, b) => {
    return filterState.sortOrder === "asc"
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name);
  });

  const handleReply = (id) => {
    // console.log("Reply sent:", replyMessage);
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
        totalCount={sortedFeedbacks.length}
        filterState={filterState}
        setFilterState={setFilterState}
        filterOptions={[
          {
            label: "Status",
            children: [
              {
                label: "Pending",
                value: "pendingReview",
              },
              { label: "Resolved", value: "resolved" },
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
      {sortedFeedbacks.length > 0 ? (
        <>
          {sortedFeedbacks.map((feedback) => (
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
                <div className="grid grid-cols-2 gap-4 p-4 rounded-md shadow-sm">
                  <p className="font-normal text-text-heading">
                    {feedback.message}
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
                      className="w-full p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-button"
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
        </>
      ) : (
        <NoResult />
      )}
    </div>
  );
}

export default Feedbacks;
