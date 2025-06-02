import { CameraIcon, UserCircle } from "lucide-react";
import { useRef, useState } from "react";
import { useUser } from "../../common/UserContext";
import Avatar from "../../common/Avatar";
import { updateProfilePhoto } from "../../../services/operations/userDashboardApi";

function Profile() {
  const { user, setUser } = useUser();
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef();

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("profilePicture", file);

    try {
      setLoading(true);
      const response = await updateProfilePhoto(user.token, formData);
      const updatedProfile = response.data.profilePicUrl;
      setUser((prev) => ({
        ...prev,
        profilePicUrl: updatedProfile,
      }));
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-x-4 p-6 text-green-100 relative">
      <div className="relative inline-block cursor-pointer">
        {user ? (
          user.profilePicUrl ? (
            <Avatar size={80} imageURL={user.profilePicUrl} />
          ) : (
            <Avatar
              size={68}
              bgColor="bg-primary"
              textColor="text-text-heading"
              textSize="text-xl"
              fontWeight="font-semibold"
              fullName={`${user.firstName} ${user.lastName}`}
            />
          )
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
        <span className="font-medium text-lg">{user?.name}</span>
        <span className="text-sm">{user?.email}</span>
      </div>

      <div className="absolute -bottom-5 w-[80%] left-[10%] border-b-2 border-gray-400 mb-2"></div>
    </div>
  );
}

export default Profile;
