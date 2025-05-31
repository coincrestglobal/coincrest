import { CirclePlus, Megaphone, Eye } from "lucide-react";
import ViewAnnouncementPost from "./ViewAnnouncementPost";
import { useEffect, useState } from "react";
import Header from "./DashboardHeader";
import NoResult from "../../pages/NoResult";
import { FaTrash } from "react-icons/fa";
import ConfirmationModal from "../common/ConfirmationModal";
import { useUser } from "../common/UserContext";
import {
  addAnnouncement,
  deleteAnnouncements,
  getAllAnnouncements,
} from "../../services/operations/adminAndOwnerDashboardApi";
import Pagination from "./Pagination";
import Loading from "../../pages/Loading";

function Announcement() {
  const { user } = useUser(); // { name, role, ... }
  const [announcements, setAnnouncements] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [selectedAudience, setSelectedAudience] = useState("All Users");
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalAnnouncements, setTotalAnnouncements] = useState(0);
  const [loading, setLoading] = useState(false);
  const numberOfEntries = 10;

  const [filterState, setFilterState] = useState({
    searchQuery: "",
    sortOrder: "asc",
    selectedFilters: [],
  });

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        const { searchQuery, selectedFilters, sortOrder } = filterState;
        const params = new URLSearchParams();

        if (searchQuery) {
          params.append("search", searchQuery);
        }

        if (selectedFilters) {
          if (selectedFilters["Date Interval"]) {
            const { startDate, endDate } = selectedFilters["Date Interval"];
            if (startDate) params.append("startDate", startDate);
            if (endDate) params.append("endDate", endDate);
          }
        }

        if (sortOrder) {
          params.append("sort", sortOrder);
        }

        params.append("page", currentPage);
        params.append("role", "user");
        params.append("limit", numberOfEntries);

        const response = await getAllAnnouncements(
          user.token,
          params.toString()
        );

        const { data } = response;
        setAnnouncements(data.announcements);
        setTotalPages(response.totalPages);
        setTotalAnnouncements(response.total);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, [currentPage, filterState]);

  const handlePost = async () => {
    if (!title.trim() || !message.trim()) {
      alert("Title and Message are required.");
      return;
    }

    setLoading(true);
    try {
      const getFormattedAudience = (audience) => {
        if (audience === "All Users") return "all";
        if (audience === "Stakers") return "user";
        if (audience === "Admins") return "admin";
        return audience.toLowerCase(); // fallback
      };
      const formattedAudience = getFormattedAudience(selectedAudience);
      const response = await addAnnouncement(user.token, {
        title,
        message,
        visibleTo: formattedAudience,
      });

      // Reset form and refresh announcements
      setTitle("");
      setMessage("");
      setSelectedAudience("All Users");
      setShowForm(false);
      setCurrentPage(1); // go to first page
      setFilterState((prev) => ({ ...prev })); // trigger re-fetch
    } catch (error) {
      console.error("Post announcement failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteAnnouncement = async (announcementId) => {
    setLoading(true);
    try {
      const response = await deleteAnnouncements(user.token, announcementId);
      if (response.status === "success") {
        setDeleteModal(false);
      }
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }
  const canPost = user?.role === "admin" || user?.role === "owner";

  return (
    <div className="p-4 bg-primary shadow-lg h-full space-y-4 rounded-xl overflow-hidden text-text-body">
      {canPost && !showForm && (
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
            {(user.role === "owner"
              ? ["All Users", "Admins", "Stakers"]
              : ["Stakers"]
            ).map((audience, index) => (
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
            totalCount={totalAnnouncements}
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

          {
            <div className="mt-3 space-y-3 max-h-[420px] overflow-y-auto scrollbar-hide">
              {announcements.map((announcement) => (
                <div
                  key={announcement._id}
                  className="p-3 bg-primary-light border border-secondary rounded-lg shadow flex justify-between items-center relative"
                >
                  <div>
                    <h3 className="font-semibold text-text-heading">
                      {announcement.title}
                    </h3>
                    <p className="text-xs text-text-muted">
                      📌 {announcement.visibleTo || "All"} | 📅{" "}
                      {new Date(announcement.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="space-x-3 flex items-center">
                    <button
                      onClick={() => setSelectedAnnouncement(announcement)}
                      className="text-secondary hover:text-secondary-light transition"
                    >
                      <Eye size={18} />
                    </button>
                    {user.role === "owner" && (
                      <button
                        onClick={() => setDeleteModal(true)}
                        className="text-red-500 hover:text-red-700 ml-4"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>

                  {deleteModal && (
                    <ConfirmationModal
                      text={
                        "Are you sure you want to delete this announcement?"
                      }
                      onConfirm={() => deleteAnnouncement(announcement._id)}
                      onCancel={() => setDeleteModal(false)}
                    />
                  )}
                </div>
              ))}
            </div>
          }

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
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
