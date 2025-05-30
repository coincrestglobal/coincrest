import { useEffect, useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import useSafeNavigate from "../../../../utils/useSafeNavigate";
import {
  addFaq,
  deleteFaq,
  getAllFaqs,
} from "../../../../services/operations/adminAndOwnerDashboardApi";
import { useUser } from "../../../common/UserContext";
import Loading from "../../../../pages/Loading";
import ConfirmationModal from "../../../common/ConfirmationModal"; // adjust path if needed

export default function FAQs() {
  const { user } = useUser();
  const navigate = useSafeNavigate();
  const [faqData, setFaqData] = useState([]);
  const [selectedSection, setSelectedSection] = useState("General");
  const [viewMode, setViewMode] = useState("view"); // 'view' or 'add'
  const [newFAQ, setNewFAQ] = useState({
    question: "",
    answer: "",
    type: "general",
  });
  const [loading, setLoading] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);

  const sectionTabs = ["General", "Deposit", "Payout"];

  const getFAQ = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append("type", selectedSection.toLowerCase());

      const response = await getAllFaqs(user.token, params.toString());
      setFaqData(response.data.faqs);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFAQ();
  }, [selectedSection]);

  const handleAddFAQ = async () => {
    try {
      setLoading(true);
      await addFaq(user.token, newFAQ);
      getFAQ();
      setViewMode("view");
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (index) => {
    const id = faqData[index]._id;
    try {
      setLoading(true);
      await deleteFaq(user.token, id);
      getFAQ();
    } catch {
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }
  return (
    <div className="p-2 md:p-4 bg-primary-light max-w-5xl mx-auto border border-button rounded">
      {/* Header */}
      <div className="flex items-center justify-between bg-primary p-2 md:p-4 rounded-md mb-4 space-y-2 md:space-y-0">
        <h3 className="text-lg font-semibold text-text-heading">
          FAQs Management
        </h3>
        <button
          onClick={() => navigate(-1)}
          className="bg-button px-3 py-2 text-lg rounded-md w-fit md:w-auto text-center"
        >
          Go Back
        </button>
      </div>

      {/* Toggle Buttons for View/Add */}
      <div className="mb-6 p-2 md:p-4 text-center space-y-4 bg-primary">
        <div className="flex flex-col md:flex-row justify-center items-center md:space-x-4 space-y-2 md:space-y-0">
          <button
            className={`pb-2 border-b-2 text-text-heading ${
              viewMode === "view"
                ? "border-text-highlighted text-text-linkHover"
                : "border-transparent"
            }`}
            onClick={() => setViewMode("view")}
          >
            View FAQs
          </button>
          <button
            className={`pb-2 border-b-2 text-text-heading ${
              viewMode === "add"
                ? "border-text-highlighted text-text-linkHover"
                : "border-transparent"
            }`}
            onClick={() => setViewMode("add")}
          >
            Add FAQ
          </button>
        </div>

        {/* Section Tabs */}
        {viewMode === "view" && (
          <div className="flex flex-wrap justify-center items-center gap-2 md:gap-4 mb-4">
            {sectionTabs.map((section) => (
              <button
                key={section}
                className={`pb-1 border-b-2 text-text-heading ${
                  selectedSection === section
                    ? "border-button text-text-linkHover"
                    : "border-transparent"
                }`}
                onClick={() => {
                  setSelectedSection(section);
                  setViewMode("view");
                  setNewFAQ({ question: "", answer: "" });
                }}
              >
                {section}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* View Mode */}
      {viewMode === "view" && (
        <div className="bg-primary p-2 md:p-4 rounded-md">
          <h2 className="text-2xl font-semibold text-text-heading mb-4">
            {selectedSection} FAQs
          </h2>
          {faqData.length === 0 ? (
            <p className="text-gray-500">No FAQs added yet.</p>
          ) : (
            <div className="space-y-3 max-h-[300px] overflow-y-scroll scrollbar-hide">
              {faqData.map((faq, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-primary-dark border-l-4 border-button-hover shadow-sm rounded-md flex justify-between items-start"
                >
                  <div className="pr-2">
                    <p className="font-semibold text-text-heading">
                      {faq.question}
                    </p>
                    <p className="text-gray-700 mt-1">{faq.answer}</p>
                  </div>
                  <button
                    className="text-red-500 hover:text-red-700 ml-2"
                    onClick={() => {
                      setDeleteIndex(idx);
                      setShowDeleteModal(true);
                    }}
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          )}
          {showDeleteModal && (
            <ConfirmationModal
              text="Are you sure you want to delete this FAQ? This action cannot be undone."
              onConfirm={() => {
                handleDelete(deleteIndex);
                setShowDeleteModal(false);
              }}
              onCancel={() => setShowDeleteModal(false)}
            />
          )}
        </div>
      )}

      {/* Add Mode */}
      {viewMode === "add" && (
        <div className="bg-primary-dark p-4 md:p-6 rounded shadow-md">
          <h2 className="text-xl font-semibold text-button mb-4">
            Add New FAQ
          </h2>
          <div className="grid grid-cols-1 gap-4 mb-4">
            <label className="text-white pb-2">
              FAQ Type:
              <select
                className="w-full border border-button-hover p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary text-text-heading bg-primary"
                value={newFAQ.type} // Bind to newFAQ.type
                onChange={
                  (e) => setNewFAQ({ ...newFAQ, type: e.target.value }) // Update type in state
                }
              >
                <option value="general">General</option>
                <option value="deposit">Deposit</option>
                <option value="payout">Payout</option>
              </select>
            </label>
            <label className="text-white pb-2">
              Question
              <input
                type="text"
                placeholder="Enter new Question"
                className="p-2 border border-button-hover rounded text-text-heading bg-primary w-full"
                value={newFAQ.question}
                onChange={(e) =>
                  setNewFAQ({ ...newFAQ, question: e.target.value })
                }
              />
            </label>

            <label className="text-white pb-2">
              Answer
              <textarea
                placeholder="Enter the answer of above Question"
                className="p-2 border border-button-hover rounded text-text-heading bg-primary w-full"
                rows={3}
                value={newFAQ.answer}
                onChange={(e) =>
                  setNewFAQ({ ...newFAQ, answer: e.target.value })
                }
              />
            </label>
          </div>
          <button
            className="bg-button text-text-heading px-4 py-2 rounded flex items-center gap-2 hover:bg-button-hover"
            onClick={() => setShowAddModal(true)}
          >
            <FaPlus />
            Add FAQ
          </button>
        </div>
      )}
      {showAddModal && (
        <ConfirmationModal
          text="Are you sure you want to add this FAQ?"
          onConfirm={() => {
            handleAddFAQ();
            setShowAddModal(false);
          }}
          onCancel={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}
