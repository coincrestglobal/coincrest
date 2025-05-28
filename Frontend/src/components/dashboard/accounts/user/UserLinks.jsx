import {
  LayoutDashboard,
  LineChart,
  Banknote,
  Wallet,
  Settings,
  Users,
  HelpCircle,
  LogOut,
} from "lucide-react";

import NavItem from "../NavItem";

function UserLinks() {
  return (
    <div className="w-full overflow-x-auto lg:overflow-x-visible scrollbar-none">
      <div className="flex lg:flex-col  min-w-max md:min-w-0 px-2 md:px-0 ">
        <NavItem to={"."}>
          <LayoutDashboard className="w-5 h-4" />
          <span>Dashboard</span>
        </NavItem>
        <NavItem to={"investments"}>
          <LineChart className="w-5 h-4" />
          <span>Investing</span>
        </NavItem>
        <NavItem to={"deposits"}>
          <Banknote className="w-5 h-4" />
          <span>Deposit</span>
        </NavItem>
        <NavItem to={"withdraws"}>
          <Wallet className="w-5 h-4" />
          <span>Withdraw</span>
        </NavItem>
        <NavItem to={"bonus-history"}>
          <Wallet className="w-5 h-4" />
          <span>Bonus History</span>
        </NavItem>
        <NavItem to={"team"}>
          <Users className="w-5 h-4" />
          <span>Your Team</span>
        </NavItem>
        <NavItem to={"announcements"}>
          <Users className="w-5 h-4" />
          <span>Announcements</span>
        </NavItem>
        <NavItem to={"settings"}>
          <Settings className="w-5 h-4" />
          <span>Settings</span>
        </NavItem>

        <NavItem to={"Help-and-Support"}>
          <HelpCircle className="w-5 h-4" />
          <span>Help & Support</span>
        </NavItem>
        <NavItem to={"logout"}>
          <LogOut className="w-5 h-4" />
          <span>Logout</span>
        </NavItem>
      </div>
    </div>
  );
}

export default UserLinks;
