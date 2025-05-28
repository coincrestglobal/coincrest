import { ArrowRight } from "lucide-react";
import useSafeNavigate from "../../../../utils/useSafeNavigate";
import { useUser } from "../../../common/UserContext.jsx";

function ControlPanel() {
  const { user, setUser } = useUser();

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

  return (
    <div className="bg-primary-light p-2 sm:p-4 rounded-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      <StatCard title="Users" value={150000} route="users" />
      <StatCard
        title="Withdraw Requests"
        value={100}
        route="withdraw-requests"
      />
      <StatCard
        title="Deposit History"
        value={200000}
        route="deposit-history"
      />
      <StatCard title="Reviews" value={5400} route="reviews" />
      <StatCard title="Feedbacks" value={300} route="feedbacks" />
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
