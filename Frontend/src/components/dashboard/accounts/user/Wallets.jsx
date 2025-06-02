import { useState } from "react";
import { addOrUpdateWallet } from "../../../../services/operations/userDashboardApi";
import Loading from "../../../../pages/Loading";
import { useUser } from "../../../common/UserContext";

const WalletForm = () => {
  const { user, setUser } = useUser();
  const [wallets, setWallets] = useState(() => {
    if (!user.wallets || user.wallets.length === 0) {
      return [
        { address: "", tokenType: "" },
        { address: "", tokenType: "" },
      ];
    } else if (user.wallets.length === 1) {
      return [...user.wallets, { address: "", tokenType: "" }];
    } else {
      return user.wallets.slice(0, 2);
    }
  });
  const [editableWalletIndex, setEditableWalletIndex] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleWalletChange = (index, field, value) => {
    const updated = [...wallets];
    updated[index][field] = value;
    setWallets(updated);
  };

  const handleEditClick = (index) => {
    setEditableWalletIndex(index);
  };

  const handleSaveWallet = async (index) => {
    setLoading(true);
    try {
      const wallet = wallets[index];
      const data = {
        address: wallet.address,
        tokenType: wallet.tokenType || (index === 0 ? "TRC-20" : "BEP-20"),
      };

      const response = await addOrUpdateWallet(user.token, data);
      if (response.message) {
        const updatedWallets = [...wallets];
        updatedWallets[index] = {
          ...updatedWallets[index],
          address: data.address,
          tokenType: data.tokenType,
        };
        setWallets(updatedWallets);
        setUser((prev) => ({
          ...prev,
          wallets: updatedWallets,
        }));
      }
      setEditableWalletIndex(null);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="p-4">
      <h2 className="text-2xl text-text-heading font-semibold mb-6">
        Wallet Details
      </h2>
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
          <div>
            <label className="block text-sm font-medium text-text-highlighted mb-2">
              Chain
            </label>
            <div className="bg-[#1e1c2f] w-[70%] text-text-heading border border-[#3a3752] rounded-lg px-4 py-3">
              {wallet.tokenType || (index === 0 ? "TRC-20" : "BEP-20")}
            </div>
          </div>

          <div className="col-span-1 md:col-span-2 flex justify-end gap-4 mt-4">
            {editableWalletIndex !== index ? (
              <button
                type="button"
                onClick={() => handleEditClick(index)}
                className="bg-yellow-500 text-text-heading font-medium px-6 py-2 rounded-lg hover:bg-yellow-600 transition"
              >
                {wallet.address ? "Edit" : "Add"}
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
    </div>
  );
};

export default WalletForm;
