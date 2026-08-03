import api from "./api";

const normalizeProfile = (payload) => {
  const profile = payload?.data ?? payload;

  return {
    id: profile?.id ?? null,
    name: profile?.name ?? "",
    email: profile?.email ?? "",
    role: profile?.role ?? "admin",
    photo: profile?.photo ?? null,
    phone: profile?.phone ?? "",
    address: profile?.address ?? "",
    specialist: profile?.specialist ?? "",
    license_number: profile?.license_number ?? "",
    medical_record_number: profile?.medical_record_number ?? "",
    gender: profile?.gender ?? "",
    birth_date: profile?.birth_date ?? "",
    created_at: profile?.created_at ?? "",
  };
};

export const getProfile = async () => {
  const response = await api.get("/profile");
  return normalizeProfile(response.data);
};

export const updateProfile = async (payload) => {
  const response = await api.put("/profile", payload);
  return normalizeProfile(response.data);
};

export const uploadProfilePhoto = async (file) => {
  const formData = new FormData();
  formData.append("photo", file);

  const response = await api.post("/profile/photo", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return normalizeProfile(response.data);
};
