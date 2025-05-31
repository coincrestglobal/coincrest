import { Bell } from "lucide-react";
import { useLocation } from "react-router-dom";
import useSafeNavigate from "../../../../utils/useSafeNavigate";
import { useState } from "react";
import { getUnreadValue } from "../../../../services/operations/userDashboardApi";
import { useUser } from "../../../common/UserContext";
import Loading from "../../../../pages/Loading";

export default function NotificationBell() {
  const { user } = useUser();
  const navigate = useSafeNavigate();
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(false);
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   const fetchUnreadCount = async () => {
  //     if (!user.token) return;

  //     setLoading(true);
  //     try {
  //       const res = await getUnreadValue(user.token);
  //       if (res?.data) {
  //         setUnreadCount(res.data.unreadCount);
  //       }
  //     } catch (error) {
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchUnreadCount();
  // }, [user.token]);

  if (loading) return <Loading />;

  const handleClick = () => {
    if (location.pathname === "/notifications") {
      navigate(-1);
    } else {
      navigate("/notifications");
    }
  };

  return (
    <button
      onClick={handleClick}
      className="relative p-2 rounded-full hover:bg-primary-light transition"
    >
      <Bell className="w-6 h-6 text-text-heading" />

      {unreadCount && (
        <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-nav-highlighted rounded-full animate-pulse" />
      )}
    </button>
  );
}
