import Profile from "./Profile";

function Sidebar({ children }) {
  return (
    <div
      className="
        bg-primary-dark flex flex-col 
         max-h-[92vh]
        py-4 space-y-4 border border-button rounded
        w-full md:w-auto
      "
    >
      <Profile />
      <div className=" flex flex-col">{children}</div>
    </div>
  );
}

export default Sidebar;
