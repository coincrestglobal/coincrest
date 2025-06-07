import { useEffect, useState } from "react";
import { FaTrash, FaPlus } from "react-icons/fa";
import useSafeNavigate from "../../../../utils/useSafeNavigate";
import { useUser } from "../../../common/UserContext";
import {
  addPrivacyPolicy,
  deletePrivacyPolicy,
  getPrivacyPolicy,
} from "../../../../services/operations/adminAndOwnerDashboardApi";
import ConfirmationModal from "../../../common/ConfirmationModal";
import Loading from "../../../../pages/Loading";

export default function PrivacyPolicy() {
  const { user } = useUser();
  const navigate = useSafeNavigate();

  const [policyList, setPolicyList] = useState([]);

  const [newPolicy, setNewPolicy] = useState("");
  const [loading, setLoading] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [activeTab, setActiveTab] = useState("view"); // "view" or "add"
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [showAddConfirm, setShowAddConfirm] = useState(false);

  const getPrivacyPolicies = async () => {
    try {
      setLoading(true);

      const response = await getPrivacyPolicy();
      setPolicyList(response.data.policies);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPrivacyPolicies();
  }, [activeTab]);

  const handleAddPolicy = async () => {
    try {
      setLoading(true);
      console.log(newPolicy, newTitle);
      await addPrivacyPolicy(user.token, {
        policy: newPolicy,
        title: newTitle,
      });
      getPrivacyPolicies();
      setActiveTab("view");
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePolicy = async (id) => {
    try {
      setLoading(true);
      await deletePrivacyPolicy(user.token, id);
      getPrivacyPolicies();
    } catch {
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return <Loading />;
  }
  return (
    <div className="p-2 bg-primary-light max-w-4xl mx-auto">
      <div className="flex items-center justify-between bg-primary-dark p-2 rounded-md mb-2">
        <h3 className="text-lg font-semibold text-[var(--text-heading)]">
          Manage Privacy Policy
        </h3>
        <button
          onClick={() => navigate(-1)}
          className="bg-button px-3 text-lg rounded-md py-2 text-white"
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
              <div>
                <p className="text-text-heading text-2xl">{policy.title}</p>
                <p className="text-text-heading">{policy.policy}</p>
              </div>

              <button
                onClick={() => setConfirmDeleteId(policy._id)}
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
          <input
            type="text"
            className="w-full p-3 border border-button bg-primary-dark text-text-heading rounded mb-4"
            placeholder="Enter title here..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <textarea
            rows={3}
            className="w-full p-3 border border-button bg-primary-dark text-text-heading rounded mb-4"
            placeholder="Enter new privacy clause..."
            value={newPolicy}
            onChange={(e) => setNewPolicy(e.target.value)}
          />
          <button
            onClick={() => setShowAddConfirm(true)}
            className="bg-button text-text-heading px-4 py-2 rounded flex items-center gap-2 hover:bg-button-hover"
          >
            <FaPlus /> Add Policy
          </button>
        </div>
      )}
      {showAddConfirm && (
        <ConfirmationModal
          text="Are you sure you want to add this new policy?"
          onConfirm={() => {
            handleAddPolicy();
            setShowAddConfirm(false);
          }}
          onCancel={() => setShowAddConfirm(false)}
        />
      )}
      {confirmDeleteId && (
        <ConfirmationModal
          text="Are you sure you want to delete this policy?"
          onConfirm={() => {
            handleDeletePolicy(confirmDeleteId);
            setConfirmDeleteId(null);
          }}
          onCancel={() => setConfirmDeleteId(null)}
        />
      )}
    </div>
  );
}
