import { Settings } from "lucide-react";

import NavItem from "../NavItem";
function AdminLinks() {
  return (
    <>
      <NavItem to={"."}>
        <Settings className="text-text-link w-5 h-5" />
        <span>Control Panel</span>
      </NavItem>
      <NavItem to={"announcements"}>
        <Settings className="text-text-link w-5 h-5" />
        <span>Announcements</span>
      </NavItem>
      <NavItem to={"settings"}>
        <Settings className="text-text-link w-5 h-5" />
        <span>Settings</span>
      </NavItem>
    </>
  );
}

export default AdminLinks;
