import { Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { FaTelegramPlane } from "react-icons/fa";

function ChatBot() {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "👋 Welcome to CoinCrest Support! I can help with:\n• 💰 Deposit issues\n• 💸 Withdrawal status\n• 📈 Staking & Plans\n• 🧑‍💼 Account or Referral\n\nYou can type your query or tap a topic below:",
    },
  ]);
  const [input, setInput] = useState("");
  const chatRef = useRef(null);

  const faqResponses = (userMessage) => {
    const msg = userMessage.toLowerCase();

    if (["hello", "hi", "hey"].some((greet) => msg.includes(greet))) {
      return "👋 Hello! I'm here to assist you with CoinCrest. You can ask about deposit, withdrawal, staking, or referrals.";
    }
    if (msg.includes("withdraw")) {
      return "💸 Withdrawals are manually approved by our multi-sig wallet team. They may take up to 24 hours to reflect.";
    }
    if (msg.includes("deposit")) {
      return "💰 Deposits are automated. Send USDT (TRC20) to your assigned wallet address. It will reflect once confirmed.";
    }
    if (msg.includes("staking")) {
      return "📈 Our staking system gives weekly returns based on your level — from Star (3%) to Satoshi (7%).";
    }
    if (msg.includes("level") || msg.includes("upgrade")) {
      return "🏅 Your level increases based on your staking amount. Higher levels earn higher weekly rewards.";
    }
    if (msg.includes("support") || msg.includes("contact")) {
      return "📞 You can reach our live support via Telegram: https://t.me/coincrest_support";
    }
    if (msg.includes("referral")) {
      return "👥 Invite friends and earn rewards! Share your referral link from the dashboard.";
    }
    if (msg.includes("plan") || msg.includes("returns")) {
      return "🗓️ Plans return weekly yields based on levels:\n• Star (3%)\n• Bronze (4%)\n• Silver (4.5%)\n• Gold (5%)\n• Diamond (5.5%)\n• Platinum (6%)\n• Satoshi (7%)";
    }
    if (msg.includes("faq") || msg.includes("help")) {
      return "❓ Try asking about: deposit, withdraw, staking, level, referral, or support.";
    }
    if (
      msg.includes("agent") ||
      msg.includes("human") ||
      msg.includes("talk")
    ) {
      return "👨‍💼 You can talk to our live support on Telegram: https://t.me/coincrest_support";
    }

    return "🤖 I'm not sure about that. Try asking about: deposit, withdraw, staking, level, support, or referral.";
  };

  const sendMessage = (text = input.trim()) => {
    if (text === "") return;
    setMessages((prev) => [...prev, { sender: "user", text }]);
    setInput("");

    setTimeout(() => {
      const response = faqResponses(text);
      setMessages((prev) => [...prev, { sender: "bot", text: response }]);
    }, 600);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleQuickReply = (text) => {
    sendMessage(text);
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
      {/* Chat messages */}
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

      {/* Quick replies */}
      {messages.length === 1 && (
        <div className="flex flex-wrap gap-2 p-4 border-t border-gray-700">
          {["Deposit", "Withdraw", "Staking", "Referral", "Support"].map(
            (topic) => (
              <button
                key={topic}
                onClick={() => handleQuickReply(topic)}
                className="bg-gray-700 hover:bg-gray-600 text-text-heading px-3 py-1 rounded-full text-sm"
              >
                {topic}
              </button>
            )
          )}
        </div>
      )}

      {/* Input field */}
      <div className="flex gap-2 p-4 border-t border-gray-700 ">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about deposit, withdraw, staking, etc..."
          className="flex-1 px-4 py-2 rounded bg-gray-800 border border-gray-600 text-text-heading focus:outline-none text-sm sm:text-base"
        />
        <button
          onClick={() => sendMessage()}
          className="bg-button hover:bg-button-hover px-4 py-2 rounded text-text-heading"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}

export default ChatBot;
