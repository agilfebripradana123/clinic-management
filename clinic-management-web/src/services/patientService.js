import api, { buildQuery, extractPageMeta } from "./api";

const fallbackPatients = [
  {
    id: 1,
    name: "Andi Pratama",
    age: "32 Tahun",
    condition: "Pemeriksaan rutin",
  },
  { id: 2, name: "Sinta Dewi", age: "27 Tahun", condition: "Flu ringan" },
  {
    id: 3,
    name: "Riko Saputra",
    age: "41 Tahun",
    condition: "Kontrol tekanan darah",
  },
];

const normalizeList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.records)) return payload.records;
  return fallbackPatients;
};

const normalizeRecord = (payload) => {
  if (payload && typeof payload === "object" && !Array.isArray(payload)) {
    return {
      id: payload.id,

      name: payload.user?.name || "",

      email: payload.user?.email || "",

      phone: payload.phone || "",

      address: payload.address || "",

      gender: payload.gender || "L",

      birth_date: payload.birth_date ? payload.birth_date.split("T")[0] : "",

      medical_record_number: payload.medical_record_number || "",

      is_active: payload.is_active ?? true,
    };
  }

  return fallbackPatients[0];
};
const mapPatientPayload = (payload) => {
  return {
    name: payload.name,

    email: payload.email,

    password: payload.password,

    medical_record_number: payload.medical_record_number,

    gender: payload.gender,

    birth_date: payload.birth_date,

    phone: payload.phone,

    address: payload.address,

    is_active: payload.is_active,
  };
};
export const getPatients = async (params = {}) => {
  try {
    const response = await api.get(`/patients${buildQuery(params)}`);
    const { list, total, lastPage } = extractPageMeta(response.data);

    return {
      data: normalizeList(list).map(normalizeRecord),
      total,
      lastPage,
    };
  } catch (error) {
    console.warn("Patients endpoint unavailable, using fallback data.", error);
    return {
      data: fallbackPatients,
      total: fallbackPatients.length,
      lastPage: 1,
    };
  }
};

export const getPatient = async (id) => {
  try {
    const response = await api.get(`/patients/${id}`);
    return normalizeRecord(response.data);
  } catch (error) {
    console.warn(
      "Patient detail endpoint unavailable, using fallback data.",
      error,
    );
    return (
      fallbackPatients.find((patient) => String(patient.id) === String(id)) ||
      fallbackPatients[0]
    );
  }
};

export const getPatientCount = async () => {
  try {
    const { total } = await getPatients({ per_page: 1 });
    return total;
  } catch (error) {
    console.warn("Patients count unavailable, using fallback.", error);
    return fallbackPatients.length;
  }
};

export const createPatient = async (payload) => {
  try {
    const response = await api.post("/patients", mapPatientPayload(payload));
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error;
    }

    console.warn(
      "Patients create endpoint unavailable, using demo fallback.",
      error,
    );
    return { success: true, demo: true, payload: mapPatientPayload(payload) };
  }
};

export const updatePatient = async (id, payload) => {
  try {
    const response = await api.put(
      `/patients/${id}`,
      mapPatientPayload(payload),
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error;
    }

    console.warn(
      "Patients update endpoint unavailable, using demo fallback.",
      error,
    );
    return {
      success: true,
      demo: true,
      id,
      payload: mapPatientPayload(payload),
    };
  }
};

export const deletePatient = async (id) => {
  try {
    const response = await api.delete(`/patients/${id}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error;
    }

    console.warn(
      "Patients delete endpoint unavailable, using demo fallback.",
      error,
    );
    return { success: true, demo: true, id };
  }
};
