import useSafeNavigate from "../../utils/useSafeNavigate";
import GradientBackground from "../common/Gradient";

import { useUser } from "../common/UserContext.jsx";

function JoinUs() {
  const navigate = useSafeNavigate();
  const { user, setUser } = useUser();

  const handlePrimaryAction = () => {
    if (user?.role === "user") {
      navigate("/dashboard/user");
    } else {
      navigate("/signup");
    }
  };

  const handleAboutUs = () => {
    navigate("/aboutus");
  };

  return (
    <div className="w-full flex flex-col md:flex-col lg:flex-row justify-between items-center px-6 sm:px-8 md:px-16 lg:px-44 py-12 sm:py-16 gap-10 sm:gap-8">
      {/* Text Section */}
      <div className="flex flex-col gap-4 text-center items-center w-full lg:w-1/2 order-2 md:order-2 lg:order-none">
        <GradientBackground
          clor1="var(--grad2)"
          size="40%"
          top="56%"
          left="98%"
        />
        <GradientBackground size="35%" top="72%" left="2%" />
        <h3 className="text-2xl sm:text-3xl font-semibold text-text-heading  ">
          Join CoinCrest Today!
        </h3>

        <p className="text-text-body text-base sm:text-lg md:max-w-md md:mx-auto lg:mx-0">
          Unlock the potential of your crypto assets with our seamless USDT
          staking platform
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 sm:justify-center lg:justify-start mt-2">
          <button
            onClick={handlePrimaryAction}
            className="w-full sm:w-fit cursor-pointer bg-button hover:bg-button-hover px-8 py-3 text-md font-semibold rounded-lg text-text-heading shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            {user?.role === "user" ? "Go to Dashboard" : "Sign Up"}
          </button>
          <button
            onClick={handleAboutUs}
            className="w-full sm:w-fit bg-transparent border border-gray-300 px-8 py-3 text-md font-semibold rounded-lg text-gray-300 hover:bg-gray-100 hover:text-gray-900 transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            About Us
          </button>
        </div>
      </div>

      {/* Image Section */}
      <div className="w-full flex justify-center order-1 md:order-1 lg:order-none lg:w-1/2">
        <img
          src="/images/joinUs.png"
          alt="Join Us"
          className="h-64 sm:h-72 object-contain"
        />
      </div>
    </div>
  );
}

export default JoinUs;
