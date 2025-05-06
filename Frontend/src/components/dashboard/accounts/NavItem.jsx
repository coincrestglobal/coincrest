import { NavLink } from "react-router";
import useSafeNavigate from "../../../utils/useSafeNavigate";

function NavItem({ to, children }) {
  const safeNavigate = useSafeNavigate();

  const handleLogout = () => {
    console.log("Logging out...");
    // Add logout logic here (clear tokens, redirect, etc.)
    safeNavigate("/login");
  };

  const style = `flex items-center px-8 py-4 text-xl uppercase bg-primary-dark text-text-link space-x-3 transition-all duration-75 ease-in-out `;

  if (to === "logout") {
    return (
      <button onClick={handleLogout} className={`${style} hover:ml-1`}>
        <div className="flex items-center space-x-3">{children}</div>
      </button>
    );
  }

  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `${style} ${isActive ? " ml-1 text-white " : " hover:ml-1"}`
      }
    >
      <div className="flex items-center space-x-3  ">{children}</div>
    </NavLink>
  );
}

export default NavItem;
