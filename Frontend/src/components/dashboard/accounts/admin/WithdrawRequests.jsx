import { useEffect, useState } from "react";
import WithdrawHeader from "../../../common/DashboardHeader";
import { FaChevronDown, FaChevronUp, FaCheck } from "react-icons/fa";
import NoResult from "../../../../pages/NoResult";
import Pagination from "../../../common/Pagination";
import ConfirmationModal from "../../../common/ConfirmationModal";
import {
  approveWithdrawRequest,
  getWithdrawRequests,
} from "../../../../services/operations/adminAndOwnerDashboardApi";
import { useUser } from "../../../common/UserContext";
import Feedbacks from "./Feedbakcs";
import Loading from "../../../../pages/Loading";

function Withdrawals() {
  const { user } = useUser();
  const [filterState, setFilterState] = useState({
    searchQuery: "",
    sortOrder: "desc",
    selectedFilters: [],
  });

  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedWithdrawal, setExpandedWithdrawal] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalWithdraws, setTotalWithdraws] = useState(0);
  const [modal, setModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const numberOfEntries = 5;

  // Calculate filtered and paginated data
  useEffect(() => {
    const fetchWithdrawals = async () => {
      try {
        setLoading(true); // Start loading
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

        const response = await getWithdrawRequests(
          user.token,
          params.toString()
        );

        const { data } = response;
        setWithdrawals(data.withdrawals);
        setTotalPages(response.totalPages);
        setTotalWithdraws(response.total);
      } catch (error) {
        console.error("Error fetching withdrawals:", error);
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchWithdrawals();
  }, [filterState, currentPage]);

  const handleApprove = async (id) => {
    try {
      setLoading(true); // Start loading
      const response = await approveWithdrawRequest(user.token, id);
      const updatedWithdrawal = response.data.withdrawal;

      setWithdrawals((prev) =>
        prev.map((w) => (w._id === id ? updatedWithdrawal : w))
      );

      setModal(false);
    } catch (error) {
      console.error("Approval failed:", error);
    } finally {
      setLoading(false); // End loading
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="px-4 py-4 h-full overflow-y-auto scrollbar-hide bg-[var(--primary)]">
      <WithdrawHeader
        title="Withdrawals"
        totalCount={totalWithdraws}
        filterState={filterState}
        setFilterState={setFilterState}
        filterOptions={[
          {
            label: "Status",
            children: [
              { label: "Pending", value: "pending" },
              { label: "Approved", value: "approved" },
              { label: "Processing", value: "processing" },
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

      {withdrawals.length > 0 ? (
        withdrawals.map((withdrawal, index) => (
          <div
            key={index}
            className="bg-primary-light text-text-body rounded-2xl mb-4 p-6 border-t-2 border-button"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-text-heading mb-2">
                {withdrawal.initiatedBy.name}
              </h2>
              <button
                onClick={() => {
                  setExpandedWithdrawal(
                    expandedWithdrawal === withdrawal._id
                      ? null
                      : withdrawal._id
                  );
                }}
                className="text-text-link hover:text-button"
              >
                {expandedWithdrawal === withdrawal._id ? (
                  <FaChevronUp size={20} />
                ) : (
                  <FaChevronDown size={20} />
                )}
              </button>
            </div>

            <div className="flex justify-between text-text-body p-3 rounded-md mb-4 shadow-sm bg-primary">
              <p>
                <strong>Amount:</strong> {withdrawal.amount}{" "}
                {withdrawal.currency}
              </p>
              <p>
                <strong>Status:</strong> {withdrawal.status}
              </p>
            </div>

            {expandedWithdrawal === withdrawal._id && (
              <div className="p-4 bg-primary rounded-md text-sm md:text-lg text-text-body space-y-1 overflow-y-auto">
                <p className="break-words whitespace-normal">
                  <strong>Email:</strong> {withdrawal.initiatedBy.email}
                </p>
                <p className="break-words whitespace-normal">
                  <strong>Wallet Address:</strong> {withdrawal.toAddress}
                </p>
                <p>
                  <strong>Requested On:</strong>{" "}
                  {new Date(withdrawal.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
                <p>
                  <strong>Chain:</strong> {withdrawal.tokenType}
                </p>
              </div>
            )}

            {withdrawal.status !== "Approved" && (
              <div className="flex relative justify-between items-center mt-4 flex-wrap gap-4">
                <button
                  onClick={() => {
                    setSelectedId(withdrawal._id);
                    setModal(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-button text-text-heading rounded-lg hover:bg-button-hover"
                >
                  <FaCheck size={16} /> Approve
                </button>

                <div className="text-sm text-text-body">
                  <strong>Approved by:</strong>{" "}
                  {withdrawal.approvedBy.length > 0
                    ? withdrawal.approvedBy
                        .map((approver) => approver.name)
                        .join(", ")
                    : "No one yet"}
                </div>
                {modal && (
                  <ConfirmationModal
                    text={"Are you sure you want to approve this withdrawal?"}
                    onConfirm={() => handleApprove(selectedId)}
                    onCancel={() => setModal(false)}
                  />
                )}
              </div>
            )}
          </div>
        ))
      ) : (
        <NoResult />
      )}

      {/* Pagination Controls */}
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

export default Withdrawals;
