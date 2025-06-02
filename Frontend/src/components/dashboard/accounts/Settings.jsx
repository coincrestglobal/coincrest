import { useState } from "react";
import { useUser } from "../../common/UserContext.jsx";
import ConfirmationModal from "../../common/ConfirmationModal.jsx";
import Loading from "../../../pages/Loading";
import {
  updatePassword,
  updatePersonalDetails,
} from "../../../services/operations/userDashboardApi.jsx";

const ProfileForm = () => {
  const { user, setUser } = useUser();
  const [activeTab, setActiveTab] = useState("Profile");
  const tabs = ["Profile", "Password"];

  const [detailsModal, setDetailsModal] = useState(false);
  const [passwordModal, setPasswordModal] = useState(false);

  const [name, setName] = useState(user.name);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdateDetails = async () => {
    setLoading(true);
    try {
      const response = await updatePersonalDetails(user.token, { name });
      const updatedName = response.data.name;
      setUser((prev) => ({
        ...prev,
        name: updatedName,
      }));
      setDetailsModal(false);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    setLoading(true);
    try {
      const data = {
        currentPassword: currentPassword,
        newPassword: newPassword,
        confirmNewPassword: confirmPassword,
      };
      await updatePassword(user.token, data);
      setPasswordModal(false);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="bg-primary-dark text-text-heading">
      <div className="relative max-w-5xl mx-auto p-8 shadow-lg">
        {/* Tabs */}
        <div className="flex space-x-10 mb-8">
          {tabs.map((tab) => (
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
