import { useState } from "react";
import { LucideCoins } from "lucide-react";

const levels = [
  { level: 1, stake: 100, title: "Star", weekly: "3%" },
  { level: 2, stake: 300, title: "Bronze", weekly: "4%" },
  { level: 3, stake: 500, title: "Silver", weekly: "4.5%" },
  { level: 4, stake: 1000, title: "Gold", weekly: "5%" },
  { level: 5, stake: 2000, title: "Diamond", weekly: "5.5%" },
  { level: 6, stake: 5000, title: "Platinum", weekly: "6%" },
  { level: 7, stake: 10000, title: "Satoshi", weekly: "7%" },
];

const activeData = [
  {
    name: "Satoshi",
    stake: 10000,
    openedAt: "07.10.2023 12:22:44 PM",
    deposit: "$10000",
  },
  {
    name: "Platinum",
    stake: 5000,
    openedAt: "08.10.2023 10:15:30 AM",
    deposit: "$5000",
  },
  {
    name: "Satoshi",
    stake: 10000,
    openedAt: "07.10.2023 12:22:44 PM",
    deposit: "$10000",
  },
  {
    name: "Platinum",
    stake: 5000,
    openedAt: "08.10.2023 10:15:30 AM",
    deposit: "$5000",
  },
  {
    name: "Satoshi",
    stake: 10000,
    openedAt: "07.10.2023 12:22:44 PM",
    deposit: "$10000",
  },
  {
    name: "Platinum",
    stake: 5000,
    openedAt: "08.10.2023 10:15:30 AM",
    deposit: "$5000",
  },
];

const closedData = [
  {
    name: "Gold",
    stake: 1000,
    openedAt: "01.01.2023 10:00:00 AM",
    closedAt: "03.01.2023 02:30:00 PM",
    deposit: "$1000",
  },
  {
    name: "Bronze",
    stake: 300,
    openedAt: "05.05.2022 01:00:00 PM",
    closedAt: "05.08.2022 11:00:00 AM",
    deposit: "$300",
  },
];

const tabs = ["Active", "Closed"];

function Investments() {
  const [activeTab, setActiveTab] = useState("Active");

  const calculateWeeklyReturn = (stake) => {
    const level = levels.find((lvl) => stake >= lvl.stake);
    return level ? level.weekly : "0%";
  };

  const extractNumericDeposit = (deposit) => {
    return parseFloat(deposit.replace(/[^0-9.-]+/g, ""));
  };

  const calculateProfit = (deposit, weeklyRate) => {
    const numericDeposit = extractNumericDeposit(deposit);
    const rate = parseFloat(weeklyRate) / 100;
    return numericDeposit * rate;
  };

  function cancelPlan() {} //to be implemented

  return (
    <div className="relative bg-primary-dark max-w-4xl mx-auto rounded-md p-8 ">
      {/* Tabs */}
      <div className="flex space-x-8 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 font-medium ${
              activeTab === tab
                ? "text-text-heading border-b-2 border-text-link"
                : "text-gray-400"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Active Tab Content */}
      {activeTab === "Active" && (
        <div>
          {activeData.map((data, index) => {
            const weeklyRate = calculateWeeklyReturn(data.stake);
            const profit = calculateProfit(data.deposit, weeklyRate);
            const numericDeposit = extractNumericDeposit(data.deposit);
            const total = profit + numericDeposit;

            return (
              <div
                key={index}
                className="mb-8 pb-4 border-b border-gray-700 space-y-4 text-text-heading"
              >
                <div className="flex justify-between items-start flex-wrap gap-4 ">
                  {/* Left Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 border border-button rounded-full flex items-center justify-center">
                        <LucideCoins size={20} className="text-text-link" />
                      </div>
                      <h3 className="text-xl font-semibold">{data.name}</h3>
                    </div>

                    <div className="text-sm space-y-2 text-gray-300">
                      <p>
                        <span className="text-text-heading">Opened at:</span>{" "}
                        {data.openedAt}
                      </p>
                      <p>
                        <span className="text-text-heading">Deposit:</span>{" "}
                        {data.deposit}
                      </p>
                      <p>
                        <span className="text-text-heading">
                          Weekly return:
                        </span>{" "}
                        {weeklyRate}
                      </p>
                    </div>
                  </div>

                  {/* Right Profit */}
                  <div className="flex flex-col gap-3">
                    <div className="flex gap-4 items-center">
                      <p className="text-text-highlighted text-lg mb-1">
                        Total Amount:
                      </p>
                      <p className="text-3xl font-semibold">
                        {total.toFixed(2)}
                      </p>
                    </div>

                    <div className="w-full flex justify-between items-center ">
                      <p className="text-text-highlighted text-lg mb-1">
                        Total Profit:
                      </p>
                      <div className="text-right">
                        <p className="text-3xl font-semibold">
                          {profit.toFixed(2)}
                        </p>
                        <p className="text-green-400 text-sm ">
                          +{profit.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  className="bg-button rounded-md px-4 py-2 text-lg"
                  onClick={() => cancelPlan()}
                >
                  Close
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Closed Tab Content */}
      {activeTab === "Closed" && (
        <div>
          {closedData.map((data, index) => {
            const weeklyRate = calculateWeeklyReturn(data.stake);
            const profit = calculateProfit(data.deposit, weeklyRate);

            return (
              <div
                key={index}
                className="flex justify-between items-start flex-wrap gap-4 mb-8 pb-4 border-b border-gray-700"
              >
                {/* Left Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 border border-button rounded-full flex items-center justify-center">
                      <LucideCoins size={20} className="text-text-link" />
                    </div>
                    <h3 className="text-xl font-semibold">{data.name}</h3>
                  </div>

                  <div className="text-sm space-y-2 text-gray-300">
                    <p>
                      <span className="text-text-heading">Opened at:</span>{" "}
                      {data.openedAt}
                    </p>
                    <p>
                      <span className="text-text-heading">Closed at:</span>{" "}
                      {data.closedAt}
                    </p>
                    <p>
                      <span className="text-text-heading">Deposit:</span>{" "}
                      {data.deposit}
                    </p>
                    <p>
                      <span className="text-text-heading">Weekly return:</span>{" "}
                      {weeklyRate}
                    </p>
                  </div>
                </div>

                {/* Right Profit */}
                <div className="text-right">
                  <p className="text-text-highlighted text-sm mb-1">
                    Total Profit
                  </p>
                  <p className="text-3xl font-semibold">{profit.toFixed(2)}</p>
                  <p className="text-green-400 text-sm mt-1">
                    +{profit.toFixed(2)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Investments;
