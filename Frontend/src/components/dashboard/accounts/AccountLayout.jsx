import Sidebar from "./Sidebar";
import { Outlet } from "react-router";

function AccountLayout({ children }) {
  return (
    <div className="px-32 mt-16 py-10 grid grid-cols-[0.3fr_0.7fr]  gap-10 bg-primary rounded-md overflow-hidden">
      <Sidebar>{children}</Sidebar>
      <div className="  bg-primary overflow-y-scroll h-fit max-h-[80vh] scrollbar-hide border border-button rounded ">
        <Outlet />
      </div>
    </div>
  );
}

export default AccountLayout;
