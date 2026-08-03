import api from "./api";

const fallbackDoctors = [
  {
    id: 1,
    name: "dr. Rina Sari",
    email: "rina@example.com",
    specialist: "Dokter Umum",
    phone: "081234567890",
    address: "Yogyakarta",
    license_number: "SIP-001",
    is_active: true,
  },
  {
    id: 2,
    name: "dr. Budi Hartono",
    email: "budi@example.com",
    specialist: "Dokter Anak",
    phone: "081234567891",
    address: "Sleman",
    license_number: "SIP-002",
    is_active: true,
  },
];

const normalizeList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.records)) return payload.records;
  return fallbackDoctors;
};

const normalizeRecord = (payload) => {
  if (payload && typeof payload === "object" && !Array.isArray(payload)) {
    return {
      id: payload.id,

      name: payload.user?.name || payload.name || "",
      email: payload.user?.email || payload.email || "",

      specialty: payload.specialty || payload.specialist || "",

      phone: payload.phone || "",
      address: payload.address || "",

      license_number: payload.license_number || "",

      photo: payload.photo || null,

      is_active: payload.is_active ?? true,
    };
  }

  return fallbackDoctors[0];
};

const mapDoctorPayload = (payload) => ({
  name: payload.name,
  email: payload.email,

  ...(payload.password ? { password: payload.password } : {}),

  specialty: payload.specialty,

  phone: payload.phone,
  address: payload.address,

  license_number: payload.license_number,

  photo: payload.photo || null,

  is_active: payload.is_active,
});

export const getDoctors = async () => {
  try {
    const response = await api.get("/doctors");

    return normalizeList(response.data).map((doctor) =>
      normalizeRecord(doctor),
    );
  } catch (error) {
    console.warn("Doctors endpoint unavailable, using fallback.", error);

    return fallbackDoctors;
  }
};

export const getDoctor = async (id) => {
  try {
    const response = await api.get(`/doctors/${id}`);

    return normalizeRecord(response.data);
  } catch (error) {
    console.warn("Doctor detail unavailable, using fallback.", error);

    return (
      fallbackDoctors.find((doctor) => String(doctor.id) === String(id)) ||
      fallbackDoctors[0]
    );
  }
};

export const getDoctorCount = async () => {
  const doctors = await getDoctors();
  return doctors.length;
};

export const createDoctor = async (payload) => {
  try {
    const response = await api.post("/doctors", mapDoctorPayload(payload));

    return response.data;
  } catch (error) {
    if (error.response) throw error;

    console.warn("Create doctor fallback.", error);

    return {
      success: true,
      demo: true,
      payload: mapDoctorPayload(payload),
    };
  }
};

export const updateDoctor = async (id, payload) => {
  try {
    const response = await api.put(`/doctors/${id}`, mapDoctorPayload(payload));

    return response.data;
  } catch (error) {
    if (error.response) throw error;

    console.warn("Update doctor fallback.", error);

    return {
      success: true,
      demo: true,
      id,
      payload: mapDoctorPayload(payload),
    };
  }
};

export const deleteDoctor = async (id) => {
  try {
    const response = await api.delete(`/doctors/${id}`);
    return response.data;
  } catch (error) {
    if (error.response) throw error;

    console.warn("Delete doctor fallback.", error);

    return {
      success: true,
      demo: true,
      id,
    };
  }
};
