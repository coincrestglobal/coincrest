import React from "react";

function ConfirmationModal({ text, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-[--primary-dark] h-48 p-8 rounded-xl shadow-lg border border-[--secondary2-dark] w-full max-w-md">
        <p className="mb-6 text-text-heading font-semibold text-lg text-center">
          {text}
        </p>
        <div className="flex justify-center gap-6">
          <button
            className="px-5 py-2 bg-[--button] hover:bg-[--button-hover] text-white rounded-md font-medium transition-all"
            onClick={onConfirm}
          >
            Yes
          </button>
          <button
            className="px-5 py-2 bg-[--secondary2] hover:bg-[--secondary2-light] text-white rounded-md font-medium transition-all"
            onClick={onCancel}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;
