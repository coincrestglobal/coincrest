import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { X, Mail } from "lucide-react"; // Importing the mail icon
import axios from "axios";

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isMailing, setIsMailing] = useState(false);
  const [isSuspended, setIsSuspended] = useState(false); // Track suspension status
  const [mailSubject, setMailSubject] = useState("");
  const [mailBody, setMailBody] = useState("");
  const [suspendMessage, setSuspendMessage] = useState(""); // Message for suspension reason

  const fetchUser = async (id) => {
    const { data } = await axios.get(
      `http://localhost:5000/api/v1/management/getUser/${id}`
    );
    const { user } = data.data;

    console.log(user);
  };

  useEffect(() => {
    fetchUser(id);
  }, []);

  const user = {
    id: "user123",
    name: "Alice Smith",
    email: "alice@coincrest.com",
    phone: "+9876543210",
    numberOfDeposits: 3,
    totalDepositedAmount: 1000, // Total amount the user has deposited (in USDT)
    totalWithdrawnAmount: 500, // Total amount the user has withdrawn
    lastLogin: "2025-04-22", // Last login date
    accountStatus: "Active", // Account status, could be 'Active', 'Suspended', etc.
    depositHistory: [
      { id: "d101", amount: 200, date: "2025-04-10", status: "Completed" },
      { id: "d102", amount: 500, date: "2025-04-12", status: "Completed" },
      { id: "d103", amount: 300, date: "2025-04-15", status: "Pending" },
      { id: "d101", amount: 200, date: "2025-04-10", status: "Completed" },
      { id: "d102", amount: 500, date: "2025-04-12", status: "Completed" },
      { id: "d103", amount: 300, date: "2025-04-15", status: "Pending" },
      { id: "d101", amount: 200, date: "2025-04-10", status: "Completed" },
      { id: "d102", amount: 500, date: "2025-04-12", status: "Completed" },
      { id: "d103", amount: 300, date: "2025-04-15", status: "Pending" },
    ],
    withdrawalHistory: [
      { id: "w101", amount: 200, date: "2025-04-11", status: "Completed" },
      { id: "w102", amount: 300, date: "2025-04-14", status: "Completed" },
      { id: "w103", amount: 100, date: "2025-04-18", status: "Pending" },
    ],
  };

  const handleSendMail = () => {
    setIsMailing(false);
    setMailSubject("");
    setMailBody("");
  };

  const handleSuspendUser = () => {
    setIsSuspended(false); // Suspend the user
    // Perform the actual suspend action (e.g., API call) here
  };

  const toggleMailing = () => {
    setIsMailing(true);
    setIsSuspended(false); // Disable suspend functionality when mailing
  };

  const toggleSuspension = () => {
    setIsSuspended(true);
    setIsMailing(false); // Disable mailing functionality when suspending
  };

  return (
    <div className="p-6 space-y-6 border border-button rounded-md bg-primary-dark shadow-md h-full overflow-y-auto scrollbar-hide text-[#d1d5db]">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#ffffff]">User Details</h2>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-button text-text-heading rounded-md hover:bg-button cursor-pointer"
        >
          Go Back
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 p-4 bg-primary-dark border border-button rounded-md shadow">
        <p>
          <span className="font-semibold text-button">User ID:</span> {user.id}
        </p>
        <p>
          <span className="font-semibold text-button">Name:</span> {user.name}
        </p>
        <p>
          <span className="font-semibold text-button">Email:</span> {user.email}
        </p>
        <p>
          <span className="font-semibold text-button">Phone:</span> {user.phone}
        </p>
        <p>
          <span className="font-semibold text-button">Number of Deposits:</span>{" "}
          {user.numberOfDeposits}
        </p>
        <p>
          <span className="font-semibold text-button">
            Total Deposited Amount:
          </span>{" "}
          {user.totalDepositedAmount} USDT
        </p>

        <p>
          <span className="font-semibold text-button">Last Login:</span>{" "}
          {user.lastLogin}
        </p>
        <p>
          <span className="font-semibold text-button">Account Status:</span>{" "}
          {user.accountStatus}
        </p>
      </div>

      <div className="p-4 bg-primary-dark border border-button rounded-md shadow ">
        <h3 className="text-button font-semibold ">Deposit History</h3>
        <ul className="list-disc pl-6 max-h-28 overflow-y-scroll scrollbar-hide">
          {user.depositHistory.map((deposit) => (
            <li key={deposit.id} className="text-[#d1d5db]">
              Amount: {deposit.amount} USDT, Date: {deposit.date}, Status:{" "}
              {deposit.status}
            </li>
          ))}
        </ul>
      </div>

      <div className="p-4 bg-primary-dark border border-button rounded-md shadow">
        <h3 className="text-button font-semibold">Withdrawal History</h3>
        <ul className="list-disc pl-6 max-h-28 overflow-y-scroll scrollbar-hide">
          {user.withdrawalHistory.map((withdrawal) => (
            <li key={withdrawal.id} className="text-[#d1d5db]">
              Amount: {withdrawal.amount} USDT, Date: {withdrawal.date}, Status:{" "}
              {withdrawal.status}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex space-x-4">
        {/* Toggle between Mail and Suspend */}
        {!isMailing && !isSuspended && (
          <button
            onClick={toggleMailing}
            className="px-4 py-2 bg-button text-text-heading rounded-md hover:bg-button"
          >
            Send Email
          </button>
        )}

        {!isMailing && !isSuspended && (
          <button
            onClick={toggleSuspension}
            className="px-4 py-2 bg-[#8B0000] text-text-heading rounded-md hover:bg-[#B22222]"
          >
            Suspend User
          </button>
        )}
      </div>

      {isSuspended && (
        <div className="relative p-4 bg-[#15142A] border border-[#7F7CFF] rounded-md shadow mt-4">
          <button
            onClick={() => setIsSuspended(!isSuspended)}
            className="absolute top-2 right-2 text-button hover:text-button"
          >
            <X size={20} />
          </button>
          <p className="text-button font-semibold">Suspend Reason:</p>
          <textarea
            value={suspendMessage}
            onChange={(e) => setSuspendMessage(e.target.value)}
            rows="4"
            placeholder="Enter the reason for suspending the user..."
            className="w-full p-2 border rounded-md bg-[#15142A] text-[#d1d5db] placeholder-[#A0A0B2]"
          />

          <button
            onClick={handleSuspendUser}
            className={`px-4 py-2 text-text-heading rounded-md ${
              !suspendMessage
                ? "cursor-not-allowed bg-gray-500"
                : "bg-[#8B0000] hover:bg-[#B22222]"
            }`}
          >
            Suspend User
          </button>
        </div>
      )}

      {isMailing && (
        <div className="relative p-4 bg-[#15142A] border border-[#7F7CFF] rounded-md shadow">
          <button
            onClick={() => setIsMailing(false)}
            className="absolute top-2 right-2 text-button hover:text-button"
          >
            <X size={20} />
          </button>
          <p className="text-button font-semibold">Enter Your Message:</p>
          <input
            type="text"
            value={mailSubject}
            onChange={(e) => setMailSubject(e.target.value)}
            placeholder="Subject"
            className="w-full p-2 border rounded-md bg-[#15142A] text-[#d1d5db] placeholder-[#A0A0B2]"
          />
          <textarea
            value={mailBody}
            onChange={(e) => setMailBody(e.target.value)}
            rows="4"
            placeholder="Enter message..."
            className="w-full p-2 border rounded-md bg-[#15142A] text-[#d1d5db] placeholder-[#A0A0B2]"
          />
          <button
            onClick={handleSendMail}
            className={`px-4 py-2 text-text-heading rounded-md ${
              !mailSubject || !mailBody
                ? "cursor-not-allowed bg-gray-500"
                : "bg-button hover:bg-button"
            }`}
            disabled={!mailSubject || !mailBody}
          >
            Send Email
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDetails;
