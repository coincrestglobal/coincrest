import { useState } from "react";
import AboutSomething from "../components/common/AboutSomething";
import GradientBackground from "../components/common/Gradient";
import { ChevronDown } from "lucide-react";
import { FaTimes } from "react-icons/fa";
import ConfirmationModal from "../components/common/ConfirmationModal";
import useSafeNavigate from "../utils/useSafeNavigate";

const levels = [
  { level: 1, min: 100, title: "Star", weekly: "2.0%" },
  { level: 2, min: 500, title: "Bronze", weekly: "2.5%" },
  { level: 3, min: 1000, title: "Silver", weekly: "3.0%" },
  { level: 4, min: 5000, title: "Gold", weekly: "3.25%" },
  { level: 5, min: 10000, title: "Diamond", weekly: "3.37%" },
  { level: 6, min: 50000, title: "Platinum", weekly: "3.5%" },
  { level: 7, min: 100000, title: "Satoshi", weekly: "3.75%" },
];

const levelIcons = [
  { level: 1, icon: "⭐", name: "Star" },
  { level: 2, icon: "🥉", name: "Bronze" },
  { level: 3, icon: "🥈", name: "Silver" },
  { level: 4, icon: "🥇", name: "Gold" },
  { level: 5, icon: "💎", name: "Diamond" },
  { level: 6, icon: "🔷", name: "Platinum" },
  { level: 7, icon: "👑", name: "Satoshi" },
];

const rewards = [
  { members: 10, reward: "$10" },
  { members: 50, reward: "$50" },
  { members: 100, reward: "$100" },
  { members: 500, reward: "$500" },
];

const earningDetails = [
  { text: "Stake USDT (TRC20) to start earning weekly." },
  { text: "Earn up to 7% Weekly ROI based on your level." },
  { text: "Refer friends and earn 10% from their deposits." },
  { text: "Build a team and earn monthly bonuses." },
  { text: "Withdraw manually after admin approval." },
];

const EarningsPlansPage = () => {
  const navigate = useSafeNavigate();
  const [isClickedOnInvestNow, setIsClickedOnInvestNow] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState(levels[0]);
  const [amount, setAmount] = useState(levels[0].stake);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLevelChange = (e) => {
    const level = levels.find((lvl) => lvl.level === parseInt(e.target.value));
    setSelectedLevel(level);
    setAmount(level.stake);
  };

  const closeModal = () => {
    setIsClickedOnInvestNow(false);
    setSelectedLevel(null);
  };

  return (
    <div className="bg-primary mt-20 text-text-heading min-h-screen py-12 px-6 sm:px-16 md:px-32">
      {/* Gradients */}
      <GradientBackground
        clor1="rgba(14,102,64,0.7)"
        size="40%"
        top="9%"
        left="5%"
      />
      <GradientBackground
        clor1="rgba(14,102,64,0.7)"
        size="40%"
        top="48%"
        left="99%"
      />
      <GradientBackground
        clor1="rgba(14,102,64,0.7)"
        size="40%"
        top="75%"
        left="2%"
      />
      <GradientBackground size="40%" top="15%" left="95%" />
      <GradientBackground size="40%" top="45%" left="5%" />
      <GradientBackground size="40%" top="78%" left="100%" />

      <h1 className="text-3xl sm:text-4xl font-bold text-center flex items-center justify-center gap-4">
        <span className="text-4xl sm:text-5xl text-button">««</span>
        <span>Earning Plans</span>
        <span className="text-button text-4xl sm:text-5xl">»»</span>
      </h1>

      {/* How it works */}
      <AboutSomething heading="How You Earn" subHeadings={earningDetails} />

      {/* Level Cards */}
      <div className="flex flex-col py-10 relative">
        <h1 className="text-3xl sm:text-4xl font-bold text-center flex items-center justify-center gap-4">
          <span className="text-4xl sm:text-5xl text-button">««</span>
          <span>7-Level Earning Structures</span>
          <span className="text-4xl sm:text-5xl text-button">»»</span>
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 py-16 gap-6">
          {levels.map((plan) => {
            const getLevelIcon = (level) => {
              const found = levelIcons.find((item) => item.level === level);
              return found ? found.icon : "";
            };

            return (
              <div
                key={plan.level}
                className="rounded-xl bg-custom-gradient shadow-md shadow-button w-full h-[200px] px-5 flex items-center justify-center relative"
              >
                <div className="absolute left-4 top-18 flex flex-col items-center space-y-1">
                  <div className="w-4 h-4 border-2 bg-button rounded-full mb-1" />
                  <span className="w-1 h-1 bg-text-link rounded-full" />
                  <span className="w-1 h-1 bg-text-link rounded-full" />
                  <span className="w-1 h-1 bg-text-link rounded-full" />
                </div>

                <div className="flex  items-center justify-center  w-full">
                  <p className="text-3xl w-[30%]">{getLevelIcon(plan.level)}</p>

                  <div className="flex flex-col  items-center justify-between space-y-2">
                    <div className="w-[100%]">
                      <div className="text-xl font-semibold">
                        {plan.title} (Level {plan.level})
                      </div>
                      <p className="text-sm text-gray-300 mt-1">
                        Min Stake:{" "}
                        <span className="font-semibold">${plan.min}</span>
                      </p>
                      <p className="text-text-link mt-1">
                        Weekly Return: <strong>{plan.weekly}</strong>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="absolute right-4 top-18 flex flex-col justify-between items-center space-y-1">
                  <div className="w-4 h-4 border-2 bg-button rounded-full mb-1" />
                  <span className="w-1 h-1 bg-text-link rounded-full" />
                  <span className="w-1 h-1 bg-text-link rounded-full" />
                  <span className="w-1 h-1 bg-text-link rounded-full" />
                </div>
              </div>
            );
          })}
        </div>
        <button
          className="bg-button w-fit self-center px-4 py-2 rounded-md shadow-sm shadow-text-highlighted"
          onClick={() => setIsClickedOnInvestNow(true)}
        >
          Start Earning Now
        </button>
        {isClickedOnInvestNow && (
          <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
            <div className="absolute bg-primary-light top-[30%] left-[25%] text-text-heading rounded-md p-8 w-full max-w-3xl shadow-sm shadow-text-link">
              <h2 className="text-2xl font-semibold mb-8">
                Start Your Investment
              </h2>
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 text-2xl text-gray-600 hover:text-button"
              >
                <FaTimes />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {/* Investment Amount */}
                <div>
                  <label className="block text-sm mb-2">
                    Enter Amount (Min ${selectedLevel.min})
                  </label>
                  <input
                    type="number"
                    min={selectedLevel.min}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-primary-dark border border-[#2d2b42] rounded-md py-3 px-4 text-text-heading focus:outline-none placeholder:text-gray-400"
                    placeholder={`Enter at least $${selectedLevel.min}`}
                  />
                </div>

                {/* Investment Level */}
                <div>
                  <label className="block text-sm mb-2">
                    Choose Investment Level
                  </label>
                  <div className="relative">
                    <select
                      className="w-full bg-primary-dark border border-[#2d2b42] rounded-md py-3 px-4 appearance-none text-text-heading focus:outline-none"
                      value={selectedLevel.level}
                      onChange={handleLevelChange}
                    >
                      {levels.map((lvl) => (
                        <option key={lvl.level} value={lvl.level}>
                          {lvl.title}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                      size={20}
                    />
                  </div>
                </div>

                {/* Weekly Interest */}
                <div>
                  <label className="block text-sm mb-2">
                    Weekly Interest Rate
                  </label>
                  <div className="w-full bg-primary-dark border border-[#2d2b42] rounded-md py-3 px-4 text-text-heading">
                    {selectedLevel.weekly}
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  className="bg-button hover:opacity-90 transition-all text-text-heading font-semibold px-12 py-3 rounded-xl shadow-inner shadow-text-link"
                  onClick={() => setIsModalOpen(true)}
                >
                  Invest Now
                </button>
              </div>

              {isModalOpen && (
                <ConfirmationModal
                  text={"Are you sure to want to pay"}
                  onConfirm={() => navigate("/dashboard/user/investments")}
                  onCancel={() => setIsModalOpen(false)}
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Referral Commission */}
      <section className="bg-primary-dark p-6 rounded-xl shadow-md mb-12">
        <h2 className="text-2xl font-semibold text-text-link flex items-center space-x-2 mb-4">
          <span>🔗</span>
          <span className="text-text-heading">Referral Commission</span>
        </h2>
        <p className="text-text-body mb-2">
          Earn <span className="font-semibold text-text-highlighted">10%</span>{" "}
          from each direct referral's deposit.
        </p>
        <p className="text-text-body">
          For example, if your referral deposits $1,000, you get{" "}
          <span className="font-semibold text-text-highlighted">$100</span>{" "}
          instantly!
        </p>
      </section>

      {/* Team Rewards */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">🎁 Monthly Team Rewards</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border border-gray-600 rounded-lg overflow-hidden">
            <thead className="bg-primary-dark text-text-heading">
              <tr>
                <th className="px-4 py-3">Active Team Members</th>
                <th className="px-4 py-3">Monthly Salary Reward</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              {rewards.map((r, i) => (
                <tr key={i} className="border-t border-gray-700">
                  <td className="px-4 py-3">{r.members}</td>
                  <td className="px-4 py-3 font-semibold text-text-link">
                    {r.reward}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-sm text-gray-400">
          💡 Monthly bonuses are based on the number of active members in your
          team.
        </p>
      </section>

      {/* Investment Modal */}
    </div>
  );
};

export default EarningsPlansPage;
