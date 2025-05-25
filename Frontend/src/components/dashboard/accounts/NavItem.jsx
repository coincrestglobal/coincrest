import { NavLink } from "react-router";
import useSafeNavigate from "../../../utils/useSafeNavigate";
import { useState } from "react";
import ConfirmationModal from "../../common/ConfirmationModal";
import { useUser } from "../../common/UserContext";
import { toast } from "react-toastify";

function NavItem({ to, children }) {
  const { setUser } = useUser();
  const safeNavigate = useSafeNavigate();
  const [modal, setModal] = useState(false);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast.success("Logged Out");
    safeNavigate("/login");
  };

  const style = `flex items-center px-2 md:px-8 py-2 md:py-3 md:text-xl uppercase bg-primary-dark text-text-link space-x-3 transition-all duration-75 ease-in-out `;

  return (
    <>
      {to === "logout" ? (
        <>
          <button
            onClick={() => setModal(true)}
            className={`${style} hover:ml-1`}
          >
            <div className="flex items-center space-x-3">{children}</div>
          </button>
          {modal && (
            <ConfirmationModal
              text={"Are you sure you want to log out?"}
              onConfirm={handleLogout}
              onCancel={() => setModal(false)}
            />
          )}
        </>
      ) : (
        <NavLink
          to={to}
          end
          className={({ isActive }) =>
            `${style} ${
              isActive
                ? "text-white border-b-2 border-button md:border-b-0 md:border-l-4 md:border-l-button"
                : " hover:ml-1 border-l-0"
            }`
          }
        >
          <div className="flex items-center space-x-3  ">{children}</div>
        </NavLink>
      )}
    </>
  );
}

export default NavItem;
