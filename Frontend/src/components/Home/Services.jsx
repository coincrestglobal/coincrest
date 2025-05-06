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
      className={`flex flex-col md:flex-row items-center justify-center  ${
        reverse ? "md:flex-row-reverse" : ""
      }`}
    >
      <div className="md:w-1/2 flex justify-center">
        <img src={imgSrc} className="h-[300px]" alt={title} />
      </div>
      <div className="md:w-1/2 space-y-4 flex flex-col items-start">
        <h1 className="text-text-highlighted text-3xl w-[60%]">{title}</h1>
        <p className="text-text-subheading w-[80%]">{desc}</p>
      </div>
    </div>
  );
};

function Services() {
  return (
    <div className="py-10 px-32 relative">
      <h1 className="text-text-heading text-3xl sm:text-4xl font-bold flex justify-center items-center gap-4">
        <span className="text-button text-4xl sm:text-5xl">««</span>
        <span className="text-text-heading text-gr ">Our features</span>
        <span className="text-button text-4xl sm:text-5xl">»»</span>
      </h1>
      <div className=" flex justify-center items-center flex-wrap py-10">
        {services.map((service, index) => (
          <div key={index} className="flex flex-col items-center w-full">
            <ServiceCard
              title={service.title}
              desc={service.desc}
              imgSrc={service.imgSrc}
              reverse={index % 2 !== 0} // Alternate: even index -> normal, odd index -> reverse
            />
          </div>
        ))}
      </div>

      {/* <Gradient size="200px" top="50px" left="50px" color="secondary2" /> */}
    </div>
  );
}

export default Services;
