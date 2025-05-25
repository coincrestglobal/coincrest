import AboutSomething from "../components/common/AboutSomething";
import GradientBackground from "../components/common/Gradient";
import useSafeNavigate from "../utils/useSafeNavigate";
import { useUser } from "../components/common/UserContext.jsx";

const subHeadings = [
  {
    text: "CoinCrest is an advanced ecosystem of innovative financial products and services, offering clients broad access to high-performance investment tools in the cryptocurrency market. Our platform is designed to deliver sustainable weekly profits and empower users through staking, rewards, and team building.",
  },
  {
    text: "CoinCrest is dedicated to building a reliable, intuitive, and transparent platform where individuals from all backgrounds can engage in cryptocurrency investing with confidence. We offer a secure, professional-led environment for users to unlock the full potential of their crypto assets, with staking opportunities that provide passive income and maximizing returns.",
  },
];

const benefitsData = [
  {
    title: "Sustainable Profits",
    description:
      "Earn 3% weekly ROI with reliable, long-term staking rewards. Your investment grows steadily over time.",
  },
  {
    title: "Referral System",
    description:
      "Refer others and earn 10% of their deposits. Build your network and increase your earnings with our team-building model.",
  },
  {
    title: "Security & Transparency",
    description:
      "With a crypto-only ecosystem and multisig wallet for withdrawals, we ensure the highest level of security and transparency.",
  },
];

export default function AboutUs() {
  const { user } = useUser();
  const navigate = useSafeNavigate();

  const handleClick = () => {
    if (!user) {
      navigate("/login");
    } else {
      navigate("/dashboard/user");
    }
  };

  return (
    <div className="mt-16 px-4 md:px-16 lg:px-32 bg-primary text-text-heading py-10">
      {/* Hero Section */}
      <div className="text-center">
        <GradientBackground
          clor1="var(--grad2)"
          size="40%"
          top="10%"
          left="5%"
        />
        <GradientBackground
          clor1="var(--grad2)"
          size="40%"
          top="45%"
          left="5%"
        />
        <GradientBackground
          clor1="var(--grad2)"
          size="35%"
          top="80%"
          left="5%"
        />
        <GradientBackground size="40%" top="22%" left="95%" />
        <GradientBackground size="40%" top="65%" left="95%" />

        <h1 className="text-center text-3xl sm:text-4xl md:text-5xl font-extrabold text-text-heading  flex items-center justify-center gap-3 sm:gap-5">
          <span className="text-text-highlighted text-4xl  md:text-6xl">
            ««
          </span>
          <span className="text-text-heading text-2xl sm:text-3xl md:text-4xl tracking-tight pt-1 md:pt-2">
            About CoinCrest
          </span>
          <span className="text-text-highlighted text-4xl sm:text-5xl md:text-6xl">
            »»
          </span>
        </h1>
        <p className="text-base sm:text-lg mt-2 max-w-xl mx-auto">
          CoinCrest is the crypto investment platform designed for sustainable
          returns.
        </p>
      </div>

      {/* About CoinCrest Section */}
      <div>
        <AboutSomething
          heading={"What is CoinCrest?"}
          subHeadings={subHeadings}
        />
      </div>

      {/* Why Choose */}
      <section className="py-10">
        <h1 className="text-center text-3xl sm:text-4xl md:text-5xl font-extrabold text-text-heading  flex items-center justify-center gap-3 sm:gap-5">
          <span className="text-text-highlighted text-4xl  md:text-6xl">
            ««
          </span>
          <span className="text-text-heading text-2xl sm:text-3xl md:text-4xl tracking-tight pt-1 md:pt-2">
            WHy Choose CoinCrest
          </span>
          <span className="text-text-highlighted text-4xl sm:text-5xl md:text-6xl">
            »»
          </span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 md:justify-center items-center">
          {benefitsData.map((benefit, index) => (
            <div
              key={index}
              className="rounded-xl bg-custom-gradient shadow-md shadow-button h-[200px] px-5 flex items-center justify-center relative"
            >
              {/* Left Dots */}
              <div className="absolute left-4 top-20 flex flex-col items-center space-y-1">
                <div className="w-4 h-4 border-2 bg-button rounded-full mb-1" />
                <span className="w-1 h-1 bg-text-link rounded-full" />
                <span className="w-1 h-1 bg-text-link rounded-full" />
                <span className="w-1 h-1 bg-text-link rounded-full" />
              </div>

              {/* Content */}
              <div className="text-center space-y-2 py-2 px-4">
                <div className="text-lg md:text-xl font-semibold">
                  {benefit.title}
                </div>
                <p className="text-sm text-gray-300">{benefit.description}</p>
              </div>

              {/* Right Dots */}
              <div className="absolute right-4 top-20 flex flex-col items-center space-y-1">
                <div className="w-4 h-4 border-2 bg-button rounded-full mb-1" />
                <span className="w-1 h-1 bg-text-link rounded-full" />
                <span className="w-1 h-1 bg-text-link rounded-full" />
                <span className="w-1 h-1 bg-text-link rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-10 bg-background">
        <div className="max-w-7xl mx-auto flex flex-col px-4">
          {/* Section Heading */}
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-text-heading flex items-center justify-center gap-4">
              <span className="text-text-highlighted text-4xl md:text-6xl">
                ««
              </span>
              <span className="tracking-tight pt-1 md:pt-2 text-2xl sm:text-3xl md:text-4xl">
                How CoinCrest Works
              </span>
              <span className="text-text-highlighted text-4xl md:text-6xl">
                »»
              </span>
            </h1>
            <p className="text-gray-300 mt-4 text-sm md:text-lg max-w-xl mx-auto">
              Discover the benefits, process of staking USDT, and earning weekly
              rewards.
            </p>
          </div>

          {/* Stake Section */}
          <div className="flex flex-col-reverse md:flex-row items-center gap-6 mb-10">
            {/* Content */}
            <div className="w-full md:w-1/2 bg-primary-light md:bg-transparent rounded-2xl shadow-lg p-6 space-y-5">
              <h3 className="text-xl md:text-2xl font-semibold">
                Stake Your USDT and Watch Your Earnings Grow!
              </h3>
              <p className="text-gray-300 text-sm sm:text-base">
                Deposit your USDT into CoinCrest to start earning passive income
                weekly.
              </p>
              <button
                className="w-fit px-4 py-2 bg-button text-text-heading rounded hover:bg-button-hover transition text-sm sm:text-base"
                onClick={handleClick}
              >
                Start Earning Now
              </button>
            </div>

            {/* Image */}
            <img
              src="/images/aboutUs.png"
              className="h-64 w-full md:w-1/2 object-contain"
              alt="Stake USDT"
            />
          </div>

          {/* Refer Section */}
          <div className="flex flex-col-reverse md:flex-row items-center gap-6">
            {/* Content */}
            <div className="w-full md:w-1/2 bg-primary-light md:bg-transparent rounded-2xl shadow-lg p-6 space-y-5">
              <h3 className="text-xl sm:text-2xl font-semibold">
                Grow Your Earnings Through Referrals
              </h3>
              <p className="text-gray-300 text-sm sm:text-base">
                Invite friends and build your team to increase your passive
                income through bonuses.
              </p>
              <ul className="list-disc list-inside text-gray-400 text-sm sm:text-base space-y-1">
                <li>Earn more by sharing</li>
                <li>Unlock monthly max rewards</li>
              </ul>
              <button
                className="w-fit px-4 py-2 bg-button text-text-heading rounded hover:bg-button-hover transition text-sm sm:text-base"
                onClick={handleClick}
              >
                Start Earning Now
              </button>
            </div>

            {/* Image */}
            <img
              src="/images/aboutUs2.png"
              className="h-64 w-full md:w-1/2 object-contain"
              alt="Referral System"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
