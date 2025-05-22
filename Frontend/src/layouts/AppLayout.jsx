import { Outlet } from "react-router";
import { useEffect, useState } from "react";
import ScrollToTop from "../components/common/ScrollToTop";
import TopNav from "../components/common/MobileNav/TopNav";
import BottomNav from "../components/common/MobileNav/BottomNav";
import Navbar from "../components/common/Navbar"; // Desktop
import Footer from "../components/common/Footer"; // Desktop

function AppLayout() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // Tailwind's 'lg' breakpoint
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="flex flex-col min-h-screen relative ">
      <ScrollToTop />

      {/* Top Navigation */}
      {isMobile ? <TopNav /> : <Navbar />}

      {/* Main Content */}
      <main className="flex-grow pt-16 pb-16 px-4 lg:px-0">
        <Outlet />
      </main>

      {/* Footer or Bottom Navigation */}
      <Footer />
      {isMobile && <BottomNav />}
    </div>
  );
}

export default AppLayout;
