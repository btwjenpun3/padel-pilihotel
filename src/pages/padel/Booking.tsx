import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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

const JadwalBooking = () => {

const [startDate, setStartDate] = useState<string>(dayjs().format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState<string>(dayjs().format("YYYY-MM-DD"));
  const [name, setName] = useState<string>("");
  const [timeSlot, setTimeSlot] = useState<string>("05:00 - 06:00");

  const timeOptions = [
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Mohon isi nama pemesan');
      return;
    }
    if (!startDate || !endDate) {
      alert('Mohon pilih tanggal mulai dan selesai');
      return;
    }
    const summary = `Nama: ${name}\nTanggal: ${startDate} - ${endDate}\nJam: ${timeSlot}`;
    console.log('Booking submitted:', { name, startDate, endDate, timeSlot });
    alert('Booking diterima:\n' + summary);
  };
  return (
    <>
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
          Form Booking Kindy Padel
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="form-control mb-4">
            <label className="block mb-2 text-gray-700 dark:text-gray-300">
              Nama Pemesan
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Masukkan nama lengkap"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block mb-2 text-gray-700 dark:text-gray-300">
                Tanggal Main
              </label>
              <DateInput
                value={startDate}
                onChange={(val) => setStartDate(val)}
                className=""
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-700 dark:text-gray-300">
                Tanggal Selesai
              </label>
              <DateInput
                value={endDate}
                onChange={(val) => setEndDate(val)}
                className=""
              />
            </div>
          </div>

          <div className="form-control mb-4">
            <label className="block mb-2 text-gray-700 dark:text-gray-300">
              Jam
            </label>
            <select
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
              className="block w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              {timeOptions.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          <div className="form-control mb-4">
            <label className="block mb-2 text-gray-700 dark:text-gray-300">
              Nama Rekening Pengirim
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Masukkan nama pengirim sesuai rekening"
            />
          </div>

          <div className="form-control mb-4">
            <label className="block mb-2 text-gray-700 dark:text-gray-300">
              Sudah Bayar atau Belum? 
            </label>
            <select className="block w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
              <option value="test">belum bayar</option>
              <option value="test">sudah bayar</option>
            </select>
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Book Now
          </button>
        </form>
      </div>
    </>
  );
};

export default JadwalBooking;
