import { useState } from "react";
import { FaTrash, FaPlus } from "react-icons/fa";
import useSafeNavigate from "../../../../utils/useSafeNavigate";

export default function ManageTermsConditions() {
  const navigate = useSafeNavigate();
  const [termsList, setTermsList] = useState([
    "Coin Crest ensures all deposited funds are secure and handled transparently.",
    "Interest is credited based on the chosen plan and lock-in duration.",
    "Withdrawals are processed within 24 hours after the maturity date.",
  ]);

  const [newTerm, setNewTerm] = useState("");
  const [activeTab, setActiveTab] = useState("view"); // "view" or "add"

  const handleAddTerm = () => {
    if (!newTerm.trim()) return;
    setTermsList([...termsList, newTerm.trim()]);
    setNewTerm("");
    setActiveTab("view"); // go back to view after adding
  };

  const handleDeleteTerm = (index) => {
    const updated = [...termsList];
    updated.splice(index, 1);
    setTermsList(updated);
  };

  return (
    <div className="p-2 bg-primary max-w-4xl mx-auto">
      <div className="flex items-center justify-between bg-primary-light p-2 md:p-2 rounded-md mb-4 space-y-2 md:space-y-0">
        <h3 className="text-lg font-semibold text-text-heading">Manage T&C</h3>
        <button
          onClick={() => navigate(-1)}
          className="bg-button px-3 py-2 text-lg rounded-md w-fit md:w-auto text-center"
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
              : "border-transparent "
          }`}
          onClick={() => setActiveTab("view")}
        >
          View
        </button>
        <button
          className={`pb-2 border-b-2 ${
            activeTab === "add"
              ? "border-text-highlighted text-text-linkHover"
              : "border-transparent "
          }`}
          onClick={() => setActiveTab("add")}
        >
          Add New
        </button>
      </div>

      {/* View Terms Section */}
      {activeTab === "view" && (
        <div className="space-y-4">
          {termsList.map((term, idx) => (
            <div
              key={idx}
              className="flex justify-between items-start bg-primary-dark border-l-4 border-text-highlighted p-4 shadow rounded"
            >
              <p className="text-text-heading">{term}</p>
              <button
                onClick={() => handleDeleteTerm(idx)}
                className="text-red-500 hover:text-red-700 ml-4"
                title="Delete"
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Term Section */}
      {activeTab === "add" && (
        <div className="bg-primary  p-6 rounded shadow-md">
          <h2 className="text-xl font-semibold text-text-heading mb-4">
            Add New
          </h2>
          <textarea
            rows={3}
            className="w-full p-3 border border-button bg-primary-dark text-text-heading rounded mb-4"
            placeholder="Enter new condition here..."
            value={newTerm}
            onChange={(e) => setNewTerm(e.target.value)}
          />
          <button
            onClick={handleAddTerm}
            className="bg-button text-text-heading px-4 py-2 rounded flex items-center gap-2 hover:bg-button-hover"
          >
            <FaPlus /> Add Term
          </button>
        </div>
      )}
    </div>
  );
}
