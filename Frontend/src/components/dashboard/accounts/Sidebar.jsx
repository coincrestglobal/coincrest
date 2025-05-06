import Profile from "./Profile";

function Sidebar({ children }) {
  return (
    <div className="bg-primary-dark flex flex-col h-[80vh] py-4 space-y-4  border border-button rounded">
      <Profile />
      <div className="bg-button">
        <div className="flex flex-col">{children}</div>
      </div>
    </div>
  );
}

export default Sidebar;
