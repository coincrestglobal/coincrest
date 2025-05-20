import { Settings } from "lucide-react";

import NavItem from "../NavItem";
function AdminLinks() {
  return (
    <div className="w-full overflow-x-auto md:overflow-x-visible scrollbar-none ">
      <div className="flex md:flex-col gap-2 min-w-max md:min-w-0 px-2 md:px-0">
        <NavItem to={"."}>
          <Settings className="text-text-link w-5 h-4" />
          <span>Control Panel</span>
        </NavItem>
        <NavItem to={"announcements"}>
          <Settings className="text-text-link w-5 h-4" />
          <span>Announcements</span>
        </NavItem>
        <NavItem to={"settings"}>
          <Settings className="text-text-link w-5 h-4" />
          <span>Settings</span>
        </NavItem>
      </div>
    </div>
  );
}

export default AdminLinks;
