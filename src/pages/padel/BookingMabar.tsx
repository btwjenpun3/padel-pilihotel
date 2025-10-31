import React, {  useState } from "react";

import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import "dayjs/locale/id";
import axios from "axios";
import Swal from "sweetalert2";

import { GiTennisCourt } from "react-icons/gi";
import { IoWarning } from "react-icons/io5";

dayjs.locale("id");
const timeOptions: Record<number, string> = {
  1: " Player  1",
  2: " Player 2",
  3: " Player 3",
  4: " Player 4",
  5: " Player 5",
  6: " Player 6",
  7: " Player 7",
  8: " Player 8",
  9: " Player 9",
  10: " Player 10",
};

interface HariAvailable {
  id: number;
  tanggal: string;
  jam: string;
}


const BookingMabar = ({ JadwalBooking,HariAvailable }: { JadwalBooking: any,HariAvailable: HariAvailable[] }) => {
  const [hariDipilih, setHariDipilih] = useState<string[]>([""]);
  const [timeSlot, setTimeSlot] = useState<number>(1);
  const [booked, setBooked] = useState<string>("");
  const [nama_rekening, setNama_Rekening] = useState<string>("");

  const [errors, setErrors] = useState<{
    booked?: string;
    hariDipilih?: string;
    timeSlot?: string;
    nama_rekening?: string;
    statusBayar?: string;
    paket?: string;
    id_hari?: string;
    sessionErrors?: string[];
  }>({});


  const [availableSlots] = useState<Record<number, string>>(timeOptions);



    const handleAddSession = () => {
      setHariDipilih((prev) => [...prev, ""]);
    };

      const handleSessionChange = (index: number, value: string) => {
        const updated = [...hariDipilih];
        updated[index] = value;
        setHariDipilih(updated);
      };


 



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: any = {};

    if (!booked.trim()) newErrors.booked = "Nama pemesan tidak boleh kosong";

    if (hariDipilih.length === 0 || hariDipilih.every((v) => !v)) {
      newErrors.hariDipilih = "Minimal pilih satu session!";
    }
    if (!timeSlot) newErrors.timeSlot = "Slot tidak boleh kosong";

    if (nama_rekening.trim() === "")
      newErrors.nama_rekening = "Nama rekening pengirim tidak boleh kosong";

    // Cek duplikat hari
    const sessionErrors = Array(hariDipilih.length).fill("");
    const hariCount: Record<string, number> = {};
    hariDipilih.forEach((id) => {
      if (id) hariCount[id] = (hariCount[id] || 0) + 1;
    });
    hariDipilih.forEach((id, idx) => {
      if (id && hariCount[id] > 1) {
        sessionErrors[idx] = "Session hari tidak boleh sama!";
      }
    });
    if (sessionErrors.some((err) => err)) {
      setErrors((prev: any) => ({ ...prev, sessionErrors }));
      return;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    const confirmation = await Swal.fire({
      title: "Konfirmasi Mabar",
      text: `Apakah Anda yakin ingin memesan untuk tanggal ${hariDipilih} dan Slot ${timeOptions[timeSlot]}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Pesan",
      cancelButtonText: "Batal",
    });

    if (!confirmation.isConfirmed) {
      return;
    }

    try {
      const sessionData = hariDipilih
        .filter((id) => id)
        .map((id) => ({
          id_hari: id,
          slot: Number(timeSlot),
        }));

      await axios.post(
        `${import.meta.env.VITE_API_URL}/padel-mabar`,
        {
          nama_pemain: booked,
          sessions: sessionData,
          nama_rekening,
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
        text: "Slot Player waktu Anda telah berhasil dibooking.",
      });

      // Refresh data booking
      JadwalBooking();

      // ✅ Reset semua input setelah sukses
      setBooked("");
        setHariDipilih([""]);
      setTimeSlot(5);
      setNama_Rekening("");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        const conflicts = error.response?.data.conflicts || [];
        // Map conflicts to session input errors
        const sessionErrors = Array(hariDipilih.length).fill("");
        conflicts.forEach((conflict: { id_hari: string; slot: number; message: string }) => {
          hariDipilih.forEach((id, idx) => {
            if (String(id) === String(conflict.id_hari)) {
              sessionErrors[idx] = conflict.message || "Slot sudah dibooking. Pilih session lain.";
            }
          });
        });
        setErrors((prev: any) => ({ ...prev, hariDipilih: undefined, sessionErrors }));

        Swal.fire({
          icon: "error",
          title: "Slot Player sudah dibooking!",
          html:
            "Maaf, slot berikut sudah tidak tersedia:<br><br>" +
            conflicts
              .map(
                (c: { id_hari: string; slot: number; message: string }) =>
                  `• Session ID: ${c.id_hari} - Player: ${timeOptions[c.slot]}<br>${c.message}`
              )
              .join("<br>")
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
        Form Booking Mabar Kindy Padel{" "}
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
            cancel/refund/reschedule.
          </li>
          <li>Pembayaran melalui transfer BCA 6375058549 Bilal Edwan.</li>
          <li>Rp 75.000 / Player / Session. Jika 2 Session Maka Rp 150.000 / Player dst.</li>
          <li>1 Session adalah 1 Jam.</li>
          <li>Pembayaran Maksimal 15 menit setelah melakukan booking.</li>
          <li>
            Jika Sudah Memastikan Jadwal Dan Sudah Melakukan Payment Harap
            Konfirmasi Ke Admin Kami Melalui Whatasapp +62 813-2097-181 atau
            Instagram @KindyPadel.
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
            Jadwal Mabar Perjam jika ingin lebih dari 1 Jam maka Peserta
            melakukan Process Booking 2x.
          </li>

          <li>Satu Session Mabar All Level Maksimal 8 Player.</li>
          <li>
            Host Berhak Mereschedule Jadwal Mabar Apabila Terjadi Force Majure.
          </li>
          <li>Sesi Akan Berjalan Kalau Sudah Ada Minimal 4 Orang. </li>
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
        {/* Pilihan Hari Available */}
        {hariDipilih.map((selectedHari, index) => (
          <div className="mb-4 flex items-center gap-2" key={index}>
            <div className="flex-1">
              <label className="block mb-2 text-gray-700 dark:text-gray-300">
                Pilih Session Tersedia {hariDipilih.length > 1 ? `(${index + 1})` : ""}
              </label>
              <select
                value={selectedHari}
                onChange={(e) => handleSessionChange(index, e.target.value)}
                className={`block w-full px-3 py-2 rounded-md dark:bg-gray-700 dark:text-gray-100 border ${
                  errors.sessionErrors && errors.sessionErrors[index]
                    ? "border-red-500  dark:bg-red-900/20"
                    : "border-gray-300"
                }`}
              >
                <option value="">Pilih Session Tersedia</option>
                {HariAvailable.map((hari) => (
                  <option key={hari.id} value={hari.id}>
                    {dayjs(hari.tanggal).format("dddd, DD MMMM YYYY")} - {hari.jam}
                  </option>
                ))}
              </select>
              {/* Error hanya pada session yang bentrok */}
              {errors.sessionErrors && errors.sessionErrors[index] && (
                <p className="text-sm text-red-500 mt-1">{errors.sessionErrors[index]}</p>
              )}
            </div>
            {hariDipilih.length > 1 && (
              <button
                type="button"
                className="ml-1 text-xs px-2 py-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 focus:outline-none"
                title="Hapus session ini"
                onClick={() => {
                  setHariDipilih((prev) => prev.filter((_, i) => i !== index));
                }}
              >
                &#10006;
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddSession}
          className=" mb-3 px-3 py-2 bg-green-600 text-white rounded-lg"
        >
          + Tambah Session
        </button>

        {/* Jam */}
        <div className="mb-4">
          <label className="block mb-2 text-gray-700 dark:text-gray-300">
            Player
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

export default BookingMabar;
