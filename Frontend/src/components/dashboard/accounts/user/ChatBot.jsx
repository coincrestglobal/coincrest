import { useEffect, useRef, useState } from "react";

function ChatBot() {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "👋 Welcome to CoinCrest Support.\nTo help us assist you efficiently, please choose the topic that best matches your concern from the options below.",
    },
  ]);
  const [step, setStep] = useState("topic"); // 'topic' | 'question' | 'done'
  const [selectedTopic, setSelectedTopic] = useState(null);
  const chatRef = useRef(null);

  const faqData = {
    deposit: {
      title: "💰 Deposit Issues",
      questions: [
        {
          q: "How do I deposit?",
          a: "Send USDT (TRC-20 or BEP-20) to your assigned wallet address. It will reflect once confirmed on-chain.",
        },
        {
          q: "Which network do I use?",
          a: "We support TRC-20 and BEP-20. Use the one matching your wallet address.",
        },
        {
          q: "Deposit not showing?",
          a: "Please wait for 1-2 confirmations. If it's still missing, contact our support via Telegram.",
        },
      ],
    },
    withdraw: {
      title: "💸 Withdrawal Issues",
      questions: [
        {
          q: "How long does withdrawal take?",
          a: "Withdrawals are manually approved by our multi-sig team. They can take up to 24 hours.",
        },
        {
          q: "Can I cancel a withdrawal?",
          a: "Once initiated, withdrawals can't be canceled as they’re processed via blockchain.",
        },
      ],
    },
    staking: {
      title: "📈 Staking & Plans",
      questions: [
        {
          q: "What is staking?",
          a: "You lock USDT to earn weekly interest. Returns vary by your level.",
        },
        {
          q: "What are the return rates?",
          a: "From 2% (Star) to 3.75% (Satoshi) weekly. More stake = better level.",
        },
      ],
    },
    referral: {
      title: "👥 Referral System",
      questions: [
        {
          q: "How does the referral program work?",
          a: "You get rewards when your invited users stake on the platform. Share your referral link from the dashboard.",
        },
        {
          q: "Where is my referral link?",
          a: "You can find your referral link in your account dashboard under 'Referral' tab.",
        },
      ],
    },
    support: {
      title: "📞 Contact Support",
      questions: [
        {
          q: "How to contact support?",
          a: "You can reach our live support via Telegram: https://t.me/coincrest_support",
        },
        {
          q: "Is support available 24/7?",
          a: "Support is available 9 AM – 9 PM IST. For urgent issues, contact our Telegram support.",
        },
      ],
    },
  };

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTo({
        top: chatRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <div className="w-full mx-auto rounded-md bg-primary border border-gray-700 h-full max-h-[90vh] flex flex-col overflow-hidden">
      {/* Chat history */}
      <div
        ref={chatRef}
        className="flex-1 bg-primary-dark border-b border-gray-700 p-4 overflow-y-auto scrollbar-hide"
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] sm:max-w-xs px-4 py-2 rounded-lg text-sm whitespace-pre-wrap ${
                msg.sender === "user"
                  ? "bg-button text-text-heading"
                  : "bg-gray-900 text-gray-200"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Step 1: Choose Topic */}
      {step === "topic" && (
        <div className="p-4 flex flex-wrap gap-3 border-t border-gray-700">
          {Object.keys(faqData).map((key) => (
            <button
              key={key}
              onClick={() => {
                setSelectedTopic(key);
                setStep("question");
                setMessages((prev) => [
                  ...prev,
                  { sender: "user", text: faqData[key].title },
                ]);
              }}
              className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-full text-sm"
            >
              {faqData[key].title}
            </button>
          ))}
        </div>
      )}

      {/* Step 2: Choose Question */}
      {step === "question" && selectedTopic && (
        <div className="p-4 flex flex-col gap-2 border-t border-gray-700">
          {faqData[selectedTopic].questions.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                setMessages((prev) => [
                  ...prev,
                  { sender: "user", text: item.q },
                  { sender: "bot", text: item.a },
                ]);
                setStep("done");
              }}
              className="bg-gray-700 hover:bg-gray-600 text-white text-left px-3 py-2 rounded-lg text-sm"
            >
              {item.q}
            </button>
          ))}
        </div>
      )}

      {/* Step 3: Option to restart */}
      {step === "done" && (
        <div className="p-4 border-t border-gray-700 flex justify-center">
          <button
            onClick={() => {
              setStep("topic");
              setSelectedTopic(null);
            }}
            className="bg-button hover:bg-button-hover px-4 py-2 rounded text-white text-sm"
          >
            🔁 Ask Another Question
          </button>
        </div>
      )}
    </div>
  );
}

export default ChatBot;
