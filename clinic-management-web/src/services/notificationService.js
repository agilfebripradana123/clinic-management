import api from "./api";

export const getNotifications = async (params = {}) => {
  const { data } = await api.get("/notifications", { params });
  return data;
};

export const getUnreadCount = async () => {
  const { data } = await api.get("/notifications/unread-count");
  return data.unread_count;
};

export const markAllRead = async () => {
  const { data } = await api.post("/notifications/read-all");
  return data;
};

export const markRead = async (id) => {
  const { data } = await api.post(`/notifications/${id}/read`);
  return data;
};
