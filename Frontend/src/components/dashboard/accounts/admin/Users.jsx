import UsersHeader from "../../../common/DashboardHeader";
import UsersTable from "../../../dashboard/Table";
import { useEffect, useState } from "react";
import NoResult from "../../../../pages/NoResult";
import axios from "axios";

const headers = [
  { label: "S No.", width: "10%" },
  { label: "Name", width: "20%" },
  { label: "Email", width: "25%" },
  { label: "Number", width: "25%" },
  { label: "Last Visit", width: "20%" },
];

const getKeyFromLabel = (label) =>
  label.toLowerCase().replace(/\s+/g, "").replace(/\./g, "");

function Users() {
  const [filterState, setFilterState] = useState({
    searchQuery: "",
    sortOrder: "asc",
    selectedFilters: [],
  });

  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { searchQuery, selectedFilters } = filterState;

        const params = new URLSearchParams();
        if (searchQuery) params.append("search", searchQuery);
        if (selectedFilters.length > 0)
          params.append("selectedFilters", selectedFilters.join(","));
        params.append("page", currentPage);
        params.append("limit", 9);

        const response = await axios.get(
          `http://localhost:5000/api/v1/management/getUsers?${params.toString()}`
        );

        const { data } = response.data;
        setUsers(data.users);
        setTotalPages(response.data.totalPages);
        setTotalUsers(response.data.total);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentPage, filterState]);

  if (loading) return <p>Loading...</p>;

  const sortedUsers = [...users].sort((a, b) => {
    return filterState.sortOrder === "asc"
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name);
  });

  const transformedUsers = sortedUsers.map((user, idx) => {
    const row = {};
    headers.forEach((header, i) => {
      const key = getKeyFromLabel(header.label);
      if (key === "sno") {
        row[key] = (currentPage - 1) * 9 + idx + 1;
      } else if (key === "lastvisit") {
        row[key] = new Date(user.updatedAt).toLocaleString();
      } else {
        row[key] = user[key] || "-";
      }
    });
    return row;
  });

  return (
    <div className="p-2 h-full bg-primary-dark scrollbar-hide">
      <UsersHeader
        title="Users"
        totalCount={totalUsers}
        filterState={filterState}
        setFilterState={setFilterState}
      />
      {transformedUsers.length > 0 ? (
        <UsersTable
          headers={headers}
          data={transformedUsers}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
          itemsPerPage={9}
        />
      ) : (
        <NoResult />
      )}
    </div>
  );
}

export default Users;
