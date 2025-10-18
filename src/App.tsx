import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";

import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";


import JadwalBooking from "./pages/padel/JadwalBooking";
import Booking from "./pages/padel/Booking";
// import Booking from "./pages/padel/Booking";
import Landing from "./pages/landing/landing";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>

        <Route index path="/" element={<Landing />} />

          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route index path="/dashboard" element={<Home />} />

            <Route path="/booking" element={<JadwalBooking />} />
            <Route path="/booking-form" element={<Booking />} />
          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
