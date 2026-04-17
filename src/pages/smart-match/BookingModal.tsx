import { useState } from "react";
import { calendarDays, timeSlotsPerDate } from "@/mocks/mentors";

interface Mentor {
  name: string;
  role: string;
  company: string;
  photo: string;
}

interface BookingModalProps {
  mentor: Mentor;
  onClose: () => void;
  onConfirm: (date: string, time: string) => void;
}

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function BookingModal({ mentor, onClose, onConfirm }: BookingModalProps) {
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => {
    setConfirmed(true);
    localStorage.setItem("mentorAI_bookedMentor", JSON.stringify({
      name: mentor.name,
      role: mentor.role,
      company: mentor.company,
      photo: mentor.photo,
      date: `April ${selectedDate}, 2026`,
      time: selectedTime ?? "",
    }));
    setTimeout(() => {
      onConfirm(`April ${selectedDate}, 2026`, selectedTime ?? "");
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative rounded-t-3xl sm:rounded-2xl w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-up" style={{ backgroundColor: "var(--bg-surface)" }}>
        {confirmed ? (
          <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
            <div className="w-16 h-16 flex items-center justify-center rounded-full mb-4" style={{ backgroundColor: "var(--success-light)" }}>
              <i className="ri-check-line text-3xl" style={{ color: "var(--success)" }} />
            </div>
            <h3 className="text-2xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>Session Booked!</h3>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Your session with <strong style={{ color: "var(--text-primary)" }}>{mentor.name}</strong> on April {selectedDate} at {selectedTime} is confirmed.
            </p>
          </div>
        ) : (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <img src={mentor.photo} alt={mentor.name} className="w-10 h-10 rounded-full object-cover object-top" />
                <div>
                  <h3 className="font-bold" style={{ color: "var(--text-primary)" }}>Book with {mentor.name}</h3>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>{mentor.role} · {mentor.company}</p>
                </div>
              </div>
              <button type="button" onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full cursor-pointer" style={{ color: "var(--text-muted)" }}>
                <i className="ri-close-line" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Calendar */}
              <div>
                <p className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>Select a Date — April 2026</p>
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {weekDays.map((d) => (
                    <div key={d} className="text-center text-xs font-medium py-1" style={{ color: "var(--text-muted)" }}>{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {[1, 2, 3, 4, 5, 6].map((i) => <div key={`e${i}`} />)}
                  {calendarDays.map((day) => (
                    <button
                      key={day.date}
                      type="button"
                      disabled={!day.available}
                      onClick={() => { if (day.available) { setSelectedDate(day.date); setSelectedTime(null); } }}
                      className="aspect-square rounded-lg text-sm font-medium transition-all cursor-pointer"
                      style={
                        !day.available
                          ? { color: "var(--text-disabled)", cursor: "not-allowed" }
                          : selectedDate === day.date
                          ? { backgroundColor: "var(--accent)", color: "#fff" }
                          : { color: "var(--text-primary)" }
                      }
                    >
                      {day.date}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slots */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Select a Time</p>
                  <span className="flex items-center gap-1 text-xs font-medium" style={{ color: "var(--warning)" }}>
                    <i className="ri-time-line" />
                    Limited slots
                  </span>
                </div>

                {!selectedDate ? (
                  <div className="flex flex-col items-center justify-center h-40 text-center" style={{ color: "var(--text-muted)" }}>
                    <i className="ri-calendar-line text-3xl mb-2" style={{ color: "var(--border)" }} />
                    <p className="text-sm">Pick a date to see<br />available windows</p>
                  </div>
                ) : (timeSlotsPerDate[selectedDate] ?? []).length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-40 text-center" style={{ color: "var(--text-muted)" }}>
                    <i className="ri-close-circle-line text-3xl mb-2" style={{ color: "var(--border)" }} />
                    <p className="text-sm">No slots on this day.<br />Try another date.</p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      {(timeSlotsPerDate[selectedDate] ?? []).map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedTime(slot)}
                          className="py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap"
                          style={selectedTime === slot
                            ? { backgroundColor: "var(--accent)", color: "#fff" }
                            : { backgroundColor: "var(--bg-elevated)", color: "var(--text-secondary)" }
                          }
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                    <p className="mt-3 text-xs flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
                      <i className="ri-information-line" />
                      {(timeSlotsPerDate[selectedDate] ?? []).length} slot{(timeSlotsPerDate[selectedDate] ?? []).length > 1 ? "s" : ""} available — book early
                    </p>
                  </>
                )}
              </div>
            </div>

            <div className="mt-5 p-4 rounded-xl flex items-center gap-3 border" style={{ backgroundColor: "var(--accent-light)", borderColor: "var(--accent-light)" }}>
              <i className="ri-video-line text-lg" style={{ color: "var(--accent)" }} />
              <div>
                <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Video Session · 60 minutes</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>You'll receive a link via email before the session</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleConfirm}
              disabled={!selectedDate || !selectedTime}
              className="w-full mt-5 py-4 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 text-white font-bold text-sm hover:from-violet-700 hover:to-violet-600 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap"
            >
              Confirm Booking
              {selectedDate && selectedTime && ` — Apr ${selectedDate} at ${selectedTime}`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
