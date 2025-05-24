import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import {
  getUserDeposits,
  verifyDeposit,
} from "../../../../services/operations/userDashboardApi";

const DepositPage = () => {
  const [activeTab, setActiveTab] = useState("New Deposit");
  const [showModal, setShowModal] = useState(false);
  const [chainType, setChainType] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [password, setPassword] = useState("");
  const [dateAndTime, setDateAndTime] = useState("");

  const handleVerify = async () => {
    const data = {
      tokenType: chainType,
      txId: transactionId,
      trxDateTime: new Date(dateAndTime).getTime(),
      password: password,
    };

    await verifyDeposit(data);

    //get admin's wallet addresess

    setShowModal(false);
  };

  useEffect(() => {
    const getHistory = async () => {
      const params = new URLSearchParams();
      params.append("sort", "desc");
      params.append("page", 1);
      params.append("limit", 10);

      // getting all users
      const response = await getUserDeposits(params.toString());
      console.log(response);
    };
    getHistory();
  }, []);

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

            <div className="bg-primary-light rounded-md p-4 space-y-6 sm:space-y-4">
              {/* TRC20 Address */}
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  TRC20 Address
                </label>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-primary-dark px-4 py-3 rounded-md">
                  <span className="text-text-heading break-words sm:break-all">
                    TVg...YourTRC20AddressHere
                  </span>
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(
                        "TVg...YourTRC20AddressHere"
                      )
                    }
                    className="mt-2 sm:mt-0 sm:ml-4 text-sm text-text-linkHover hover:underline"
                  >
                    Copy
                  </button>
                </div>
              </div>

              {/* BEP20 Address */}
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  BEP20 Address
                </label>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-primary-dark px-4 py-3 rounded-md">
                  <span className="text-text-heading break-words sm:break-all">
                    0x...YourBEP20AddressHere
                  </span>
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText("0x...YourBEP20AddressHere")
                    }
                    className="mt-2 sm:mt-0 sm:ml-4 text-sm text-text-linkHover hover:underline"
                  >
                    Copy
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
        <div className="text-gray-300 space-y-4">
          <div className="bg-primary-light p-4 rounded-lg border border-button">
            <div className="flex justify-between">
              <span>Amount:</span>
              <span>$500</span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <span className="text-text-link">Completed</span>
            </div>
            <div className="flex justify-between">
              <span>Date:</span>
              <span>2025-04-21</span>
            </div>
          </div>
          <p className="text-center text-sm text-gray-500">
            No more deposits found.
          </p>
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
