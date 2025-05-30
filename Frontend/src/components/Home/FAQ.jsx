import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion"; // ✅ already imported
import { getAllFaqs } from "../../services/operations/adminAndOwnerDashboardApi";
import Loading from "../../pages/Loading";
import { useUser } from "../common/UserContext";

const FAQ = () => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("General");
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getFaqs = async () => {
      try {
        setLoading(true);
        const response = await getAllFaqs(user.token);
        setFaqs(response.data.faqs);
      } catch {
      } finally {
        setLoading(false);
      }
    };
    getFaqs();
  }, []);

  if (loading) {
    return <Loading />;
  }

  const transformFaqData = (rawFaqs) => {
    const grouped = {
      General: [],
      Deposits: [],
      Payouts: [],
    };

    rawFaqs.forEach((faq) => {
      const { question, answer, type } = faq;

      const formattedFAQ = { question, answer };

      if (type === "general") {
        grouped.General.push(formattedFAQ);
      } else if (type === "deposit") {
        grouped.Deposits.push(formattedFAQ);
      } else if (type === "payout") {
        grouped.Payouts.push(formattedFAQ);
      }
    });

    return grouped;
  };

  const transformedFaqs = transformFaqData(faqs);

  const handleQuestionClick = (index) => {
    setActiveQuestion(activeQuestion === index ? null : index);
  };

  return (
    <div className="relative px-6 md:px-20 lg:px-96 py-8 space-y-8 text-center text-text-heading">
      <h1 className="text-center text-3xl sm:text-4xl md:text-5xl font-extrabold text-text-heading  flex items-center justify-center gap-3 sm:gap-5">
        <span className="text-text-highlighted text-4xl  md:text-6xl">««</span>
        <span className="text-text-heading text-2xl sm:text-3xl md:text-4xl tracking-tight pt-1 md:pt-2">
          FAQ
        </span>
        <span className="text-text-highlighted text-4xl sm:text-5xl md:text-6xl">
          »»
        </span>
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
        {Object.keys(transformedFaqs).map((tab) => (
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
          {transformedFaqs[activeTab].map((item, index) => (
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
