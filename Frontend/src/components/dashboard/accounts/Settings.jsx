import { useState } from "react";
import { useUser } from "../../common/UserContext.jsx";

const ProfileForm = () => {
  const { user, setUser } = useUser();
  const [activeTab, setActiveTab] = useState("Profile");
  const tabs = ["Profile", "Wallets", "Password"];

  const [wallets, setWallets] = useState(() => {
    return user?.wallets?.length > 0
      ? user.wallets
      : [{ address: "", chain: "" }];
  });

  // Track index of the editable wallet
  const [editableWalletIndex, setEditableWalletIndex] = useState(null);

  const visibleTabs =
    user.role === "admin" ? tabs.filter((tab) => tab !== "Wallets") : tabs;

  const handleWalletChange = (index, field, value) => {
    const updated = [...wallets];
    updated[index][field] = value;
    setWallets(updated);
  };

  const handleAddWallet = () => {
    const newWallet = { address: "", chain: "" };
    setWallets([...wallets, newWallet]);
    setEditableWalletIndex(wallets.length);
  };

  const handleDeleteWallet = (index) => {
    const updated = [...wallets];
    updated.splice(index, 1);
    setWallets(updated);
    if (editableWalletIndex === index) {
      setEditableWalletIndex(null);
    }
  };

  const handleEditClick = (index) => {
    setEditableWalletIndex(index);
  };

  const handleSaveWallet = (index) => {
    const updatedWallets = [...wallets];
    updatedWallets[index] = wallets[index];
    setWallets(updatedWallets);
    setEditableWalletIndex(null);
  };

  return (
    <div className="bg-primary-dark text-text-heading">
      <div className="relative max-w-5xl mx-auto  rounded- p-8 shadow-lg">
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
                  className="w-full bg-transparent border border-[#2d2b42] rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-button"
                  defaultValue={user.name}
                />
              </div>

              <div>
                <label className="block text-sm mb-2 text-gray-300">
                  Phone
                </label>
                <input
                  type="tel"
                  className="w-full bg-transparent border border-[#2d2b42] rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-button"
                />
              </div>
            </form>
            <button className="bg-button hover:bg-button-hover text-text-heading font-semibold px-10 py-3 rounded-xl border-2 shadow-inner hover:opacity-90 transition-all duration-200">
              SAVE
            </button>
          </>
        )}

        {/* Wallets Tab */}
        {activeTab === "Wallets" && user.role !== "admin" && (
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
                    placeholder="Enter your USDT Wallet address"
                    value={wallet.address}
                    onChange={(e) =>
                      handleWalletChange(index, "address", e.target.value)
                    }
                    className="w-full bg-[#1e1c2f] text-text-heading border border-[#3a3752] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-button placeholder:text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-highlighted mb-2">
                    Chain
                  </label>
                  <select
                    disabled={editableWalletIndex !== index}
                    value={wallet.chain}
                    onChange={(e) =>
                      handleWalletChange(index, "chain", e.target.value)
                    }
                    className="bg-[#1e1c2f] w-[70%] text-text-heading border border-[#3a3752] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-button"
                  >
                    <option value="">Choose Chain</option>
                    <option value="BEP20">BEP20</option>
                    <option value="TRC20">TRC20</option>
                  </select>
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
                      onClick={handleSaveWallet}
                      className="bg-button text-text-heading font-medium px-6 py-2 rounded-lg hover:bg-button/80 transition"
                    >
                      Save
                    </button>
                  )}
                  {wallets.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleDeleteWallet(index)}
                      className="bg-red-600 text-text-heading font-medium px-6 py-2 rounded-lg hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </form>
            ))}
            <button
              type="button"
              onClick={handleAddWallet}
              className="bg-button hover:bg-button-hover text-text-heading font-semibold px-10 py-3 rounded-xl border-2 shadow-inner hover:opacity-90 transition-all duration-200"
            >
              Add Wallet
            </button>
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
                  placeholder="Enter current Password"
                  className="w-full bg-transparent border border-[#2d2b42] rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-button"
                />
              </div>
              <div>
                <label className="block text-sm mb-2 text-gray-300">
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  className="w-full bg-transparent border border-[#2d2b42] rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-button"
                />
              </div>
              <div>
                <label className="block text-sm mb-2 text-gray-300">
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="Re-enter new password"
                  className="w-full bg-transparent border border-[#2d2b42] rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-button"
                />
              </div>
            </form>
            <button className="bg-button hover:bg-button-hover text-text-heading font-semibold px-10 py-3 rounded-xl border-2 shadow-inner hover:opacity-90 transition-all duration-200">
              UPDATE PASSWORD
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileForm;
