import axios from "axios";

// Susun query string dari params, abaikan nilai kosong/null/undefined.
export const buildQuery = (params = {}) => {
  const qs = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
    )
    .join("&");

  return qs ? `?${qs}` : "";
};

// Normalisasi respons list:
// - paginate() Laravel → total/last_page di level atas
// - Resource collection → { meta: { total, last_page } }
// Mengembalikan { list, total, lastPage }.
export const extractPageMeta = (body = {}) => {
  const meta = body.meta ?? body;
  const list = Array.isArray(body.data) ? body.data : body;

  return {
    list,
    total: meta?.total ?? list.length,
    lastPage: meta?.last_page ?? 1,
  };
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Jika token tidak valid / expired
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      window.location.href = "/";
    }

    return Promise.reject(error);
  },
);

export default api;
