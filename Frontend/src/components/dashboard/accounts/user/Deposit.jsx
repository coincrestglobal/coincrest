import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import {
  getDepositAddresses,
  getUserDeposits,
  verifyDeposit,
} from "../../../../services/operations/userDashboardApi";
import DashboardHeader from "../../../common/DashboardHeader";
import { useUser } from "../../../common/UserContext";
import Pagination from "../../../common/Pagination";
import Loading from "../../../../pages/Loading";

const DepositPage = () => {
  const { user } = useUser();
  const [filterState, setFilterState] = useState({
    searchQuery: "",
    sortOrder: "desc",
    selectedFilters: [],
  });
  const [activeTab, setActiveTab] = useState("New Deposit");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [chainType, setChainType] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [password, setPassword] = useState("");
  const [dateAndTime, setDateAndTime] = useState("");
  const [deposits, setDeposits] = useState();
  const [totalPages, setTotalPages] = useState(1);
  const [totalDeposits, setTotalDeposits] = useState([]);
  const [addresses, setAdresses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const numberOfEntries = 5;
  const [copiedBEP, setCopiedBEP] = useState(false);
  const [copiedTRC, setCopiedTRC] = useState(false);

  useEffect(() => {
    const getHistory = async () => {
      try {
        setLoading(true);
        const { searchQuery, selectedFilters, sortOrder } = filterState;
        const params = new URLSearchParams();

        if (searchQuery) {
          params.append("search", searchQuery);
        }
        if (selectedFilters["Date Interval"]) {
          const { startDate, endDate } = selectedFilters["Date Interval"];
          if (startDate) params.append("startDate", startDate);
          if (endDate) params.append("endDate", endDate);
        }

        if (sortOrder) {
          params.append("sort", sortOrder);
        }

        params.append("page", currentPage);
        params.append("role", "user");
        params.append("limit", numberOfEntries);

        // getting all users
        const response = await getUserDeposits(user.token, params.toString());

        setDeposits(response.data.deposits || []);

        setTotalPages(response.totalPages || 1);
        setTotalDeposits(response.total || 0);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    getHistory();
  }, [currentPage, filterState]);

  useEffect(() => {
    const getAddressess = async () => {
      try {
        setLoading(true); // Start loading
        const response = await getDepositAddresses(user.token);
        setAdresses(response.data.addresses);
      } catch (error) {
        console.error("Failed to fetch addresses:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    getAddressess();
  }, []);

  const handleCopyTRC = () => {
    const address = addresses["TRC-20"]?.walletAddress;
    if (address) {
      navigator.clipboard.writeText(address).then(() => {
        setCopiedTRC(true);
        setTimeout(() => setCopiedTRC(false), 2000); // Reset after 2s
      });
    }
  };

  const handleCopyBEP = () => {
    const address = addresses["BEP-20"]?.walletAddress;
    if (address) {
      navigator.clipboard.writeText(address).then(() => {
        setCopiedBEP(true);
        setTimeout(() => setCopiedBEP(false), 2000); // Show "Copied!" for 2 seconds
      });
    }
  };

  const handleVerify = async () => {
    try {
      setLoading(true);
      const data = {
        tokenType: chainType,
        txId: transactionId,
        trxDateTime: new Date(dateAndTime).getTime(),
        password: password,
      };

      await verifyDeposit(user.token, data);
      setShowModal(false);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="relative w-full max-w-4xl bg-primary-dark rounded-md p-4 sm:p-6 md:p-8 flex flex-col ">
      {/* Tabs */}
      <div className="flex flex-wrap gap-4 sm:space-x-10 mb-8">
        {["New Deposit", "History", "Guidelines"].map((tab) => (
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

      {/* New Deposit Tab */}
      {activeTab === "New Deposit" && (
        <div className="space-y-6">
          <div>
            <p className="text-sm text-gray-300 mb-2">
              Please transfer USDT to one of the following wallet addresses:
            </p>

            {user?.wallets?.length > 0 ? (
              <div className="bg-primary-light rounded-md p-4 space-y-6 sm:space-y-4">
                {/* TRC-20 Address */}
                {user.wallets.find((w) => w.tokenType === "TRC-20") ? (
                  <div className="mb-4">
                    <label className="block text-sm text-gray-400 mb-1">
                      TRC-20 Address
                    </label>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-primary-dark px-4 py-3 rounded-md">
                      <span className="text-text-heading break-words sm:break-all">
                        {addresses["TRC-20"]?.walletAddress}
                      </span>
                      <button
                        onClick={handleCopyTRC}
                        className="mt-2 sm:mt-0 sm:ml-4 text-sm text-text-linkHover hover:underline"
                      >
                        {copiedTRC ? "Copied!" : "Copy"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-primary-light border-l-4 border-button text-text-highlighted p-4 rounded-md shadow-sm">
                    <p className="font-medium">No TRC-20 Wallet Found</p>
                    <p className="text-sm mt-1">
                      Please add your TRC-20 wallet address to continue.
                    </p>
                  </div>
                )}

                {/* BEP-20 Address */}
                {user.wallets.find((w) => w.tokenType === "BEP-20") ? (
                  <div className="mb-4">
                    <label className="block text-sm text-gray-400 mb-1">
                      BEP-20 Address
                    </label>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-primary-dark px-4 py-3 rounded-md">
                      <span className="text-text-heading break-words sm:break-all">
                        {addresses["BEP-20"]?.walletAddress}
                      </span>
                      <button
                        onClick={handleCopyBEP}
                        className="mt-2 sm:mt-0 sm:ml-4 text-sm text-text-linkHover hover:underline"
                      >
                        {copiedBEP ? "Copied!" : "Copy"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-primary-light border-l-4 border-button text-text-highlighted p-4 rounded-md shadow-sm">
                    <p className="font-medium">No BEP-20 Wallet Found</p>
                    <p className="text-sm mt-1">
                      Please add your BEP-20 wallet address to continue.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-primary-light border-l-4 border-button text-text-highlighted p-4 rounded-md shadow-sm">
                <p className="font-medium">No Wallets Found</p>
                <p className="text-sm mt-1">
                  Please add your TRC-20 and BEP-20 wallet addresses to
                  continue.
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col py-2 gap-3">
            <p className="text-sm text-nav-highlighted">
              Kindly read the guidelines to avoid any issues.
            </p>

            <p className="text-sm text-gray-400">
              After sending the payment, please upload proof of payment using
              below verify button.
            </p>
            <button
              className="w-fit bg-button py-2 text-lg px-4 rounded-md"
              onClick={() => setShowModal(true)}
            >
              Verify Payment
            </button>
          </div>
        </div>
      )}

      {/* History Tab */}
      {activeTab === "History" && (
        <div>
          <DashboardHeader
            title={"Deposit History"}
            totalCount={totalDeposits}
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
          <div className="text-gray-300 space-y-4">
            {deposits.length > 0 ? (
              deposits.map((deposit, index) => (
                <div
                  key={index}
                  className="bg-primary-light p-4 rounded-lg border border-button"
                >
                  <div className="flex justify-between">
                    <span>Amount:</span>
                    <span>${deposit.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Token Type</span>
                    <span className="text-text-link">{deposit.tokenType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span>
                      {new Date(deposit.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-sm text-gray-500">
                No deposits found.
              </p>
            )}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-primary border border-button p-6 rounded-lg w-full max-w-md relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-text-heading"
              onClick={() => setShowModal(false)}
              aria-label="Close modal"
            >
              <FaTimes />
            </button>

            <h2 className="text-lg text-text-heading mb-4 font-semibold">
              Verify Your Payment
            </h2>

            <div className="space-y-4">
              {/* Chain Type */}
              <div>
                <label className="block text-sm text-text-heading mb-1">
                  Chain Type
                </label>
                <select
                  value={chainType}
                  onChange={(e) => setChainType(e.target.value)}
                  className="w-full bg-gray-800  border border-button rounded-md px-4 py-2 text-text-heading focus:outline-none"
                >
                  <option
                    className="bg-primary-dark border-b-2  border-white"
                    value=""
                  >
                    Select Chain Type
                  </option>
                  <option
                    className="bg-primary-dark border-b-2 border-white"
                    value="BEP-20"
                  >
                    BEP-20
                  </option>
                  <option
                    className="bg-primary-dark border-b-2 border-white"
                    value="TRC-20"
                  >
                    TRC-20
                  </option>
                </select>
              </div>

              {/* Transaction ID */}
              <div>
                <label className="block text-sm text-text-heading mb-1">
                  Transaction ID
                </label>
                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="w-full bg-gray-800  border border-button rounded-md px-4 py-2 placeholder-white   focus:outline-none"
                  placeholder="Enter your transaction ID"
                />
              </div>

              {/* Date And Time */}
              <div>
                <label className="block text-sm text-text-heading mb-1">
                  Date And Time
                </label>
                <input
                  type="datetime-local"
                  value={dateAndTime}
                  onChange={(e) => setDateAndTime(e.target.value)}
                  className="w-full bg-gray-800 border border-button rounded-md px-4 py-2 text-white placeholder-white text-text-heading focus:outline-none"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm text-text-heading mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-800  border border-button rounded-md px-4 py-2 text-text-heading placeholder-white  focus:outline-none"
                  placeholder="Enter your password"
                />
              </div>

              {/* Submit Button */}
              <button
                className="w-full bg-button hover:bg-button-hover py-2 mt-4 rounded-md text-text-heading font-medium"
                onClick={handleVerify}
              >
                Verify
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === "Guidelines" && (
        <div className="text-gray-300 space-y-4">
          <h2 className="text-xl font-semibold text-text-heading mb-4">
            Deposit Guidelines
          </h2>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>Ensure your wallet address is correct before depositing.</li>
            <li>Minimum deposit amount is $10.</li>
            <li>All deposits are final and non-refundable.</li>
            <li>Use only supported chains and tokens for deposits.</li>
            <li>Deposits may take a few minutes to reflect in your account.</li>
            <li>
              Contact support in case of issues with the deposit confirmation.
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default DepositPage;
