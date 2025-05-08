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
  const { user, setUser } = useUser();

  const handleClick = () => {
    if (!user) {
      navigate("/login");
    } else {
      navigate("/dashboard/user");
    }
  };
  const navigate = useSafeNavigate();
  return (
    <div className="mt-16 px-32 bg-primary text-text-heading py-10">
      {/* Hero Section */}
      <div className="px-4 sm:px-6 lg:px-8 text-center">
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
        <h1 className="text-text-heading text-3xl sm:text-4xl font-bold flex justify-center items-center gap-4">
          <span className=" text-4xl sm:text-5xl text-button">««</span>
          <span>About CoinCrest</span>
          <span className="text-4xl sm:text-5xl text-button">»»</span>
        </h1>
        <p className="text-text-heading text-lg sm:text-xl mt-2 max-w-2xl mx-auto">
          CoinCrest is the crypto investment platform designed for sustainable
          returns. Secure, transparent, and user-focused.
        </p>
      </div>

      {/* About CoinCrest Section */}
      <div>
        <AboutSomething
          heading={"What is CoinCrest?"}
          subHeadings={subHeadings}
        />
      </div>
      <section className="py-16">
        <h1 className="text-text-heading text-3xl sm:text-4xl font-bold flex justify-center items-center gap-4">
          <span className="text-button text-4xl sm:text-5xl">««</span>
          <span> Why Choose CoinCrest?</span>
          <span className="text-button text-4xl sm:text-5xl">»»</span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 py-16 gap-6">
          {benefitsData.map((benefit, index) => (
            <div
              key={index}
              className="text-text-heading rounded-xl border bg-custom-gradient border-[#2D2642] w-full h-[200px] px-5 flex items-center justify-center relative shadow-sm shadow-text-link"
            >
              {/* Left dots + circle */}
              <div className="absolute left-4 top-16 flex flex-col items-center space-y-1">
                <div className="w-4 h-4 border-2 bg-button rounded-full mb-1" />
                <span className="w-1 h-1 bg-text-link rounded-full" />
                <span className="w-1 h-1 bg-text-link rounded-full" />
                <span className="w-1 h-1 bg-text-link rounded-full" />
              </div>

              {/* Main Content */}
              <div className="text-center space-y-2 p-2">
                <div className="text-xl font-semibold">{benefit.title}</div>
                <p className="text-sm text-gray-300 mt-1">
                  {benefit.description}
                </p>
              </div>

              {/* Right dots + circle */}
              <div className="absolute right-4 top-16 flex flex-col items-center space-y-1">
                <div className="w-4 h-4 border-2 bg-button rounded-full mb-1" />
                <span className="w-1 h-1 bg-text-link rounded-full" />
                <span className="w-1 h-1 bg-text-link rounded-full" />
                <span className="w-1 h-1 bg-text-link rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* how it works */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="text-button text-4xl sm:text-5xl ">««</span>
              <span className="p-4">How CoinCrest Works</span>
              <span className="text-button text-4xl sm:text-5xl">»»</span>
            </h2>
            <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto">
              Discover the benefits, process of staking USDT, and earning weekly
              rewards efficiently with CoinCrest.
            </p>
          </div>

          {/* Stake */}
          <div className="grid gap-10 md:grid-cols-2 items-center mb-10">
            <div className="flex flex-col gap-4 order-2 md:order-none">
              <h3 className="text-2xl sm:text-3xl font-semibold">
                Stake Your USDT and Watch Your Earnings Grow Weekly!
              </h3>
              <p className="text-gray-300 text-base sm:text-lg">
                Deposit your USDT easily into CoinCrest to kickstart your
                rewards. Start earning weekly interest and maximizing your
                crypto passive income!
              </p>
              <button
                className="w-fit px-5 py-2 bg-button  text-text-heading rounded-md hover:bg-button-hover transition text-sm sm:text-base"
                onClick={handleClick}
              >
                Start Earning Now
              </button>
            </div>
            <img src="/images/aboutUs.png" className="h-72 w-full"></img>
          </div>

          {/* Refer */}
          <div className="flex  items-center py-2">
            <div className="flex flex-col gap-4 ">
              <h3 className="text-2xl sm:text-3xl font-semibold">
                Grow Your Earnings Through Referrals
              </h3>
              <p className="text-gray-300 text-base sm:text-lg">
                Invite friends to join CoinCrest and watch your rewards grow.
                Build your team and earn bonuses for every successful referral.
              </p>
              <ul className="list-disc list-inside text-gray-400 text-sm sm:text-base">
                <li>Earn more by sharing</li>
                <li>Join our mission for faster and monthly max rewards</li>
              </ul>
              <button
                className="w-fit px-5 py-2 bg-button  text-text-heading rounded-md hover:bg-button-hover transition text-sm sm:text-base"
                onClick={handleClick}
              >
                Start Earning Now
              </button>
            </div>
            <img src="/images/aboutUs2.png" className="mb-20 h-90 "></img>
          </div>
        </div>
      </section>
    </div>
  );
}
