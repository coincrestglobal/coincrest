import { CirclePlus, Megaphone, Eye } from "lucide-react";
import ViewAnnouncementPost from "./ViewAnnouncementPost";
import { useEffect, useState } from "react";
import Header from "./DashboardHeader";
import NoResult from "../../pages/NoResult";
import { FaTrash } from "react-icons/fa";
import ConfirmationModal from "../common/ConfirmationModal";

const announcementsData = [
  {
    id: 1,
    title: "USDT Staking Update",
    message: "New staking pool with 20% APY launched! Stake now to earn more.",
    postedBy: "Admin",
    audience: "All Users",
    date: "2025-04-24",
  },
  {
    id: 2,
    title: "Withdrawal Maintenance",
    message:
      "Manual withdrawal approval will be delayed on April 25 due to system maintenance.",
    postedBy: "Support Team",
    audience: "Stakers",
    date: "2025-04-23",
  },
  {
    id: 3,
    title: "Security Notice",
    message:
      "Please enable 2FA in your account settings for enhanced security.",
    postedBy: "Admin",
    audience: "All Users",
    date: "2025-04-22",
  },
];

function Announcement() {
  const [showForm, setShowForm] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [selectedAudience, setSelectedAudience] = useState("All Users");
  const [announcements, setAnnouncements] = useState(announcementsData);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  const handlePost = () => {
    if (!title.trim() || !message.trim()) {
      alert("Title and message cannot be empty.");
      return;
    }

    const newAnnouncement = {
      id: Date.now(),
      title,
      message,
      postedBy: "Admin",
      audience: selectedAudience,
      date: new Date().toLocaleString(),
    };

    setAnnouncements([newAnnouncement, ...announcements]);
    setShowForm(false);
    setTitle("");
    setMessage("");
    setSelectedAudience("All Users");
  };

  const [filterState, setFilterState] = useState({
    searchQuery: "",
    sortOrder: "asc",
    selectedFilters: [],
  });

  const [filteredAnnouncements, setFilteredAnnouncements] =
    useState(announcements);

  useEffect(() => {
    let filtered = announcements.filter((a) =>
      a.title.toLowerCase().includes(filterState.searchQuery.toLowerCase())
    );

    if (filterState.selectedFilters.length > 0) {
      filtered = filtered.filter((a) =>
        filterState.selectedFilters.includes(a.audience)
      );
    }

    const sorted = [...filtered].sort((a, b) =>
      filterState.sortOrder === "asc"
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date)
    );

    setFilteredAnnouncements(sorted);
  }, [filterState, announcements]);

  function deleteAnnouncement(announcement) {
    setDeleteModal(false);
  }

  return (
    <div className="p-4 bg-primary shadow-lg h-full space-y-4 rounded-xl  overflow-hidden text-text-body">
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full flex items-center justify-center gap-2 py-2 bg-button text-white font-semibold rounded-lg hover:bg-button-hover transition cursor-pointer"
        >
          <CirclePlus size={20} /> New Announcement
        </button>
      )}

      {showForm ? (
        <div className="h-full overflow-y-auto scrollbar-none mt-4">
          <h2 className="text-xl font-bold text-text-heading flex items-center gap-2">
            <Megaphone className="text-secondary" size={24} /> Post New Update
          </h2>

          <label className="block text-sm font-semibold mt-4 text-text-muted">
            Target Audience:
          </label>
          <select
            value={selectedAudience}
            onChange={(e) => setSelectedAudience(e.target.value)}
            className="w-full p-2 border border-secondary bg-primary-light rounded text-text-body outline-none"
          >
            {["All Users", "Stakers", "Admins"].map((audience, index) => (
              <option key={index} value={audience}>
                {audience}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-secondary bg-primary-light rounded mt-3 text-text-body outline-none"
          />

          <textarea
            placeholder="Message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows="4"
            className="w-full p-2 border border-secondary bg-primary-light rounded mt-3 text-text-body outline-none"
          />

          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
              Discard
            </button>
            <button
              onClick={handlePost}
              className="px-4 py-2 bg-button text-white font-semibold rounded-lg hover:bg-button-hover transition"
            >
              Publish
            </button>
          </div>
        </div>
      ) : (
        <>
          <Header
            title="Recent Platform Updates"
            totalCount={filteredAnnouncements.length}
            filterState={filterState}
            setFilterState={setFilterState}
            filterOptions={[
              {
                label: "Date Interval",
                children: [
                  { label: "Start Date", value: "startDate", type: "date" },
                  { label: "End Date", value: "endDate", type: "date" },
                ],
              },
            ]}
          />

          {filteredAnnouncements.length === 0 ? (
            <NoResult />
          ) : (
            <div className="mt-3 space-y-3 h-fith-[420px] overflow-y-auto scrollbar-hide">
              {filteredAnnouncements.map((announcement) => (
                <div
                  key={announcement.id}
                  className="p-3 bg-primary-light border border-secondary rounded-lg shadow flex justify-between items-center relative"
                >
                  <div>
                    <h3 className="font-semibold text-text-heading">
                      {announcement.title}
                    </h3>
                    <p className="text-xs text-text-muted">
                      📌 {announcement.audience || "All"} | 📅{" "}
                      {announcement.date}
                    </p>
                  </div>
                  <div className="space-x-3">
                    <button
                      onClick={() => setSelectedAnnouncement(announcement)}
                      className="text-secondary hover:text-secondary-light transition"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => setDeleteModal(true)}
                      className="text-red-500 hover:text-red-700 ml-4"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                  {deleteModal && (
                    <ConfirmationModal
                      text={"Are you sure you want to delete the announcement:"}
                      onConfirm={() => deleteAnnouncement(announcement)}
                      onCancel={() => setDeleteModal(false)}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <ViewAnnouncementPost
        isOpen={selectedAnnouncement}
        onClose={() => setSelectedAnnouncement(null)}
        announcement={selectedAnnouncement}
      />
    </div>
  );
}

export default Announcement;
