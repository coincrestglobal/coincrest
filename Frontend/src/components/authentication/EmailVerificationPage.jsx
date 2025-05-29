import { motion } from "framer-motion";
import { useEffect } from "react";
import { HiOutlineRefresh } from "react-icons/hi";
import { useParams } from "react-router-dom";
import { emailVerification } from "../../services/operations/authApi";
import useSafeNavigate from "../../utils/useSafeNavigate";

export default function EmailVerifyingScreen() {
  const { token } = useParams();
  const navigate = useSafeNavigate();
  useEffect(() => {
    const verifyEmail = async () => {
      try {
        await emailVerification(token, navigate);
      } catch (error) {
        console.error("Email verification failed:", error);
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary px-4">
      <motion.div
        className="flex flex-col items-center text-center"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div
          className="animate-spin-slow mb-4 text-button"
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        >
          <HiOutlineRefresh className="text-5xl" />
        </motion.div>

        <p className="text-xl text-text-heading font-semibold mb-2">
          Verifying your email...
        </p>
        <p className="text-sm text-text-subheading">
          Please wait while we complete the verification process.
        </p>
      </motion.div>
    </div>
  );
}
