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
    setTimeout(() => {
      onConfirm(
        `April ${selectedDate}, 2026`,
        selectedTime ?? ""
      );
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
        {confirmed ? (
          <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-emerald-100 mb-4">
              <i className="ri-check-line text-emerald-600 text-3xl" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Session Booked!</h3>
            <p className="text-gray-500 text-sm">
              Your session with <strong>{mentor.name}</strong> on April {selectedDate} at {selectedTime} is confirmed.
            </p>
          </div>
        ) : (
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <img src={mentor.photo} alt={mentor.name} className="w-10 h-10 rounded-full object-cover object-top" />
                <div>
                  <h3 className="font-bold text-gray-900">Book with {mentor.name}</h3>
                  <p className="text-xs text-gray-500">{mentor.role} · {mentor.company}</p>
                </div>
              </div>
              <button type="button" onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 cursor-pointer">
                <i className="ri-close-line text-gray-500" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Calendar */}
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-3">Select a Date — April 2026</p>
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {weekDays.map((d) => (
                    <div key={d} className="text-center text-xs text-gray-400 font-medium py-1">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {/* Empty cells for offset */}
                  {[1, 2, 3, 4, 5, 6].map((i) => <div key={`e${i}`} />)}
                  {calendarDays.map((day) => (
                    <button
                      key={day.date}
                      type="button"
                      disabled={!day.available}
                      onClick={() => { if (day.available) { setSelectedDate(day.date); setSelectedTime(null); } }}
                      className={`aspect-square rounded-lg text-sm font-medium transition-all cursor-pointer ${
                        !day.available
                          ? "text-gray-300 cursor-not-allowed"
                          : selectedDate === day.date
                          ? "bg-violet-600 text-white"
                          : "hover:bg-violet-50 text-gray-700"
                      }`}
                    >
                      {day.date}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slots */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-gray-700">Select a Time</p>
                  <span className="flex items-center gap-1 text-xs text-amber-600 font-medium">
                    <i className="ri-time-line" />
                    Limited slots
                  </span>
                </div>

                {!selectedDate ? (
                  <div className="flex flex-col items-center justify-center h-40 text-center text-gray-400">
                    <i className="ri-calendar-line text-3xl mb-2 text-gray-300" />
                    <p className="text-sm">Pick a date to see<br />available windows</p>
                  </div>
                ) : (timeSlotsPerDate[selectedDate] ?? []).length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-40 text-center text-gray-400">
                    <i className="ri-close-circle-line text-3xl mb-2 text-gray-300" />
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
                          className={`py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
                            selectedTime === slot
                              ? "bg-violet-600 text-white"
                              : "bg-gray-50 text-gray-700 hover:bg-violet-50 hover:text-violet-700"
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                    <p className="mt-3 text-xs text-gray-400 flex items-center gap-1">
                      <i className="ri-information-line" />
                      {(timeSlotsPerDate[selectedDate] ?? []).length} slot{(timeSlotsPerDate[selectedDate] ?? []).length > 1 ? "s" : ""} available — book early
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Session type */}
            <div className="mt-5 p-4 rounded-xl bg-violet-50 flex items-center gap-3">
              <i className="ri-video-line text-violet-600 text-lg" />
              <div>
                <p className="text-sm font-semibold text-gray-900">Video Session · 60 minutes</p>
                <p className="text-xs text-gray-500">You'll receive a link via email before the session</p>
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
