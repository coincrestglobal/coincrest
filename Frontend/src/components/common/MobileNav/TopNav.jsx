import React from "react";
import { FaUserCircle } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { useUser } from "../../common/UserContext"; // adjust path as needed
import Avatar from "../Avatar";

function TopNav() {
  const { user } = useUser();
  const navigate = useNavigate();

  const handleProfileClick = () => {
    if (!user) return navigate("/login");

    switch (user.role) {
      case "admin":
        return navigate("/dashboard/admin");
      case "owner":
        return navigate("/dashboard/owner");
      default:
        return navigate("/dashboard/user");
    }
  };

  return (
    <div className="fixed top-0  left-0 right-0 bg-primary-light shadow-md z-50 px-4 py-3 flex justify-between items-center">
      {/* Logo or Title */}
      <NavLink to="/">
        <img className="h-26 w-40" src="/images/logo.png" alt="logo" />
      </NavLink>

      {/* Profile Icon */}
      <button onClick={handleProfileClick} className="text-white text-2xl">
        {user?.photo ? (
          <Avatar size={48} imageURL={user.photo} />
        ) : (
          <Avatar
            size={48}
            bgColor="bg-green-500"
            textColor="text-white"
            textSize="text-xl"
            fontWeight="font-semibold"
            fullName={user.name}
          />
        )}
      </button>
    </div>
  );
}

export default TopNav;
