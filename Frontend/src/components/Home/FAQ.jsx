import { Plus } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion"; // ✅ already imported

const faqData = {
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

const FAQ = () => {
  const [activeTab, setActiveTab] = useState("General");
  const [activeQuestion, setActiveQuestion] = useState(null);
  const navigate = useNavigate();

  const handleQuestionClick = (index) => {
    setActiveQuestion(activeQuestion === index ? null : index);
  };

  return (
    <div className="relative px-6 md:px-20 lg:px-96 py-8 space-y-8 text-center text-text-heading">
      <h1 className="text-text-heading text-3xl md:text-4xl font-bold flex items-center gap-4 justify-center flex-wrap">
        <span className="text-button text-3xl md:text-4xl">««</span>
        <span className="text-heading">FAQ</span>
        <span className="text-button text-3xl md:text-4xl">»»</span>
      </h1>
      <p className="text-base md:text-lg mb-6 max-w-xl md:max-w-2xl mx-auto px-2">
        Here you’ll find answers to frequently asked questions about our company
        and services.
      </p>

      {/* Hide on small screens, show on large */}
      <img
        src="/images/FAQ.png"
        className="absolute opacity-20 translate-x-28 pointer-events-none hidden lg:block"
        alt="FAQ background"
      />

      <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-8">
        {Object.keys(faqData).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setActiveQuestion(null); // Reset open question when tab changes
            }}
            className={`pb-2 border-b-2 ${
              activeTab === tab
                ? "border-text-highlighted text-text-linkHover"
                : "border-transparent"
            } text-sm md:text-base`}
          >
            {tab}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="space-y-6 pt-5 relative z-10"
        >
          {faqData[activeTab].map((item, index) => (
            <div key={index} className="group">
              <div
                onClick={() => handleQuestionClick(index)}
                className="cursor-pointer flex justify-between items-center border border-gray-700 rounded-full"
              >
                <span
                  className={`text-xl text-gray-400 border border-text-link rounded-full p-2 group-hover:border-text-linkHover ${
                    activeQuestion === index
                      ? "border-2 border-text-linkHover"
                      : ""
                  }`}
                >
                  <Plus
                    className={`transition-transform duration-300 ${
                      activeQuestion === index ? "rotate-45" : ""
                    }`}
                  />
                </span>
                <span className="flex-1 text-center font-semibold text-sm md:text-base px-2">
                  {item.question}
                </span>
                <span
                  className={`text-xl text-gray-400 border border-text-link rounded-full p-2 group-hover:border-text-linkHover ${
                    activeQuestion === index
                      ? "border-2 border-text-linkHover"
                      : ""
                  }`}
                >
                  <Plus
                    className={`transition-transform duration-300 ${
                      activeQuestion === index ? "rotate-45" : ""
                    }`}
                  />
                </span>
              </div>

              {/* Animated answer part */}
              <AnimatePresence>
                {activeQuestion === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-2 text-gray-300 px-4 md:px-10 pb-4 text-sm md:text-base">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>

      <button
        onClick={() => navigate("/contactus")}
        className="border border-white py-3 px-6 rounded-xl text-text-heading font-semibold bg-button hover:bg-button-hover hover:text-black transition mt-8 text-sm md:text-base"
      >
        ASK A QUESTION
      </button>
    </div>
  );
};

export default FAQ;
