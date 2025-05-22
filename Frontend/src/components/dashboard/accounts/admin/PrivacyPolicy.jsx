import { useState } from "react";
import { FaTrash, FaPlus } from "react-icons/fa";
import useSafeNavigate from "../../../../utils/useSafeNavigate";

export default function PrivacyPolicy() {
  const navigate = useSafeNavigate();
  const [policyList, setPolicyList] = useState([
    "We collect only essential user data required for platform functionality.",
    "User data is stored securely and not shared with third parties.",
    "You can request deletion of your account and data at any time.",
  ]);

  const [newPolicy, setNewPolicy] = useState("");
  const [activeTab, setActiveTab] = useState("view"); // "view" or "add"

  const handleAddPolicy = () => {
    if (!newPolicy.trim()) return;
    setPolicyList([...policyList, newPolicy.trim()]);
    setNewPolicy("");
    setActiveTab("view");
  };

  const handleDeletePolicy = (index) => {
    const updated = [...policyList];
    updated.splice(index, 1);
    setPolicyList(updated);
  };

  return (
    <div className="p-2 bg-primary-light max-w-4xl mx-auto">
      <div className="flex items-center justify-between bg-primary-dark p-2 rounded-md mb-2">
        <h3 className="text-lg font-semibold text-[var(--text-heading)]">
          Manage Privacy Policy
        </h3>
        <button
          onClick={() => navigate(-1)}
          className="bg-button px-3 text-lg rounded-md py-2"
        >
          Go Back
        </button>
      </div>

      {/* Toggle Buttons */}
      <div className="flex justify-center gap-4 mb-6 text-text-heading">
        <button
          className={`pb-2 border-b-2 ${
            activeTab === "view"
              ? "border-text-highlighted text-text-linkHover"
              : "border-transparent"
          }`}
          onClick={() => setActiveTab("view")}
        >
          View
        </button>
        <button
          className={`pb-2 border-b-2 ${
            activeTab === "add"
              ? "border-text-highlighted text-text-linkHover"
              : "border-transparent"
          }`}
          onClick={() => setActiveTab("add")}
        >
          Add New
        </button>
      </div>

      {/* View Policies Section */}
      {activeTab === "view" && (
        <div className="space-y-4">
          {policyList.map((policy, idx) => (
            <div
              key={idx}
              className="flex justify-between items-start bg-primary-dark  border-l-4 border-text-highlighted p-4 shadow rounded"
            >
              <p className="text-text-heading">{policy}</p>
              <button
                onClick={() => handleDeletePolicy(idx)}
                className="text-red-500 hover:text-red-700 ml-4"
                title="Delete"
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Policy Section */}
      {activeTab === "add" && (
        <div className="bg-primary p-6 rounded shadow-md">
          <h2 className="text-xl font-semibold text-text-heading mb-4">
            Add New
          </h2>
          <textarea
            rows={3}
            className="w-full p-3 border border-button bg-primary-dark text-text-heading rounded mb-4"
            placeholder="Enter new privacy clause..."
            value={newPolicy}
            onChange={(e) => setNewPolicy(e.target.value)}
          />
          <button
            onClick={handleAddPolicy}
            className="bg-button text-text-heading px-4 py-2 rounded flex items-center gap-2 hover:bg-button-hover"
          >
            <FaPlus /> Add Policy
          </button>
        </div>
      )}
    </div>
  );
}
