import { useEffect, useState } from "react";
import InvestmentHeader from "../../../common/DashboardHeader";
import { FaChevronDown, FaChevronUp, FaCheck } from "react-icons/fa";
import NoResult from "../../../../pages/NoResult";
import Pagination from "../../../common/Pagination";
import ConfirmationModal from "../../../common/ConfirmationModal";
import {
  approvePlanCloseFund,
  getInvestedPlanClousreHistory,
} from "../../../../services/operations/adminAndOwnerDashboardApi";
import { useUser } from "../../../common/UserContext";
import Loading from "../../../../pages/Loading";

function Investments() {
  const { user } = useUser();
  const [filterState, setFilterState] = useState({
    searchQuery: "",
    sortOrder: "desc",
    selectedFilters: [],
  });

  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedInvestment, setExpandedInvestment] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalInvestments, setTotalInvestments] = useState(0);
  const [modal, setModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const numberOfEntries = 5;

  useEffect(() => {
    const fetchInvestments = async () => {
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

        const response = await getInvestedPlanClousreHistory(
          user.token,
          params.toString()
        );

        const { data } = response;
        console.log(data);
        setInvestments(data.investments);
        setTotalPages(response.totalPages);
        setTotalInvestments(response.total);
      } catch (error) {
        console.error("Failed to fetch investments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvestments();
  }, [filterState, currentPage]);

  const handleApprove = async (id) => {
    try {
      setLoading(true);
      const response = await approvePlanCloseFund(user.token, id);
      const updatedInvestment = response.data.investment;

      setInvestments((prev) =>
        prev.map((inv) => (inv._id === id ? updatedInvestment : inv))
      );
    } catch (error) {
      console.error("Approval failed:", error);
    } finally {
      setModal(false);
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="px-4 py-4 h-full overflow-y-auto scrollbar-hide bg-[var(--primary)]">
      <InvestmentHeader
        title="Investments"
        totalCount={totalInvestments}
        filterState={filterState}
        setFilterState={setFilterState}
        filterOptions={[
          {
            label: "Status",
            children: [
              { label: "Pending", value: "pending" },
              { label: "Approved", value: "approved" },
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
      {investments.length > 0 ? (
        investments.map((investment, index) => (
          <div
            key={index}
            className="bg-primary-light text-text-body rounded-2xl mb-4 p-6 border-t-2 border-button"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-text-heading mb-2">
                {investment.investedBy.name}
              </h2>
              <button
                onClick={() =>
                  setExpandedInvestment(
                    expandedInvestment === investment._id
                      ? null
                      : investment._id
                  )
                }
                className="text-text-link hover:text-button"
              >
                {expandedInvestment === investment._id ? (
                  <FaChevronUp size={20} />
                ) : (
                  <FaChevronDown size={20} />
                )}
              </button>
            </div>

            <div className="flex justify-between text-text-body p-3 rounded-md mb-4 shadow-sm bg-primary">
              <p>
                <strong>Amount:</strong> {investment.amount}{" "}
                {investment.currency}
              </p>
              <p>
                <strong>Status:</strong> {investment.status}
              </p>
            </div>

            {expandedInvestment === investment._id && (
              <div className="p-4 bg-primary rounded-md text-sm md:text-lg text-text-body space-y-1 overflow-y-auto">
                <p className="break-words whitespace-normal">
                  <strong>Transaction Id:</strong> {investment?.txId}
                </p>
                <p className="break-words whitespace-normal">
                  <strong>Wallet Address:</strong> {investment.fromAddress}
                </p>
                <p>
                  <strong>Invested On:</strong>{" "}
                  {new Date(investment.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
                <p>
                  <strong>Chain:</strong> {investment.tokenType}
                </p>
              </div>
            )}

            {investment.status !== "approved" && (
              <div className="flex relative justify-between items-center mt-4 flex-wrap gap-4">
                <button
                  onClick={() => {
                    setSelectedId(investment._id);
                    setModal(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-button text-text-heading rounded-lg hover:bg-button-hover"
                >
                  <FaCheck size={16} /> Approve
                </button>

                <div className="text-sm text-text-body">
                  <strong>Approved by:</strong>{" "}
                  {investment.approvedBy.length > 0
                    ? investment.approvedBy
                        .map((approver) => approver.name)
                        .join(", ")
                    : "No one yet"}
                </div>
                {modal && (
                  <ConfirmationModal
                    text={"Are you sure you want to approve this investment?"}
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

export default Investments;
