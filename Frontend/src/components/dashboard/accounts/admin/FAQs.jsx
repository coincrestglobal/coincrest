import { useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import useSafeNavigate from "../../../../utils/useSafeNavigate";

const FAQ_Data = {
  General: [
    {
      question: "What is Coin Crest?",
      answer:
        "Coin Crest is a secure platform where users can earn fixed interest on their deposited amounts over a chosen time period. We also offer referral bonuses and guaranteed payouts within 24 hours after maturity.",
    },
    {
      question: "How does Coin Crest generate interest?",
      answer:
        "We use a diversified and risk-managed approach to generate returns, enabling us to offer fixed interest rates. Your returns are not dependent on market fluctuations.",
    },
    {
      question: "Is Coin Crest secure and legit?",
      answer:
        "Yes. Coin Crest operates with full transparency. We promise 100% assured withdrawals and interest payments as per your selected plan.",
    },
    {
      question: "How do I sign up?",
      answer:
        "You can sign up easily using your mobile number or email. Once verified, you can deposit and start earning.",
    },
    {
      question: "Can I refer others?",
      answer:
        "Yes! You’ll receive a unique referral link. Every successful referral earns you a bonus on top of your interest.",
    },
  ],

  Deposits: [
    {
      question: "What’s the minimum amount to start investing?",
      answer:
        "The minimum deposit amount is ₹500 (or its equivalent in your local currency), which ensures accessibility to all users.",
    },
    {
      question: "Can I cancel or withdraw my deposit before maturity?",
      answer:
        "Premature withdrawals are not allowed to ensure fair interest distribution. However, we offer competitive returns for the full duration.",
    },
    {
      question: "How long can I lock my deposit?",
      answer:
        "You can choose flexible lock-in durations, ranging from 15 days to 12 months, depending on your financial goal.",
    },
    {
      question: "Will my interest vary during the deposit period?",
      answer:
        "No. The interest rate is fixed once you choose your deposit plan. You’ll know exactly what you’ll earn.",
    },
  ],

  Payouts: [
    {
      question: "How and when will I get my money back?",
      answer:
        "Once your chosen time period is over, the principal amount along with earned interest is processed within 24 hours directly to your bank account or wallet.",
    },
    {
      question: "Are there any withdrawal charges?",
      answer:
        "No hidden charges! Withdrawals are free. What you see in your payout summary is what you get.",
    },
    {
      question: "What if my payout is delayed?",
      answer:
        "Delays are rare, but in case of unforeseen issues, our support team will assist you instantly to ensure prompt resolution.",
    },
    {
      question: "How do referral bonuses get paid out?",
      answer:
        "Referral bonuses are credited once your referred user makes a successful deposit and completes the lock-in period. Bonuses can be withdrawn or added to your deposit.",
    },
  ],
};

export default function FAQs() {
  const navigate = useSafeNavigate();
  const [faqData, setFaqData] = useState(FAQ_Data);
  const [selectedSection, setSelectedSection] = useState("General");
  const [viewMode, setViewMode] = useState("view"); // 'view' or 'add'
  const [newFAQ, setNewFAQ] = useState({ question: "", answer: "" });

  const sectionTabs = Object.keys(faqData);

  const handleAddFAQ = () => {
    const { question, answer } = newFAQ;
    if (!question.trim() || !answer.trim()) return;

    const updatedFAQs = [
      ...(faqData[selectedSection] || []),
      { question, answer },
    ];

    setFaqData({
      ...faqData,
      [selectedSection]: updatedFAQs,
    });

    setNewFAQ({ question: "", answer: "" });
  };

  const handleDelete = (index) => {
    const updatedFAQs = [...faqData[selectedSection]];
    updatedFAQs.splice(index, 1);
    setFaqData({
      ...faqData,
      [selectedSection]: updatedFAQs,
    });
  };

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
          {faqData[selectedSection].length === 0 ? (
            <p className="text-gray-500">No FAQs added yet.</p>
          ) : (
            <div className="space-y-3 max-h-[300px] overflow-y-scroll scrollbar-hide">
              {faqData[selectedSection].map((faq, idx) => (
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
                    onClick={() => handleDelete(idx)}
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
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
            <select className="w-full border border-button-hover p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary text-text-heading bg-primary">
              <option value="">Choose FAQ type</option>
              <option value="general">General</option>
              <option value="deposit">Deposit</option>
              <option value="payouts">Payouts</option>
            </select>
            <input
              type="text"
              placeholder="Question"
              className="p-2 border border-button-hover rounded text-text-heading bg-primary w-full"
              value={newFAQ.question}
              onChange={(e) =>
                setNewFAQ({ ...newFAQ, question: e.target.value })
              }
            />

            <textarea
              placeholder="Answer"
              className="p-2 border border-button-hover rounded text-text-heading bg-primary w-full"
              rows={3}
              value={newFAQ.answer}
              onChange={(e) => setNewFAQ({ ...newFAQ, answer: e.target.value })}
            />
          </div>
          <button
            className="bg-button text-text-heading px-4 py-2 rounded flex items-center gap-2 hover:bg-button-hover"
            onClick={handleAddFAQ}
          >
            <FaPlus />
            Add FAQ
          </button>
        </div>
      )}
    </div>
  );
}
