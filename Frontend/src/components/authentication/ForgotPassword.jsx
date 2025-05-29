import { useState } from "react";
import { getPasswordResetToken } from "../../services/operations/authApi";

function ForgotPasswordModal({ isOpen, onClose }) {
  const [email, setEmail] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) return;

    try {
      const response = await getPasswordResetToken(email);
    } catch (error) {
      console.error("Failed to send password reset email:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-[var(--primary-light)] w-full max-w-md p-6 rounded-lg shadow-xl">
        <h3 className="text-xl font-semibold mb-4 text-[var(--text-heading)]">
          Forgot Password
        </h3>
        {successMsg ? (
          <p className="text-[var(--statusColor.success)] text-sm mb-4">
            {successMsg}
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label>
              <p className="text-[var(--text-body)] mb-1">
                Enter your registered email
              </p>
              <input
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-[var(--primary)] rounded-lg p-2 focus:outline-none focus:border-2 "
                required
              />
            </label>
            <div className="flex justify-end gap-2 mt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm rounded-lg bg-gray-300 hover:bg-gray-400 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm rounded-lg bg-[var(--button)] cursor-pointer hover:bg-[var(--button-hover)] text-black font-semibold"
              >
                Send Reset Link
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ForgotPasswordModal;
