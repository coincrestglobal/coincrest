import { useEffect, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import NoResult from "../../../../pages/NoResult";
import Pagination from "../../../common/Pagination";
import { useUser } from "../../../common/UserContext";
import { getBonustHistory } from "../../../../services/operations/userDashboardApi";
import Loading from "../../../../pages/Loading";

function BonusHistory() {
  const { user } = useUser();
  const [filterState, setFilterState] = useState({
    searchQuery: "",
    sortOrder: "desc",
    selectedFilters: [],
  });

  const [bonusHistory, setBonusHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const numberOfEntries = 5;

  useEffect(() => {
    const fetchBonusHistory = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        params.append("page", currentPage);
        params.append("limit", numberOfEntries);

        const response = await getBonustHistory(user.token, params.toString());
        const { data } = response;

        setBonusHistory(data.bonuses);
        setTotalPages(response.totalPages);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchBonusHistory();
  }, [filterState, currentPage]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="px-4 py-2 h-full overflow-y-auto scrollbar-hide bg-primary-dark">
      <div className="bg-primary text-text-subheading flex flex-col mb-3 sm:flex-row sm:items-center justify-between p-4 rounded-lg shadow-md space-y-3 sm:space-y-0 sm:space-x-4">
        <h1 className="text-3xl font-bold text-white">Bonus History</h1>
      </div>

      {bonusHistory.length > 0 ? (
        bonusHistory.map((bonus, index) => (
          <div
            key={index}
            className="bg-primary-light text-white p-4 rounded-lg border border-[#383658]"
          >
            <div>
              <span>Amount: </span>
              <span>${bonus.amount}</span>
            </div>

            <div>
              <span>Type: </span>
              <span>{bonus.type}</span>
            </div>
            <div>
              <span>
                Date:{" "}
                {new Date(bonus.createdAt).toLocaleString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        ))
      ) : (
        <NoResult />
      )}

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

export default BonusHistory;
