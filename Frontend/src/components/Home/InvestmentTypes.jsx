import { CirclePlus, Gem } from "lucide-react";
import GradientBackground from "../common/Gradient";
import useSafeNavigate from "../../utils/useSafeNavigate";

function InvestmentCard() {
  const navigate = useSafeNavigate();
  return (
    <div className="relative w-full h-auto sm:h-[360px] lg:h-[320px] bg-opacity-70 rounded-xl border-2 border-button text-text-heading px-4 sm:px-6 py-6 sm:py-8 overflow-hidden flex flex-col sm:flex-row items-center justify-center transition-all duration-300">
      {/* Shield Circle */}
      <div className="absolute top-2 left-2.5 w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-button flex items-center justify-center bg-[#15152b]">
        <Gem className="w-4 h-4 sm:w-5 sm:h-5" />
      </div>

      {/* Decorative Dots */}
      <div className="absolute top-6 left-16 flex gap-2">
        <div className="w-1.5 h-1.5 bg-orange-300 rounded-full" />
        <div className="w-1.5 h-1.5 bg-orange-200 rounded-full" />
        <div className="w-1.5 h-1.5 bg-orange-100 rounded-full" />
      </div>
      <div className="absolute left-6 top-16 flex flex-col gap-2">
        <div className="w-1.5 h-1.5 bg-orange-300 rounded-full" />
        <div className="w-1.5 h-1.5 bg-orange-200 rounded-full" />
        <div className="w-1.5 h-1.5 bg-orange-100 rounded-full" />
      </div>
      <div className="absolute right-6 bottom-14 flex flex-col gap-2">
        <div className="w-1.5 h-1.5 bg-[#39394f] rounded-full" />
        <div className="w-1.5 h-1.5 bg-[#44445b] rounded-full" />
        <div className="w-1.5 h-1.5 bg-[#51516b] rounded-full" />
      </div>
      <div className="absolute bottom-6 right-14 flex gap-2">
        <div className="w-1.5 h-1.5 bg-[#39394f] rounded-full" />
        <div className="w-1.5 h-1.5 bg-[#44445b] rounded-full" />
        <div className="w-1.5 h-1.5 bg-[#51516b] rounded-full" />
      </div>

      {/* Plus Icons */}
      <CirclePlus className="absolute top-5 right-5 text-[#44445c] w-4 h-4 sm:w-5 sm:h-5" />
      <CirclePlus className="absolute bottom-5 left-5 text-[#44445c] w-4 h-4 sm:w-5 sm:h-5" />
      <CirclePlus className="absolute bottom-5 right-5 text-[#44445c] w-4 h-4 sm:w-5 sm:h-5" />

      {/* Content */}
      <div className="relative z-10 px-4 sm:px-16 py-4 sm:py-6 text-center sm:text-left w-full sm:w-fit">
        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-text-heading">
          For Investors
        </h2>
        <div className="text-sm sm:text-base text-text-heading/80 space-y-2">
          <p>
            Stake USDT (TRC20) and earn weekly returns up to{" "}
            <span className="text-text-highlighted font-medium">7%</span>.
          </p>
          <p>
            Choose from{" "}
            <span className="text-text-highlighted font-medium">
              7 unique levels
            </span>{" "}
            starting at just $100:
          </p>
          <p className="text-text-heading text-base sm:text-lg">
            Levels range from Star to Satoshi with increasing rewards.
          </p>
          <p>
            Refer friends and earn{" "}
            <span className="text-text-highlighted font-medium">10%</span> of
            their deposits instantly.
          </p>
          <p className="text-text-heading">
            Build a team and unlock monthly bonuses of up to $500!
          </p>
        </div>
        <button
          onClick={() => navigate("/earnings")}
          className="text-text-highlighted hover:text-text-link underline mt-4 inline-block cursor-pointer"
        >
          View Earning Plans
        </button>
      </div>
    </div>
  );
}

function InvestmentTypes() {
  return (
    <div>
      <div className="px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-center text-3xl sm:text-4xl md:text-5xl font-extrabold text-text-heading  flex items-center justify-center gap-3 sm:gap-5">
          <span className="text-text-highlighted text-4xl  md:text-6xl">
            ««
          </span>
          <span className="text-text-heading text-2xl sm:text-3xl md:text-4xl tracking-tight pt-1 md:pt-2">
            Grow with Us
          </span>
          <span className="text-text-highlighted text-4xl sm:text-5xl md:text-6xl">
            »»
          </span>
        </h1>
        <p className="text-text-heading text-base sm:text-lg lg:text-xl mt-2 max-w-2xl mx-auto">
          Explore flexible and fixed-term staking plans designed to help you
          earn passive income and maximize your returns.
        </p>
      </div>
      <GradientBackground size="43%" top="44%" left="2%" />

      <div className="relative flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-20 px-4 sm:px-6 lg:px-32 py-10 sm:py-16">
        {/* Background overlay */}
        <div className="absolute w-[100%] md:w-[70%] lg:w-[70%] max-w-5xl h-[380px] md:h-[350px] lg:h-[250px] rounded-lg overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-10" />
          <video
            src="/images/video1.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        {/* Cards Container */}
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-16">
          <InvestmentCard />
        </div>
      </div>
    </div>
  );
}

export default InvestmentTypes;
