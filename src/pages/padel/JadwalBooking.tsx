import React, { useState, useMemo, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import dayjs from "dayjs";
import "dayjs/locale/id";

dayjs.locale("id");

interface DateInputProps {
  value: string;
  onChange: (dateStr: string) => void;
  className?: string;
}

const DateInput: React.FC<DateInputProps> = ({ value, onChange, className = "" }) => {
  // value is string (YYYY-MM-DD), react-datepicker expects Date
  const dateValue = value ? new Date(value) : null;
  return (
    <div className="relative w-full mb-3 sm:mb-0">
      <DatePicker
        selected={dateValue}
        onChange={(date: Date | null) => {
          if (date) {
            onChange(dayjs(date).format("YYYY-MM-DD"));
          }
        }}
        dateFormat="yyyy-MM-dd"
        className={`block w-full px-4 py-3 text-base rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500 cursor-pointer ${className}`}
        calendarClassName="!z-50"
        popperClassName="datepicker-popper-z"
        popperPlacement="top"
        showPopperArrow={false}
        autoComplete="off"
      />
    </div>
  );
};

const Booking = () => {
  const [startDate, setStartDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState(
    dayjs().add(6, "day").format("YYYY-MM-DD")
  );
  const [bookings, setBookings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update the convertApiResponse function to use the 'status' key
  const convertApiResponse = (apiData: any) => {
    const converted: Record<string, string> = {};
    if (apiData.booked_slots) {
      Object.values(apiData.booked_slots).forEach((slot: any) => {
        const startHour = String(slot.hour).padStart(2, "0");
        const endHour = String(slot.hour + 1).padStart(2, "0");
        const timeRange = `${startHour}:00 - ${endHour}:00`;
        const key = `${slot.date}_${timeRange}`;
        converted[key] = slot.status; // Use the 'status' key directly
      });
    }
    return converted;
  };

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        "http://pilihotel-booking.test/api/padel"
      );
      const convertedData = convertApiResponse(response.data);
      console.log("Fetched bookings:", convertedData);
      setBookings(convertedData);
    } catch (err) {
      setError("Gagal memuat data booking");
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const dates = useMemo(() => {
    const start = dayjs(startDate);
    const end = dayjs(endDate);
    const totalDays = end.diff(start, "day") + 1;
    return Array.from({ length: totalDays }, (_, index) =>
      start.add(index, "day")
    );
  }, [startDate, endDate]);

  const times = [
    "05:00 - 06:00",
    "06:00 - 07:00",
    "07:00 - 08:00",
    "08:00 - 09:00",
    "09:00 - 10:00",
    "10:00 - 11:00",
    "11:00 - 12:00",
    "12:00 - 13:00",
    "13:00 - 14:00",
    "14:00 - 15:00",
    "15:00 - 16:00",
    "16:00 - 17:00",
    "17:00 - 18:00",
    "18:00 - 19:00",
    "19:00 - 20:00",
    "20:00 - 21:00",
    "21:00 - 22:00",
    "22:00 - 23:00",
    "23:00 - 24:00",
    "00:00 - 01:00",
    "01:00 - 02:00",
    "02:00 - 03:00",
    "03:00 - 04:00",
    "04:00 - 05:00",
  ];

  const getBookingKey = (date: any, time: string) =>
    `${date.format("YYYY-MM-DD")}_${time}`;
  // Update the getBookingStatus function to return the status directly
  const getBookingStatus = (date: any, time: string) => bookings[getBookingKey(date, time)];

  return (
    <div className="p-3 sm:p-4 md:p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header & Filter Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-5 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-8">
            {/* Left: Judul, deskripsi, legend */}
            <div className="flex-1 min-w-[220px]">
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center justify-center text-blue-500 text-2xl md:text-3xl">
                  <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="3" fill="#e0e7ff"/><rect x="7" y="2" width="2" height="4" rx="1" fill="#6366f1"/><rect x="15" y="2" width="2" height="4" rx="1" fill="#6366f1"/><rect x="3" y="9" width="18" height="2" fill="#6366f1"/><rect x="7" y="13" width="2" height="2" rx="1" fill="#6366f1"/><rect x="11" y="13" width="2" height="2" rx="1" fill="#6366f1"/><rect x="15" y="13" width="2" height="2" rx="1" fill="#6366f1"/></svg>
                </span>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Jadwal Booking Kindy Padel</h1>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-300 mb-3"></div>
              <div className="flex gap-4 items-center mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Kosong</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Reserved</span>
                </div>
              </div>
            </div>
            {/* Right: Filter tanggal & tombol */}
            <div className="flex flex-col md:flex-row md:items-end gap-3 md:gap-4 w-full md:w-auto">
              <div className="flex flex-col md:flex-row gap-3 md:gap-4 w-full md:w-auto">
                {/* Start Date */}
                <div className="flex flex-col w-full md:w-44">
                  <label className="flex items-center gap-1 text-xs font-semibold text-gray-700 dark:text-gray-200 mb-1">
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="3" fill="#e0e7ff"/><rect x="7" y="2" width="2" height="4" rx="1" fill="#6366f1"/><rect x="15" y="2" width="2" height="4" rx="1" fill="#6366f1"/><rect x="3" y="9" width="18" height="2" fill="#6366f1"/></svg>
                    Tanggal Mulai
                  </label>
                  <DateInput value={startDate} onChange={setStartDate} />
                </div>
                {/* End Date */}
                <div className="flex flex-col w-full md:w-auto">
                  <label className="flex items-center gap-1 text-xs font-semibold text-gray-700 dark:text-gray-200 mb-1">
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="3" fill="#e0e7ff"/><rect x="7" y="2" width="2" height="4" rx="1" fill="#6366f1"/><rect x="15" y="2" width="2" height="4" rx="1" fill="#6366f1"/><rect x="3" y="9" width="18" height="2" fill="#6366f1"/></svg>
                    Tanggal Selesai
                  </label>
                  <DateInput value={endDate} onChange={setEndDate} />
                </div>
              </div>
              <button
                onClick={fetchBookings}
                disabled={loading}
                className="w-full md:w-auto px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm sm:text-base font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                <span>{loading ? 'Loading...' : 'Refresh Data'}</span>
              </button>
            </div>
          </div>
        </div>


        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 sm:p-4">
            <div className="flex items-start gap-2">
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-xs sm:text-sm text-red-800 dark:text-red-200">
                {error}
              </span>
            </div>
          </div>
        )}

        {/* Booking Table */}
        <div className="shadow-xl rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto scroll-smooth">
            <table className="w-full min-w-[800px] border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600">
                  <th className="bg-orange-500 text-white py-2 sm:py-3 px-2 sm:px-4 text-center sticky left-0 z-20 min-w-[90px] sm:min-w-[120px] border-r border-orange-400 shadow-[2px_0_5px_rgba(0,0,0,0.1)]">
                    <span className="text-xs sm:text-sm md:text-base font-semibold">
                      Jam
                    </span>
                  </th>
                  {dates.map((date) => (
                    <th
                      key={date.format("YYYY-MM-DD")}
                      className="bg-blue-500 text-white py-2 sm:py-3 px-2 sm:px-3 border-r border-blue-400 min-w-[110px] sm:min-w-[140px]"
                    >
                      <div className="text-center space-y-0.5 sm:space-y-1">
                        <div className="font-bold text-[11px] sm:text-xs md:text-sm">
                          {date.format("dddd")}
                        </div>
                        <div className="text-[10px] sm:text-[11px] md:text-xs opacity-90">
                          {date.format("DD MMM YYYY")}
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {times.map((time, index) => (
                  <tr
                    key={time}
                    className={
                      index % 2 === 0
                        ? "bg-gray-50 dark:bg-gray-800"
                        : "bg-white dark:bg-gray-750"
                    }
                  >
                    <td className="bg-orange-100 dark:bg-orange-900 border-r border-orange-200 text-center font-semibold sticky left-0 z-10 py-2 sm:py-2.5 px-2 sm:px-3 text-[10px] sm:text-xs md:text-sm shadow-[2px_0_5px_rgba(0,0,0,0.05)]">
                      <span className="font-mono whitespace-nowrap">
                        {time}
                      </span>
                    </td>
                    {dates.map((date) => {
                      // Update the logic to handle 'selesai' and 'belum bayar' statuses
                      const bookingStatus = getBookingStatus(date, time);
                      const isSelesai = bookingStatus === "selesai";
                      const isBelumBayar = bookingStatus === "belum bayar";

                      return (
                        <td
                          key={date.format("YYYY-MM-DD") + time}
                          className="border-r border-b border-gray-200 dark:border-gray-600 p-1 sm:p-1.5 md:p-2"
                        >
                          <div
                            className={`h-9 sm:h-10 md:h-12 flex items-center justify-center rounded-md text-[10px] sm:text-[11px] md:text-sm font-medium transition-all duration-200 shadow-sm ${
                              isSelesai
                                ? "bg-red-500 hover:bg-red-600 text-white"
                                : isBelumBayar
                                ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                                : "bg-green-500 hover:bg-green-600 text-white"
                            }`}
                          >
                            <span className="font-semibold px-1">
                              {isSelesai ? "RESERVED" : isBelumBayar ? "PENDING" : "KOSONG"}
                            </span>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
