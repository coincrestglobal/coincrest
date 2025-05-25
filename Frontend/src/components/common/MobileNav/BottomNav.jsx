import { FaHome, FaInfoCircle, FaPhone, FaUser } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: "Home", icon: <FaHome />, path: "/" },
    { label: "Earnings", icon: <FaUser />, path: "/earnings" },
    { label: "Contact Us", icon: <FaPhone />, path: "/contactus" },
    { label: "About", icon: <FaInfoCircle />, path: "/aboutus" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-primary-light py-2 shadow-inner z-50">
      <div className="flex justify-around py-2">
        {navItems.map((item, index) => (
          <button
            key={index}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center text-sm ${
              location.pathname === item.path
                ? "text-nav-highlighted"
                : "text-text-link"
            }`}
          >
            <div
              className={`text-xl ${
                item.label === "Contact Us" ? "rotate-90" : ""
              }`}
            >
              {item.icon}
            </div>

            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default BottomNav;
