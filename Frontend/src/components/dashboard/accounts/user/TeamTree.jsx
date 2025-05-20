import { useState } from "react";
import { FaCopy, FaShareAlt } from "react-icons/fa";

const currentUser = {
  id: 1,
  name: "Alice",
  email: "alice@gmail.com",
  level: "Platinum",
  referrals: [
    {
      id: 2,
      name: "Bob",
      email: "bob123@gmail.com",
      level: "Gold",
      referrals: [],
    },
    {
      id: 3,
      name: "Charlie",
      email: "charlie@gmail.com",
      level: "Bronze",
      referrals: [],
    },
  ],
};

const UserNode = ({ user }) => {
  return (
    <div className="mb-4">
      <div className="p-3 bg-primary-light border border-button rounded shadow w-fit max-w-full">
        <p className="font-semibold text-text-heading">{user.name}</p>
        <p className="text-sm text-text-body truncate max-w-xs">
          Email: {`${user.email.slice(0, 4)}***${user.email.split("@")[1]}`}
        </p>
      </div>
      {user.referrals && user.referrals.length > 0 && (
        <div className="ml-6 border-l-2 border-button pl-4 mt-2 space-y-2">
          {user.referrals.map((child) => (
            <UserNode key={child.id} user={child} />
          ))}
        </div>
      )}
    </div>
  );
};

const TeamTree = () => {
  const [copied, setCopied] = useState(false);
  const referralCode = "123456";
  const referralLink = "https://userabc.com";

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const shareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check this out!",
          text: "Here’s my referral link:",
          url: referralLink,
        });
      } catch (err) {
        console.error("Sharing failed", err);
      }
    } else {
      alert("Share not supported in this browser.");
    }
  };

  return (
    <div className="p-4 bg-primary-dark max-w-4xl mx-auto rounded-md">
      <div className="bg-primary text-text-subheading flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg shadow-md space-y-3 sm:space-y-0 sm:space-x-4">
        <div className="flex items-center space-x-2 overflow-hidden">
          <strong className="text-text-heading">Referral Code:</strong>
          <p className="truncate max-w-xs">{referralCode}</p>
        </div>
        <div className="flex items-center space-x-2 flex-wrap">
          <button
            onClick={copyToClipboard}
            className="flex items-center space-x-1 bg-text-highlighted hover:bg-text-linkHover text-white px-3 py-1 rounded transition duration-200"
          >
            <FaCopy />
            <span>{copied ? "Copied!" : "Copy"}</span>
          </button>
          <button
            onClick={shareLink}
            className="flex items-center space-x-1 bg-button hover:bg-button-hover text-white px-3 py-1 rounded transition duration-200"
          >
            <FaShareAlt />
            <span>Invite Link</span>
          </button>
        </div>
      </div>

      <h2 className="text-xl py-4 font-bold mb-4 text-text-highlighted text-center sm:text-left">
        Team Tree
      </h2>

      <UserNode user={currentUser} />
    </div>
  );
};

export default TeamTree;
