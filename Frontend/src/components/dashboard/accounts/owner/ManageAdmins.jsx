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
import { useUser } from "../../../common/UserContext";
import {
  fireAdmin,
  getAllUsers,
} from "../../../../services/operations/adminAndOwnerDashboardApi";
import FireAdminConfirmationModal from "./FireAdminConfirmationModal";
import Pagination from "../../../common/Pagination";
import Loading from "../../../../pages/Loading";

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
  const [expandedAdmin, setExpandedAdmin] = useState(null);

  const [fireAdminConfirmationModal, setFireAdminConfirmationModal] =
    useState(false);

  const { user } = useUser();

  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const numberOfEntries = 1;

  useEffect(() => {
    const fetchUsers = async () => {
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
        params.append("role", "admin");
        params.append("limit", numberOfEntries);

        // getting all users
        const response = await getAllUsers(user.token, params.toString());

        const { data } = response;

        setAdmins(data.users);
        setTotalPages(response.totalPages);
        setTotalUsers(response.total);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentPage, filterState]);
  // Handle "Fire Admin"
  const handleFireAdmin = async (adminId, password) => {
    try {
      setLoading(true);
      const response = await fireAdmin(adminId, user.token, password);
      if (response.status === "success") {
        setFireAdminConfirmationModal(false);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }
  return (
    <div className="p-2 flex flex-col gap-4 h-full overscroll-y-scroll scrollbar-hide">
      <AdminsHeader
        title="All Admins"
        totalCount={totalUsers}
        filterState={filterState}
        setFilterState={setFilterState}
        filterOptions={filterOptions}
      />

      <div
        className="flex items-center justify-between p-4 border border-button rounded-xl -my-2 cursor-pointer hover:bg-button-hover transition-all"
        onClick={() => navigate("add-admin")}
      >
        <div className="flex items-center gap-2">
          <BiPlusCircle className="text-text-heading w-6 h-6" />
          <span className="text-text-heading font-semibold text-lg">
            Add New Admin
          </span>
        </div>
      </div>

      {/* Admins List */}
      {admins.map((admin) => (
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
                setExpandedAdmin(expandedAdmin === admin._id ? null : admin._id)
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
                <strong className="text-text-heading">Role:</strong>{" "}
                {admin.role}
              </p>
              <p className="text-text-subheading">
                <strong className="text-text-heading">Joined:</strong>{" "}
                {new Date(admin.updatedAt).toLocaleDateString()}
              </p>
            </div>
          )}

          <div className="mt-4">
            <button
              onClick={() => setFireAdminConfirmationModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-button text-text-heading rounded-lg cursor-pointer"
            >
              <FaUserSlash />
              Fire Admin
            </button>
          </div>

          {fireAdminConfirmationModal && (
            <FireAdminConfirmationModal
              adminId={admin._id}
              text={`Are you sure you want to fire the admin ${admin.name}? This action cannot be undone.`}
              onCancel={() => setFireAdminConfirmationModal(false)}
              onConfirm={handleFireAdmin}
            />
          )}
        </div>
      ))}

      {/* ✅ Pagination Control */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}

export default AllAdmins;
