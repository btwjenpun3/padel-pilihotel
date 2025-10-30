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
const timeOptions: Record<string, string> = {
  "5": "05:00 - 06:00",
  "6": "06:00 - 07:00",
  "7": "07:00 - 08:00",
  "8": "08:00 - 09:00",
  "9": "09:00 - 10:00",
  "10": "10:00 - 11:00",
  "11": "11:00 - 12:00",
  "12": "12:00 - 13:00",
  "13": "13:00 - 14:00",
  "14": "14:00 - 15:00",
  "15": "15:00 - 16:00",
  "16": "16:00 - 17:00",
  "17": "17:00 - 18:00",
  "18": "18:00 - 19:00",
  "19": "19:00 - 20:00",
  "20": "20:00 - 21:00",
  "21": "21:00 - 22:00",
  "22": "22:00 - 23:00",
  "23": "23:00 - 24:00",
  "24": "00:00 - 01:00",
  "1": "01:00 - 02:00",
  "2": "02:00 - 03:00",
  "3": "03:00 - 04:00",
  "4": "04:00 - 05:00",
};

const Booking = ({ fetchBookings, kategori }: { fetchBookings: () => void, kategori: string }) => {
  // Fungsi untuk mengumpulkan index slot yang bentrok
  const getDuplicateIndices = (dates: string[], slots: string[]) => {
    // slots sekarang string ("" jika belum dipilih)
    const slotPairs = dates.map((date, idx) => ({ date, hour: slots[idx] }));
    const duplicates: number[] = [];
    for (let i = 0; i < slotPairs.length; i++) {
      const isDuplicate = slotPairs.filter(
        (slot, idx) =>
          slot.date === slotPairs[i].date &&
          slot.hour !== "" &&
          slot.hour === slotPairs[i].hour &&
          idx !== i
      ).length > 0;
      if (isDuplicate) {
        duplicates.push(i);
      }
    }
    return Array.from(new Set(duplicates));
  };
  const [startDates, setStartDates] = useState<string[]>([dayjs().format("YYYY-MM-DD")]);
  // <-- CHANGED: timeSlots sebagai string[] dan inisialisasi satu entri kosong supaya sinkron dengan startDates
  const [timeSlots, setTimeSlots] = useState<string[]>([""]);
  const [booked, setBooked] = useState<string>("");
  const [nama_rekening, setNama_Rekening] = useState<string>("");


  const [errors, setErrors] = useState<{
    booked?: string;
    startDate?: string;
    timeSlot?: string[]; // ✅ Ubah jadi array
    nama_rekening?: string;
  }>({});
  // Removed unused state setter
  const [availableSlots] = useState<Record<string, string>>(timeOptions);

  // Add SweetAlert confirmation before submitting
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: any = {};
    if (!booked.trim()) {
      newErrors.booked = "Nama pemesan tidak boleh kosong";
    } else if (/^\d+$/.test(booked.trim())) {
      newErrors.booked = "Nama pemesan tidak boleh hanya angka. Harus mengandung huruf.";
    }
    if (!startDates.length || startDates.some((d) => !d)) newErrors.startDate = "Tanggal main tidak boleh kosong";

    // <-- CHANGED: buat error per-slot jika jam kosong
    const slotErrorArr: string[] = Array(startDates.length).fill("");
    startDates.forEach((_, idx) => {
      if (!timeSlots[idx] || timeSlots[idx] === "") {
        slotErrorArr[idx] = "Jam tidak boleh kosong";
      }
    });

    // Cek duplikat tanggal dan jam (jika jam dipilih)
    const slotPairs: Record<string, number[]> = {};
    startDates.forEach((date, idx) => {
      const hour = timeSlots[idx] === "" ? "" : timeSlots[idx];
      const key = `${date}-${hour}`;
      if (!slotPairs[key]) slotPairs[key] = [];
      slotPairs[key].push(idx);
    });
    Object.values(slotPairs).forEach(indices => {
      if (indices.length > 1) {
        indices.forEach(idx => {
          slotErrorArr[idx] = "Tanggal & jam tidak boleh sama persis dengan input lain.";
        });
      }
    });
    // Kumpulkan index slot yang bentrok (fungsi lama yang sudah disesuaikan)
    const duplicateIndices = getDuplicateIndices(startDates, timeSlots);
    if (duplicateIndices.length > 0) {
      duplicateIndices.forEach(idx => {
        slotErrorArr[idx] = "Slot ini bentrok dengan input lain. Pilih jadwal berbeda.";
      });
    }
    if (slotErrorArr.some((err) => err)) {
      newErrors.timeSlot = slotErrorArr;
    }
    if (!nama_rekening.trim())
      newErrors.nama_rekening = "Nama rekening pengirim tidak boleh kosong";

    // Jika ada error bentrok antar input, hentikan proses submit
    if ((newErrors.timeSlot && newErrors.timeSlot.some((err: string) => err)) || Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    const confirmation = await Swal.fire({
      title: "Konfirmasi Booking",
      html:
        `<div style=' text-align:center;'>` +
        `<p>Pastikan data booking Anda sudah benar:</p>` +
        `<ul style='margin-top:8px;'>` +
        startDates
          .map((d, i) => {
            const label = timeOptions[String(timeSlots[i])] ?? "";
            return `<li><b>Tanggal:</b> ${dayjs(d).format("DD MMM YYYY")} <b>Jam:</b> ${label}</li>`;
          })
          .join("") +
        `</ul>` +
        `<p style='margin-top:10px;'>Jika sudah yakin, klik <b>Ya, Pesan</b>.</p>` +
        `</div>`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Pesan",
      cancelButtonText: "Batal",
    });

    if (!confirmation.isConfirmed) {
      return;
    }

    if (kategori === "coaching") {
      kategori = "coaching";
    } else {
      kategori = "court";
    }


    const timeSlotData = startDates.map((date, i) => ({
      date,
      // <-- CHANGED: kirim hour sebagai number
      time_slot: Number(timeSlots[i]),
    }));

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/padel`,
        {
          booked: booked,
          start_date: startDates,
          time_slot: timeSlotData,
          nama_rekening,
          kategori: kategori,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Booking berhasil!",
        text: "Slot waktu Anda telah berhasil dibooking.",
      });

      // Refresh data booking
      fetchBookings();

      // ✅ Reset semua input setelah sukses
      setBooked("");
      setStartDates([dayjs().format("YYYY-MM-DD")]);
      // <-- CHANGED: reset timeSlots sinkron dengan startDates
      setTimeSlots([""]);
      setNama_Rekening("");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        const conflicts = error.response.data.conflicts || [];
        // Kumpulkan semua index yang bentrok dengan backend
        const updatedErrorSlots = Array(startDates.length).fill("");
        conflicts.forEach((c: { date: string; hour: number }) => {
          startDates.forEach((d, i) => {
            if (d === c.date && Number(timeSlots[i]) === c.hour) {
              updatedErrorSlots[i] = "Slot ini bentrok. Pilih jadwal lain.";
            }
          });
        });
        setErrors({ timeSlot: updatedErrorSlots });

        const conflictList = conflicts
          .map(
            (c: { date: string; hour: number }) =>
              `• ${dayjs(c.date).format("DD MMM YYYY")} - ${timeOptions[String(c.hour)]}`
          )
          .join("<br>");

        Swal.fire({
          icon: "error",
          title: "Slot Sudah Dibooking",
          html: `Maaf slot berikut sudah tidak tersedia:<br><br>${conflictList}`,
        });
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
          <li>
            Pembayaran Maksimal 15 menit setelah melakukan booking. Jika Sudah
            Memastikan Jadwal Dan Sudah Melakukan Payment Harap Konfirmasi Ke
            Admin Kami Melalui Whatasapp +62 813-2097-181 atau Instagram
            @KindyPadel.
          </li>
          <li>Pembayaran melalui transfer BCA 6375058549 Bilal Edwan.</li>
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
            className={`block w-full px-3 py-2 rounded-md dark:bg-gray-700 dark:text-gray-100 border ${errors.booked
              ? "border-red-500  dark:bg-red-900/20"
              : "border-gray-300"
              }`}
          />
          {errors.booked && (
            <p className="text-sm text-red-500 mt-1">{errors.booked}</p>
          )}
        </div>

        {/* Tanggal & Jam Main (Dinamis) */}
        {startDates.map((date, idx) => (
          <div className="mb-4 flex flex-row gap-2 items-start" key={idx}>
            <div className="w-1/2 md:flex-1 flex flex-col justify-end">
              <label className="block mb-2 text-gray-700 dark:text-gray-300">
                Tanggal Main {startDates.length > 1 ? `(${idx + 1})` : ""}
              </label>
              <DatePicker
                selected={date ? new Date(date) : null}
                onChange={(d: Date | null) => {
                  if (d) {
                    const updated = [...startDates];
                    updated[idx] = dayjs(d).format("YYYY-MM-DD");
                    setStartDates(updated);
                    if (errors.startDate) {
                      setErrors((prev) => ({ ...prev, startDate: undefined }));
                    }
                  }
                }}
                dateFormat="yyyy-MM-dd"
                className={`block w-full px-3 py-2 rounded-md dark:bg-gray-700 dark:text-gray-100 border ${errors.startDate
                  ? "border-red-500  dark:bg-red-900/20"
                  : "border-gray-300"
                  }`}
              />
            </div>
            <div className="w-1/2 md:flex-4 ml-2 flex flex-col justify-end min-h-[56px]">
              <label className="block mb-2 text-gray-700 dark:text-gray-300">
                Jam
              </label>
              <div className="flex items-center gap-2">
                <select
                  value={timeSlots[idx] ?? ""}
                  onChange={(e) => {
                    const updated = [...timeSlots];
                    // <-- CHANGED: simpan sebagai string (key dari timeOptions)
                    updated[idx] = e.target.value;
                    setTimeSlots(updated);
                    // Hapus error hanya pada slot yang diedit
                    if (errors.timeSlot && errors.timeSlot[idx]) {
                      const newErr = [...errors.timeSlot];
                      newErr[idx] = "";
                      setErrors((prev) => ({ ...prev, timeSlot: newErr }));
                    }
                  }}
                  className={`block w-full px-3 py-2 mt-2 rounded-md dark:bg-gray-700 dark:text-gray-100 border ${errors.timeSlot && errors.timeSlot[idx]
                    ? "border-red-500 dark:bg-red-900/20"
                    : "border-gray-300"
                    }`}
                >
                  <option value="">Pilih Jam</option>
                  {Object.entries(availableSlots).map(([key, label]) => (
                    // <-- CHANGED: gunakan key sebagai value (string) agar konsisten dengan state
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
                {/* Tombol hapus kecil */}
                {startDates.length > 1 && (
                  <button
                    type="button"
                    className="ml-1 text-xs px-2 py-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 focus:outline-none"
                    title="Hapus input ini"
                    onClick={() => {
                      setStartDates((prev) => prev.filter((_, i) => i !== idx));
                      setTimeSlots((prev) => prev.filter((_, i) => i !== idx));
                      // Hapus error slot terkait
                      if (errors.timeSlot) {
                        const newErr = [...errors.timeSlot];
                        newErr.splice(idx, 1);
                        setErrors((prev) => ({ ...prev, timeSlot: newErr }));
                      }
                    }}
                  >
                    &#10006;
                  </button>
                )}
              </div>
              {/* Error hanya pada slot yang bentrok */}
              {errors.timeSlot && errors.timeSlot[idx] && (
                <p className="text-sm text-red-500 mt-2">{errors.timeSlot[idx]}</p>
              )}
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => {
            setStartDates((prev) => {
              const last =
                prev.length > 0
                  ? prev[prev.length - 1]
                  : dayjs().format("YYYY-MM-DD");
              const next = dayjs(last).add(1, "day").format("YYYY-MM-DD");
              return [...prev, next];
            });
            // <-- CHANGED: tambahkan slot kosong saat menambah tanggal baru
            setTimeSlots((prev) => [...prev, ""]);
          }}
          className=" mb-3 px-3 py-2 bg-green-600 text-white rounded-lg"
        >
          + Tambah Tanggal & Jam Main
        </button>

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
            className={`block w-full px-3 py-2 rounded-md dark:bg-gray-700 dark:text-gray-100 border ${errors.nama_rekening
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
