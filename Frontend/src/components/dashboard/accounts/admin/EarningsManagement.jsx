import { useState } from "react";
import useSafeNavigate from "../../../../utils/useSafeNavigate";
import { FaTimes } from "react-icons/fa";

const AdminEarningsManagement = () => {
  const [earnings, setEarnings] = useState({
    levels: [
      { level: 1, stake: 100, title: "Star", weekly: "3" },
      { level: 2, stake: 300, title: "Bronze", weekly: "4" },
      { level: 3, stake: 500, title: "Silver", weekly: "4.5" },
      { level: 4, stake: 1000, title: "Gold", weekly: "5" },
      { level: 5, stake: 2000, title: "Diamond", weekly: "5.5" },
      { level: 6, stake: 5000, title: "Platinum", weekly: "6" },
      { level: 7, stake: 10000, title: "Satoshi", weekly: "7" },
    ],
    referral: [{ referralBonus: "10" }],
    team: [
      { members: 10, reward: "10" },
      { members: 50, reward: "50" },
      { members: 100, reward: "100" },
      { members: 500, reward: "500" },
    ],
  });

  const navigate = useSafeNavigate();
  const [activeSection, setActiveSection] = useState("levels");

  const [editLevel, setEditLevel] = useState(null);
  const [tempLevel, setTempLevel] = useState({ stake: "", weekly: "" });

  const [editReferral, setEditReferral] = useState(false);
  const [tempReferral, setTempReferral] = useState({
    referralBonus: earnings.referral[0].referralBonus,
  });

  const handleUpdateLevel = (level, newStake, newWeekly) => {
    setEarnings((prev) => ({
      ...prev,
      levels: prev.levels.map((lvl) =>
        lvl.level === level
          ? { ...lvl, stake: newStake, weekly: newWeekly }
          : lvl
      ),
    }));
  };

  const handleUpdateReferralBonus = (_, newBonus) => {
    setEarnings((prev) => ({
      ...prev,
      referral: [{ referralBonus: newBonus }],
    }));
  };

  const handleUpdateTeamBonus = (members, newReward) => {
    setEarnings((prev) => ({
      ...prev,
      team: prev.team.map((team) =>
        team.members === members ? { ...team, reward: newReward } : team
      ),
    }));
  };

  const handleSaveChanges = (level) => {
    handleUpdateLevel(level.level, tempLevel.stake, tempLevel.weekly);
    setEditLevel(null);
  };

  return (
    <div className="admin-page px-8 py-6 bg-primary-dark text-text-body">
      <div className="flex items-center justify-between bg-primary p-2 rounded-md mb-2">
        <h3 className="text-lg font-semibold text-[var(--text-subheading)]">
          Admin Earnings Management
        </h3>
        <button
          onClick={() => navigate(-1)}
          className="bg-button px-3 text-lg rounded-md py-2"
        >
          Go Back
        </button>
      </div>

      {/* Section Tabs */}
      <div className="flex justify-center gap-4 mb-6 text-text-heading">
        {["levels", "referral", "team"].map((section) => (
          <button
            key={section}
            onClick={() => setActiveSection(section)}
            className={`pb-2 border-b-2 capitalize ${
              activeSection === section
                ? "border-text-highlighted text-text-linkHover"
                : "border-transparent"
            }`}
          >
            {section}{" "}
            {section === "referral"
              ? "Bonuses"
              : section === "team"
              ? "Bonuses"
              : ""}
          </button>
        ))}
      </div>

      {/* Levels Section */}
      {activeSection === "levels" && (
        <section>
          <h2 className="text-2xl text-text-subheading mb-4">Update Levels</h2>
          {earnings.levels.map((level) => (
            <div
              key={level.level}
              className="relative level-update p-4 rounded-lg mb-4 border border-primary-light shadow-md bg-primary"
            >
              <h3 className="text-xl font-semibold text-text-body mb-2">
                {level.title} (Level {level.level})
              </h3>
              <div className="flex justify-between bg-primary-dark p-2 rounded-md mb-3 ">
                <p className="text-lg ">Current Stake: ${level.stake}</p>
                <p className="text-lg ">
                  Current Weekly Return: {level.weekly}%
                </p>
              </div>

              <button
                onClick={() => {
                  setEditLevel(level.level);
                  setTempLevel({ stake: level.stake, weekly: level.weekly });
                }}
                className="bg-button rounded-md py-2 px-4"
              >
                Edit
              </button>

              {editLevel === level.level && (
                <div className="relative mt-4 bg-primary-dark p-4">
                  {/* Close icon */}
                  <button
                    onClick={() => setEditLevel(null)}
                    className="absolute top-1 right-1 text-button text-xl"
                  >
                    <FaTimes />
                  </button>

                  <div className="grid grid-cols-1 gap-4 mt-6">
                    <div className="mb-4">
                      <label className="block mb-1 text-lg font-medium">
                        Stake Amount
                      </label>
                      <input
                        type="number"
                        className="w-full p-2 border border-primary-light rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="New Stake Amount"
                        value={tempLevel.stake}
                        onChange={(e) =>
                          setTempLevel({ ...tempLevel, stake: e.target.value })
                        }
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block mb-1 text-lg font-medium ">
                        Weekly Return (%)
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border border-primary-light rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="New Weekly Return"
                        value={tempLevel.weekly}
                        onChange={(e) =>
                          setTempLevel({ ...tempLevel, weekly: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => handleSaveChanges(level)}
                    className="bg-button px-4 py-2 text-text-heading rounded-md mt-4"
                  >
                    Save
                  </button>
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Referral Section */}

      {activeSection === "referral" && (
        <section>
          <h2 className="text-2xl text-text-subheading mb-4">
            Update Referral Bonuses
          </h2>

          <div className="relative referral-update p-4 rounded-lg mb-4 border border-primary-light shadow-md bg-primary">
            <p className="text-lg font-medium text-text-body">
              Current Referral Bonus: {earnings.referral[0].referralBonus}%
            </p>

            <button
              onClick={() => {
                setEditReferral(true);
                setTempReferral({
                  referralBonus: earnings.referral[0].referralBonus,
                });
              }}
              className="bg-button rounded-md py-2 px-4 mt-4"
            >
              Edit
            </button>

            {editReferral && (
              <div className="relative mt-4 bg-primary-dark p-4 rounded-md">
                {/* Close button */}
                <button
                  onClick={() => setEditReferral(false)}
                  className="absolute top-1 right-1 text-button text-xl"
                >
                  <FaTimes />
                </button>

                <div className="mb-4">
                  <label className="block mb-1 text-lg font-medium">
                    New Referral Bonus (%)
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border border-primary-light rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter new referral bonus"
                    value={tempReferral.referralBonus}
                    onChange={(e) =>
                      setTempReferral({ referralBonus: e.target.value })
                    }
                  />
                </div>

                <button
                  onClick={() => {
                    handleUpdateReferralBonus(null, tempReferral.referralBonus);
                    setEditReferral(false);
                  }}
                  className="bg-button px-4 py-2 text-text-heading rounded-md mt-2"
                >
                  Save
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Team Section */}
      {activeSection === "team" && (
        <section>
          <h2 className="text-2xl text-text-subheading mb-4">
            Update Team Bonuses
          </h2>
          {earnings.team.map((team) => (
            <div
              key={team.members}
              className="relative team-update p-4 rounded-lg mb-4 border border-primary-light shadow-md bg-primary"
            >
              <h3 className="text-xl font-semibold text-text-body mb-2">
                {team.members} Members
              </h3>
              <div className="flex justify-between bg-primary-dark p-2 rounded-md mb-3 ">
                <p className="text-lg ">Current Reward: ${team.reward}</p>
              </div>

              <button
                onClick={() => {
                  setEditLevel(`team-${team.members}`);
                  setTempLevel({ stake: "", weekly: team.reward });
                }}
                className="bg-button rounded-md py-2 px-4"
              >
                Edit
              </button>

              {editLevel === `team-${team.members}` && (
                <div className="relative mt-4 bg-primary-dark p-4">
                  <button
                    onClick={() => setEditLevel(null)}
                    className="absolute top-1 right-1 text-button text-xl"
                  >
                    <FaTimes />
                  </button>

                  <div className="grid grid-cols-1 gap-4 mt-6">
                    <div className="mb-4">
                      <label className="block mb-1 text-lg font-medium">
                        New Reward
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border border-primary-light rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Enter new reward"
                        value={tempLevel.weekly}
                        onChange={(e) =>
                          setTempLevel({ ...tempLevel, weekly: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      handleUpdateTeamBonus(team.members, tempLevel.weekly);
                      setEditLevel(null);
                    }}
                    className="bg-button px-4 py-2 text-text-heading rounded-md mt-4"
                  >
                    Save
                  </button>
                </div>
              )}
            </div>
          ))}
        </section>
      )}
    </div>
  );
};

export default AdminEarningsManagement;
