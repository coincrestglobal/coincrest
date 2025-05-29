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

const tabs = ["Active", "Closed"];

function Investments() {
  const { user } = useUser();
  const [filterState, setFilterState] = useState({
    searchQuery: "",
    sortOrder: "desc",
    selectedFilters: [],
  });
  const [investHistory, setInvestHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("Active");
  const [modalMap, setModalMap] = useState({});
  const [totalPages, setTotalPages] = useState(1);
  const [totalInvestments, setTotalInvestments] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const numberOfEntries = 1;

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
        const response = await investingHistory(user.token, params);
        const { data } = response;

        setInvestHistory(data.investments || []);
        setTotalPages(response.totalPages || 1);
        setTotalInvestments(response.total || 0);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    getInvestingHistory();
  }, [currentPage, filterState]);

  const cancelPlan = async (id) => {
    setLoading(true);
    try {
      const response = await redeemInvestPlan(user.token, id);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }
  const filteredData =
    activeTab === "Active"
      ? investHistory.filter((item) => item.status === "active")
      : investHistory.filter((item) => item.status === "closed");

  return (
    <div className="relative bg-primary-dark max-w-6xl mx-auto rounded-md p-6 sm:p-8 max-h-[87vh] flex flex-col">
      {/* Tabs */}
      <div className="flex space-x-8 mb-6 flex-shrink-0 bg-primary-light justify-center rounded-md p-2">
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
        <DashboardHeader
          title={`${activeTab} Investments`}
          totalCount={filteredData.length}
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

        {loading ? (
          <p className="text-center text-gray-400 mt-10">Loading...</p>
        ) : filteredData.length === 0 ? (
          <p className="text-center text-gray-400 mt-10">
            No {activeTab.toLowerCase()} investments found.
          </p>
        ) : (
          <>
            {filteredData.map((data, index) => {
              return (
                <div
                  key={data._id || index}
                  className=" py-5 border-b border-gray-700 space-y-4 md:space-y-0 text-text-heading"
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
                          <span className="text-text-heading">Opened at:</span>{" "}
                          {new Date(data.investDate).toLocaleDateString()}
                        </p>
                        <p>
                          <span className="text-text-heading">Deposit:</span> $
                          {data.investedAmount}
                        </p>
                        <p>
                          <span className="text-text-heading">
                            Weekly return:{data.interestRate}%
                          </span>{" "}
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

                      <div className="flex flex-col md:flex-row items-center gap-4">
                        <p className="text-text-highlighted text-base sm:text-lg md:mb-1 self-end">
                          Total Profit:
                        </p>
                        <div className="md:text-right">
                          <p className="text-2xl font-semibold">
                            ${data.profit}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {activeTab === "Active" && (
                    <>
                      <button
                        className="bg-button rounded-md px-4 py-2 text-base sm:text-lg"
                        onClick={() =>
                          setModalMap((prev) => ({
                            ...prev,
                            [data._id]: true,
                          }))
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
              );
            })}

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
      </div>
    </div>
  );
}

export default Investments;
