import { LayoutDashboard, Settings } from "lucide-react";

import NavItem from "../NavItem";

function OwnerLinks() {
  return (
    <div className="w-full overflow-x-auto md:overflow-x-visible scrollbar-none  ">
      <div className="flex md:flex-col gap-2 min-w-max md:min-w-0 px-2 md:px-0 ">
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
      </div>
    </div>
  );
}

export default OwnerLinks;
