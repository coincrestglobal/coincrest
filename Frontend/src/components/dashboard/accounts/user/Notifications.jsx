import { useEffect, useState } from "react";
import { useUser } from "../../../common/UserContext";
import {
  getNotifications,
  markRead,
} from "../../../../services/operations/userDashboardApi";
import Loading from "../../../../pages/Loading";

export default function NotificationsPage() {
  const { user } = useUser();
  const initialNotifications = [
    {
      id: 1,
      title: "Wallet Connected",
      message: "Your BEP-20 wallet has been successfully connected.",
      date: "2025-05-28T14:30:00",
      read: true,
    },
    {
      id: 2,
      title: "Bonus Received",
      message: "You received a $20 bonus for referring a new user.",
      date: "2025-05-27T18:45:00",
      read: true,
    },
    {
      id: 3,
      title: "Action Required",
      message:
        "Please verify your email address to continue using your account.",
      date: "2025-05-26T09:15:00",
      read: false,
    },
    {
      id: 4,
      title: "Transaction Failed",
      message: "Your recent deposit attempt failed due to an invalid address.",
      date: "2025-05-25T21:00:00",
      read: false,
    },
    {
      id: 2,
      title: "Bonus Received",
      message: "You received a $20 bonus for referring a new user.",
      date: "2025-05-27T18:45:00",
      read: true,
    },
    {
      id: 3,
      title: "Action Required",
      message:
        "Please verify your email address to continue using your account.",
      date: "2025-05-26T09:15:00",
      read: false,
    },
    {
      id: 4,
      title: "Transaction Failed",
      message: "Your recent deposit attempt failed due to an invalid address.",
      date: "2025-05-25T21:00:00",
      read: false,
    },
    {
      id: 2,
      title: "Bonus Received",
      message: "You received a $20 bonus for referring a new user.",
      date: "2025-05-27T18:45:00",
      read: true,
    },
    {
      id: 3,
      title: "Action Required",
      message:
        "Please verify your email address to continue using your account.",
      date: "2025-05-26T09:15:00",
      read: false,
    },
    {
      id: 4,
      title: "Transaction Failed",
      message: "Your recent deposit attempt failed due to an invalid address.",
      date: "2025-05-25T21:00:00",
      read: false,
    },
  ];

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const res = await getNotifications(user.token);
        console.log(res);
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
          unreadNotifications.map((n) => markRead(user.token, n.id))
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
              {new Date(notif.date).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
