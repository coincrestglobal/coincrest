import { useState, useEffect } from "react";
import { useUser } from "../../common/UserContext.jsx";
import ConfirmationModal from "../../common/ConfirmationModal.jsx";
import axios from "axios";
import {
  addOrUpdateWallet,
  updatePassword,
  updatePersonalDetails,
} from "../../../services/operations/userDashboardApi.jsx";

const ProfileForm = () => {
  const { user, setUser } = useUser();
  const [activeTab, setActiveTab] = useState("Profile");
  const tabs = ["Profile", "Wallets", "Password"];

  const [detailsModal, setDetailsModal] = useState(false);
  const [passwordModal, setPasswordModal] = useState(false);

  const [wallets, setWallets] = useState(() => {
    if (!user.wallets || user.wallets.length === 0) {
      return [
        { address: "", chain: "" },
        { address: "", chain: "" },
      ];
    } else if (user.wallets.length === 1) {
      return [...user.wallets, { address: "", chain: "" }];
    } else {
      return user.wallets.slice(0, 2);
    }
  });

  const [editableWalletIndex, setEditableWalletIndex] = useState(null);
  const [name, setName] = useState(user.name);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const visibleTabs =
    user.role === "admin" ? tabs.filter((tab) => tab !== "Wallets") : tabs;

  const handleWalletChange = (index, field, value) => {
    const updated = [...wallets];
    updated[index][field] = value;
    setWallets(updated);
  };

  const handleEditClick = (index) => {
    setEditableWalletIndex(index);
  };

  const handleSaveWallet = async (index) => {
    const wallet = wallets[index];
    const data = {
      address: wallet.address,
      tokenType: wallet.tokenType,
    };

    const response = await addOrUpdateWallet(user.token, data);
    if (response.message === "Withdrawal address updated successfully") {
      const updatedWallets = [...wallets];
      updatedWallets[index] = {
        ...updatedWallets[index],
        address: data.address,
        tokenType: data.tokenType,
      };
      setWallets(updatedWallets);
      setUser((prev) => ({
        ...prev,
        wallets: wallets,
      }));
    }
    setEditableWalletIndex(null);
  };

  const handleUpdateDetails = async () => {
    const response = await updatePersonalDetails(user.token, { name });
    const updatedName = response.data.name;
    setUser((prev) => ({
      ...prev,
      name: updatedName,
    }));
    setDetailsModal(false);
  };

  const handleUpdatePassword = async () => {
    const data = {
      currentPassword: currentPassword,
      newPassword: newPassword,
      confirmNewPassword: confirmPassword,
    };
    await updatePassword(user.token, data);
    setPasswordModal(false);
  };

  return (
    <div className="bg-primary-dark text-text-heading">
      <div className="relative max-w-5xl mx-auto p-8 shadow-lg">
        {/* Tabs */}
        <div className="flex space-x-10 mb-8">
          {visibleTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 font-medium ${
                activeTab === tab
                  ? "text-text-heading border-b-2 border-button"
                  : "text-gray-400"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === "Profile" && (
          <>
            <h2 className="text-2xl font-semibold mb-6">
              Personal Information
            </h2>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm mb-2 text-gray-300">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-transparent border border-[#2d2b42] rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-button"
                />
              </div>
            </form>
            <button
              className="bg-button hover:bg-button-hover text-text-heading font-semibold px-10 py-3 rounded-xl border-2 shadow-inner hover:opacity-90 transition-all duration-200"
              onClick={() => setDetailsModal(true)}
            >
              SAVE
            </button>
            {detailsModal && (
              <ConfirmationModal
                text="Are you sure you want to update your personal details? Your profile information will be changed."
                onConfirm={handleUpdateDetails}
                onCancel={() => setDetailsModal(false)}
              />
            )}
          </>
        )}

        {/* Wallets Tab */}
        {activeTab === "Wallets" && user.role === "user" && (
          <>
            <h2 className="text-2xl font-semibold mb-6">Wallet Details</h2>
            {wallets.map((wallet, index) => (
              <form
                key={index}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-primary-dark border border-[#2d2b42] rounded-xl shadow-lg mb-6"
              >
                <div>
                  <label className="block text-sm font-medium text-text-highlighted mb-2">
                    Wallet Address
                  </label>
                  <input
                    disabled={editableWalletIndex !== index}
                    type="text"
                    value={wallet.address}
                    onChange={(e) =>
                      handleWalletChange(index, "address", e.target.value)
                    }
                    placeholder="Enter your USDT Wallet address"
                    className="w-full bg-[#1e1c2f] text-text-heading border border-[#3a3752] rounded-lg px-4 py-3"
                  />
                </div>
                <div key={index}>
                  <label className="block text-sm font-medium text-text-highlighted mb-2">
                    Chain
                  </label>
                  <div className="bg-[#1e1c2f] w-[70%] text-text-heading border border-[#3a3752] rounded-lg px-4 py-3">
                    {wallet.tokenType}
                  </div>
                </div>

                <div className="col-span-1 md:col-span-2 flex justify-end gap-4 mt-4">
                  {editableWalletIndex !== index ? (
                    <button
                      type="button"
                      onClick={() => handleEditClick(index)}
                      className="bg-yellow-500 text-text-heading font-medium px-6 py-2 rounded-lg hover:bg-yellow-600 transition"
                    >
                      Edit
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSaveWallet(index)}
                      className="bg-button text-text-heading font-medium px-6 py-2 rounded-lg hover:bg-button/80 transition"
                    >
                      Save
                    </button>
                  )}
                </div>
              </form>
            ))}
          </>
        )}

        {/* Password Tab */}
        {activeTab === "Password" && (
          <>
            <h2 className="text-2xl font-semibold mb-6">Change Password</h2>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm mb-2 text-gray-300">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full bg-transparent border border-[#2d2b42] rounded-md px-4 py-3"
                />
              </div>
              <div>
                <label className="block text-sm mb-2 text-gray-300">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full bg-transparent border border-[#2d2b42] rounded-md px-4 py-3"
                />
              </div>
              <div>
                <label className="block text-sm mb-2 text-gray-300">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full bg-transparent border border-[#2d2b42] rounded-md px-4 py-3"
                />
              </div>
            </form>
            <button
              className="bg-button hover:bg-button-hover text-text-heading font-semibold px-10 py-3 rounded-xl border-2 shadow-inner hover:opacity-90 transition-all duration-200"
              onClick={() => setPasswordModal(true)}
            >
              UPDATE PASSWORD
            </button>
            {passwordModal && (
              <ConfirmationModal
                text="Are you sure you want to change your password? Make sure to remember your new password."
                onConfirm={handleUpdatePassword}
                onCancel={() => setPasswordModal(false)}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileForm;
