import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, CalendarDays, Instagram } from "lucide-react";
import { IoTennisballOutline } from "react-icons/io5";
import padel1 from "/images/landing-page/lapangan/padel1.jpg";
import padel2 from "/images/landing-page/lapangan/padel2.jpeg";
import padel3 from "/images/landing-page/lapangan/padel3.jpeg";
import padel4 from "/images/landing-page/lapangan/padel4.jpeg";
import padel5 from "/images/landing-page/lapangan/padel5.jpeg";
import padel6 from "/images/landing-page/lapangan/padel6.jpeg";
import padel7 from "/images/landing-page/lapangan/padel7.jpeg";
import padel8 from "/images/landing-page/lapangan/padel8.jpeg";
import padel9 from "/images/landing-page/lapangan/padel9.jpeg";
import padel10 from "/images/landing-page/lapangan/padel10.jpeg";
import padel11 from "/images/landing-page/lapangan/padel11.jpeg";
import padel12 from "/images/landing-page/lapangan/padel12.jpeg";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";

const Landing = () => {
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const images = [
    { url: padel1, description: "Kindy Padel" },
    { url: padel2, description: "Kindy Padel" },
    { url: padel3, description: "Kindy Padel" },
    { url: padel4, description: "Kindy Padel" },
    { url: padel5, description: "Kindy Padel" },
    { url: padel6, description: "Kindy Padel" },
    { url: padel7, description: "Kindy Padel" },
    { url: padel8, description: "Kindy Padel" },
    { url: padel9, description: "Kindy Padel" },
    { url: padel10, description: "Kindy Padel" },
    { url: padel11, description: "Kindy Padel" },
    { url: padel12, description: "Kindy Padel" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-sky-50 via-white to-blue-50 text-gray-900 font-sans">
      {/* Navbar */}
      <header className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl flex font-bold text-blue-700">
              Kindy Padel{" "}
              <span className="hidden sm:inline">
                <IoTennisballOutline />
              </span>
            </h1>
          </div>
          <nav className="hidden md:flex space-x-8 text-gray-700 font-medium">
            <a href="#about" className="hover:text-blue-600 transition">
              Tentang
            </a>
            <a href="#gallery" className="hover:text-blue-600 transition">
              Gallery
            </a>
            <a href="#contact" className="hover:text-blue-600 transition">
              Kontak
            </a>
          </nav>
          <a
            href="/booking"
            className="px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm md:text-base bg-blue-600 text-white rounded-full hover:bg-blue-700 transition font-medium whitespace-nowrap"
          >
            Reservasi Sekarang
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col-reverse md:flex-row items-center justify-between max-w-7xl mx-auto px-6 pt-28 pb-16 md:pt-36 gap-10">
        <motion.div
          className="max-w-lg order-2 md:order-1"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            Lapangan <span className="text-blue-600">Padel Pertama</span> di
            Depok Dan Termurah Di Indonesia
          </h2>
          {/* <p className="text-lg text-gray-700 mb-6">
            Rasakan sensasi olahraga padel di fasilitas modern dengan
            pencahayaan premium dan suasana eksklusif. Kami hadir untuk
            memperkenalkan gaya hidup sehat yang menyenangkan.
          </p> */}
          <a
            href="/booking"
            className="px-6 py-3 bg-blue-600 text-white rounded-full shadow-lg hover:shadow-xl hover:bg-blue-700 transition-all"
          >
            Reservasi Sekarang
          </a>
        </motion.div>

        <motion.img
          src={padel1}
          alt="Lapangan padel modern di Depok"
          className="w-full md:w-1/2 rounded-3xl shadow-lg order-1 md:order-2"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        />
      </section>

      {/* Price List Section */}
      <section id="about" className="py-20 bg-white px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-6 text-gray-900">
            Price List <span className="text-blue-600">Kindy Padel</span>
          </h3>

          {/* Responsive grid dengan minimal lebar 250px per kolom */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 place-items-stretch">
            {[
              {
                title: "Court",
                price: "Rp 87.000/jam",
                link: "/booking/court",
                features: [
                  { text: "Senin - Minggu", bullet: true },
                  { text: "06:00 AM - 10:00 AM | 225k", bullet: false },
                  { text: "10:00 AM - 03:00 PM | 87k", bullet: false },
                  { text: "03:00 PM - 11:00 AM | 225k", bullet: false },

                  { text: "Sabtu - Minggu/ Holliday", bullet: false },
                  { text: "All Day | 285k", bullet: false },
                ],
              },
              {
                title: "Coaching Class",
                link: "/booking/coaching",
                price: "Rp 600.000/jam",
                features: [
                  { text: "1-2 Orang 600k", bullet: true },
                  { text: "3-4 Orang 700k", bullet: true },
                  { text: "5-6 Orang 1.000k", bullet: true },
                ],
              },
              {
                title: "Mabar All Level",
                link: "/booking-mabar",
                price: "Rp 75.000 / Player / Session",
                features: [
                  { text: "free cold drinks", bullet: true },
                  { text: "Sewa Racket Tersedia", bullet: true },
                  { text: "Balls Included", bullet: true },
                ],
              },
              {
                title: "Sewa Racket",
                price: "Rp 85.000 / Sesi",
                features: [
                  { text: "Padle Racket", bullet: true },
                  { text: "Sepatu Padel", bullet: true },
                  { text: "Bola Padel", bullet: true },
                ],
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-transform hover:-translate-y-2 flex flex-col justify-between min-w-[250px]"
                whileHover={{ scale: 1.02 }}
              >
                <div className="p-6 text-center flex-1 flex flex-col">
                  <h4 className="text-xl font-semibold mb-2 text-gray-800">
                    {item.title}
                  </h4>

                  {/* Teks "Mulai Dari" + Harga dengan tinggi tetap */}
                  <div className="mb-4 min-h-[120px] flex flex-col justify-center">
                    <p className="text-blue-600 font-bold text-2xl">
                      Mulai Dari
                      <br />
                      {item.price}
                    </p>
                  </div>

                  <ul className="text-gray-600 text-left space-y-2 flex-1">
                    {item.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        {feature.bullet && (
                          <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                        )}
                        {feature.text}
                      </li>
                    ))}
                  </ul>
                </div>

                {item.title === "Coaching Class" && (
                  <span className="ml-4 mb-2 text-left text-gray-500 text-[10px]">
                    *Harga sudah termasuk Coach, Court & Ball
                  </span>
                )}

                <a
                  href={item.link ? item.link : "https://wa.me/6281320971811"}
                  className="bg-blue-600 text-white py-2 px-4 rounded-b-2xl hover:bg-blue-700 transition block"
                >
                  {item.title === "Rent Gear"
                    ? "Hubungi Sekarang"
                    : "Booking Sekarang"}
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16" id="gallery">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-gray-800">
            Galeri <span className="text-blue-600">Kindy Padel</span>
          </h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
            Nikmati pengalaman bermain padel pertama di Depok dengan fasilitas
            modern dan suasana eksklusif.
          </p>

          <Swiper
            modules={[Pagination, Navigation]}
            spaceBetween={20}
            slidesPerView={1}
            pagination={{ clickable: true }}
            navigation
            loop={true}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="rounded-2xl shadow-lg"
          >
            {images.map((item, index) => (
              <SwiperSlide key={index}>
                <div className="relative overflow-hidden rounded-2xl">
                  <img
                    src={item.url}
                    alt={`Lapangan ${index + 1}`}
                    className="w-full h-[300px] sm:h-[400px] object-cover hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                    <p className="text-white font-semibold text-lg">
                      {item.description}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Override style untuk tombol Swiper: lebih besar, background putih, ikon berwarna biru */}
          <style>{`
            /* ukuran & tampilan tombol */
            .swiper-button-prev,
            .swiper-button-next {
              width: 26px;
              height: 26px;
              border-radius: 9999px;
              background: #ffffff !important; /* background putih */
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 8px 20px rgba(2,6,23,0.12);
              z-index: 50;
              transition: transform .15s ease, box-shadow .15s ease;
            }
            .swiper-button-prev:hover,
            .swiper-button-next:hover {
              transform: translateY(-2px);
              box-shadow: 0 12px 30px rgba(2,6,23,0.14);
            }

            /* ukuran icon panah */
            .swiper-button-prev::after,
            .swiper-button-next::after {
              font-size: 20px;
              color: #1e40af; /* biru agar kontras terhadap background putih */
            }

            /* posisi tombol lebih ke dalam (opsional tweak) */
            .swiper-button-prev { left: 8px; }
            .swiper-button-next { right: 8px; }

            /* responsive: sedikit lebih kecil di layar kecil */
            @media (max-width: 640px) {
              .swiper-button-prev,
              .swiper-button-next {
                width: 26px;
                height: 26px;
              }
              .swiper-button-prev::after,
              .swiper-button-next::after {
                font-size: 18px;
              }
            }
          `}</style>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-6 text-gray-900">
            Tentang <span className="text-blue-600">Kindy Padel</span>
          </h3>
          <p className="text-gray-600 leading-relaxed text-lg">
            Didirikan pada tahun 2025, <b>Kindy Padel</b> menjadi pelopor
            lapangan padel pertama di Kota Depok Dan Termurah Se Indonesia. Kami
            berkomitmen untuk menghadirkan pengalaman olahraga padel yang seru
            dan profesional — lengkap dengan fasilitas modern, lingkungan
            nyaman, serta komunitas aktif yang ramah untuk semua kalangan.
          </p>

          <div className="embed-map-responsive mt-4">
            <div className="embed-map-container">
              <iframe
                className="embed-map-frame"
                frameBorder="0"
                scrolling="no"
                marginHeight={0}
                marginWidth={0}
                src="https://maps.google.com/maps?width=600&height=400&hl=en&q=kindy%20padel&t=p&z=19&ie=UTF8&iwloc=B&output=embed"
              />
              <a
                href="https://sprunkiretake.net"
                style={{
                  fontSize: "2px",
                  color: "gray",
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  zIndex: 1,
                  maxHeight: "1px",
                  overflow: "hidden",
                }}
              >
                sprunki retake
              </a>
            </div>
            <style>{`.embed-map-responsive{position:relative;text-align:right;width:100%;height:0;padding-bottom:66.66666666666666%;}.embed-map-container{overflow:hidden;background:none!important;width:100%;height:100%;position:absolute;top:0;left:0;}.embed-map-frame{width:100%!important;height:100%!important;position:absolute;top:0;left:0;}`}</style>
          </div>
        </div>
      </section>

      {/** Maps */}

      {/* Facilities Section */}
      {/* <section
        id="facilities"
        className="py-20 bg-gradient-to-r from-blue-50 to-sky-100 px-6"
      >
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-12 text-gray-900">
            Fasilitas Unggulan Kami
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                title: "Lapangan Premium",
                desc: "Bersertifikasi internasional dengan pencahayaan LED profesional.",
                img: "https://images.unsplash.com/photo-1605280260220-08aa6785b27e?auto=format&fit=crop&w=900&q=80",
              },
              {
                title: "Lounge & Coffee Corner",
                desc: "Area santai dengan AC, WiFi, dan kopi terbaik setelah bermain.",
                img: "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=900&q=80",
              },
              {
                title: "Ruang Ganti Modern",
                desc: "Fasilitas bersih, air panas, dan loker pribadi untuk kenyamanan Anda.",
                img: "https://images.unsplash.com/photo-1596392927852-6b07d74a1f28?auto=format&fit=crop&w=900&q=80",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-transform hover:-translate-y-2"
                whileHover={{ scale: 1.02 }}
              >
                <img
                  src={item.img}
                  alt={item.title}
                marginHeight={0}
                marginWidth={0}
                src="https://maps.google.com/maps?width=600&height=400&hl=en&q=kindy%20padel&t=p&z=19&ie=UTF8&iwloc=B&output=embed"
              />
              <a
                href="https://sprunkiretake.net"
                style={{
                  fontSize: "2px",
                  color: "gray",
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  zIndex: 1,
                  maxHeight: "1px",
                  overflow: "hidden",
                }}
              >
                sprunki retake
              </a>
            </div>
            <style>{`.embed-map-responsive{position:relative;text-align:right;width:100%;height:0;padding-bottom:66.66666666666666%;}.embed-map-container{overflow:hidden;background:none!important;width:100%;height:100%;position:absolute;top:0;left:0;}.embed-map-frame{width:100%!important;height:100%!important;position:absolute;top:0;left:0;}`}</style>
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      {/* <section
        id="facilities"
        className="py-20 bg-gradient-to-r from-blue-50 to-sky-100 px-6"
      >
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-12 text-gray-900">
            Fasilitas Unggulan Kami
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                title: "Lapangan Premium",
                desc: "Bersertifikasi internasional dengan pencahayaan LED profesional.",
                img: "https://images.unsplash.com/photo-1605280260220-08aa6785b27e?auto=format&fit=crop&w=900&q=80",
              },
              {
                title: "Lounge & Coffee Corner",
                desc: "Area santai dengan AC, WiFi, dan kopi terbaik setelah bermain.",
                img: "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=900&q=80",
              },
              {
                title: "Ruang Ganti Modern",
                desc: "Fasilitas bersih, air panas, dan loker pribadi untuk kenyamanan Anda.",
                img: "https://images.unsplash.com/photo-1596392927852-6b07d74a1f28?auto=format&fit=crop&w=900&q=80",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-transform hover:-translate-y-2"
                whileHover={{ scale: 1.02 }}
              >
                <img
                  src={item.img}
                  alt={item.title}
                  className="h-56 w-full object-cover"
                />
                <div className="p-6 text-left">
                  <h4 className="text-xl font-semibold mb-2 text-gray-800">
                    {item.title}
                  </h4>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}

      <section
        id="contact"
        className="bg-blue-700 text-white py-20 px-6 text-center"
      >
        <h3 className="text-3xl font-bold mb-8">Hubungi Kami</h3>
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 text-lg">
          <p className="flex items-center gap-3">
            <MapPin className="w-5 h-5" /> Jl. Kartini depok No. 14
          </p>
          <p className="flex items-center gap-3">
            <Phone className="w-5 h-5" /> +62 813-2097-1811
          </p>
          <a className="flex items-center gap-3">
            <Instagram className="w-5 h-5" /> @KindyPadel
          </a>
          <p className="flex items-center gap-3">
            <CalendarDays className="w-5 h-5" /> Buka Setiap Hari: 24 Jam
          </p>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-400 py-6 text-center text-sm">
        © 2025 <span className="text-white font-semibold">Kindy Padel</span>.
        All rights reserved.
      </footer>

      {showScrollButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition"
        >
          ↑
        </button>
      )}
    </div>
  );
};

export default Landing;
