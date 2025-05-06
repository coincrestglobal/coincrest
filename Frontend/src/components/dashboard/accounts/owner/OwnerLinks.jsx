import { LayoutDashboard, Settings } from "lucide-react";

import NavItem from "../NavItem";

function OwnerLinks() {
  return (
    <>
      <NavItem to={"."}>
        <LayoutDashboard className=" w-5 h-5" />
        <span>Dashboard</span>
      </NavItem>

      <NavItem to={"control-pannel"}>
        <Settings className=" w-5 h-5" />
        <span>Control Panel</span>
      </NavItem>
      <NavItem to={"announcements"}>
        <Settings className=" w-5 h-5" />
        <span>Announcements</span>
      </NavItem>
      <NavItem to={"settings"}>
        <Settings className=" w-5 h-5" />
        <span>Settings</span>
      </NavItem>
    </>
  );
}

export default OwnerLinks;
