import { PanelTopClose, Megaphone, Settings, LogOut } from "lucide-react";

import NavItem from "../NavItem";
function AdminLinks() {
  return (
    <div className="w-full overflow-x-auto md:overflow-x-visible scrollbar-none ">
      <div className="flex md:flex-col gap-2 min-w-max md:min-w-0 px-2 md:px-0">
        <NavItem to={"."}>
          <PanelTopClose className="w-5 h-5" />
          <span>Control Panel</span>
        </NavItem>
        <NavItem to={"announcements"}>
          <Megaphone className="w-5 h-5" />
          <span>Announcements</span>
        </NavItem>
        <NavItem to={"settings"}>
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </NavItem>
        <NavItem to={"logout"}>
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </NavItem>
      </div>
    </div>
  );
}

export default AdminLinks;
