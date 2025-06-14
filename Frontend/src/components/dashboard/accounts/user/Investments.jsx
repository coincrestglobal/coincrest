import { useEffect, useState } from "react";
import { LucideCoins } from "lucide-react";
import ConfirmationModal from "../../../common/ConfirmationModal";
import { useUser } from "../../../common/UserContext";
import {
  investingHistory,
  redeemInvestPlan,
} from "../../../../services/operations/userDashboardApi";
import DashboardHeader from "../../../common/DashboardHeader";
import Pagination from "../../../common/Pagination";
import Loading from "../../../../pages/Loading";

const tabs = ["Active", "Redeemed", "Pending", "Guidelines"];

function Investments() {
  const { user } = useUser();
  const [filterState, setFilterState] = useState({
    searchQuery: "",
    sortOrder: "desc",
    selectedFilters: {},
  });
  const [investHistory, setInvestHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("Active");
  const [modalMap, setModalMap] = useState({});
  const [totalPages, setTotalPages] = useState(1);
  const [totalInvestments, setTotalInvestments] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const numberOfEntries = 5;

  useEffect(() => {
    const getInvestingHistory = async () => {
      try {
        setLoading(true);
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
        params.append("status", activeTab.toLowerCase());

        const response = await investingHistory(user.token, params);
        const { data } = response;

        setInvestHistory(data.investments || []);
        setTotalPages(response.totalPages || 1);
        setTotalInvestments(response.total || 0);
      } catch (error) {
        // Ideally handle errors here (toast or console)
      } finally {
        setLoading(false);
      }
    };

    getInvestingHistory();
  }, [currentPage, filterState, user.token, activeTab]);

  const cancelPlan = async (id) => {
    setLoading(true);
    try {
      await redeemInvestPlan(user.token, id);
      // Optionally refresh investments after cancel
      setInvestHistory((prev) => prev.filter((inv) => inv._id !== id));
      setModalMap((prev) => ({ ...prev, [id]: false }));
    } catch (error) {
      // Handle error properly
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="relative bg-primary-dark max-w-6xl mx-auto rounded-md p-6 sm:p-8 max-h-[87vh] flex flex-col">
      {/* Tabs */}
      <div className="flex space-x-4 md:space-x-8 mb-6 flex-shrink-0  justify-center rounded-md p-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 font-medium ${
              activeTab === tab
                ? "text-text-heading border-b-2 border-button"
                : "text-gray-400"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Scrollable Tab Content */}
      <div className="overflow-y-auto flex-1 scrollbar-none">
        {activeTab !== "Guidelines" && (
          <>
            <DashboardHeader
              title={`${activeTab} Investments`}
              totalCount={totalInvestments}
              filterState={filterState}
              setFilterState={setFilterState}
              filterOptions={[
                {
                  label: "Date Interval",
                  children: [
                    { label: "Start Date", value: "startDate", type: "date" },
                    { label: "End Date", value: "endDate", type: "date" },
                  ],
                },
              ]}
            />

            {investHistory.map((data, index) => (
              <div
                key={data._id || index}
                className="py-5 border-b border-gray-700 space-y-4 md:space-y-0 text-text-heading"
              >
                <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                  {/* Left Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 border border-button rounded-full flex items-center justify-center">
                        <LucideCoins size={20} className="text-text-link" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-semibold">
                        {data.name}
                      </h3>
                    </div>

                    <div className="text-sm space-y-2 text-gray-300">
                      <p>
                        <span className="text-text-heading">Id:</span>
                        {data._id}
                      </p>
                      <p>
                        <span className="text-text-heading">Opened at:</span>{" "}
                        {new Date(data.investDate).toLocaleString()}
                      </p>
                      <p>
                        <span className="text-text-heading">Deposit:</span> $
                        {data.investedAmount}
                      </p>
                      <p>
                        <span className="text-text-heading">
                          Weekly return: {data.interestRate}%
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Right Profit */}
                  <div className="flex md:flex-col md:gap-6 w-full md:w-auto md:py-5 justify-between">
                    <div className="flex flex-col md:flex-row items-center gap-4">
                      <p className="text-text-highlighted text-base sm:text-lg">
                        Total Amount:
                      </p>
                      <p className="text-2xl font-semibold">
                        $
                        {(
                          (data.profit ?? 0) + (data.investedAmount ?? 0)
                        ).toFixed(2)}
                      </p>
                    </div>

                    <div className="flex flex-col items-center md:flex-row md:items-start gap-4">
                      <p className="text-text-highlighted  sm:text-lg md:mb-10  self-end">
                        Total Profit:
                      </p>
                      <div>
                        <p className="text-2xl font-semibold">
                          ${data.profit.toFixed(2)}
                        </p>
                        {activeTab === "Active" && (
                          <p className="text-sm sm:text-xl text-text-linkHover font-bold text-right">
                            +
                            {Math.floor(
                              (new Date() - new Date(data.investDate)) /
                                (1000 * 60 * 60 * 24)
                            ) > 0
                              ? (
                                  (data.investedAmount *
                                    (data.interestRate / 7)) /
                                  100
                                ).toFixed(2)
                              : "0.00"}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {activeTab === "Active" && (
                  <>
                    <p className="text-sm text-nav-highlighted py-2">
                      Kindly read the guidelines to avoid any issues.
                    </p>
                    <button
                      className="bg-button rounded-md px-4 py-2 text-base sm:text-lg"
                      onClick={() =>
                        setModalMap((prev) => ({ ...prev, [data._id]: true }))
                      }
                    >
                      Close
                    </button>
                    {modalMap[data._id] && (
                      <ConfirmationModal
                        text="Are you sure you want to cancel this plan? This action cannot be undone."
                        onConfirm={() => cancelPlan(data._id)}
                        onCancel={() =>
                          setModalMap((prev) => ({
                            ...prev,
                            [data._id]: false,
                          }))
                        }
                      />
                    )}
                  </>
                )}
              </div>
            ))}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}
        {activeTab === "Guidelines" && (
          <div className="text-gray-300 space-y-4 px-2">
            <div className="flex flex-col bg-primary-light p-4 rounded-md">
              <h2 className="text-xl font-semibold text-center text-text-heading mb-4 border-b border-b-button">
                Investing Guidelines
              </h2>
              <p>
                Your capital works for you — but with structure and clarity.
                Here's how withdrawal works after you've invested with
                CoinCrest:
              </p>
            </div>
            <ul className="list-disc list-inside space-y-2 text-sm px-2">
              <li>
                💰 <strong>1. Interest Withdrawals Anytime:</strong> You can
                withdraw your earned interest at any time without affecting your
                principal investment. No lock-in for rewards — they're yours,
                on-demand.
              </li>
              <li>
                🔐 <strong>2. Full Withdrawal Requires Staking Closure:</strong>{" "}
                To withdraw your full invested amount, you must first close your
                staking position. This ensures your funds are safely released
                from the staking pool.
              </li>
              <li>
                ⏳{" "}
                <strong>
                  3. 10–15 Days Processing Time for Full Withdrawal:
                </strong>{" "}
                Once your staking is closed, your entire balance (including
                principal and any remaining interest) will be processed. Please
                allow 10 to 15 business days for the funds to be released and
                credited to your linked wallet.
                <br></br>
                ⚠️ If your withdrawal is not approved after this period, please
                contact Customer Support for assistance.
              </li>
            </ul>

            <div class="mt-4 p-4 bg-primary-dark border-l-4 border-yellow-400 rounded text-text-heading">
              <p class="font-semibold mb-2">⚠️ Important Notes:</p>
              <ul class="list-disc pl-5 space-y-1">
                <li>
                  Partial withdrawals of principal are not supported while
                  staking is active.
                </li>
                <li>
                  Ensure your wallet address is up-to-date before requesting
                  full withdrawal.
                </li>
                <li>
                  For any delays or concerns, contact support with your staking
                  ID or transaction reference.
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Investments;
