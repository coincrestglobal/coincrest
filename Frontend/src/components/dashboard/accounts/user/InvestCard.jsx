import { useState, useEffect } from "react";
import ConfirmationModal from "../../../common/ConfirmationModal";
import useSafeNavigate from "../../../../utils/useSafeNavigate";
import { X } from "lucide-react";
import { getPlans } from "../../../../services/operations/userDashboardApi";
function InvestCard({ onClose }) {
  const navigate = useSafeNavigate();
  const [amount, setAmount] = useState("");
  const [levels, setLevels] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchPlans = async () => {
      const res = await getPlans();
      console.log(res);

      if (res.status === "success") {
        const sorted = res.data.plans.sort((a, b) => a.level - b.level);
        setLevels(sorted);

        // Set default plan
        if (sorted.length > 0) {
          setSelectedLevel(sorted[0]);
          setAmount(sorted[0].minAmount.toString());
        }
      }
    };

    fetchPlans();
  }, []);

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setAmount(value);

    const numericValue = parseFloat(value);
    if (!isNaN(numericValue)) {
      const matched = levels.find(
        (lvl) => numericValue >= lvl.minAmount && numericValue <= lvl.maxAmount
      );
      setSelectedLevel(matched || null);
    } else {
      setSelectedLevel(null);
    }
  };

  const handlePlanSelect = (e) => {
    const levelId = parseInt(e.target.value);
    const selected = levels.find((lvl) => lvl.level === levelId);
    if (selected) {
      setSelectedLevel(selected);
      setAmount(selected.minAmount.toString());
    }
  };

  const handleConfirm = async () => {
    if (selectedLevel && amount) {
      try {
        const res = await fetch("http://localhost:5000/api/v1/account/invest", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            planId: selectedLevel._id,
            investedAmount: amount,
          }),
        });

        const response = await res.json();

        if (response.status === "success") {
          navigate("investments");
        } else {
          alert(response.message);
        }
      } catch (err) {
        console.error("Investment error", err);
        alert("Something went wrong. Try again.");
      }
    }
  };

  return (
    <div className="relative bg-primary-light text-text-heading rounded-md p-8 w-full max-w-3xl shadow-sm shadow-text-link">
      <h2 className="text-2xl font-semibold mb-8">Start Your Investment</h2>

      {onClose && (
        <button
          className="absolute top-2 right-2 text-button hover:text-button-hover"
          onClick={() => onClose(false)}
        >
          <X />
        </button>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Amount */}
        <div>
          <label className="block text-sm mb-2">Enter Amount</label>
          <input
            type="text"
            value={amount}
            onChange={handleAmountChange}
            className="w-full bg-primary-dark border border-[#2d2b42] rounded-md py-3 px-4 text-text-heading focus:outline-none"
            placeholder="Enter your investment amount"
          />
        </div>
        {/* Plan Select */}
        <div>
          <label className="block text-sm mb-2">Select Plan</label>
          <select
            value={selectedLevel?.level || ""}
            onChange={handlePlanSelect}
            className="w-full bg-primary-dark border border-[#2d2b42] rounded-md py-3 px-4 text-text-heading"
          >
            <option value="">-- Choose Plan --</option>
            {levels.map((lvl) => (
              <option key={lvl._id} value={lvl.level}>
                {lvl.name} (Min ${lvl.minAmount})
              </option>
            ))}
          </select>
        </div>

        {/* Interest */}
        <div>
          <label className="block text-sm mb-2">Weekly Interest Rate</label>
          <div className="w-full bg-primary-dark border border-[#2d2b42] rounded-md py-3 px-4 text-text-heading">
            {selectedLevel ? `${selectedLevel.interestRate}%` : "--"}
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          className="bg-button hover:opacity-90 transition-all text-text-heading font-semibold px-12 py-3 rounded-xl shadow-inner shadow-text-link"
          onClick={() => setIsModalOpen(true)}
          disabled={!selectedLevel || !amount || isNaN(parseFloat(amount))}
        >
          Invest Now
        </button>
      </div>

      {isModalOpen && (
        <ConfirmationModal
          text={`Are you sure you want to invest $${amount}?`}
          onConfirm={handleConfirm}
          onCancel={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}

export default InvestCard;
