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
  const [chainType, setChainType] = useState("BEP-20");
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

  const handleCopyBEP = () => {
    const address = addresses["BEP-20"]?.walletAddress;
    if (!address) return;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(address)
        .then(() => {
          setCopiedBEP(true);
          setTimeout(() => setCopiedBEP(false), 2000);
        })
        .catch(() => fallbackCopyTextToClipboard(address, setCopiedBEP));
    } else {
      fallbackCopyTextToClipboard(address, setCopiedBEP);
    }
  };

  const fallbackCopyTextToClipboard = (text, setCopied) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.position = "fixed";
    textArea.style.top = 0;
    textArea.style.left = 0;
    textArea.style.width = "2em";
    textArea.style.height = "2em";
    textArea.style.padding = 0;
    textArea.style.border = "none";
    textArea.style.outline = "none";
    textArea.style.boxShadow = "none";
    textArea.style.background = "transparent";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand("copy");
      if (successful) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        alert("Failed to copy address");
      }
    } catch (err) {
      alert("Failed to copy address");
    }

    document.body.removeChild(textArea);
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
          <p className="text-sm text-nav-highlighted">
            Kindly read the guidelines to avoid any issues.
          </p>
          <div>
            <p className="text-sm text-gray-300 mb-2">
              Please transfer USDT to one of the following wallet addresses:
            </p>

            <div className="bg-primary-light rounded-md p-4 space-y-6 sm:space-y-4">
              {/* BEP-20 Address */}

              <div className="mb-4">
                <div className="mt-4 flex justify-center">
                  <img
                    src="/images/qr.png"
                    alt="Safepal Payment QR"
                    className="w-48 h-48 object-contain rounded-md shadow-md"
                  />
                </div>
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
            </div>
          </div>

          <div className="flex flex-col py-2 gap-3">
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
                    <span>Token Type:</span>
                    <span className="text-text-link">{deposit.tokenType}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start break-words">
                    <span className="font-medium">Transaction Id:</span>
                    <span className="text-text-link break-words max-w-full sm:ml-4">
                      {deposit.txId}
                    </span>
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
                <p className="w-full bg-gray-800 border border-button rounded-md px-4 py-2 text-text-heading">
                  BEP-20
                </p>
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
          <div className="flex flex-col bg-primary-light p-4 rounded-md">
            <h2 className="text-xl font-semibold text-center text-text-heading mb-4 border-b border-b-button">
              CoinCrest Deposit Guidelines
            </h2>
            <p>
              Welcome to the future of finance. Before you fund your wallet,
              please follow these important steps to ensure a seamless
              experience:
            </p>
          </div>

          <ul className="list-disc list-inside space-y-2 text-sm px-2">
            <li>
              <strong>Double-Check Your Wallet Address: </strong>Blockchain
              transactions are irreversible. Always confirm that your wallet
              address is 100% accurate before making a deposit.
            </li>
            <li>
              <strong>Minimum Deposit Requirement:</strong> The network doesn’t
              run on dust — make sure your deposit meets the minimum threshold
              of $100 to activate your staking.
            </li>
            <li>
              <strong>All Transactions Are Final:</strong> On-chain means no
              take-backs. Once confirmed, deposits are non-refundable and cannot
              be reversed.
            </li>
            <li>
              <strong>Use Supported Chains & Tokens Only:</strong> Stick to the
              approved networks and tokens listed on CoinCrest. Unsupported
              assets may be lost permanently.
            </li>
            <li>
              <strong>Deposit Times May Vary:</strong> Most deposits reflect
              within minutes, but network congestion or chain conditions may
              cause slight delays. Your patience is appreciated.
            </li>
            <li>
              <strong>Need Help? We’ve Got You:</strong> If your deposit doesn’t
              show up or you're unsure about the process, our support team is
              just a message away. Keep your transaction hash ready.
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default DepositPage;
