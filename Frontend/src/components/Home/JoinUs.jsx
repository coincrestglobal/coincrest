import useSafeNavigate from "../../utils/useSafeNavigate";
import GradientBackground from "../common/Gradient";

import { useUser } from "../common/UserContext.jsx";

function JoinUs() {
  const navigate = useSafeNavigate();
  const { user, setUser } = useUser();

  const handlePrimaryAction = () => {
    if (user?.role === "user") {
      navigate("/dashboard"); // If already a user, go to dashboard
    } else {
      navigate("/signup"); // If not, go to signup page
    }
  };

  const handleAboutUs = () => {
    navigate("/aboutus");
  };

  return (
    <div className="w-full flex flex-col md:flex-row justify-between items-center px-8 md:px-44 py-16 gap-8">
      <div className="flex flex-col gap-4 order-2 md:order-none">
        <GradientBackground
          clor1="rgba(14,102,64,0.7)"
          size="40%"
          top="56%"
          left="98%"
        />
        <GradientBackground size="35%" top="72%" left="2%" />
        <h3 className="text-2xl sm:text-3xl font-semibold text-text-heading">
          Join CoinCrest Today!
        </h3>
        <p className="text-text-body text-base sm:text-lg">
          Unlock the potential of your crypto assets with our seamless USDT
          staking platform
        </p>
        <div className="flex gap-4">
          <button
            onClick={handlePrimaryAction}
            className="w-fit cursor-pointer bg-button hover:bg-button-hover px-8 py-3 text-md font-semibold rounded-lg text-text-heading shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            {user?.role === "user" ? "Go to Dashboard" : "Sign Up"}
          </button>
          <button
            onClick={handleAboutUs}
            className="w-fit bg-transparent border border-gray-300 px-8 py-3 text-md font-semibold rounded-lg text-gray-300 hover:bg-gray-100 hover:text-gray-900 transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            About Us
          </button>
        </div>
      </div>

      {/* Right Side Image */}
      <div className="rounded-lg">
        <img
          src="/images/joinUs.png"
          alt="Join Us"
          className="h-72 object-cover"
        />
      </div>
    </div>
  );
}

export default JoinUs;
