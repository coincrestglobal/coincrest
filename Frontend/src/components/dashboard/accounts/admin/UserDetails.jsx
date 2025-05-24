import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { X, Mail } from "lucide-react"; // Importing the mail icon
import Loading from "../../../../pages/Loading";
import { getUserDetails } from "../../../../services/operations/adminAndOwnerDashboardApi";

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMailing, setIsMailing] = useState(false);
  const [isSuspended, setIsSuspended] = useState(false); // Track suspension status
  const [mailSubject, setMailSubject] = useState("");
  const [mailBody, setMailBody] = useState("");
  const [suspendMessage, setSuspendMessage] = useState(""); // Message for suspension reason

  useEffect(() => {
    const fetchUser = async () => {
      const params = new URLSearchParams();
      params.append("id", id);
      const userDetails = await getUserDetails(params);
      setUser(userDetails.data.user);
      setLoading(false);
    };

    fetchUser();
  }, []);

  if (loading) {
    return <Loading />;
  }

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

  function findAccountStatus(updatedAt) {
    const lastUpdatedDate = new Date(updatedAt);

    const currentDate = new Date();

    const diffInMs = currentDate - lastUpdatedDate;

    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    return diffInDays > 15 ? "inactive" : "active";
  }

  return (
    <div className="p-6 space-y-6  rounded-md bg-primary-dark shadow-md h-full overflow-y-auto scrollbar-hide text-[#d1d5db]">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#ffffff]">User Details</h2>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-button text-text-heading rounded-md hover:bg-button cursor-pointer"
        >
          Go Back
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4 p-4 bg-primary border border-button rounded-md shadow">
        {/* <p>
          <span className="font-semibold text-button">User ID:</span> {user.id}
        </p> */}
        <p>
          <span className="font-semibold text-button">Name:</span> {user.name}
        </p>
        <p>
          <span className="font-semibold text-button">Email:</span> {user.email}
        </p>
        <p>
          <span className="font-semibold text-button">Number of Deposits:</span>{" "}
          {user.deposits.length}
        </p>
        <p>
          <span className="font-semibold text-button">
            Total Deposited Amount:
          </span>{" "}
          {user.totalDepositedAmount} USDT
        </p>

        <p>
          <span className="font-semibold text-button">Last Login:</span>{" "}
          {new Date(user.updatedAt).toLocaleDateString()}
        </p>
        <p>
          <span className="font-semibold text-button ">Account Status: </span>
          <span className="px-3 py-1 bg-button rounded-md">
            {findAccountStatus(user.updatedAt)}
          </span>
        </p>
      </div>

      <div className="p-4 bg-primary-dark border border-button rounded-md shadow ">
        <h3 className="text-button font-semibold ">Deposit History</h3>
        <ul className="list-disc pl-6 max-h-28 overflow-y-scroll scrollbar-hide">
          {user.deposits.map((deposit, index) => (
            <li
              key={`${deposit.id}-${deposit.date}-${index}`}
              className="text-[#d1d5db]"
            >
              Amount: {deposit.amount} USDT, Date: {deposit.date}, Status:{" "}
              {deposit.status}
            </li>
          ))}
        </ul>
      </div>

      <div className="p-4 bg-primary-dark border border-button rounded-md shadow">
        <h3 className="text-button font-semibold">Withdrawal History</h3>
        <ul className="list-disc pl-6 max-h-28 overflow-y-scroll scrollbar-hide">
          {user.withdrawals.map((withdrawal) => (
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
        <div className="relative p-4 bg-primary  border border-buttonrounded-md shadow mt-4">
          <button
            onClick={() => setIsSuspended(!isSuspended)}
            className="absolute top-2 right-2 text-button hover:text-button"
          >
            <X size={20} />
          </button>
          <p className="text-button font-semibold py-2">Suspend Reason:</p>
          <textarea
            value={suspendMessage}
            onChange={(e) => setSuspendMessage(e.target.value)}
            rows="4"
            placeholder="Enter the reason for suspending the user..."
            className="w-full p-2 border rounded-md  bg-primary-dark text-text-heading placeholder-text-heading"
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
        <div className="relative px-4 py-2 bg-primary border border-button rounded-md shadow">
          <button
            onClick={() => setIsMailing(false)}
            className="absolute top-2 right-2 text-button hover:text-button"
          >
            <X size={20} />
          </button>
          <p className="text-button font-semibold py-2">Enter Your Message:</p>
          <input
            type="text"
            value={mailSubject}
            onChange={(e) => setMailSubject(e.target.value)}
            placeholder="Subject"
            className="w-full p-2  border rounded-md bg-primary-dark text-text-heading placeholder-text-heading mb-1"
          />
          <textarea
            value={mailBody}
            onChange={(e) => setMailBody(e.target.value)}
            rows="4"
            placeholder="Enter message..."
            className="w-full p-2 border rounded-md  bg-primary-dark text-text-heading placeholder-text-heading"
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
