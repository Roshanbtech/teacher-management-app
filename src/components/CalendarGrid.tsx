import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Calendar, Clock, User } from "lucide-react";
import { TimeSlot, Schedule } from "../types";

interface CalendarGridProps {
  schedule?: Schedule;
  onSlotClick?: (slot: TimeSlot) => void;
  onSlotUpdate?: (slot: TimeSlot) => void;
  readonly?: boolean;
}

const generateTimeSlots = (): string[] => {
  const slots: string[] = [];
  for (let hour = 7; hour <= 20; hour++) {
    if (hour === 20 && slots.length > 0) break;
    slots.push(`${hour.toString().padStart(2, "0")}:00`);
    if (hour < 20) {
      slots.push(`${hour.toString().padStart(2, "0")}:30`);
    }
  }
  return slots;
};

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const DAYS_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DAYS_MOBILE = ["M", "T", "W", "T", "F", "S", "S"];
const TIME_SLOTS = generateTimeSlots();

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  schedule,
  onSlotClick,
  onSlotUpdate,
  readonly = false,
}) => {
  const [currentWeek, setCurrentWeek] = useState(() => {
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - today.getDay() + 1);
    return monday;
  });

  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [hoveredSlot, setHoveredSlot] = useState<string | null>(null);

  const weekDates = useMemo(() => {
    return DAYS.map((_, index) => {
      const date = new Date(currentWeek);
      date.setDate(currentWeek.getDate() + index);
      return date;
    });
  }, [currentWeek]);

  const goToPreviousWeek = () => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(currentWeek.getDate() - 7);
    setCurrentWeek(newWeek);
  };

  const goToNextWeek = () => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(currentWeek.getDate() + 7);
    setCurrentWeek(newWeek);
  };

  const goToToday = () => {
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - today.getDay() + 1);
    setCurrentWeek(monday);
  };

  const getSlotData = (dayIndex: number, timeSlot: string): TimeSlot | null => {
    return (
      schedule?.slots.find(
        (slot) => slot.day === dayIndex && slot.startTime === timeSlot
      ) || null
    );
  };

  const handleSlotClick = (dayIndex: number, timeSlot: string) => {
    if (readonly) return;

    const existingSlot = getSlotData(dayIndex, timeSlot);

    if (existingSlot) {
      setSelectedSlot(existingSlot);
      onSlotClick?.(existingSlot);
    } else {
      const newSlot: TimeSlot = {
        id: `${dayIndex}-${timeSlot}`,
        day: dayIndex,
        startTime: timeSlot,
        endTime: getEndTime(timeSlot),
        status: "available",
      };

      setSelectedSlot(newSlot);
      onSlotClick?.(newSlot);
    }
  };

  const getEndTime = (startTime: string): string => {
    const [hours, minutes] = startTime.split(":").map(Number);
    const endMinutes = minutes + 30;
    const endHours = hours + Math.floor(endMinutes / 60);
    return `${endHours.toString().padStart(2, "0")}:${(endMinutes % 60)
      .toString()
      .padStart(2, "0")}`;
  };

  const getSlotStyling = (
    slot: TimeSlot | null,
    dayIndex: number,
    timeSlot: string
  ) => {
    const slotId = `${dayIndex}-${timeSlot}`;
    const isHovered = hoveredSlot === slotId;
    const isSelected = selectedSlot?.id === slotId;

    let baseClasses =
      "h-8 sm:h-10 md:h-12 p-0.5 sm:p-1 md:p-2 text-xs border-r border-b border-gray-200 flex items-center justify-center transition-all duration-200 relative";

    if (isSelected) {
      baseClasses += " ring-1 ring-blue-500 ring-inset";
    }

    if (!slot) {
      return `${baseClasses} bg-white hover:bg-blue-50 ${
        readonly ? "" : "cursor-pointer"
      }`;
    }

    switch (slot.status) {
      case "booked":
        return `${baseClasses} bg-green-500 text-white ${
          readonly ? "" : "cursor-pointer"
        }`;
      case "unavailable":
        return `${baseClasses} bg-gray-300 text-gray-600 cursor-not-allowed`;
      case "available":
        return `${baseClasses} bg-green-100 text-green-800 ${
          readonly ? "" : "cursor-pointer hover:bg-green-200"
        }`;
      default:
        return `${baseClasses} bg-white hover:bg-blue-50 ${
          readonly ? "" : "cursor-pointer"
        }`;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
          <div className="flex items-center space-x-2">
            <Calendar size={16} className="text-blue-600 sm:w-5 sm:h-5" />
            <h2 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900">
              Schedule
            </h2>
          </div>

          <div className="flex items-center justify-between sm:justify-end space-x-2 sm:space-x-4">
            <button
              onClick={goToToday}
              className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            >
              Today
            </button>

            <div className="flex items-center space-x-1">
              <button
                onClick={goToPreviousWeek}
                className="p-1 sm:p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                aria-label="Previous week"
              >
                <ChevronLeft size={14} className="sm:w-4 sm:h-4" />
              </button>

              <span className="text-xs sm:text-sm font-medium text-gray-900 min-w-[80px] sm:min-w-[100px] md:min-w-[120px] text-center">
                {formatDate(weekDates[0])} - {formatDate(weekDates[6])}
              </span>

              <button
                onClick={goToNextWeek}
                className="p-1 sm:p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                aria-label="Next week"
              >
                <ChevronRight size={14} className="sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="overflow-x-auto overflow-y-auto max-h-[60vh] sm:max-h-[70vh]">
        <div className="min-w-[320px] sm:min-w-[480px] md:min-w-[600px] lg:min-w-[800px]">
          <div className="grid grid-cols-8 sticky top-0 bg-gray-50 border-b border-gray-200 z-10">
            {/* Time column header */}
            <div className="px-1 sm:px-2 md:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 flex items-center justify-center">
              <Clock size={10} className="sm:w-3 sm:h-3 md:w-4 md:h-4" />
            </div>

            {/* Day headers */}
            {DAYS_SHORT.map((day, index) => (
              <div
                key={day}
                className="px-1 sm:px-2 md:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 last:border-r-0"
              >
                <div className="flex flex-col items-center">
                  <span className="hidden sm:inline">{day}</span>
                  <span className="sm:hidden">{DAYS_MOBILE[index]}</span>
                  <span
                    className={`text-xs font-normal ${
                      isToday(weekDates[index])
                        ? "text-blue-600 font-semibold"
                        : "text-gray-600"
                    }`}
                  >
                    {weekDates[index].getDate()}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Time slots */}
          <div>
            {TIME_SLOTS.map((timeSlot) => (
              <div key={timeSlot} className="grid grid-cols-8">
                {/* Time label */}
                <div className="px-1 sm:px-2 md:px-4 py-1 sm:py-2 text-xs text-gray-500 border-r border-gray-200 bg-gray-50 font-mono flex items-center justify-center">
                  <span className="hidden sm:inline">{timeSlot}</span>
                  <span className="sm:hidden">{timeSlot.slice(0, 2)}</span>
                </div>

                {/* Day columns */}
                {DAYS.map((_, dayIndex) => {
                  const slotData = getSlotData(dayIndex, timeSlot);
                  const slotId = `${dayIndex}-${timeSlot}`;

                  return (
                    <div
                      key={dayIndex}
                      className={getSlotStyling(slotData, dayIndex, timeSlot)}
                      onClick={() => handleSlotClick(dayIndex, timeSlot)}
                      onMouseEnter={() => setHoveredSlot(slotId)}
                      onMouseLeave={() => setHoveredSlot(null)}
                      role="gridcell"
                      aria-label={`${DAYS[dayIndex]} ${timeSlot} ${
                        slotData?.status || "empty"
                      }`}
                      tabIndex={0}
                    >
                      {slotData && (
                        <div className="w-full text-center overflow-hidden">
                          {slotData.status === "booked" && (
                            <div className="space-y-0.5">
                              {slotData.studentName && (
                                <div className="flex items-center justify-center space-x-0.5 sm:space-x-1">
                                  <User
                                    size={8}
                                    className="sm:w-2 sm:h-2 md:w-3 md:h-3 flex-shrink-0"
                                  />
                                  <span className="truncate text-xs sm:text-xs">
                                    {slotData.studentName.slice(0, 8)}
                                  </span>
                                </div>
                              )}
                              {slotData.subject && (
                                <div className="text-xs opacity-90 truncate hidden sm:block">
                                  {slotData.subject.slice(0, 6)}
                                </div>
                              )}
                            </div>
                          )}
                          {slotData.status === "available" && (
                            <div className="text-green-700 text-xs font-medium">
                              <span className="hidden sm:inline">
                                Available
                              </span>
                              <span className="sm:hidden">✓</span>
                            </div>
                          )}
                          {slotData.status === "unavailable" && (
                            <div className="text-gray-600 text-xs">
                              <span className="hidden sm:inline">
                                Unavailable
                              </span>
                              <span className="sm:hidden">✗</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-gray-50 px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 border-t border-gray-200">
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 md:gap-6">
          <div className="flex items-center space-x-1 sm:space-x-2">
            <span className="w-3 h-3 sm:w-4 sm:h-4 rounded bg-green-500 inline-block border border-gray-300"></span>
            <span className="text-xs sm:text-sm text-gray-700">Booked</span>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2">
            <span className="w-3 h-3 sm:w-4 sm:h-4 rounded bg-green-100 inline-block border border-gray-300"></span>
            <span className="text-xs sm:text-sm text-gray-700">Available</span>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2">
            <span className="w-3 h-3 sm:w-4 sm:h-4 rounded bg-gray-300 inline-block border border-gray-300"></span>
            <span className="text-xs sm:text-sm text-gray-700">
              Unavailable
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
