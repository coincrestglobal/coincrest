import { ArrowRight } from "lucide-react";
import useSafeNavigate from "../../../../utils/useSafeNavigate";
import { useUser } from "../../../common/UserContext.jsx";
import { useEffect, useState } from "react";
import { controlPannelStats } from "../../../../services/operations/adminAndOwnerDashboardApi.js";
import Loading from "../../../../pages/Loading";

function ControlPanel() {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [statsSata, setStatsData] = useState({
    users: 0,
    Withdrawals: 0,
    deposits: 0,
    reviews: 0,
    feedbacks: 0,
  });

  useEffect(() => {
    const getStats = async () => {
      try {
        setLoading(true);
        const response = await controlPannelStats(user.token);
        if (response.status === "success" && response.data) {
          const {
            totalUsers,
            totalWithdrawals,
            totalDeposits,
            totalReviews,
            totalFeedbacks,
          } = response.data;

          setStatsData({
            users: totalUsers || 0,
            Withdrawals: totalWithdrawals || 0,
            deposits: totalDeposits || 0,
            reviews: totalReviews || 0,
            feedbacks: totalFeedbacks || 0,
          });
        }
      } catch {
      } finally {
        setLoading(false);
      }
    };
    getStats();
  }, []);

  if (loading) {
    return <Loading />;
  }

  const StatCard = ({ title, value, route }) => {
    const safeNavigate = useSafeNavigate();
    return (
      <div className="bg-primary border border-secondary rounded-md p-4 flex items-center justify-between shadow-md hover:shadow-lg transition-all duration-300 h-[130px] w-full">
        <div>
          <h2 className="text-base sm:text-lg font-semibold text-text-heading mb-1">
            {title}
          </h2>
          {value !== undefined && (
            <p className="text-xl sm:text-3xl font-bold text-text-heading">
              {value}
            </p>
          )}
        </div>

        {route && (
          <button
            onClick={() => safeNavigate(route)}
            className="text-text-heading p-2 rounded-full hover:bg-secondary-light bg-button hover:bg-button shadow-lg transition-all duration-200"
          >
            <ArrowRight size={20} />
          </button>
        )}
      </div>
    );
  };
  console.log(statsSata);
  return (
    <div className="bg-primary-light p-2 sm:p-4 rounded-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      <StatCard title="Users" value={statsSata.users} route="users" />
      <StatCard
        title="Withdraw Requests"
        value={statsSata.Withdrawals}
        route="withdraw-requests"
      />
      <StatCard
        title="Investment Closure Requests"
        value={statsSata.Withdrawals}
        route="investment-closure-requests"
      />
      <StatCard
        title="Deposit History"
        value={statsSata.deposits}
        route="deposit-history"
      />
      <StatCard title="Reviews" value={statsSata.reviews} route="reviews" />
      <StatCard
        title="Feedbacks"
        value={statsSata.feedbacks}
        route="feedbacks"
      />
      <StatCard title="FAQ Management" route="faq-management" />
      <StatCard title="Terms & Conditions" route="terms-and-conditions" />
      <StatCard title="Privacy Policy" route="privacy-policy" />
      {user.role === "owner" && (
        <StatCard title="Manage Admins" route="manage-admins" />
      )}
    </div>
  );
}

export default ControlPanel;
