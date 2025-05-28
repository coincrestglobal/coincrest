import { useEffect, useState } from "react";
import DepositHeader from "../../../common/DashboardHeader";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import NoResult from "../../../../pages/NoResult";
import Pagination from "../../../common/Pagination";
import { getAllUsersDepositHistory } from "../../../../services/operations/adminAndOwnerDashboardApi";
import { useUser } from "../../../common/UserContext";
import Loading from "../../../../pages/Loading";

function Deposits() {
  const { user } = useUser();
  const [filterState, setFilterState] = useState({
    searchQuery: "",
    sortOrder: "desc",
    selectedFilters: [],
  });

  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedDeposit, setExpandedDeposit] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDeposits, setTotalDeposits] = useState(0);
  const numberOfEntries = 5;

  // Filter logic

  useEffect(() => {
    const fetchDeposits = async () => {
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
          if (selectedFilters["Token Type"]) {
            params.append("tokenType", selectedFilters["Token Type"]);
          }
        }

        if (sortOrder) params.append("sort", sortOrder);
        params.append("page", currentPage);
        params.append("limit", numberOfEntries);

        const response = await getAllUsersDepositHistory(
          user.token,
          params.toString()
        );

        const { data } = response;
        setDeposits(data.deposits);
        setTotalPages(response.totalPages);
        setTotalDeposits(response.total);
      } catch (error) {
        console.error("Error fetching deposits:", error);
      } finally {
        setLoading(false); // Stop loading after everything
      }
    };

    fetchDeposits();
  }, [filterState, currentPage]);

  if (loading) return <Loading />;

  return (
    <div className="px-4 py-2 h-full overflow-y-auto scrollbar-hide bg-primary-dark">
      <DepositHeader
        title="Deposits"
        totalCount={totalDeposits}
        filterState={filterState}
        setFilterState={setFilterState}
        filterOptions={[
          {
            label: "Token Type",
            children: [
              { label: "BEP-20", value: "BEP-20" },
              { label: "TRC-20", value: "TRC-20" },
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

      {deposits.length > 0 ? (
        deposits.map((deposit, index) => (
          <div
            key={index}
            className="bg-primary-light text-text-body rounded-2xl mb-4 shadow-lg p-6 border-t-2 border-button"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-text-heading mb-2">
                {deposit?.depositedBy?.name
                  ? deposit.depositedBy.name
                  : "Unknown"}
              </h2>
              <button
                onClick={() =>
                  setExpandedDeposit(
                    expandedDeposit === deposit._id ? null : deposit._id
                  )
                }
                className="text-text-link hover:text-button"
              >
                {expandedDeposit === deposit._id ? (
                  <FaChevronUp size={20} />
                ) : (
                  <FaChevronDown size={20} />
                )}
              </button>
            </div>

            <div className="flex justify-between text-text-body p-3 rounded-md mb-4 shadow-sm bg-primary">
              <p>
                <strong>Amount:</strong> ${deposit.amount}
              </p>
              <p>
                <strong>Deposited On:</strong>{" "}
                {new Date(deposit.createdAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>

            {expandedDeposit === deposit._id && (
              <div className="p-4 bg-primary rounded-md text-text-body space-y-1 break-words whitespace-normal">
                <p>
                  <strong>Email:</strong> {deposit?.depositedBy?.email}
                </p>
                <p>
                  <strong>Wallet Address:</strong> {deposit.fromAddress}
                </p>

                <p>
                  <strong>Chain:</strong> {deposit.tokenType}
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
