import { motion } from "framer-motion";
import { HiOutlineMailOpen } from "react-icons/hi";

function BeforeEmailVerify() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-primary px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-md w-full p-8 bg-primary-dark shadow-xl rounded-2xl text-center border border-button"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
        >
          <HiOutlineMailOpen className="text-6xl text-button mx-auto mb-4" />
        </motion.div>
        <motion.h2
          className="text-2xl font-bold text-text-heading mb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Check Your Email
        </motion.h2>
        <motion.p
          className="text-text-body mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          A verification link has been sent to your email address. Please open
          it to verify your account.
        </motion.p>
        <motion.p
          className="text-sm text-text-subheading mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          Didn’t receive the email? Check your spam folder or try again!
        </motion.p>
      </motion.div>
    </div>
  );
}

export default BeforeEmailVerify;
