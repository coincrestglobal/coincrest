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
  const [expandedBonus, setExpandedBonus] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const numberOfEntries = 5;

  useEffect(() => {
    const fetchBonusHistory = async () => {
      try {
        setLoading(true);

        params.append("page", currentPage);
        params.append("limit", numberOfEntries);

        const response = await getBonustHistory(user.token, params.toString());
        const { data } = response;
        console.log(data);

        setBonusHistory(data.deposits);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.error("Error fetching bonus history:", error);
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
      {loading ? (
        <p className="text-center text-white">Loading...</p>
      ) : bonusHistory.length > 0 ? (
        bonusHistory.map((bonus, index) => (
          <div
            key={index}
            className="bg-primary-light text-text-body rounded-2xl mb-4 shadow-lg p-6 border-t-2 border-button"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-text-heading mb-2">
                {bonus?.depositedBy?.name ? bonus.depositedBy.name : "Unknown"}
              </h2>
              <button
                onClick={() =>
                  setExpandedBonus(
                    expandedBonus === bonus._id ? null : bonus._id
                  )
                }
                className="text-text-link hover:text-button"
              >
                {expandedBonus === bonus._id ? (
                  <FaChevronUp size={20} />
                ) : (
                  <FaChevronDown size={20} />
                )}
              </button>
            </div>

            <div className="flex justify-between text-text-body p-3 rounded-md mb-4 shadow-sm bg-primary">
              <p>
                <strong>Amount:</strong> {bonus.amount} {bonus.currency}
              </p>
              <p>
                <strong>Status:</strong> {bonus.status}
              </p>
            </div>

            {expandedBonus === bonus._id && (
              <div className="p-4 bg-primary rounded-md text-text-body space-y-1 break-words whitespace-normal">
                <p>
                  <strong>Email:</strong> {bonus.depositedBy.email}
                </p>
                <p>
                  <strong>Wallet Address:</strong> {bonus.fromAddress}
                </p>
                <p>
                  <strong>Credited On:</strong>{" "}
                  {new Date(bonus.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
                <p>
                  <strong>Chain:</strong> {bonus.tokenType}
                </p>
              </div>
            )}
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
