import { useEffect, useState } from "react";
import { FaTrash, FaPlus } from "react-icons/fa";
import useSafeNavigate from "../../../../utils/useSafeNavigate";
import {
  addTerms,
  deleteTerms,
  getTerms,
} from "../../../../services/operations/adminAndOwnerDashboardApi";
import { useUser } from "../../../common/UserContext";
import ConfirmationModal from "../../../common/ConfirmationModal";
import Loading from "../../../../pages/Loading";

export default function ManageTermsConditions() {
  const { user } = useUser();
  const navigate = useSafeNavigate();
  const [termsList, setTermsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newTerm, setNewTerm] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [activeTab, setActiveTab] = useState("view"); // "view" or "add"
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [showAddConfirm, setShowAddConfirm] = useState(false);

  const getTermsAndConditions = async () => {
    try {
      setLoading(true);

      const response = await getTerms();
      setTermsList(response.data.terms);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTermsAndConditions();
  }, [activeTab]);

  const handleAddTerm = async () => {
    try {
      setLoading(true);
      await addTerms(user.token, { condition: newTerm, title: newTitle });
      getTermsAndConditions();
      setActiveTab("view");
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTerm = async (id) => {
    try {
      setLoading(true);
      await deleteTerms(user.token, id);
      getTermsAndConditions();
    } catch {
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

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
              <div>
                <p className="text-text-heading text-2xl">{term.title}</p>
                <p className="text-text-heading">{term.condition}</p>
              </div>
              <button
                onClick={() => setConfirmDeleteId(term._id)}
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
        <div className="bg-primary p-6 rounded shadow-md">
          <h2 className="text-xl font-semibold text-text-heading mb-4">
            Add New
          </h2>

          {/* Title Input */}
          <input
            type="text"
            className="w-full p-3 border border-button bg-primary-dark text-text-heading rounded mb-4"
            placeholder="Enter title here..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />

          {/* Term Textarea */}
          <textarea
            rows={3}
            className="w-full p-3 border border-button bg-primary-dark text-text-heading rounded mb-4"
            placeholder="Enter new condition here..."
            value={newTerm}
            onChange={(e) => setNewTerm(e.target.value)}
          />

          <button
            onClick={() => setShowAddConfirm(true)}
            className="bg-button text-text-heading px-4 py-2 rounded flex items-center gap-2 hover:bg-button-hover"
          >
            <FaPlus /> Add Term
          </button>
        </div>
      )}
      {showAddConfirm && (
        <ConfirmationModal
          text="Are you sure you want to add this new term?"
          onConfirm={() => {
            handleAddTerm();
            setShowAddConfirm(false);
          }}
          onCancel={() => setShowAddConfirm(false)}
        />
      )}
      {confirmDeleteId && (
        <ConfirmationModal
          text="Are you sure you want to delete this term?"
          onConfirm={() => {
            handleDeleteTerm(confirmDeleteId);
            setConfirmDeleteId(null);
          }}
          onCancel={() => setConfirmDeleteId(null)}
        />
      )}
    </div>
  );
}
