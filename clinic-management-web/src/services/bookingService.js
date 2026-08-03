import api from "./api";
import { formatDate } from "../utils/format";

const fallbackBookings = [];

const normalizeList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.records)) return payload.records;

  return fallbackBookings;
};

const normalizeRecord = (payload) => {
  if (!payload || typeof payload !== "object") return null;

  return {
    id: payload.id,

    doctor_id: payload.doctor_id,
    patient_id: payload.patient_id,
    schedule_id: payload.schedule_id,

    doctor_name: payload.doctor?.user?.name ?? "-",
    specialist: payload.doctor?.specialist ?? "-",

    patient_name: payload.patient?.user?.name ?? "-",

    booking_code: payload.booking_code ?? "",

    booking_date: payload.booking_date
      ? payload.booking_date.split("T")[0]
      : "",

    day: payload.schedule?.day ?? "",

    start_time: payload.schedule?.start_time
      ? payload.schedule.start_time.substring(0, 5)
      : "",

    end_time: payload.schedule?.end_time
      ? payload.schedule.end_time.substring(0, 5)
      : "",

    queue_number: payload.queue_number ?? "",

    status: payload.status ?? "pending",

    notes: payload.notes ?? "",
  };
};

const mapBookingPayload = (payload) => ({
  doctor_id: Number(payload.doctor_id),
  patient_id: Number(payload.patient_id),
  schedule_id: payload.schedule_id ? Number(payload.schedule_id) : null,

  booking_code: payload.booking_code,

  booking_date: payload.booking_date,

  queue_number: payload.queue_number,

  status: payload.status,

  notes: payload.notes,
});

export const getBookings = async () => {
  try {
    const response = await api.get("/bookings");

    return normalizeList(response.data).map(normalizeRecord);
  } catch (error) {
    console.warn("Booking endpoint unavailable.", error);

    return fallbackBookings;
  }
};

export const getBooking = async (id) => {
  const response = await api.get(`/bookings/${id}`);

  return normalizeRecord(response.data);
};

export const createBooking = async (payload) => {
  const response = await api.post("/bookings", mapBookingPayload(payload));

  return response.data;
};

export const updateBooking = async (id, payload) => {
  const response = await api.put(`/bookings/${id}`, mapBookingPayload(payload));

  return response.data;
};

export const deleteBooking = async (id) => {
  const response = await api.delete(`/bookings/${id}`);

  return response.data;
};

export const getBookingCount = async () => {
  try {
    const bookings = await getBookings();
    return bookings.length;
  } catch (error) {
    console.error(error);
    return 0;
  }
};
