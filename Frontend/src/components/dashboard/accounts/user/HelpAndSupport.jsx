import { MessageCircle } from "lucide-react";
import ChatBot from "./ChatBot";

function HelpSupport() {
  return (
    <div className="bg-primary-dark text-text-heading  ">
      <div className=" mx-auto p-6 shadow-lg ">
        <h2 className="text-2xl font-bold mb-4">Help & Support</h2>
        <p className="mb-6 text-gray-400">
          Need assistance? You can chat with our support bot below or reach us
          directly via Telegram.
        </p>

        <ChatBot />

        {/* Telegram Link */}
        <div className="mt-6">
          <a
            href="https://t.me/YourSupportBot" // Replace with your actual Telegram bot/group link
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm px-4 py-2 bg-button text-text-heading rounded hover:bg-button-hover"
          >
            <MessageCircle size={16} />
            Contact via Telegram
          </a>
        </div>
      </div>
    </div>
  );
}

export default HelpSupport;
