import StatBox from "./StatBox";
import { useState } from "react";
import ConfirmationModal from "../../../common/ConfirmationModal";

import useSafeNavigate from "../../../../utils/useSafeNavigate";

import { ChevronDown } from "lucide-react";

const levels = [
  { level: 1, stake: 100, title: "Star", weekly: "2.0%" },
  { level: 2, stake: 500, title: "Bronze", weekly: "2.5%" },
  { level: 3, stake: 1000, title: "Silver", weekly: "3.0%" },
  { level: 4, stake: 5000, title: "Gold", weekly: "3.25%" },
  { level: 5, stake: 10000, title: "Diamond", weekly: "3.37%" },
  { level: 6, stake: 50000, title: "Platinum", weekly: "3.5%" },
  { level: 7, stake: 100000, title: "Satoshi", weekly: "3.75%" },
];

function UserPortfolio() {
  const navigate = useSafeNavigate();
  const [selectedLevel, setSelectedLevel] = useState(levels[0]);
  const [amount, setAmount] = useState(levels[0].stake);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLevelChange = (e) => {
    const level = levels.find((lvl) => lvl.level === parseInt(e.target.value));
    setSelectedLevel(level);
    setAmount(level.stake);
  };

  return (
    <div className="relative bg-primary-dark max-w-4xl mx-auto border border-[#2d2b42] rounded-md px-16 py-6 space-y-8">
      <div className="flex flex-wrap justify-between gap-4">
        <div className="flex-1 basis-[220px]">
          <StatBox heading={1880000} subHeading="Available Balance" />
        </div>

        <div className="flex-1 basis-[220px]">
          <StatBox heading={1880} subHeading="Unstaked Balance" />
        </div>
      </div>

      <div className="relative bg-primary-light text-text-heading rounded-md p-8 w-full max-w-3xl shadow-sm shadow-text-link">
        <h2 className="text-2xl font-semibold mb-8">Start Your Investment</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Investment Amount */}
          <div>
            <label className="block text-sm mb-2">
              Enter Amount (Min ${selectedLevel.stake})
            </label>
            <input
              type="number"
              min={selectedLevel.stake}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-primary-dark border border-[#2d2b42] rounded-md py-3 px-4 text-text-heading focus:outline-none placeholder:text-gray-400"
              placeholder={`Enter at least $${selectedLevel.stake}`}
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
            <label className="block text-sm mb-2">Weekly Interest Rate</label>
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
            onConfirm={() => navigate("investments")}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </div>
    </div>
  );
}

export default UserPortfolio;
