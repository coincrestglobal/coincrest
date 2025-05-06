import { useEffect, useState } from "react";
import {
  FaChevronDown,
  FaChevronUp,
  FaEnvelope,
  FaUserShield,
  FaUserSlash,
} from "react-icons/fa";
import AdminsHeader from "../../../common/DashboardHeader";
import { BiPlusCircle } from "react-icons/bi";
import useSafeNavigate from "../../../../utils/useSafeNavigate";
import ConfirmationModal from "../../../common/ConfirmationModal";
import Loading from "../../../../pages/Loading";

const demoAdmins = [
  {
    _id: "1",
    name: "Aarav Mehta",
    email: "aarav.mehta@coincrest.com",
    role: "Admin",
    status: "Active",
    joinedAt: "2024-01-15T12:00:00Z",
  },
  {
    _id: "2",
    name: "Simran Kaur",
    email: "simran.kaur@coincrest.com",
    role: "Admin",
    status: "Active",
    joinedAt: "2023-11-22T09:30:00Z",
  },
  {
    _id: "3",
    name: "Ravi Sharma",
    email: "ravi.sharma@coincrest.com",
    role: "Admin",
    status: "Active",
    joinedAt: "2024-03-05T08:45:00Z",
  },
];

const filterOptions = [
  {
    label: "Date Interval",
    children: [
      { label: "Start Date", value: "startDate", type: "date" },
      { label: "End Date", value: "endDate", type: "date" },
    ],
  },
];

function AllAdmins() {
  const navigate = useSafeNavigate();
  const [filterState, setFilterState] = useState({
    searchQuery: "",
    sortOrder: "asc",
    selectedFilters: {},
  });
  const [admins, setAdmins] = useState([]);
  const [expandedAdmin, setExpandedAdmin] = useState(null);
  const [loading, setLoading] = useState(false);

  const [fireAdminConfirmationModal, setFireAdminConfirmationModal] =
    useState(false);

  useEffect(() => {
    function fetchAdmins(query) {
      return demoAdmins.filter(
        (admin) =>
          !query ||
          admin.name.toLowerCase().includes(query.toLowerCase()) ||
          admin.email.toLowerCase().includes(query.toLowerCase())
      );
    }

    const filteredAdmins = fetchAdmins(filterState.searchQuery);
    setAdmins(filteredAdmins);
  }, [filterState.searchQuery, filterState.selectedFilters]);

  const sortedAdmins = [...admins].sort((a, b) => {
    return filterState.sortOrder === "asc"
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name);
  });

  // Handle "Fire Admin"
  const handleFireAdmin = async (adminId) => {
    setLoading(true);
    // Simulate async operation
    setTimeout(() => {
      setAdmins((prevAdmins) =>
        prevAdmins.filter((admin) => admin._id !== adminId)
      );
      setLoading(false);
    }, 2000);
    setFireAdminConfirmationModal(false);
  };
  if (loading) {
    return <Loading />;
  }
  return (
    <div className="p-2 flex flex-col gap-4 h-full overscroll-y-scroll scrollbar-hide">
      <AdminsHeader
        title="All Admins"
        totalCount={sortedAdmins.length}
        filterState={filterState}
        setFilterState={setFilterState}
        filterOptions={filterOptions}
      />
      <div
        className="flex items-center justify-between p-4  border border-button rounded-xl -my-2 cursor-pointer hover:bg-button-hover transition-all"
        onClick={() => navigate("add-admin")}
      >
        <div className="flex items-center gap-2">
          <BiPlusCircle className="text-text-heading w-6 h-6" />
          <span className="text-text-heading font-semibold text-lg">
            Add New Admin
          </span>
        </div>
      </div>
      {admins.length === 0 ? (
        <p className="text-text-body">No admins found.</p>
      ) : (
        sortedAdmins.map((admin) => (
          <div
            key={admin._id}
            className="bg-primary-dark rounded-2xl mb-4 shadow-lg p-6 border-t-2 border-button"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-text-heading mb-2 flex items-center gap-2">
                <FaUserShield className="text-text-heading" />
                {admin.name}
              </h2>
              <button
                onClick={() =>
                  setExpandedAdmin(
                    expandedAdmin === admin._id ? null : admin._id
                  )
                }
                className="text-button hover:text-button-hover transition cursor-pointer"
              >
                {expandedAdmin === admin._id ? (
                  <FaChevronUp size={20} />
                ) : (
                  <FaChevronDown size={20} />
                )}
              </button>
            </div>
            <div className="flex justify-between text-text-heading p-3 rounded-md mb-4 shadow-sm">
              <p className="text-text-body mb-2">
                <FaEnvelope className="inline mr-2" />
                {admin.email}
              </p>
              <p className="text-text-subheading">
                <strong className="text-text-heading">Status:</strong>{" "}
                {admin.status}
              </p>
            </div>

            {expandedAdmin === admin._id && (
              <div className="grid grid-cols-2 gap-4 p-4 rounded-md shadow-sm bg-primary ">
                <p className="text-text-subheading">
                  <strong className="text-text-heading">Phone:</strong>{" "}
                  {admin.phone || "Not Provided"}
                </p>
                <p className="text-text-subheading">
                  <strong className="text-text-heading">Role:</strong>{" "}
                  {admin.role}
                </p>
                <p className="text-text-subheading">
                  <strong className="text-text-heading">Joined:</strong>{" "}
                  {new Date(admin.joinedAt).toLocaleDateString()}
                </p>
              </div>
            )}

            <div className="mt-4">
              <button
                onClick={() => setFireAdminConfirmationModal(true)}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-button text-text-heading rounded-lg cursor-pointer"
              >
                <FaUserSlash />
                Fire Admin
              </button>
            </div>
            {fireAdminConfirmationModal && (
              <ConfirmationModal
                text={`Are you sure you want to fire the admin ${admin.name}? This action cannot be undone.`}
                onCancel={() => setFireAdminConfirmationModal(false)}
                onConfirm={() => handleFireAdmin(admin._id)}
              />
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default AllAdmins;
