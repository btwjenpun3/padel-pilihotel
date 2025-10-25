import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import "dayjs/locale/id";
import isBetween from "dayjs/plugin/isBetween";
import axios from "axios";
import BookingMabar from "./BookingMabar";

dayjs.locale("id");
dayjs.extend(isBetween);

interface Pivot {
  slot: number;
}

interface Pemain {
  booked: string;
  status: string;
  pivot: Pivot;
}

interface JadwalItem {
  id: number;
  tanggal: string;
  jam: string;
  pemain: Pemain[];
}
interface HariAvailable {
  id: number;
  tanggal: string;
  jam: string;
}



const JadwalMabar = () => {
  const [data, setData] = React.useState<JadwalItem[]>([]);

  const [startDate, setStartDate] = React.useState<Date | null>(dayjs().toDate());
  const [endDate, setEndDate] = React.useState<Date | null>(dayjs().add(30, "day").toDate());
  const [loading, setLoading] = React.useState(false);
  const [hariAvailable, setHariAvailable] = React.useState<HariAvailable[]>([]);

  const fetchData = async () => {
      setLoading(true);
  
    try {

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/padel-mabar`);
   
      

      setData(response.data.data); // Ensure we access the correct field

    } catch (error) {
      console.error("Error fetching data:", error);
    }finally {
      setLoading(false);
    } 
  };

   const fetchHariAvailable = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/padel-mabar/check`
        );
  
        const raw = response.data.hari_available || {};
  
        const arr: HariAvailable[] = Object.values(raw);
  
    
        setHariAvailable(arr);
      } catch (error) {
        console.error("Error fetching available days:", error);
      }
    };

  const slot = {
    1: "Player 1",
    2: "Player 2",
    3: "Player 3",
    4: "Player 4",
    5: "Player 5",
    6: "Player 6",
    7: "Player 7",
    8: "Player 8",
   
  };

  const filterDataByDate = () => {
    if (!startDate || !endDate) return data;
    return data.filter((item) => {
      const itemDate = dayjs(item.tanggal, "YYYY-MM-DD").startOf("day");
      const start = dayjs(startDate).startOf("day");
      const end = dayjs(endDate).endOf("day");
      return itemDate.isBetween(start, end, null, "[]");
    });
  };

  const filteredData = filterDataByDate();



  React.useEffect(() => {
    fetchData();
    fetchHariAvailable();
  }, []);

  return (
    <div className="p-3 sm:p-4 md:p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      {/* <div>
        <h1>Jadwal Mabar</h1>
        {data.map((item) => (
          <div key={item.id}>
            <h2>{item.tanggal} - {item.jam}</h2>
            <ul>
              {item.pemain.map((pemain, index) => (
                <li key={index}>
                  Nama: {pemain.nama}, Status: {pemain.status}, Slot: {pemain.pivot.slot}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div> */}
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-5 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-8">
            <div className="flex-1 min-w-[220px]">
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center justify-center text-blue-500 text-2xl md:text-3xl">
                  <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                    <rect
                      x="3"
                      y="5"
                      width="18"
                      height="16"
                      rx="3"
                      fill="#e0e7ff"
                    />
                    <rect
                      x="7"
                      y="2"
                      width="2"
                      height="4"
                      rx="1"
                      fill="#6366f1"
                    />
                    <rect
                      x="15"
                      y="2"
                      width="2"
                      height="4"
                      rx="1"
                      fill="#6366f1"
                    />
                    <rect x="3" y="9" width="18" height="2" fill="#6366f1" />
                  </svg>
                </span>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  Jadwal Mabar Booking Kindy Padel
                </h1>
              </div>
              <div className="flex gap-4 items-center mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                    Kosong
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                    Reserved
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                    On Process
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row md:items-end gap-3 md:gap-4 w-full md:w-auto">
              <div className="flex flex-col md:flex-row gap-3 md:gap-4 w-full md:w-auto">
                {/* Start Date */}
                <div className="flex flex-col w-full md:w-44">
                  <label className="flex items-center gap-1 text-xs font-semibold text-gray-700 dark:text-gray-200 mb-1">
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                      <rect
                        x="3"
                        y="5"
                        width="18"
                        height="16"
                        rx="3"
                        fill="#e0e7ff"
                      />
                      <rect
                        x="7"
                        y="2"
                        width="2"
                        height="4"
                        rx="1"
                        fill="#6366f1"
                      />
                      <rect
                        x="15"
                        y="2"
                        width="2"
                        height="4"
                        rx="1"
                        fill="#6366f1"
                      />
                      <rect x="3" y="9" width="18" height="2" fill="#6366f1" />
                    </svg>
                    Tanggal Mulai
                  </label>
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    className="w-full border border-gray-300 rounded-md p-2"
                    dateFormat="yyyy-MM-dd"
                  />
                </div>
                {/* End Date */}
                <div className="flex flex-col w-full md:w-44">
                  <label className="flex items-center gap-1 text-xs font-semibold text-gray-700 dark:text-gray-200 mb-1">
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                      <rect
                        x="3"
                        y="5"
                        width="18"
                        height="16"
                        rx="3"
                        fill="#e0e7ff"
                      />
                      <rect
                        x="7"
                        y="2"
                        width="2"
                        height="4"
                        rx="1"
                        fill="#6366f1"
                      />
                      <rect
                        x="15"
                        y="2"
                        width="2"
                        height="4"
                        rx="1"
                        fill="#6366f1"
                      />
                      <rect x="3" y="9" width="18" height="2" fill="#6366f1" />
                    </svg>
                    Tanggal Selesai
                  </label>
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    className="w-full border border-gray-300 rounded-md p-2"
                    dateFormat="yyyy-MM-dd"
                  />
                </div>
              </div>
              <button
                onClick={() => {
                  fetchData();
                  fetchHariAvailable();
                }}
                disabled={loading}
                className="w-full md:w-auto px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm sm:text-base font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 disabled:cursor-not-allowed"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{loading ? "Loading..." : "Refresh Data"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Booking Table Placeholder */}
        <div className="shadow-xl rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto scroll-smooth">
            <table className="w-full min-w-0 sm:min-w-[800px] border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600">
                  <th className="bg-orange-500 text-white py-2 sm:py-3 px-2 sm:px-4 text-center sticky left-0 z-20 min-w-[90px] sm:min-w-[120px] border-r border-orange-400 shadow-[2px_0_5px_rgba(0,0,0,0.1)]">
                    <span className="text-xs sm:text-sm md:text-base font-semibold">
                      Player
                    </span>
                  </th>
                  {filteredData.map((item) => (
                    <th
                      key={item.id}
                      className="bg-blue-500 text-white py-2 sm:py-3 px-2 sm:px-3 border-r border-blue-400 min-w-[110px] sm:min-w-[140px]"
                    >
                      <div className="text-center space-y-0.5 sm:space-y-1">
                        <div className="font-bold text-[11px] sm:text-xs md:text-sm">
                          {dayjs(item.tanggal).format("dddd")}
                        </div>
                        <div className="text-[10px] sm:text-[11px] md:text-xs opacity-90">
                          {dayjs(item.tanggal).format("DD MMM YYYY")}
                        </div>
                        <div className="text-[10px] sm:text-[11px] md:text-xs opacity-90">
                          {item.jam}
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(slot).map(([slotKey, slotValue]) => (
                  <tr key={slotKey} className="bg-gray-50 dark:bg-gray-800">
                    <td className="bg-orange-100 dark:bg-orange-900 border-r border-orange-200 text-center font-semibold sticky left-0 z-10 py-2 sm:py-2.5 px-2 sm:px-3 text-[10px] sm:text-xs md:text-sm shadow-[2px_0_5px_rgba(0,0,0,0.05)]">
                      <span className="font-mono whitespace-nowrap">
                        {slotValue}
                      </span>
                    </td>
                    {filteredData.map((item) => {
                      const pemainInSlot = item.pemain.find(
                        (pemain) => pemain.pivot.slot.toString() === slotKey
                      );
                      return (
                        <td
                          key={`${item.id}-${slotKey}`}
                          className="border-r border-b border-gray-200 dark:border-gray-600 p-1 sm:p-1.5 md:p-2"
                        >
                          {(() => {
                            if (!pemainInSlot) {
                              return (
                                <div className="h-9 sm:h-10 md:h-12 flex items-center justify-center rounded-md text-[10px] sm:text-[11px] md:text-sm font-medium transition-all duration-200 shadow-sm bg-green-500 hover:bg-green-600 text-white">
                                  <span className="font-semibold px-1">KOSONG</span>
                                </div>
                              );
                            }
                            const bookedInt = parseInt(pemainInSlot.booked, 10);
                            if (pemainInSlot.status === "selesai") {
                              if (!isNaN(bookedInt)) {
                                return (
                                  <div className="h-9 sm:h-10 md:h-12 flex items-center justify-center rounded-md text-[10px] sm:text-[11px] md:text-sm font-medium transition-all duration-200 shadow-sm bg-green-500 hover:bg-green-600 text-white">
                                    <span className="font-semibold px-1">{`Rp${bookedInt.toLocaleString("id-ID")}`}</span>
                                  </div>
                                );
                              } else {
                                return (
                                  <div className="h-9 sm:h-10 md:h-12 flex items-center justify-center rounded-md text-[10px] sm:text-[11px] md:text-sm font-medium transition-all duration-200 shadow-sm bg-red-500 hover:bg-red-600 text-white">
                                    <span className="font-semibold px-1">{`RESERVED`}</span>
                                  </div>
                                );
                              }
                            } else if (pemainInSlot.status === "belum bayar") {
                              return (
                                <div className="h-9 sm:h-10 md:h-12 flex items-center justify-center rounded-md text-[10px] sm:text-[11px] md:text-sm font-medium transition-all duration-200 shadow-sm bg-yellow-500 hover:bg-yellow-600 text-white">
                                  <span className="font-semibold px-1"></span>
                                </div>
                              );
                            } else {
                              return (
                                <div className="h-9 sm:h-10 md:h-12 flex items-center justify-center rounded-md text-[10px] sm:text-[11px] md:text-sm font-medium transition-all duration-200 shadow-sm bg-green-500 hover:bg-green-600 text-white">
                                  <span className="font-semibold px-1">KOSONG</span>
                                </div>
                              );
                            }
                          })()}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="mt-4">
          <BookingMabar
          
          JadwalBooking={fetchData}
          HariAvailable={hariAvailable}
          />
        </div>
      </div>
    </div>
  );
};

export default JadwalMabar;
