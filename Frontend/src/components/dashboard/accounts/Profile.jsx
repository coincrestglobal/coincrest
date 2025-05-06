import { CameraIcon, UserCircle } from "lucide-react";
import { useRef } from "react";

const user = {
  name: "Salman Khan",
  firstName: "Salman",
  lastName: "Khan",
  email: "bishnoi@298.com",
  photo:
    "https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?q=80&w=1985&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
};

function Profile() {
  const fileInputRef = useRef();

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  };

  return (
    <div className="flex items-center gap-x-4 p-6 text-green-100 relative">
      <div className="relative inline-block cursor-pointer">
        {user ? (
          <img
            src={
              user?.photo
                ? user.photo
                : `https://api.dicebear.com/5.x/initials/svg?seed=${user.firstName}%20${user.lastName}&backgroundColor=f5f5f5&textColor=2e7d32`
            }
            alt={user.name}
            className="w-20 h-20 object-cover object-center rounded-full transition-transform duration-300 ease-in-out "
          />
        ) : (
          <UserCircle className="w-20 h-20 text-text-heading transition-transform duration-300 ease-in-out hover:scale-125" />
        )}

        {/* Camera Icon Overlay */}
        <div
          onClick={() => fileInputRef.current.click()}
          className="absolute bottom-0 right-0 bg-button p-1 rounded-full cursor-pointer hover:bg-button-hover transition"
        >
          <CameraIcon className="w-4 h-4 text-text-heading" />
        </div>

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handlePhotoChange}
          className="hidden"
        />
      </div>

      {/* User Info */}
      <div className="flex flex-col relative">
        <span className="font-medium text-lg">{user.name}</span>
        <span className="text-sm">{user.email}</span>
      </div>

      <div className="absolute -bottom-5 w-[80%] left-[10%] border-b-2 border-gray-400"></div>
    </div>
  );
}

export default Profile;
