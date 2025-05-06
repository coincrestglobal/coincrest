import { useState, useEffect } from "react";
import { CircleUserRound } from "lucide-react";
import { NavLink } from "react-router-dom";
import useSafeNavigate from "../../utils/useSafeNavigate";
import { useUser } from "../common/UserContext.jsx";

function Navbar() {
  const { user, setUser } = useUser();

  const [isMenuOpen, setIsMenuOpen] = useState(false); // Track the state of the mobile menu
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
      {/* Modal Overlay for Mobile Menu */}
      {isMenuOpen && (
        <div className=" top-[68px] md:top-[72px] h-fit right-0 bottom-0  p-10 z-50">
          <div className="flex flex-col items-center h-full space-y-6 text-white">
            <ul className="space-y-4 text-2xl font-medium">
              <li>
                <NavLink to="/" onClick={() => setIsMenuOpen(false)}>
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/" onClick={() => setIsMenuOpen(false)}>
                  Earnings
                </NavLink>
              </li>
              <li>
                <NavLink to="/contactus" onClick={() => setIsMenuOpen(false)}>
                  Contact Us
                </NavLink>
              </li>
              <li>
                <NavLink to="/" onClick={() => setIsMenuOpen(false)}>
                  About Us
                </NavLink>
              </li>
            </ul>

            {/* Close Button */}
            <button
              onClick={() => setIsMenuOpen(false)}
              className="text-3xl font-bold text-white"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {/* Navbar */}
      <div className="  flex justify-between items-center px-8 sm:px-12 lg:px-28 py-4 z-10 relative">
        <NavLink to="/">
          <img className="h-26 w-40" src="/images/logo.png" alt="logo" />
        </NavLink>

        {/* Hamburger Icon for mobile/tablet */}
        <div className="lg:hidden flex items-center fixed top-4 right-4 z-60">
          <button
            className="space-y-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)} // Toggle the menu state
          >
            <div className="w-8 h-1 bg-primary rounded"></div>
            <div className="w-8 h-1 bg-primary rounded"></div>
            <div className="w-8 h-1 bg-primary rounded"></div>
          </button>
        </div>

        {/* Navigation Links (desktop version) */}
        <nav className="hidden lg:flex flex-col lg:flex-row items-center justify-between w-full sm:w-[50%]">
          <ul className="flex flex-col lg:flex-row space-y-4 lg:space-x-8 lg:space-y-0 text-lg sm:text-2xl font-raleway">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `transition-all duration-300 hover:text-text-linkHover ${
                    isActive ? "text-text-linkHover" : "text-text-link"
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
                  `transition-all duration-300 hover:text-text-linkHover ${
                    isActive ? "text-text-linkHover" : "text-text-link"
                  }`
                }
              >
                Earnings
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/contactus"
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `transition-all duration-300 hover:text-text-linkHover ${
                    isActive ? "text-text-linkHover" : "text-text-link"
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
                  `transition-all duration-300 hover:text-text-linkHover ${
                    isActive ? "text-text-linkHover" : "text-text-link"
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
            {user?.photo ? (
              <img
                src={user?.photo}
                alt={user?.name}
                className="w-11 h-11 object-cover object-center rounded-full shadow-sm shadow-text-linkHover"
              />
            ) : (
              <CircleUserRound className="w-11 h-11 text-gray-600" />
            )}
          </button>
        </nav>
      </div>
    </div>
  );
}

export default Navbar;
