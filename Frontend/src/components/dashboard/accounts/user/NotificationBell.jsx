import { Bell } from "lucide-react";
import useSafeNavigate from "../../../../utils/useSafeNavigate";

export default function NotificationBell() {
  const navigate = useSafeNavigate();
  const unreadCount = 1;

  return (
    <button
      onClick={() => navigate("/notifications")}
      className="relative p-2 rounded-full hover:bg-primary-light transition"
    >
      <Bell className="w-6 h-6 text-text-heading" />

      {unreadCount > 0 && (
        <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-nav-highlighted rounded-full animate-pulse" />
      )}
    </button>
  );
}
