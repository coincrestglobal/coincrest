import { useEffect, useState } from "react";
import {
  FaCopy,
  FaCommentAlt,
  FaWhatsapp,
  FaTelegramPlane,
  FaEnvelope,
  FaTwitter,
} from "react-icons/fa";
import { useUser } from "../../../common/UserContext";
import { getReferredUsers } from "../../../../services/operations/userDashboardApi";
import Loading from "../../../../pages/Loading";
import { toast } from "react-toastify";

const UserNode = ({ user }) => {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getReferrals = async () => {
      if (!user?.token) return;
      setLoading(true);
      try {
        const response = await getReferredUsers(user.token);
        setReferrals(response.data.referredUsers);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getReferrals();
  }, [user?.token]);

  if (loading) return <Loading />;

  return (
    <div className="mb-4">
      <div className="p-3 bg-primary-light border border-button rounded shadow w-full sm:w-fit max-w-full">
        <p className="font-semibold text-text-heading">
          {user?.name || "Unknown User"}
        </p>
        <p className="text-sm text-text-body truncate max-w-xs">
          Email:{" "}
          {user?.email
            ? `${user.email.slice(0, 4)}***${user.email.split("@")[1]}`
            : "N/A"}
        </p>
      </div>

      {referrals.length > 0 && (
        <div className="ml-3 sm:ml-6 border-l-2 border-button pl-2 sm:pl-4 mt-2 space-y-2">
          {referrals.map((child) => (
            <UserNode key={child.id || child.email} user={child} />
          ))}
        </div>
      )}
    </div>
  );
};

const TeamTree = () => {
  const { user } = useUser();
  const [copied, setCopied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const referralCode = user?.referralCode || "N/A";
  const referralLink = `${window.location.origin}/signup?ref=${referralCode}`;

  const message = `Join me on CoinCrest and start your crypto journey!\n\nSign up here: ${referralLink}`;
  const encodedMessage = encodeURIComponent(message);

  const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(
    referralLink
  )}&text=${encodedMessage}`;
  const emailUrl = `mailto:?subject=Join%20CoinCrest&body=${encodedMessage}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedMessage}`;
  const smsUrl = `sms:?&body=${encodedMessage}`;

  const copyToClipboard = async () => {
    if (!referralLink) return;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(referralLink);
        toast.success("Referral link copied!");
      } catch (err) {
        fallbackCopyToClipboard(referralLink, "Referral link copied!");
      }
    } else {
      fallbackCopyToClipboard(referralLink, "Referral link copied!");
    }
  };

  const fallbackCopyToClipboard = (text, successMessage) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;

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
        toast.success(successMessage);
      } else {
        toast.error("Failed to copy text.");
      }
    } catch (err) {
      toast.error("Failed to copy text.");
    }

    document.body.removeChild(textArea);
  };

  const copyCode = async () => {
    if (!referralCode) return;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(referralCode);
        toast.success("Referral code copied!");
      } catch (err) {
        fallbackCopyCodeToClipboard(referralCode, "Referral code copied!");
      }
    } else {
      fallbackCopyCodeToClipboard(referralCode, "Referral code copied!");
    }
  };

  const fallbackCopyCodeToClipboard = (text, successMessage) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;

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
        toast.success(successMessage);
      } else {
        toast.error("Failed to copy text.");
      }
    } catch (err) {
      toast.error("Failed to copy text.");
    }

    document.body.removeChild(textArea);
  };

  return (
    <div className="p-4 bg-primary-dark max-w-4xl mx-auto rounded-md">
      <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4 sm:items-center">
        <div className="flex items-start justify-between sm:items-center gap-2 text-white">
          <h1 className="text-lg sm:text-xl font-bold">
            Referral Code:{" "}
            <span className="text-text-highlighted">{referralCode}</span>
          </h1>
          <button
            onClick={copyCode}
            className="bg-gray-700 hover:bg-gray-800 text-white p-2 rounded"
            title="Copy Referral Code"
          >
            <FaCopy />
          </button>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-button hover:bg-button-hover text-white font-semibold px-4 py-2 sm:px-6 sm:py-2 rounded transition duration-200"
        >
          Invite Link
        </button>
      </div>

      <h2 className="text-lg sm:text-xl py-4 font-bold mb-4 text-text-highlighted text-center sm:text-left">
        Team Tree
      </h2>

      <UserNode user={user} />

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-2">
          <div className="bg-primary-light p-4 sm:p-6 rounded-lg w-full max-w-sm sm:max-w-md shadow-lg relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-3 text-2xl font-bold text-gray-700 hover:text-red-500"
            >
              ×
            </button>

            <h3 className="text-base sm:text-lg font-bold mb-4 text-center text-text-heading">
              Share Your Invite Link
            </h3>

            <div className="flex flex-col items-center gap-4">
              <button
                onClick={copyToClipboard}
                className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded text-sm sm:text-base"
              >
                <FaCopy />
                <span>{copied ? "Copied!" : "Copy Invite Link"}</span>
              </button>

              <div className="flex gap-3 flex-wrap justify-center">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded"
                >
                  <FaWhatsapp />
                </a>

                <a
                  href={telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded"
                >
                  <FaTelegramPlane />
                </a>

                <a
                  href={twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 bg-sky-500 hover:bg-sky-600 text-white px-3 py-2 rounded"
                >
                  <FaTwitter />
                </a>

                <a
                  href={emailUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-800 text-white px-3 py-2 rounded"
                >
                  <FaEnvelope />
                </a>

                <a
                  href={smsUrl}
                  className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded"
                >
                  <FaCommentAlt />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamTree;
