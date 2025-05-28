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
      className={`flex flex-col md:flex-col lg:flex-row h-fit items-center gap-8 md:gap-16 my-10 md:my-16
        ${reverse ? "lg:flex-row-reverse" : ""}
      `}
    >
      {/* Image Section */}
      <div className="w-full md:w-full lg:w-1/2 flex justify-center px-4 lg:px-8">
        <img
          src={imgSrc}
          alt={title}
          className="h-[200px] sm:h-[250px] md:h-[300px] object-contain transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* Text Section */}
      <div className="w-full md:w-full lg:w-1/2 bg-primary-light lg:bg-transparent rounded-2xl shadow-lg p-6 sm:p-8 md:p-10 space-y-5">
        <h2 className="text-lg md:text-3xl font-bold text-text-highlighted ">
          {title}
        </h2>
        <p className="text-text-subheading text-base sm:text-lg leading-relaxed">
          {desc}
        </p>
      </div>
    </div>
  );
};

function Services() {
  return (
    <div className="py-10 px-4 md:px-16 lg:px-32">
      <h1 className="text-center text-3xl sm:text-4xl md:text-5xl font-extrabold text-text-heading flex items-center justify-center gap-3 sm:gap-5">
        <span className="text-text-highlighted text-4xl md:text-6xl">««</span>
        <span className="text-text-heading text-2xl sm:text-3xl md:text-4xl tracking-tight pt-1 md:pt-2">
          Our Features
        </span>
        <span className="text-text-highlighted text-4xl sm:text-5xl md:text-6xl">
          »»
        </span>
      </h1>

      <div className="flex flex-col items-center justify-center">
        {services.map((service, index) => (
          <div key={index} className="w-full">
            <ServiceCard
              title={service.title}
              desc={service.desc}
              imgSrc={service.imgSrc}
              reverse={index % 2 !== 0}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Services;
