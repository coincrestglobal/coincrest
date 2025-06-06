import { useState } from "react";
import { addOrUpdateWallet } from "../../../../services/operations/userDashboardApi";
import Loading from "../../../../pages/Loading";
import { useUser } from "../../../common/UserContext";

const WalletForm = () => {
  const { user, setUser } = useUser();
  const [wallet, setWallet] = useState(() => {
    if (user.wallets && user.wallets.length > 0) {
      return {
        address: user.wallets[0].address || "",
        tokenType: "BEP-20",
      };
    } else {
      return { address: "", tokenType: "BEP-20" };
    }
  });
  const [editable, setEditable] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleWalletChange = (value) => {
    setWallet((prev) => ({ ...prev, address: value }));
  };

  const handleSaveWallet = async () => {
    setLoading(true);
    try {
      const data = {
        address: wallet.address,
        tokenType: "BEP-20",
      };

      const response = await addOrUpdateWallet(user.token, data);
      if (response.message) {
        setUser((prev) => ({
          ...prev,
          wallets: [data],
        }));
        setEditable(false);
      }
    } catch (error) {
      // handle error
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
      <form className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-primary-dark border border-[#2d2b42] rounded-xl shadow-lg mb-6">
        <div>
          <label className="block text-sm font-medium text-text-highlighted mb-2">
            Wallet Address
          </label>
          <input
            disabled={!editable}
            type="text"
            value={wallet.address}
            onChange={(e) => handleWalletChange(e.target.value)}
            placeholder="Enter your USDT Wallet address"
            className="w-full bg-[#1e1c2f] text-text-heading border border-[#3a3752] rounded-lg px-4 py-3"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-highlighted mb-2">
            Chain
          </label>
          <div className="bg-[#1e1c2f] w-[70%] text-text-heading border border-[#3a3752] rounded-lg px-4 py-3">
            BEP-20
          </div>
        </div>

        <div className="col-span-1 md:col-span-2 flex justify-end gap-4 mt-4">
          {!editable ? (
            <button
              type="button"
              onClick={() => setEditable(true)}
              className="bg-yellow-500 text-text-heading font-medium px-6 py-2 rounded-lg hover:bg-yellow-600 transition"
            >
              {wallet.address ? "Edit" : "Add"}
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
        </div>
      </form>
    </div>
  );
};

export default WalletForm;
