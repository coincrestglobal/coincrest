import { useEffect, useState } from "react";
import AboutSomething from "../components/common/AboutSomething";
import GradientBackground from "../components/common/Gradient";
import InvestCard from "../components/dashboard/accounts/user/InvestCard";
import { FaMedal } from "react-icons/fa";
import {
  getReferralPlan,
  getTeamBasedRewards,
} from "../services/operations/earningApi";
import { toast } from "react-toastify";
import { useUser } from "../components/common/UserContext";
import { getPlans } from "../services/operations/userDashboardApi";
import Loading from "../pages/Loading";

const levelIcons = [
  { level: 1, icon: "⭐", name: "Star" },
  { level: 2, icon: <FaMedal color="#cd7f32" />, name: "Bronze" },
  { level: 3, icon: <FaMedal color="#c0c0c0" />, name: "Silver" },
  { level: 4, icon: <FaMedal color="#ffd700" />, name: "Gold" },
  { level: 5, icon: "💎", name: "Diamond" },
  { level: 6, icon: "🔷", name: "Platinum" },
  { level: 7, icon: "👑", name: "Satoshi" },
];

const earningDetails = [
  { text: "Stake USDT  to start earning weekly." },
  { text: "Earn up to 15% monthly ROI based on your investment plan level" },
  { text: "Refer friends and earn 10% from their deposits." },
  {
    text: "Expand your team to earn scalable bonuses, directly aligned with your team's size and contribution.",
  },
  { text: "Withdraw manually after admin approval." },
];

const EarningsPlansPage = () => {
  const { user } = useUser();
  const [isClickedOnInvestNow, setIsClickedOnInvestNow] = useState(false);
  const [levels, setLevels] = useState([]);
  const [depositBonus, setDepositBonus] = useState(0);
  const [teamBonus, setTeamBonus] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getDepositBonus = async () => {
      const referralDepositBonus = await getReferralPlan();
      setDepositBonus(referralDepositBonus.data.value);
    };
    getDepositBonus();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch plans
        const plansRes = await getPlans();
        if (plansRes.status === "success") {
          const sorted = plansRes.data.plans.sort((a, b) => a.level - b.level);
          setLevels(sorted);
        }

        // Fetch team bonus
        const teamRes = await getTeamBasedRewards();
        if (teamRes.status === "success") {
          const entriesArray = Object.entries(teamRes.data.value);
          setTeamBonus(entriesArray);
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  const handleInvestClick = () => {
    if (!user || !user.token) {
      toast.error("Please login first to start earning!");
      return;
    }
    setIsClickedOnInvestNow(true);
  };

  return (
    <div className="bg-primary mt-20 text-text-heading min-h-screen py-1 px-4 md:px-32">
      {/* Gradients */}
      <GradientBackground clor1="var(--grad2)" size="40%" top="9%" left="1%" />
      <GradientBackground
        clor1="var(--grad2)"
        size="40%"
        top="48%"
        left="99%"
      />
      <GradientBackground clor1="var(--grad2)" size="40%" top="75%" left="2%" />
      <GradientBackground size="40%" top="15%" left="95%" />
      <GradientBackground size="40%" top="45%" left="5%" />
      <GradientBackground size="40%" top="78%" left="100%" />

      <h1 className="text-center text-3xl sm:text-4xl md:text-5xl font-extrabold text-text-heading  flex items-center justify-center gap-3 sm:gap-5">
        <span className="text-text-highlighted text-4xl  md:text-6xl">««</span>
        <span className="text-text-heading text-2xl sm:text-3xl md:text-4xl tracking-tight pt-1 md:pt-2">
          Earning Plans
        </span>
        <span className="text-text-highlighted text-4xl sm:text-5xl md:text-6xl">
          »»
        </span>
      </h1>

      {/* How it works */}
      <AboutSomething heading="How You Earn" subHeadings={earningDetails} />

      {/* Level Cards */}
      <div className="flex flex-col py-10 relative px-4 md:px-0.5 lg:px-10">
        {/* Title */}

        <h1 className="text-center text-3xl sm:text-4xl md:text-5xl font-extrabold text-text-heading  flex items-center justify-center gap-3 sm:gap-5">
          <span className="text-text-highlighted text-4xl  md:text-6xl">
            ««
          </span>
          <span className="text-text-heading text-2xl sm:text-3xl md:text-4xl tracking-tight pt-1 md:pt-2">
            7-Level Earning Structures
          </span>
          <span className="text-text-highlighted text-4xl sm:text-5xl md:text-6xl">
            »»
          </span>
        </h1>

        {/* Level Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-12 sm:py-14">
          {levels.map((plan) => {
            const getLevelIcon = (level) => {
              const found = levelIcons.find((item) => item.level === level);
              return found ? found.icon : "";
            };

            return (
              <div
                key={plan.level}
                className="rounded-xl bg-custom-gradient shadow-md shadow-button w-full h-auto min-h-[180px] px-6 py-6 flex items-center justify-center relative"
              >
                {/* Left dots */}
                <div className="absolute left-4 top-16 flex flex-col items-center space-y-1">
                  <div className="w-4 h-4 border-2 bg-button rounded-full mb-1" />
                  <span className="w-1 h-1 bg-text-link rounded-full" />
                  <span className="w-1 h-1 bg-text-link rounded-full" />
                  <span className="w-1 h-1 bg-text-link rounded-full" />
                </div>

                {/* Content */}
                <div className="flex flex-col lg:flex-row items-center lg:justify-center w-full gap-4">
                  {/* Icon */}
                  <p className="text-3xl sm:text-4xl md:text-5xl">
                    {getLevelIcon(plan.level)}
                  </p>

                  {/* Info */}
                  <div className="flex flex-col text-center sm:text-left items-center sm:items-start justify-center space-y-2">
                    <div className="text-lg sm:text-xl font-semibold">
                      {plan.title} (Level {plan.level})
                    </div>
                    <p className="text-sm text-gray-300">
                      Min Stake:{" "}
                      <span className="font-semibold">${plan.minAmount}</span>
                    </p>
                    <p className="text-sm text-text-link">
                      Weekly Return: <strong>{plan.interestRate}%</strong>
                    </p>
                  </div>
                </div>

                {/* Right dots */}
                <div className="absolute right-4 top-16 flex flex-col items-center space-y-1">
                  <div className="w-4 h-4 border-2 bg-button rounded-full mb-1" />
                  <span className="w-1 h-1 bg-text-link rounded-full" />
                  <span className="w-1 h-1 bg-text-link rounded-full" />
                  <span className="w-1 h-1 bg-text-link rounded-full" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Button */}
        <button
          className="bg-button w-fit self-center px-6 py-2 text-sm sm:text-base rounded-md shadow-sm shadow-text-highlighted"
          onClick={handleInvestClick}
        >
          Start Earning Now
        </button>

        {/* Modal */}
        {isClickedOnInvestNow && (
          <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
            <InvestCard onClose={setIsClickedOnInvestNow} />
          </div>
        )}
      </div>

      {/* Referral Commission */}
      <section className="bg-primary-dark p-4 sm:p-6 rounded-xl shadow-md mb-10 sm:mb-12">
        <h2 className="text-xl sm:text-2xl font-semibold text-text-link flex items-center space-x-2 mb-3 sm:mb-4">
          <span>🔗</span>
          <span className="text-text-heading">Referral Commission</span>
        </h2>

        <p className="text-sm sm:text-base text-text-body mb-2">
          Earn{" "}
          <span className="font-semibold text-text-highlighted">
            {depositBonus}%
          </span>{" "}
          from each direct referral's deposit.
        </p>
        <p className="text-sm sm:text-base text-text-body">
          For example, if your referral deposits $1,000, you get{" "}
          <span className="font-semibold text-text-highlighted">
            ${1000 * 0.1}{" "}
          </span>
          instantly!
        </p>
      </section>

      {/* Team Rewards */}
      <section className="mb-10 sm:mb-12 ">
        <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">
          🎁 Team Based Rewards
        </h2>

        <div className="overflow-x-auto ">
          <table className="w-[310px] md:w-full text-left border border-gray-600">
            <thead className="bg-primary-dark text-text-heading">
              <tr>
                <th className="px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base">
                  Active Team Members
                </th>
                <th className="px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base">
                  Reward
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              {teamBonus.map((r, i) => (
                <tr key={i} className="border-t border-gray-700">
                  <td className="px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base">
                    {r[0]}
                  </td>
                  <td className="px-3 sm:px-4 py-2 sm:py-3 font-semibold text-text-link text-sm sm:text-base">
                    ${r[1]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-2 text-xs sm:text-sm text-gray-400">
          💡 Monthly bonuses are based on the number of active members in your
          team.
        </p>
      </section>
    </div>
  );
};

export default EarningsPlansPage;
