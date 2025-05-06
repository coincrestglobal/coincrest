import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { Outlet } from "react-router";
import ScrollToTop from "../components/common/ScrollTotop";

function AppLayout() {
  return (
    <div className="flex flex-col relative">
      <ScrollToTop />
      <Navbar />
      <main className="">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default AppLayout;
