import { useState, useEffect } from "react";
import { useUser } from "../../../common/UserContext";
import {
  getUserWithdrawals,
  withdraw,
} from "../../../../services/operations/userDashboardApi";
import DashboardHeader from "../../../common/DashboardHeader";
import Pagination from "../../../common/Pagination";
import { toast } from "react-toastify";
import Loading from "../../../../pages/Loading";

const WithdrawPage = () => {
  const { user } = useUser();
  const [filterState, setFilterState] = useState({
    searchQuery: "",
    sortOrder: "desc",
    selectedFilters: [],
  });
  const [activeTab, setActiveTab] = useState("New Withdrawal");
  const [isCooldown, setIsCooldown] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");
  const [withdrawHistory, setWithdrawHistory] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalWithdraws, setTotalWithdraws] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    amount: "",
    wallet: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const numberOfEntries = 5;

  useEffect(() => {
    const getWithdrawalHistory = async () => {
      try {
        setLoading(true);
        const { searchQuery, selectedFilters, sortOrder } = filterState;
        const params = new URLSearchParams();

        if (searchQuery) params.append("search", searchQuery);
        if (selectedFilters["Date Interval"]) {
          const { startDate, endDate } = selectedFilters["Date Interval"];
          if (startDate) params.append("startDate", startDate);
          if (endDate) params.append("endDate", endDate);
        }

        if (sortOrder) params.append("sort", sortOrder);

        params.append("page", currentPage);
        params.append("role", "user");
        params.append("limit", numberOfEntries);

        const response = await getUserWithdrawals(
          user.token,
          params.toString()
        );
        const withdrawals = response.data.withdrawals;

        setWithdrawHistory(withdrawals);
        setTotalPages(response.totalPages || 1);
        setTotalWithdraws(response.total || 0);

        if (withdrawals.length > 0) {
          const lastWithdrawalDate = new Date(withdrawals[0].createdAt);
          const now = new Date();
          const diffInMs = now - lastWithdrawalDate;
          const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

          if (diffInDays < 7) {
            setIsCooldown(true);
            const timeLeftInMs = 7 * 24 * 60 * 60 * 1000 - diffInMs;
            const days = Math.floor(timeLeftInMs / (1000 * 60 * 60 * 24));
            const hours = Math.floor(
              (timeLeftInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
            );
            const minutes = Math.floor(
              (timeLeftInMs % (1000 * 60 * 60)) / (1000 * 60)
            );
            setTimeLeft(`${days}d ${hours}h ${minutes}m`);
          } else {
            setIsCooldown(false);
            setTimeLeft("");
          }
        } else {
          setIsCooldown(false);
          setTimeLeft("");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching withdrawal history:", error);
        setLoading(false);
      }
    };

    getWithdrawalHistory();
  }, [currentPage, filterState, user.token]);

  const handleWithdraw = async () => {
    const { amount, wallet, password } = formData;

    if (!amount || Number(amount) < 50) {
      toast.error("Minimum withdrawal amount is $50.");
      return;
    }

    if (!wallet) {
      toast.error("Please select a wallet.");
      return;
    }

    if (!password) {
      toast.error("Please enter your password.");
      return;
    }

    try {
      setLoading(true);
      console.log(wallet);
      const [tokenType, address] = wallet.split(" - ");
      const payload = {
        amount,
        tokenType,
        address,
        password,
      };
      const response = await withdraw(user.token, payload);
      setFormData({ amount: "", wallet: "", password: "" });
      setCurrentPage(1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }
  return (
    <div className="relative max-w-4xl mx-auto bg-primary-dark rounded-md p-6 sm:p-8">
      <div className="flex flex-wrap sm:flex-nowrap space-x-0 sm:space-x-10 mb-6 sm:mb-8">
        {["New Withdrawal", "History", "Guidelines"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 font-medium w-1/3 sm:w-auto text-center sm:text-left ${
              activeTab === tab
                ? "text-text-heading border-b-2 border-button"
                : "text-gray-400"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div>
        {/* New Withdrawal Form */}
        <form
          className={`space-y-6 ${
            activeTab === "New Withdrawal" ? "" : "hidden"
          }`}
        >
          <div>
            <label className="block mb-2 text-sm text-gray-300">
              Amount ($)
            </label>
            <input
              type="number"
              placeholder="Enter amount"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              className="w-full bg-transparent border border-[#2d2b42] text-white rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-text-link"
              disabled={isCooldown}
            />
          </div>

          <div>
            <label className="block mb-2 text-sm text-gray-300">
              Choose Wallet
            </label>
            <select
              value={formData.wallet}
              onChange={(e) =>
                setFormData({ ...formData, wallet: e.target.value })
              }
              className="w-full text-text-heading bg-transparent border border-[#2d2b42] rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-text-link"
              disabled={isCooldown || !user?.wallets?.length}
            >
              <option value="" disabled>
                Select wallet
              </option>
              {user?.wallets?.map((wallet, index) => (
                <option
                  key={index}
                  value={`${wallet.tokenType} - ${wallet.address}`}
                  className="text-text-heading bg-primary-light"
                >
                  {wallet.tokenType} - {wallet.address}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm text-gray-300">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full bg-transparent border border-[#2d2b42] text-white rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-text-link"
              disabled={isCooldown}
            />
          </div>

          <button
            type="button"
            onClick={handleWithdraw}
            disabled={isCooldown || loading}
            className={`bg-button w-fit text-text-heading font-semibold px-10 py-3 rounded-xl border-2 shadow-inner transition-all duration-200 ${
              isCooldown || loading
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-button-hover hover:opacity-90"
            }`}
          >
            {isCooldown
              ? `Next Withdraw available in: ${timeLeft}`
              : loading
              ? "Processing..."
              : "Withdraw Now"}
          </button>
        </form>

        {/* Withdrawal History */}
        <div
          className={`${
            activeTab === "History" ? "" : "hidden"
          } text-gray-300 space-y-4`}
        >
          <DashboardHeader
            title={"Withdrawal History"}
            totalCount={totalWithdraws}
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
          {withdrawHistory.map((item, index) => (
            <div
              key={index}
              className="bg-primary-light p-4 rounded-lg border border-[#383658]"
            >
              <div className="flex justify-between">
                <span>Amount:</span>
                <span>${item.amount}</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span
                  className={`${
                    item.status === "Pending"
                      ? "text-text-link"
                      : "text-green-400"
                  }`}
                >
                  {item.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Date:</span>
                <span>{item.date}</span>
              </div>
            </div>
          ))}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>

        {/* Guidelines */}
        <div
          className={`${
            activeTab === "Guidelines" ? "" : "hidden"
          } text-gray-300 space-y-4`}
        >
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
      </div>
    </div>
  );
};

export default WithdrawPage;
