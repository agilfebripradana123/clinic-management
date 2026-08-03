import api, { buildQuery, extractPageMeta } from "./api";

const fallbackSchedules = [
  {
    id: 1,
    doctor_id: 1,
    doctor_name: "dr. Budi Santoso",
    specialist: "Dokter Umum",
    day: "Monday",
    start_time: "08:00",
    end_time: "12:00",
    time: "08:00 - 12:00",
    is_active: true,
  },
];

const normalizeList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.records)) return payload.records;

  return fallbackSchedules;
};

const normalizeRecord = (payload) => {
  if (payload && typeof payload === "object" && !Array.isArray(payload)) {
    const startTime = payload.start_time
      ? payload.start_time.substring(0, 5)
      : "";

    const endTime = payload.end_time
      ? payload.end_time.substring(0, 5)
      : "";

    return {
      id: payload.id,

      doctor_id: payload.doctor_id,

      doctor_name: payload.doctor?.user?.name ?? "",

      specialist: payload.doctor?.specialist ?? "",

      day: payload.day,

      start_time: startTime,

      end_time: endTime,

      time:
        startTime && endTime
          ? `${startTime} - ${endTime}`
          : "",

      is_active: payload.is_active ?? true,
    };
  }

  return fallbackSchedules[0];
};

const mapSchedulePayload = (payload) => ({
  doctor_id: Number(payload.doctor_id),
  day: payload.day,
  start_time: payload.start_time,
  end_time: payload.end_time,
  is_active: payload.is_active,
});

export const getSchedules = async (params = {}) => {
  try {
    const response = await api.get(`/schedules${buildQuery(params)}`);
    const { list, total, lastPage } = extractPageMeta(response.data);

    return {
      data: normalizeList(list).map(normalizeRecord),
      total,
      lastPage,
    };
  } catch (error) {
    console.warn(
      "Schedules endpoint unavailable, using fallback.",
      error
    );

    return {
      data: fallbackSchedules,
      total: fallbackSchedules.length,
      lastPage: 1,
    };
  }
};

export const getSchedule = async (id) => {
  try {
    const response = await api.get(`/schedules/${id}`);

    return normalizeRecord(response.data);
  } catch (error) {
    console.warn(
      "Schedule detail unavailable, using fallback.",
      error
    );

    return (
      fallbackSchedules.find(
        (schedule) => schedule.id == id
      ) ?? fallbackSchedules[0]
    );
  }
};

export const createSchedule = async (payload) => {
  const response = await api.post(
    "/schedules",
    mapSchedulePayload(payload)
  );

  return response.data;
};

export const updateSchedule = async (id, payload) => {
  const response = await api.put(
    `/schedules/${id}`,
    mapSchedulePayload(payload)
  );

  return response.data;
};

export const deleteSchedule = async (id) => {
  const response = await api.delete(`/schedules/${id}`);

  return response.data;
};

export const getScheduleCount = async () => {
  try {
    const { total } = await getSchedules({ per_page: 1 });
    return total;
  } catch (error) {
    console.error(error);
    return 0;
  }
};