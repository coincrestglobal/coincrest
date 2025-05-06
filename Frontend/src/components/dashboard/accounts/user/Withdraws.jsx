import React, { useState, useEffect } from "react";
import dayjs from "dayjs"; // Make sure dayjs is installed
import { useUser } from "../../../common/UserContext";

const WithdrawPage = () => {
  const { user, setUser } = useUser();
  const [activeTab, setActiveTab] = useState("New Withdrawal");
  const [isCooldown, setIsCooldown] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (!user || !user.lastWithdrawalDate) return;

    const lastDate = dayjs(user.lastWithdrawalDate);
    console.log(user.lastWithdrawalDate);
    const nextAllowed = lastDate.add(7, "day");

    const updateTimer = () => {
      const now = dayjs();
      const diff = nextAllowed.diff(now, "second");

      if (diff <= 0) {
        setIsCooldown(false);
        setTimeLeft("");
        return;
      }

      const days = Math.floor(diff / (60 * 60 * 24));
      const hours = Math.floor((diff % (60 * 60 * 24)) / 3600);
      const minutes = Math.floor((diff % 3600) / 60);
      const seconds = diff % 60;

      const formatted = `${days}d ${hours}h ${minutes}m ${seconds}s`;
      setIsCooldown(true);
      setTimeLeft(formatted);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [user]);

  return (
    <div className="relative max-w-4xl mx-auto bg-primary-dark  rounded-md p-8">
      {/* Tabs */}
      <div className="flex space-x-10 mb-8">
        {["New Withdrawal", "History", "Guidelines"].map((tab) => (
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

      {/* New Withdrawal Form */}
      {activeTab === "New Withdrawal" && (
        <form className="space-y-6">
          <div>
            <label className="block mb-2 text-sm text-gray-300">
              Amount ($)
            </label>
            <input
              type="number"
              placeholder="Enter amount"
              className="w-full bg-transparent border border-[#2d2b42] rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-text-link"
              disabled={isCooldown}
            />
          </div>

          <div>
            <label className="block mb-2 text-sm text-gray-300">
              Choose Wallet
            </label>
            <select
              className="w-full text-text-heading bg-transparent border border-[#2d2b42] rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-text-link"
              disabled={isCooldown || !user?.wallets?.length}
            >
              {user?.wallets?.length > 0 ? (
                user.wallets.map((wallet, index) => (
                  <option
                    key={index}
                    value={wallet.address}
                    className="text-text-heading bg-primary-light"
                  >
                    {wallet.type.toUpperCase()} - {wallet.chain}
                  </option>
                ))
              ) : (
                <option disabled>No wallets found. Please add one.</option>
              )}
            </select>
          </div>

          <button
            type="button"
            disabled={isCooldown}
            className={`bg-button w-fit text-text-heading font-semibold px-10 py-3 rounded-xl border-2 shadow-inner transition-all duration-200 ${
              isCooldown
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-button-hover hover:opacity-90"
            }`}
          >
            {isCooldown
              ? `Next Withdraw available in: ${timeLeft}`
              : "Withdraw Now"}
          </button>
        </form>
      )}

      {/* Withdrawal History (static for now) */}
      {activeTab === "History" && (
        <div className="text-gray-300 space-y-4">
          <div className="bg-primary-light p-4 rounded-lg border border-[#383658]">
            <div className="flex justify-between">
              <span>Amount:</span>
              <span>$300</span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <span className="text-text-link">Pending</span>
            </div>
            <div className="flex justify-between">
              <span>Date:</span>
              <span>2025-04-20</span>
            </div>
          </div>
          <p className="text-center text-sm text-gray-500">
            No more withdrawals found.
          </p>
        </div>
      )}
      {activeTab === "Guidelines" && (
        <div className="text-gray-300 space-y-4">
          <h2 className="text-xl font-semibold text-text-heading mb-4">
            Withdrawal Guidelines
          </h2>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>Withdrawals are allowed once every 7 days.</li>
            <li>
              Ensure your wallet address is correctly added before initiating a
              withdrawal.
            </li>
            <li>Minimum withdrawal amount is $50.</li>
            <li>Only approved wallets can be used for withdrawal.</li>
            <li>
              All withdrawals are manually reviewed and may take up to 24–48
              hours.
            </li>
            <li>
              In case of issues, contact support with your transaction reference
              ID.
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default WithdrawPage;
