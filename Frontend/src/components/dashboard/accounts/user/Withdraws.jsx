import { useState, useEffect } from "react";
import { useUser } from "../../../common/UserContext";
import { getUserWithdrawals } from "../../../../services/operations/userDashboardApi";
import DashboardHeader from "../../../common/DashboardHeader";
import Pagination from "../../../common/Pagination";

const WithdrawPage = () => {
  const { user } = useUser();
  const [filterState, setFilterState] = useState({
    searchQuery: "",
    sortOrder: "asc",
    selectedFilters: [],
  });
  const [activeTab, setActiveTab] = useState("New Withdrawal");
  const [isCooldown, setIsCooldown] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");
  const [withdrawHistory, setWithdrawHistory] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalWithdraws, setTotalWithdraws] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const numberOfEntries = 1;

  useEffect(() => {
    const getWithdrawalHistroy = async () => {
      try {
        const { searchQuery, selectedFilters, sortOrder } = filterState;
        const params = new URLSearchParams();

        if (searchQuery) {
          params.append("search", searchQuery);
        }
        if (selectedFilters["Date Interval"]) {
          const { startDate, endDate } = selectedFilters["Date Interval"];
          if (startDate) params.append("startDate", startDate);
          if (endDate) params.append("endDate", endDate);
        }

        if (sortOrder) {
          params.append("sort", sortOrder);
        }

        params.append("page", currentPage);
        params.append("role", "user");
        params.append("limit", numberOfEntries);
        const response = await getUserWithdrawals(user.token);
        setWithdrawHistory(response.data.withdrawals);
        setTotalPages(response.totalPages || 1);
        setTotalWithdraws(response.total || 0);
      } catch (error) {
        console.error("Error fetching investment history:", error);
      }
    };
    getWithdrawalHistroy();
  }, [currentPage, filterState]);

  return (
    <div className="relative max-w-4xl mx-auto bg-primary-dark rounded-md p-6 sm:p-8">
      {/* Tabs */}
      <div className="flex flex-wrap sm:flex-nowrap space-x-0 sm:space-x-10 mb-6 sm:mb-8">
        {["New Withdrawal", "History", "Guidelines"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 font-medium w-1/3 sm:w-auto text-center sm:text-left ${
              activeTab === tab
                ? "text-text-heading border-b-2 border-button"
                : "text-gray-400"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* All tabs rendered, show/hide via hidden */}
      <div>
        {/* New Withdrawal Form */}
        <form
          className={`space-y-6 ${
            activeTab === "New Withdrawal" ? "" : "hidden"
          }`}
        >
          <div>
            <label className="block mb-2 text-sm text-gray-300">
              Amount ($)
            </label>
            <input
              type="number"
              placeholder="Enter amount"
              className="w-full bg-transparent border border-[#2d2b42]  text-white rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-text-link"
              disabled={isCooldown}
            />
          </div>

          <div>
            <label className="block mb-2 text-sm text-gray-300">
              Choose Wallet
            </label>
            <select
              className="w-full text-text-heading bg-transparent border border-[#2d2b42] rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-text-link"
              disabled={isCooldown || !user?.wallets?.length}
            >
              {user?.wallets?.length > 0 ? (
                user.wallets.map((wallet, index) => (
                  <option
                    key={index}
                    value={wallet.address}
                    className="text-text-heading bg-primary-light"
                  >
                    {wallet.tokenType} - {wallet.address}
                  </option>
                ))
              ) : (
                <option disabled>No wallets found. Please add one.</option>
              )}
            </select>
          </div>

          <button
            type="button"
            disabled={isCooldown}
            className={`bg-button w-fit text-text-heading font-semibold px-10 py-3 rounded-xl border-2 shadow-inner transition-all duration-200 ${
              isCooldown
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-button-hover hover:opacity-90"
            }`}
          >
            {isCooldown
              ? `Next Withdraw available in: ${timeLeft}`
              : "Withdraw Now"}
          </button>
        </form>

        {/* Withdrawal History */}
        <div
          className={`${
            activeTab === "History" ? "" : "hidden"
          } text-gray-300 space-y-4`}
        >
          <div>
            <DashboardHeader
              title={"Deposit History"}
              totalCount={totalWithdraws}
              filterState={filterState}
              setFilterState={setFilterState}
              filterOptions={[
                {
                  label: "Date Interval",
                  children: [
                    {
                      label: "Start Date",
                      value: "startDate",
                      type: "date",
                    },
                    { label: "End Date", value: "endDate", type: "date" },
                  ],
                },
              ]}
            />
            {withdrawHistory.map((item, index) => (
              <div
                key={index}
                className="bg-primary-light p-4 rounded-lg border border-[#383658]"
              >
                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span>${item.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span
                    className={`${
                      item.status === "Pending"
                        ? "text-text-link"
                        : "text-green-400"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span>{item.date}</span>
                </div>
              </div>
            ))}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        </div>

        {/* Guidelines */}
        <div
          className={`${
            activeTab === "Guidelines" ? "" : "hidden"
          } text-gray-300 space-y-4`}
        >
          <h2 className="text-xl font-semibold text-text-heading mb-4">
            Withdrawal Guidelines
          </h2>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>Withdrawals are allowed once every 7 days.</li>
            <li>
              Ensure your wallet address is correctly added before initiating a
              withdrawal.
            </li>
            <li>Minimum withdrawal amount is $50.</li>
            <li>Only approved wallets can be used for withdrawal.</li>
            <li>
              All withdrawals are manually reviewed and may take up to 24–48
              hours.
            </li>
            <li>
              In case of issues, contact support with your transaction reference
              ID.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WithdrawPage;
