import api, { buildQuery, extractPageMeta } from "./api";
import { formatDate } from "../utils/format";
const fallbackRecords = [
  {
    id: 1,
    booking_id: 1,
    booking_code: "BK202608020001",
    patient_name: "Andi Pratama",
    doctor_name: "dr. Budi Hartono",
    complaint: "Demam sejak 3 hari",
    diagnosis: "Influenza",
    treatment: "Istirahat yang cukup",
    prescription: "Paracetamol",
    notes: "-",
  },
];

const normalizeList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.records)) return payload.records;
  return fallbackRecords;
};

const normalizeRecord = (payload) => {
  if (payload && typeof payload === "object" && !Array.isArray(payload)) {
    return {
      id: payload.id,

      booking_id: payload.booking_id,

      booking_code: payload.booking?.booking_code || "",

      patient_name: payload.booking?.patient?.user?.name || "",

      doctor_name: payload.booking?.doctor?.user?.name || "",

      booking_date: formatDate(payload.booking?.booking_date),

      complaint: payload.complaint || "",

      diagnosis: payload.diagnosis || "",

      treatment: payload.treatment || "",

      prescription: payload.prescription || "",

      notes: payload.notes || "",
    };
  }

  return fallbackRecords[0];
};

const mapPayload = (payload) => ({
  booking_id: payload.booking_id,
  complaint: payload.complaint,
  diagnosis: payload.diagnosis,
  treatment: payload.treatment,
  prescription: payload.prescription,
  notes: payload.notes,
});

export const getMedicalRecords = async (params = {}) => {
  try {
    const response = await api.get(`/medical-records${buildQuery(params)}`);
    const { list, total, lastPage } = extractPageMeta(response.data);

    return {
      data: normalizeList(list).map((item) => normalizeRecord(item)),
      total,
      lastPage,
    };
  } catch (error) {
    console.warn("Medical Records fallback", error);

    return {
      data: fallbackRecords,
      total: fallbackRecords.length,
      lastPage: 1,
    };
  }
};

export const getMedicalRecord = async (id) => {
  try {
    const response = await api.get(`/medical-records/${id}`);

    return normalizeRecord(response.data);
  } catch (error) {
    console.warn("Medical Record detail fallback", error);

    return (
      fallbackRecords.find((item) => String(item.id) === String(id)) ||
      fallbackRecords[0]
    );
  }
};

export const getMedicalRecordCount = async () => {
  const { total } = await getMedicalRecords({ per_page: 1 });
  return total;
};

export const createMedicalRecord = async (payload) => {
  try {
    const response = await api.post("/medical-records", mapPayload(payload));

    return response.data;
  } catch (error) {
    if (error.response) throw error;

    return {
      success: true,
      demo: true,
      payload,
    };
  }
};

export const updateMedicalRecord = async (id, payload) => {
  try {
    const response = await api.put(
      `/medical-records/${id}`,
      mapPayload(payload),
    );

    return response.data;
  } catch (error) {
    if (error.response) throw error;

    return {
      success: true,
      demo: true,
      id,
      payload,
    };
  }
};

export const deleteMedicalRecord = async (id) => {
  try {
    const response = await api.delete(`/medical-records/${id}`);

    return response.data;
  } catch (error) {
    if (error.response) throw error;

    return {
      success: true,
      demo: true,
      id,
    };
  }
};
