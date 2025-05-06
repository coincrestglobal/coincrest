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
      <h1 className="text-xl h-24 sm:text-4xl md:text-5xl font-bold whitespace-pre-line leading-tight text-text-heading">
        {lines.map((line, i) => (
          <div key={i}>
            {line.includes("CoinCrest") ? (
              <>
                {line.replace("CoinCrest", "")}
                <span className="text-button">CoinCrest</span>
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
    <div className=" min-h-screen flex items-center justify-center text-text-heading text-3xl">
      <div className="relative min-h-screen bg-white"></div>
      <div className="grid grid-cols-2 h-[100vh] px-24 mt-10 ">
        <div className="w-[50vw]  flex flex-col items-center justify-center gap-10">
          {/* Typing Animated Text */}
          {renderStyledText()}
          <GradientBackground
            clor1="rgba(14,102,64,0.7)"
            size="35%"
            top="5%"
            left="3%"
          />
          <GradientBackground size="35%" top="11%" left="99%" />

          {/* Description */}
          <p className=" sm:text-lg text-text-subheading mt-2 max-w-2xl">
            Join <span className="text-button font-semibold">CoinCrest</span>{" "}
            today and start earning rewards through USDT staking. <br />
            Our platform supports TRC20 and BEP20 networks, making it easy{" "}
            <br />
            and secure to grow your investments.
          </p>
          {/* CTA Buttons */}
          <div className="flex gap-4 mt-4">
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
              REGISTER
            </button>
            <button
              className="bg-transparent border border-gray-300 px-8 py-3 text-sm font-semibold rounded-lg text-gray-300 hover:bg-gray-100 hover:text-gray-900 transition-all duration-300 hover:scale-105 hover:shadow-lg"
              onClick={() => navigate("/aboutus")}
            >
              ABOUT US
            </button>
          </div>
        </div>
        <div className="w-[50vw] flex flex-col items-center justify-center gap-10">
          <img
            src="/images/heroImage2.png"
            className="h-[600px] animate-spin-slow"
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
