import { CircleUserRound, UserRound } from "lucide-react";
import { NavLink } from "react-router-dom";
import useSafeNavigate from "../../utils/useSafeNavigate";
import { useUser } from "../common/UserContext.jsx";
import Avatar from "./Avatar.jsx";

function Navbar() {
  const { user, setUser } = useUser();
  console.log(user);

  const navigate = useSafeNavigate();

  const handleProfileClick = (e) => {
    e.preventDefault();

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
    <div className="bg-primary-light fixed top-0 left-0 w-full z-50">
      {/* Navbar */}
      <div className="  flex justify-between items-center px-8 sm:px-12 lg:px-28 py-4 z-10 relative">
        <NavLink to="/">
          <img className="h-26 w-40" src="/images/logo4.png" alt="logo" />
        </NavLink>

        {/* Navigation Links (desktop version) */}
        <nav className="hidden lg:flex flex-col lg:flex-row items-center justify-between w-full sm:w-[50%]">
          <ul className="flex flex-col lg:flex-row space-y-4 lg:space-x-8 lg:space-y-0 text-lg sm:text-2xl font-raleway">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `transition-all duration-300 hover:text-nav-highlighted ${
                    isActive ? "text-nav-highlighted" : "text-text-link"
                  }`
                }
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/earnings"
                className={({ isActive }) =>
                  `transition-all duration-300 hover:text-nav-highlighted ${
                    isActive ? "text-nav-highlighted" : "text-text-link"
                  }`
                }
              >
                Earnings
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/contactus"
                className={({ isActive }) =>
                  `transition-all duration-300 hover:text-nav-highlighted ${
                    isActive ? "text-nav-highlighted" : "text-text-link"
                  }`
                }
              >
                Contact Us
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/aboutus"
                className={({ isActive }) =>
                  `transition-all duration-300 hover:text-nav-highlighted ${
                    isActive ? "text-nav-highlighted" : "text-text-link"
                  }`
                }
              >
                About Us
              </NavLink>
            </li>
          </ul>

          {/* User Profile - Positioned to the right on large screens */}
          <button
            onClick={handleProfileClick}
            className="cursor-pointer ml-auto lg:ml-0"
          >
            {user ? (
              user.profilePicUrl ? (
                <Avatar
                  size={48}
                  imageURL={`${
                    import.meta.env.VITE_BACKEND_URL
                  }/uploads/profilePics/${user.profilePicUrl}`}
                />
              ) : (
                <Avatar
                  size={48}
                  bgColor="bg-"
                  textColor="text-text-heading"
                  textSize="text-xl"
                  fontWeight="font-semibold"
                  fullName={user.name}
                />
              )
            ) : (
              <div className="bg-primary text-nav-link p-2 rounded-full flex items-center justify-center shadow-sm shadow-nav-highlighted">
                <UserRound className="text-white w-6 h-6" />
              </div>
            )}
          </button>
        </nav>
      </div>
    </div>
  );
}

export default Navbar;
