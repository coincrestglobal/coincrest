import UsersHeader from "../../../common/DashboardHeader";
import UsersTable from "../../../dashboard/Table";
import { useEffect, useState } from "react";
import NoResult from "../../../../pages/NoResult";
const headers = [
  { label: "S No.", width: "10%" },
  { label: "Name", width: "20%" },
  { label: "Email", width: "25%" },
  { label: "Number", width: "25%" },
  { label: "Last Visit", width: "20%" },
];

const usersData = Array.from({ length: 50 }, (_, i) => ({
  id: (i + 1).toString(),
  name: ["John Doe", "Jane Smith", "Sam Wilson", "Lucy Heart"][i % 4],
  email: [
    "john@example.com",
    "jane@example.com",
    "sam@example.com",
    "lucy@example.com",
  ][i % 4],
  number: ["1234567890", "9876543210", "4561237890", "7894561230"][i % 4],
  lastVisit: `2024-03-${(i % 30) + 1}`.padStart(10, "0"),
}));

function Users() {
  const [filterState, setFilterState] = useState({
    searchQuery: "",
    sortOrder: "asc",
    selectedFilters: [],
  });

  const [users, setUsers] = useState(usersData);

  useEffect(() => {
    function fetchUsers(query) {
      return usersData.filter(
        (user) =>
          user &&
          user.name &&
          user.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    const filteredUsers = fetchUsers(filterState.searchQuery);
    setUsers(filteredUsers);
  }, [filterState.searchQuery, filterState.selectedFilters]);

  const sortedUsers = [...users].sort((a, b) => {
    return filterState.sortOrder === "asc"
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name);
  });

  return (
    <div className="p-2 h-full bg-primary-dark scrollbar-hide ">
      {/* Header Section */}
      <UsersHeader
        title="Users"
        totalCount={sortedUsers.length}
        filterState={filterState}
        setFilterState={setFilterState}
        filterOptions={[
          {
            label: "Status",
            children: [
              { label: "Active", value: "active" },
              { label: "Inactive", value: "inactive" },
              { label: "Suspended", value: "suspended" },
            ],
          },
        ]}
      />
      {sortedUsers.length > 0 ? (
        <UsersTable headers={headers} data={sortedUsers} itemsPerPage={9} />
      ) : (
        <NoResult />
      )}
    </div>
  );
}

export default Users;
