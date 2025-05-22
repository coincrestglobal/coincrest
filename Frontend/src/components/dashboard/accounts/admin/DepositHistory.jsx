import { useEffect, useState } from "react";
import DepositHeader from "../../../common/DashboardHeader";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import NoResult from "../../../../pages/NoResult";
import Pagination from "../../../common/Pagination";
// Sample deposit data
const depositList = [
  {
    id: "dp001",
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    amount: "150",
    currency: "USDT",
    walletAddress: "TX2hjG6yQnDhSP1j7NnJ9kEgExXXXfC2tr",
    date: new Date().toLocaleDateString(),
    chain: "TRC20",
    status: "Confirmed",
  },
  {
    id: "dp002",
    name: "Bob Williams",
    email: "bob.williams@example.com",
    amount: "300",
    currency: "USDT",
    walletAddress: "TX9vGh8yMnEiSf2LpPQxL2hTtYYYuQ3Vok",
    date: new Date().toLocaleDateString(),
    chain: "TRC20",
    status: "Pending",
  },
  {
    id: "dp003",
    name: "Carol Davis",
    email: "carol.davis@example.com",
    amount: "500",
    currency: "USDT",
    walletAddress: "TX4kYf3uNbPiTq9QkNwJ6gRtZZZxV5WuHf",
    date: new Date().toLocaleDateString(),
    chain: "BEP20",
    status: "Confirmed",
  },
  // Add more items for testing pagination
  {
    id: "dp004",
    name: "David Evans",
    email: "david.evans@example.com",
    amount: "100",
    currency: "USDT",
    walletAddress: "TX2hjG6yQnDhSP1j7NnJ9kEgExXXXfC2tr",
    date: new Date().toLocaleDateString(),
    chain: "TRC20",
    status: "Pending",
  },
  {
    id: "dp005",
    name: "Eve Adams",
    email: "eve.adams@example.com",
    amount: "250",
    currency: "USDT",
    walletAddress: "TX2hjG6yQnDhSP1j7NnJ9kEgExXXXfC2tr",
    date: new Date().toLocaleDateString(),
    chain: "BEP20",
    status: "Confirmed",
  },
];

function Deposits() {
  const [filterState, setFilterState] = useState({
    searchQuery: "",
    sortOrder: "desc",
    selectedFilters: [],
  });

  const [expandedDeposit, setExpandedDeposit] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [deposits, setDeposits] = useState(depositList);

  const itemsPerPage = 5; // Number of items per page

  // Filter logic
  useEffect(() => {
    function fetchDeposits(query) {
      return depositList.filter(
        (item) =>
          item &&
          item.name &&
          item.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    const filtered = fetchDeposits(filterState.searchQuery);
    setDeposits(filtered);
  }, [filterState.searchQuery, filterState.selectedFilters]);

  // Sort logic
  const sortedDeposits = [...deposits].sort((a, b) => {
    return filterState.sortOrder === "asc"
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name);
  });

  // Paginate the sorted deposits
  const paginatedDeposits = sortedDeposits.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(sortedDeposits.length / itemsPerPage);

  return (
    <div className="px-4 py-2 h-full overflow-y-auto scrollbar-hide bg-primary-dark">
      <DepositHeader
        title="Deposits"
        totalCount={sortedDeposits.length}
        filterState={filterState}
        setFilterState={setFilterState}
        filterOptions={[
          {
            label: "Status",
            children: [
              { label: "Confirmed", value: "confirmed" },
              { label: "Pending", value: "pending" },
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

      {paginatedDeposits.length > 0 ? (
        paginatedDeposits.map((deposit) => (
          <div
            key={deposit.id}
            className="bg-primary-light text-text-body rounded-2xl mb-4 shadow-lg p-6 border-t-2 border-button"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-text-heading mb-2">
                {deposit.name}
              </h2>
              <button
                onClick={() =>
                  setExpandedDeposit(
                    expandedDeposit === deposit.id ? null : deposit.id
                  )
                }
                className="text-text-link hover:text-button"
              >
                {expandedDeposit === deposit.id ? (
                  <FaChevronUp size={20} />
                ) : (
                  <FaChevronDown size={20} />
                )}
              </button>
            </div>

            <div className="flex justify-between text-text-body p-3 rounded-md mb-4 shadow-sm bg-primary">
              <p>
                <strong>Amount:</strong> {deposit.amount} {deposit.currency}
              </p>
              <p>
                <strong>Status:</strong> {deposit.status}
              </p>
            </div>

            {expandedDeposit === deposit.id && (
              <div className="p-4 bg-primary rounded-md text-text-body space-y-1 break-words whitespace-normal">
                <p>
                  <strong>Email:</strong> {deposit.email}
                </p>
                <p>
                  <strong>Wallet Address:</strong> {deposit.walletAddress}
                </p>
                <p>
                  <strong>Deposited On:</strong> {deposit.date}
                </p>
                <p>
                  <strong>Chain:</strong> {deposit.chain}
                </p>
              </div>
            )}
          </div>
        ))
      ) : (
        <NoResult />
      )}

      {/* Pagination Component */}
      <div className="mt-6">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}

export default Deposits;
