import { motion } from "framer-motion";
import { useState } from "react";
import { HiOutlineRefresh } from "react-icons/hi";
import { useParams } from "react-router-dom";
import { emailVerification } from "../../services/operations/authApi";
import useSafeNavigate from "../../utils/useSafeNavigate";

export default function EmailVerifyingScreen() {
  const { token } = useParams();
  const navigate = useSafeNavigate();
  const [loading, setLoading] = useState(false);

  const handleVerifyEmail = async () => {
    if (!token) return;
    try {
      setLoading(true);
      await emailVerification(token, navigate);
    } catch (error) {
      console.error("Verification failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary px-4">
      <motion.div
        className="flex flex-col items-center text-center"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {loading ? (
          <motion.div
            className="animate-spin-slow mb-4 text-button"
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          >
            <HiOutlineRefresh className="text-5xl" />
          </motion.div>
        ) : (
          <button
            onClick={handleVerifyEmail}
            className="bg-button text-white px-6 py-2 rounded-lg text-sm font-semibold shadow hover:bg-button-hover transition"
          >
            Verify Email
          </button>
        )}

        <p className="text-xl text-text-heading font-semibold mt-4 mb-2">
          {loading ? "Verifying your email..." : "Click to verify your email"}
        </p>
        <p className="text-sm text-text-subheading">
          {loading
            ? "Please wait while we complete the verification process."
            : "Press the button above to verify your email."}
        </p>
      </motion.div>
    </div>
  );
}
