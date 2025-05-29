import { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  LineChart,
  Banknote,
  Wallet,
  Users,
  Settings,
  HelpCircle,
  LogOut,
  Menu,
} from "lucide-react";
import NavItem from "../NavItem"; // Adjust the import path if needed

const navLinks = [
  {
    to: ".",
    label: "Dashboard",
    icon: <LayoutDashboard className="w-5 h-4" />,
  },
  {
    to: "investments",
    label: "Investing",
    icon: <LineChart className="w-5 h-4" />,
  },
  {
    to: "deposits",
    label: "Deposit",
    icon: <Banknote className="w-5 h-4" />,
  },
  {
    to: "withdraws",
    label: "Withdraw",
    icon: <Wallet className="w-5 h-4" />,
  },
  {
    to: "bonus-history",
    label: "Bonus History",
    icon: <Wallet className="w-5 h-4" />,
  },
  {
    to: "team",
    label: "Your Team",
    icon: <Users className="w-5 h-4" />,
  },
  // {
  //   to: "announcements",
  //   label: "Announcements",
  //   icon: <Users className="w-5 h-4" />,
  // },
  {
    to: "settings",
    label: "Settings",
    icon: <Settings className="w-5 h-4" />,
  },
  {
    to: "Help-and-Support",
    label: "Help & Support",
    icon: <HelpCircle className="w-5 h-4" />,
  },
  {
    to: "logout",
    label: "Logout",
    icon: <LogOut className="w-5 h-4" />,
  },
];

export default function ResponsiveNav() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <div>
      {/* Mobile / Tablet Navbar with Burger Button */}
      <div className="lg:hidden flex gap-5 items-center px-8 py-2 w-full ">
        <button onClick={() => setOpen(!open)} className="text-nav-highlighted">
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold text-nav-highlighted">
          {navLinks.find((n) => location.pathname.includes(n.to))?.label ||
            "Dashboard"}
        </h1>
      </div>

      {/* Mobile / Tablet Drawer */}
      {open && (
        <div className="lg:hidden bg-primary-dark shadow-md px-4 py-2 space-y-1 z-50 absolute w-fit left-4">
          {navLinks.map((item) => (
            <NavItem
              key={item.to}
              to={item.to}
              isActive={location.pathname.includes(item.to)}
              onClick={() => setOpen(false)} // close drawer on any item click
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
          {navLinks.map((item) => (
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
