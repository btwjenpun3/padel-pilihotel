import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import "dayjs/locale/id";
import axios from "axios";
import Swal from "sweetalert2";

import { GiTennisCourt } from "react-icons/gi";
import { IoWarning } from "react-icons/io5";

dayjs.locale("id");
const timeOptions: Record<number, string> = {
  5: "05:00 - 06:00",
  6: "06:00 - 07:00",
  7: "07:00 - 08:00",
  8: "08:00 - 09:00",
  9: "09:00 - 10:00",
  10: "10:00 - 11:00",
  11: "11:00 - 12:00",
  12: "12:00 - 13:00",
  13: "13:00 - 14:00",
  14: "14:00 - 15:00",
  15: "15:00 - 16:00",
  16: "16:00 - 17:00",
  17: "17:00 - 18:00",
  18: "18:00 - 19:00",
  19: "19:00 - 20:00",
  20: "20:00 - 21:00",
  21: "21:00 - 22:00",
  22: "22:00 - 23:00",
  23: "23:00 - 24:00",
  24: "00:00 - 01:00",
  1: "01:00 - 02:00",
  2: "02:00 - 03:00",
  3: "03:00 - 04:00",
  4: "04:00 - 05:00",
};

const Booking = ({fetchBookings}: {fetchBookings: () => void}) => {

  const [startDate, setStartDate] = useState<string>(dayjs().format("YYYY-MM-DD"));
  const [timeSlot, setTimeSlot] = useState<number>(5);
  const [booked, setBooked] = useState<string>("");
  const [nama_rekening, setNama_Rekening] = useState<string>("");

  const [errors, setErrors] = useState<{ booked?: string; startDate?: string; timeSlot?: string; nama_rekening?: string; statusBayar?: string }>({});

  // Removed unused state setter
  const [availableSlots] = useState<Record<number, string>>(timeOptions);

  // Add SweetAlert confirmation before submitting
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: any = {};

    if (!booked.trim()) newErrors.booked = "Nama pemesan tidak boleh kosong";
    if (!startDate) newErrors.startDate = "Tanggal main tidak boleh kosong";
    if (!timeSlot) newErrors.timeSlot = "Jam tidak boleh kosong";
    if (!nama_rekening.trim()) newErrors.nama_rekening = "Nama rekening pengirim tidak boleh kosong";


    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    const confirmation = await Swal.fire({
      title: "Konfirmasi Booking",
      text: `Apakah Anda yakin ingin memesan untuk tanggal ${startDate} dan jam ${timeOptions[timeSlot]}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Pesan",
      cancelButtonText: "Batal",
    });

    if (!confirmation.isConfirmed) {
      return;
    }

  try {
    const response = await axios.post(
      "https://pilihotel.com/api/padel",
      {
        booked: booked,
        start_date: startDate,
        time_slot: timeSlot,
        nama_rekening,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    console.log("Booking response:", response.data);
    Swal.fire({
      icon: "success",
      title: "Booking berhasil!",
      text: "Slot waktu Anda telah berhasil dibooking.",
    });

    // Refresh data booking
    fetchBookings();

    // ✅ Reset semua input setelah sukses
    setBooked("");
    setStartDate(dayjs().format("YYYY-MM-DD"));
    setTimeSlot(5);
    setNama_Rekening("");

  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 409) {
      Swal.fire({
        icon: "error",
        title: "Slot sudah dibooking!",
        text: "Maaf, slot waktu ini sudah dibooking. Silakan pilih slot lain.",
      });

      newErrors.timeSlot = "Slot waktu sudah dibooking Pilih Waktu Lain";
      setErrors(newErrors);
      return;
    }

    Swal.fire({
      icon: "error",
      title: "Terjadi kesalahan!",
      text: `Terjadi kesalahan saat submit booking: ${error}`,
    });
  }





  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl inline-flex gap-2  font-semibold mb-4 text-gray-800 dark:text-white">
        Form Booking Kindy Padel{" "}
        <span className="inline-flex items-center justify-center w-6 h-6 text-gray-700 dark:text-gray-400">
          <GiTennisCourt />
        </span>
      </h2>

      <div className="p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 rounded-lg mb-6">
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
          Informasi Penting{" "}
          <span>
            <IoWarning />
          </span>
        </h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            Apabila sudah melakukan payment maka tidak bisa melakukan
            cancel/refund.
          </li>
          <li>
            Untuk jadwal yang sudah di reservasi tidak bisa di reschedule.
          </li>
          <li>
            Jika turun hujan sebelum sesi dimulai, maka jadwal bisa di
            reschedule.
          </li>
          <li>
            Jika sesi sudah berjalan lebih dari 30 menit & terjadi hujan, fee
            tidak di refund dan tidak bisa di reschedule.
          </li>
          <li>
            Segala kerusakan properti di Kindy Padel akan menjadi tanggung jawab
            pemain.
          </li>
          <li>Jika sudah booking harap segera melakukan pembayaran maksimal 15 menit.</li>
        </ul>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Nama Pemesan */}
        <div className="mb-4">
          <label className="block mb-2 text-gray-700 dark:text-gray-300">
            Nama Pemesan
          </label>
          <input
            value={booked}
            type="text"
            placeholder="Masukan Nama Pemesan"
            onChange={(e) => {
              setBooked(e.target.value);
              if (errors.booked && e.target.value.trim()) {
                setErrors((prev) => ({ ...prev, booked: undefined }));
              }
            }}
            className={`block w-full px-3 py-2 rounded-md dark:bg-gray-700 dark:text-gray-100 border ${
              errors.booked
                ? "border-red-500  dark:bg-red-900/20"
                : "border-gray-300"
            }`}
          />
          {errors.booked && (
            <p className="text-sm text-red-500 mt-1">{errors.booked}</p>
          )}
        </div>

        {/* Tanggal */}
        <div className="mb-4">
          <label className="block mb-2 text-gray-700 dark:text-gray-300">
            Tanggal Main
          </label>
          <DatePicker
            selected={new Date(startDate)}
            onChange={(date: Date | null) => {
              if (date) {
                setStartDate(dayjs(date).format("YYYY-MM-DD"));
                if (errors.startDate) {
                  setErrors((prev) => ({ ...prev, startDate: undefined }));
                }
              }
            }}
            dateFormat="yyyy-MM-dd"
            className={`block w-full px-3 py-2 rounded-md dark:bg-gray-700 dark:text-gray-100 border ${
              errors.startDate
                ? "border-red-500  dark:bg-red-900/20"
                : "border-gray-300"
            }`}
          />
          {errors.startDate && (
            <p className="text-sm text-red-500 mt-1">{errors.startDate}</p>
          )}
        </div>

        {/* Jam */}
        <div className="mb-4">
          <label className="block mb-2 text-gray-700 dark:text-gray-300">
            Jam
          </label>
          <select
            value={timeSlot}
            onChange={(e) => {
              setTimeSlot(Number(e.target.value));
              if (errors.timeSlot && e.target.value) {
                setErrors((prev) => ({ ...prev, timeSlot: undefined }));
              }
            }}
            className={`block w-full px-3 py-2 rounded-md dark:bg-gray-700 dark:text-gray-100 border ${
              errors.timeSlot
                ? "border-red-500  dark:bg-red-900/20"
                : "border-gray-300"
            }`}
          >
            {Object.entries(availableSlots).map(([key, label]) => (
              <option key={key} value={Number(key)}>
                {label}
              </option>
            ))}
          </select>
          {errors.timeSlot && (
            <p className="text-sm text-red-500 mt-1">{errors.timeSlot}</p>
          )}
        </div>

        {/* Nama Rekening */}
        <div className="mb-4">
          <label className="block mb-2 text-gray-700 dark:text-gray-300">
            Nama Rekening Pengirim
          </label>
          <input
            type="text"
            value={nama_rekening}
            placeholder="Pastikan Nama Pengirim Patikan Sesuai"
            onChange={(e) => {
              setNama_Rekening(e.target.value);
              if (errors.nama_rekening && e.target.value.trim()) {
                setErrors((prev) => ({ ...prev, nama_rekening: undefined }));
              }
            }}
            className={`block w-full px-3 py-2 rounded-md dark:bg-gray-700 dark:text-gray-100 border ${
              errors.nama_rekening
                ? "border-red-500  dark:bg-red-900/20"
                : "border-gray-300"
            }`}
          />
          {errors.nama_rekening && (
            <p className="text-sm text-red-500 mt-1">{errors.nama_rekening}</p>
          )}
        </div>



        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Book Now
        </button>
      </form>
    </div>
  );
};

export default Booking;
