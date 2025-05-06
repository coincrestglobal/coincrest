import { useEffect, useState } from "react";
import WithdrawHeader from "../../../common/DashboardHeader";
import { FaChevronDown, FaChevronUp, FaCheck } from "react-icons/fa";
import NoResult from "../../../../pages/NoResult";

const withdrawalList = [
  {
    id: "wd001",
    name: "John Doe",
    email: "john.doe@example.com",
    amount: "100",
    currency: "USDT",
    walletAddress: "TX7hjG6yQnDhSP1j7NnJ9kEgExXXXfC2tr",
    date: new Date().toLocaleDateString(),
    status: "Pending",
    chain: "TRC20",
    approvedBy: [], // 0 approvals
  },
  {
    id: "wd002",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    amount: "250",
    currency: "USDT",
    walletAddress: "TX9vGh8yMnEiSf2LpPQxL2hTtYYYuQ3Vok",
    date: new Date().toLocaleDateString(),
    status: "Pending",
    chain: "TRC20",
    approvedBy: ["Admin A"], // 1 approval
  },
  {
    id: "wd003",
    name: "Michael Johnson",
    email: "michael.johnson@example.com",
    amount: "75",
    currency: "USDT",
    walletAddress: "TX4kYf3uNbPiTq9QkNwJ6gRtZZZxV5WuHf",
    date: new Date().toLocaleDateString(),
    status: "Pending",
    chain: "BEP20",
    approvedBy: ["Admin A", "Admin B"], // 2 approvals
  },
];

function Withdrawals() {
  const [filterState, setFilterState] = useState({
    searchQuery: "",
    sortOrder: "desc",
    selectedFilters: [],
  });

  const [expandedWithdrawal, setExpandedWithdrawal] = useState(null);
  const [withdrawals, setWithdrawals] = useState(withdrawalList);

  const currentAdmin = "Admin A"; // Replace this with real admin name from auth

  useEffect(() => {
    function fetchWithdrawals(query) {
      return withdrawalList.filter(
        (item) =>
          item &&
          item.name &&
          item.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    const filtered = fetchWithdrawals(filterState.searchQuery);
    setWithdrawals(filtered);
  }, [filterState.searchQuery, filterState.selectedFilters]);

  const sortedWithdrawals = [...withdrawals].sort((a, b) => {
    return filterState.sortOrder === "asc"
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name);
  });

  const handleApprove = (id) => {
    setWithdrawals((prev) =>
      prev.map((w) => {
        if (w.id === id && !w.approvedBy.includes(currentAdmin)) {
          const updatedApprovedBy = [...w.approvedBy, currentAdmin];
          const newStatus =
            updatedApprovedBy.length >= 3 ? "Approved" : w.status;

          return {
            ...w,
            approvedBy: updatedApprovedBy,
            status: newStatus,
          };
        }
        return w;
      })
    );
  };

  return (
    <div className="px-4 py-4 h-full overflow-y-auto scrollbar-hide bg-[var(--primary)]">
      <WithdrawHeader
        title="Withdrawals"
        totalCount={sortedWithdrawals.length}
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

      {sortedWithdrawals.length > 0 ? (
        sortedWithdrawals.map((withdrawal) => (
          <div
            key={withdrawal.id}
            className="bg-primary-light text-text-body rounded-2xl mb-4 p-6 border-t-2 border-button"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-text-heading mb-2">
                {withdrawal.name}
              </h2>
              <button
                onClick={() =>
                  setExpandedWithdrawal(
                    expandedWithdrawal === withdrawal.id ? null : withdrawal.id
                  )
                }
                className="text-text-link hover:text-button"
              >
                {expandedWithdrawal === withdrawal.id ? (
                  <FaChevronUp size={20} />
                ) : (
                  <FaChevronDown size={20} />
                )}
              </button>
            </div>

            <div className="flex justify-between text-text-body p-3 rounded-md mb-4 shadow-sm bg-primary ">
              <p>
                <strong>Amount:</strong> {withdrawal.amount}{" "}
                {withdrawal.currency}
              </p>
              <p>
                <strong>Status:</strong> {withdrawal.status}
              </p>
            </div>

            {expandedWithdrawal === withdrawal.id && (
              <div className="p-4 bg-primary rounded-md text-text-body space-y-1">
                <p>
                  <strong>Email:</strong> {withdrawal.email}
                </p>
                <p>
                  <strong>Wallet Address:</strong> {withdrawal.walletAddress}
                </p>
                <p>
                  <strong>Requested On:</strong> {withdrawal.date}
                </p>
                <p>
                  <strong>Chain:</strong> {withdrawal.chain}
                </p>
              </div>
            )}

            {withdrawal.status !== "Approved" && (
              <div className="flex justify-between items-center mt-4 flex-wrap gap-4">
                <button
                  onClick={() => handleApprove(withdrawal.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-button text-text-heading rounded-lg hover:bg-button-hover"
                >
                  <FaCheck size={16} /> Approve
                </button>

                <div className="text-sm text-text-body">
                  <strong>Approved by:</strong>{" "}
                  {withdrawal.approvedBy.length > 0
                    ? withdrawal.approvedBy.join(", ")
                    : "No one yet"}
                </div>
              </div>
            )}
          </div>
        ))
      ) : (
        <NoResult />
      )}
    </div>
  );
}

export default Withdrawals;
