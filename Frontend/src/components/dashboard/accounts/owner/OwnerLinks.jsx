import { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  PanelTopClose,
  Megaphone,
  Settings,
  LogOut,
  Menu,
} from "lucide-react";

import NavItem from "../NavItem"; // Adjust path if needed

const ownerNavLinks = [
  {
    to: ".",
    label: "Dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    to: "control-pannel",
    label: "Control Panel",
    icon: <PanelTopClose className="w-5 h-5" />,
  },
  {
    to: "announcements",
    label: "Announcements",
    icon: <Megaphone className="w-5 h-5" />,
  },
  {
    to: "settings",
    label: "Settings",
    icon: <Settings className="w-5 h-5" />,
  },
  {
    to: "logout",
    label: "Logout",
    icon: <LogOut className="w-5 h-5" />,
  },
];

export default function OwnerLinks() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <div>
      {/* Mobile / Tablet Navbar with Burger Button */}
      <div className="lg:hidden flex gap-5 items-center px-8 py-2 w-full">
        <button onClick={() => setOpen(!open)} className="text-nav-highlighted">
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold text-nav-highlighted">
          {ownerNavLinks.find((n) => location.pathname.includes(n.to))?.label ||
            "Dashboard"}
        </h1>
      </div>

      {/* Mobile / Tablet Drawer */}
      {open && (
        <div className="lg:hidden bg-primary-dark shadow-md px-4 py-2 space-y-1 z-50 absolute w-fit left-4">
          {ownerNavLinks.map((item) => (
            <NavItem
              key={item.to}
              to={item.to}
              isActive={location.pathname.includes(item.to)}
              onClick={() => setOpen(false)} // Close drawer on click
            >
              {item.icon}
              <span>{item.label}</span>
            </NavItem>
          ))}
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-full overflow-x-auto lg:overflow-x-visible scrollbar-none">
        <div className="flex lg:flex-col min-w-max md:min-w-0 px-2 md:px-0">
          {ownerNavLinks.map((item) => (
            <NavItem
              key={item.to}
              to={item.to}
              isActive={location.pathname.includes(item.to)}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavItem>
          ))}
        </div>
      </div>
    </div>
  );
}
