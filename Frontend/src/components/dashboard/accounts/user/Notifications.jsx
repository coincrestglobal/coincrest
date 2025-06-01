import { useEffect, useState } from "react";
import { useUser } from "../../../common/UserContext";
import {
  getNotifications,
  markRead,
} from "../../../../services/operations/userDashboardApi";
import Loading from "../../../../pages/Loading";

export default function NotificationsPage() {
  const { user } = useUser();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const res = await getNotifications(user.token);
        if (res?.data) {
          setNotifications(res.data.notifications);
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user.token]);

  useEffect(() => {
    const markAllUnreadAsRead = async () => {
      if (!user.token || notifications.length === 0) return;

      const unreadNonAnnouncement = notifications.filter((n) => !n.isRead);

      setLoading(true);
      try {
        await Promise.all(
          unreadNonAnnouncement.map((n) => markRead(user.token, n._id))
        );
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    markAllUnreadAsRead();
  }, [user.token, notifications]);

  if (loading) return <Loading />;

  return (
    <div className="max-w-4xl mx-auto p-10">
      <h1 className="text-3xl font-bold mb-6 bg-primary-light p-2 rounded-md  text-white text-center">
        Notifications
      </h1>
      <ul className="space-y-4 h-[90vh] overflow-y-scroll scrollbar-hide">
        {notifications.map((notif, i) => (
          <li
            key={i}
            className="p-4 rounded-md border bg-gray-800 border-gray-700"
          >
            <p className="font-semibold text-text-heading">{notif.title}</p>
            <p className="text-text-subheading">{notif.message}</p>
            <p className="text-xs text-text-subheading">
              {new Date(notif.updatedAt).toLocaleString("en-US", {
                day: "2-digit",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
