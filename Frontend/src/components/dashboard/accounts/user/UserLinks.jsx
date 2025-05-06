import {
  LayoutDashboard,
  LineChart,
  Banknote,
  Wallet,
  Settings,
  Users,
  HelpCircle,
} from "lucide-react";

import NavItem from "../NavItem";

function UserLinks() {
  return (
    <div className="flex flex-col">
      <NavItem to={"."}>
        <LayoutDashboard className="w-5 h-5" />
        <span>Dashboard</span>
      </NavItem>
      <NavItem to={"investments"}>
        <LineChart className="w-5 h-5" />
        <span>Investing</span>
      </NavItem>
      <NavItem to={"deposits"}>
        <Banknote className="w-5 h-5" />
        <span>Deposit</span>
      </NavItem>
      <NavItem to={"withdraws"}>
        <Wallet className="w-5 h-5" />
        <span>Withdraw</span>
      </NavItem>
      <NavItem to={"settings"}>
        <Settings className="w-5 h-5" />
        <span>Settings</span>
      </NavItem>
      <NavItem to={"team"}>
        <Users className="w-5 h-5" />
        <span>Your Team</span>
      </NavItem>
      <NavItem to={"Help-and-Support"}>
        <HelpCircle className="w-5 h-5" />
        <span>Help & Support</span>
      </NavItem>
    </div>
  );
}

export default UserLinks;
