// Booking constants + slot generation, ported verbatim from the Express bookings
// route. Shared by /api/bookings/availability and /api/bookings.

export const SERVICE_PRICES: Record<string, number> = {
  lesson: 45,
  coaching: 50,
  studio: 200,
};

export const SERVICE_DURATIONS: Record<string, number> = {
  lesson: 1,
  coaching: 1,
  studio: 8,
};

export function generateAvailableSlots(serviceType: string, month: string) {
  const [year, monthNum] = month.split("-").map(Number);
  const daysInMonth = new Date(year, monthNum, 0).getDate();
  const slots: Array<{ date: string; startTime: string; endTime: string; available: boolean }> = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, monthNum - 1, day);
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) continue;

    const dateStr = `${year}-${String(monthNum).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const times = serviceType === "studio" ? ["10:00"] : ["10:00", "14:00", "16:00"];

    for (const startTime of times) {
      const duration = SERVICE_DURATIONS[serviceType] ?? 1;
      const [h, m] = startTime.split(":").map(Number);
      const endHour = h + duration;
      const endTime = `${String(endHour).padStart(2, "0")}:${String(m).padStart(2, "0")}`;

      slots.push({ date: dateStr, startTime, endTime, available: true });
    }
  }

  return slots;
}
