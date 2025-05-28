import { MessageCircle } from "lucide-react";
import ChatBot from "./ChatBot";

function HelpSupport() {
  return (
    <div className="bg-primary-dark text-text-heading">
      <div className="p-4 sm:p-6 md:p-8 bg-primary shadow-lg rounded-lg">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4">
          Help & Support
        </h2>
        <p className="mb-6 text-gray-400 text-sm sm:text-base">
          Have questions or need assistance? Start a conversation with our
          support chatbot below or reach out to us on Telegram for direct help.
        </p>

        {/* ChatBot component */}
        <ChatBot />

        {/* Telegram Link */}
        <div className="mt-6">
          <p className="text-gray-400 text-sm sm:text-base mb-2">
            Didn't find what you were looking for?
          </p>
          <a
            href="https://t.me/YourSupportBot" // Replace with your actual Telegram bot/group link
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm px-4 py-2 bg-button text-text-heading rounded hover:bg-button-hover transition-colors"
          >
            <MessageCircle size={16} />
            Chat with Support on Telegram
          </a>
        </div>
      </div>
    </div>
  );
}

export default HelpSupport;
