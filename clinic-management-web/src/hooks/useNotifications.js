import { useCallback, useEffect, useRef, useState } from "react";
import {
  getNotifications,
  getUnreadCount,
  markAllRead,
  markRead,
} from "../services/notificationService";

export default function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef(null);

  const refreshUnread = useCallback(async () => {
    try {
      const count = await getUnreadCount();
      setUnreadCount(count);
    } catch {
      // abaikan error polling
    }
  }, []);

  const fetchList = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getNotifications({ per_page: 15 });
      setNotifications(data.data ?? []);
    } catch {
      // abaikan
    } finally {
      setLoading(false);
    }
  }, []);

  // Poll unread setiap 30 detik + saat mount
  useEffect(() => {
    refreshUnread();
    timerRef.current = setInterval(refreshUnread, 30000);
    return () => clearInterval(timerRef.current);
  }, [refreshUnread]);

  // Refresh saat tab kembali aktif (user switch tab lain, ada notif baru)
  useEffect(() => {
    const onVisibility = () => {
      if (!document.hidden) refreshUnread();
    };

    const onFocus = () => refreshUnread();

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("focus", onFocus);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("focus", onFocus);
    };
  }, [refreshUnread]);

  const handleRead = useCallback(
    async (notification) => {
      if (notification.is_read) return;
      await markRead(notification.id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, is_read: true } : n)),
      );
      refreshUnread();
    },
    [refreshUnread],
  );

  const handleReadAll = useCallback(async () => {
    await markAllRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);
  }, []);

  return {
    notifications,
    unreadCount,
    loading,
    fetchList,
    handleRead,
    handleReadAll,
    refreshUnread,
  };
}
