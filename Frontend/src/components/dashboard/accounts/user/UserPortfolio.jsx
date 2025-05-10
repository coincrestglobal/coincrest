import StatBox from "./StatBox";
import { useState } from "react";
import ConfirmationModal from "../../../common/ConfirmationModal";
import useSafeNavigate from "../../../../utils/useSafeNavigate";
import axios from "axios";

const levels = [
  {
    level: 1,
    minAmount: 100,
    maxAmount: 299,
    name: "Star",
    interestRate: "2.0%",
  },
  {
    level: 2,
    minAmount: 500,
    maxAmount: 999,
    name: "Bronze",
    interestRate: "2.5%",
  },
  {
    level: 3,
    minAmount: 1000,
    maxAmount: 4999,
    name: "Silver",
    interestRate: "3.0%",
  },
  {
    level: 4,
    minAmount: 5000,
    maxAmount: 9999,
    name: "Gold",
    interestRate: "3.25%",
  },
  {
    level: 5,
    minAmount: 10000,
    maxAmount: 49999,
    name: "Diamond",
    interestRate: "3.37%",
  },
  {
    level: 6,
    minAmount: 50000,
    maxAmount: 99999,
    name: "Platinum",
    interestRate: "3.5%",
  },
  {
    level: 7,
    minAmount: 100000,
    maxAmount: Infinity,
    name: "Satoshi",
    interestRate: "3.75%",
  },
];

function UserPortfolio() {
  const navigate = useSafeNavigate();
  const [amount, setAmount] = useState(""); // Initialize as empty string
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setAmount(value);

    // Convert the value to number (parseFloat)
    const numericValue = parseFloat(value);

    // Ensure valid numeric value is provided
    if (!isNaN(numericValue)) {
      const matchedLevel = levels.find(
        (lvl) => numericValue >= lvl.minAmount && numericValue <= lvl.maxAmount
      );
      if (matchedLevel) {
        setSelectedLevel(matchedLevel);
      } else {
        setSelectedLevel(null);
      }
    } else {
      setSelectedLevel(null); // Reset if non-numeric value entered
    }
  };

  const handleConfirm = async () => {
    if (selectedLevel && amount) {
      try {
        // 1. Backend call to create the investment using axios

        const res = await fetch(`http://localhost:5000/api/v1/account/invest`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            planId: "681b68d7a95bfa3514cc8085",
            investedAmount: amount,
          }),
        });

        console.log(await res.json());

        if (response.status === "sucess") {
          // 2. If investment is created successfully, navigate to the next page
          navigate("investments");
        } else {
          // Handle error response if investment creation fails
          console.error("Investment creation failed", response.data);
          alert("Investment creation failed. Please try again.");
        }
      } catch (error) {
        console.error("Error during investment creation", error);
        alert("An error occurred. Please try again.");
      } finally {
        // setIsLoading(false);
      }
    }
  };

  return (
    <div className="relative bg-primary-dark max-w-4xl mx-auto rounded-md px-16 py-6 space-y-8">
      <div className="flex flex-wrap justify-between gap-4">
        <div className="flex-1 basis-[220px]">
          <StatBox heading={1880000} subHeading="Available Balance" />
        </div>
        <div className="flex-1 basis-[220px]">
          <StatBox heading={1880} subHeading="Unstaked Balance" />
        </div>
      </div>

      <div className="relative bg-primary-light text-text-heading rounded-md p-8 w-full max-w-3xl shadow-sm shadow-text-link">
        <h2 className="text-2xl font-semibold mb-8">Start Your Investment</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Investment Amount */}
          <div>
            <label className="block text-sm mb-2">Enter Amount</label>
            <input
              type="text" // Text type to allow number input
              value={amount}
              onChange={handleAmountChange}
              className="w-full bg-primary-dark border border-[#2d2b42] rounded-md py-3 px-4 text-text-heading focus:outline-none placeholder:text-gray-400"
              placeholder="Enter your investment amount"
            />
          </div>

          {/* Selected Plan */}
          <div>
            <label className="block text-sm mb-2">Selected Plan</label>
            <div className="w-full bg-primary-dark border border-[#2d2b42] rounded-md py-3 px-4 text-text-heading">
              {selectedLevel ? selectedLevel.name : "No Plan Found"}
            </div>
          </div>

          {/* Interest Rate */}
          <div>
            <label className="block text-sm mb-2">Weekly Interest Rate</label>
            <div className="w-full bg-primary-dark border border-[#2d2b42] rounded-md py-3 px-4 text-text-heading">
              {selectedLevel ? selectedLevel.interestRate : "--"}
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
    </div>
  );
}

export default UserPortfolio;
