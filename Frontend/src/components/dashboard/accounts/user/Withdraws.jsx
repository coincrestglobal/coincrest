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
            // setIsCooldown(true);
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
      } finally {
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
      <div className="flex flex-wrap sm:flex-nowrap space-x-0 sm:space-x-10 mb-8 md:mb-4 lg:mb-2">
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
            <p className="text-sm text-nav-highlighted py-3">
              Kindly read the guidelines to avoid any issues.
            </p>
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
                <span>Transaction Id:</span>
                <span className="text-text-link">
                  {" "}
                  {item?.txId ? item.txId : item?._id}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Date:</span>
                <span>{new Date(item.createdAt).toLocaleDateString()}</span>
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
          <div className="flex flex-col bg-primary-light p-4 rounded-md">
            <h2 className="text-xl font-semibold text-center text-text-heading mb-4 border-b border-b-button">
              CoinCrest Withdrawal Guidelines
            </h2>
            <p>
              Your assets, your control — but with secure and transparent
              processes. Please review the following withdrawal terms:
            </p>
          </div>
          <ul className="list-disc list-inside space-y-2 text-sm px-2">
            <li>
              📅 <strong>1. One Withdrawal Every 7 Days:</strong> To maintain
              platform integrity and ensure smooth operations, withdrawals are
              permitted once every 7 days per user.
            </li>
            <li>
              🎯 <strong>2. Verify Your Wallet Address:</strong> Make sure your
              withdrawal wallet address is added and verified before initiating
              a request. Incorrect addresses may lead to permanent loss of
              funds.
            </li>
            <li>
              💸 <strong>3. Minimum Withdrawal: $30:</strong> To process a
              withdrawal, the minimum amount must be $30 or more. Requests below
              this threshold will not be accepted.
            </li>
            <li>
              🛡️ <strong>4. Approved Wallets Only:</strong> Withdrawals are only
              allowed to pre-approved wallet addresses linked to your account.
              This enhances security and prevents unauthorized access.
            </li>
            <li>
              ⏱️ <strong>5. Manual Review – 24 to 48 Hours:</strong> For your
              safety, all withdrawal requests are manually reviewed. Please
              allow 24 to 48 hours for processing and confirmation.
            </li>
            <li>
              🆘 <strong>6. Need Assistance?</strong> If you experience any
              issues, reach out to our support team with your transaction
              reference ID for quick resolution.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WithdrawPage;
