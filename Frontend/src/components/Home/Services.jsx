import React from "react";

const services = [
  {
    title: "Guaranteed Withdrawals Within 24 Hours",
    desc: "Your money, your control — At Coin Crest, we promise 100% assured withdrawals. Once your decided time is complete, your funds (including interest) will be transferred to your account within 24 hours — fast, reliable, and secure.",
    imgSrc: "/images/feature1.png",
  },
  {
    title: "Fixed and Assured Interest Returns",
    desc: "Grow your wealth with certainty — We offer guaranteed interest on your deposits. No hidden conditions, no market risks. You know exactly how much you’ll earn at the end of your decided period.",
    imgSrc: "/images/feature2.png",
  },
  {
    title: "Earn Extra Bonuses with Referrals",
    desc: "Share and Earn — Invite your friends and circle using your unique referral link. For every successful referral, you earn extra bonuses on top of your guaranteed returns. The more you share, the more you earn!",
    imgSrc: "/images/feature3.png",
  },
];

const ServiceCard = ({ title, desc, imgSrc, reverse = false }) => {
  return (
    <div
      className={`flex flex-col md:flex-row items-center  ${
        reverse ? "md:flex-row-reverse" : ""
      }`}
    >
      <div
        className={`w-full ml-20 md:ml-0 md:w-1/2 flex justify-center px-4 sm:px-6 ${
          reverse ? "mr-40 md:mr-0" : ""
        }`}
      >
        <img
          src={imgSrc}
          className="h-[200px] sm:h-[250px] md:h-[300px] object-contain"
          alt={title}
        />
      </div>
      <div className={`w-full md:w-1/2 space-y-4 flex flex-col items-start `}>
        <h1 className="w-full md:w-[60%] text-xl sm:text-2xl md:text-3xl text-text-highlighted font-semibold">
          {title}
        </h1>
        <p className="text-sm sm:text-base text-text-subheading w-full md:w-[80%]">
          {desc}
        </p>
      </div>
    </div>
  );
};

function Services() {
  return (
    <div className="py-10 px-4 sm:px-8 md:px-16 lg:px-32 relative">
      <h1 className="text-center text-2xl sm:text-3xl md:text-4xl font-bold text-text-heading flex justify-center items-center gap-4">
        <span className="text-button text-3xl sm:text-4xl md:text-5xl">««</span>
        <span className="text-text-heading">Our features</span>
        <span className="text-button text-3xl sm:text-4xl md:text-5xl">»»</span>
      </h1>
      <div className="flex flex-col items-center justify-center py-10 ">
        {services.map((service, index) => (
          <div key={index} className="w-full">
            <ServiceCard
              title={service.title}
              desc={service.desc}
              imgSrc={service.imgSrc}
              reverse={index % 2 !== 0} // Alternate: even index -> normal, odd index -> reverse
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Services;
