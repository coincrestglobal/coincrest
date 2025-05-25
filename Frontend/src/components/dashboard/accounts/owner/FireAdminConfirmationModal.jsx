import { useState } from "react";

const FireAdminConfirmationModal = ({ adminId, text, onCancel, onConfirm }) => {
  const [password, setPassword] = useState("");

  const handleConfirm = async () => {
    if (!password) return alert("Password is required");

    await new Promise((resolve) => setTimeout(resolve, 100)); // Optional delay

    onConfirm(adminId, password); // Pass password here
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
      <div className="bg-primary-light p-6 rounded-lg shadow-md w-[90%] max-w-md">
        <h3 className="text-lg font-semibold text-white mb-4">{text}</h3>
        <input
          type="password"
          placeholder="Enter your password"
          className="w-full p-2 border border-gray-300 rounded-md mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default FireAdminConfirmationModal;
