import { useEffect, useState } from "react";
import useSafeNavigate from "../../utils/useSafeNavigate";
import GradientBackground from "../common/Gradient";
import { useUser } from "../common/UserContext";

const HeroSection = () => {
  const { user, setUser } = useUser();
  const navigate = useSafeNavigate();
  const fullText = "Unlock Your Crypto \nPotential with CoinCrest";
  const [typedText, setTypedText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const typeDelay = 60;
    const resetDelay = 2000;
    let timeout;

    if (index < fullText.length) {
      timeout = setTimeout(() => {
        setTypedText((prev) => prev + fullText[index]);
        setIndex((prev) => prev + 1);
      }, typeDelay);
    } else {
      timeout = setTimeout(() => {
        setTypedText("");
        setIndex(0);
      }, resetDelay);
    }

    return () => clearTimeout(timeout);
  }, [index]);

  const renderStyledText = () => {
    const lines = typedText.split("\n");
    return (
      <h1 className="text-xl h-16 md:h-24 sm:text-4xl md:text-5xl font-bold whitespace-pre-line leading-tight text-text-heading">
        {lines.map((line, i) => (
          <div key={i}>
            {line.includes("CoinCrest") ? (
              <>
                {line.replace("CoinCrest", "")}
                <span className="text-text-highlighted">CoinCrest</span>
              </>
            ) : (
              line
            )}
          </div>
        ))}
      </h1>
    );
  };

  return (
    <div className="flex pt-10 pb-10 sm:pt-0 sm:pb-0 lg:pt-10 lg:pb-0 justify-center text-text-heading">
      <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 h-full md:h-screen px-4 sm:px-10 md:px-16 lg:px-24 lg:mt-10 gap-8">
        {/* LEFT SECTION */}
        <div className="w-full flex flex-col items-center md:items-start lg:justify-center gap-3 md:gap-10 md:text-left">
          {renderStyledText()}
          <GradientBackground
            clor1="var(--grad2)"
            size="35%"
            top="5%"
            left="3%"
          />
          <GradientBackground size="35%" top="11%" left="99%" />

          <p className="text-sm sm:text-base md:text-lg text-center text-text-subheading mt-2 max-w-2xl">
            Join{" "}
            <span className="text-text-highlighted font-semibold">
              CoinCrest
            </span>{" "}
            today and start earning rewards through USDT staking. <br />
            Our platform supports TRC20 and BEP20 networks, making it easy{" "}
            <br />
            and secure to grow your investments.
          </p>

          {/* Buttons container: horizontal, centered below text */}
          <div className="flex justify-center gap-4 mt-4 w-full">
            <button
              className="bg-button hover:bg-button-hover px-8 py-3 text-sm font-semibold rounded-lg text-text-heading shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl"
              onClick={() => {
                if (!user) {
                  navigate("/login");
                } else {
                  switch (user.role) {
                    case "admin":
                      navigate("/dashboard/admin");
                      break;
                    case "owner":
                      navigate("/dashboard/owner");
                      break;
                    case "user":
                    default:
                      navigate("/dashboard/user");
                      break;
                  }
                }
              }}
            >
              {user ? "Go to Dashboard" : "REGISTER"}
            </button>
            <button
              className="bg-transparent border border-gray-300 px-8 py-3 text-sm font-semibold rounded-lg text-gray-300 hover:bg-gray-100 hover:text-gray-900 transition-all duration-300 hover:scale-105 hover:shadow-lg"
              onClick={() => navigate("/aboutus")}
            >
              ABOUT US
            </button>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="hidden md:flex w-full  flex-col items-center lg:justify-center">
          <img
            src="/images/heroImage2.png"
            className="h-60 md:h-[400px] lg:h-[500px] xl:h-[600px] animate-spin-slow"
            alt="Hero"
          />
        </div>
        <div className="w-full flex flex-col items-center justify-center md:hidden">
          <img
            src="/images/heroImage.png"
            className="h-60 md:h-[400px] lg:h-[500px] xl:h-[600px] animate-spin-slow"
            alt="Hero"
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
