import api from "./api";

const endpoint = "/users";

const normalize = (payload = {}) => ({
  id: payload.id,
  name: payload.name ?? "",
  email: payload.email ?? "",
  role: payload.role ?? "",
  created_at: payload.created_at,
  updated_at: payload.updated_at,
});

export async function getUsers() {
  const { data } = await api.get(endpoint);

  const users = Array.isArray(data?.data) ? data.data : data;

  return users.map(normalize);
}

export async function getUser(id) {
  const { data } = await api.get(`${endpoint}/${id}`);

  return normalize(data.data ?? data);
}

export async function createUser(payload) {
  const { data } = await api.post(endpoint, payload);

  return normalize(data.data ?? data);
}

export async function updateUser(id, payload) {
  const { data } = await api.put(`${endpoint}/${id}`, payload);

  return normalize(data.data ?? data);
}

export async function deleteUser(id) {
  return api.delete(`${endpoint}/${id}`);
}
