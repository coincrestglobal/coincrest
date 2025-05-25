import { CirclePlus, Gem } from "lucide-react";

function AboutCard({ heading, subHeadings }) {
  return (
    <div className="relative w-full h-full lg:h-[320px]  rounded-2xl border border-button text-text-heading px-6 py-8 overflow-hidden flex flex-col sm:flex-row items-center shadow-md transition-all duration-300">
      {/* Icon Circle */}
      <div className="absolute top-4 left-4 w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-button bg-[#15152b] flex items-center justify-center z-10">
        <Gem className="w-5 h-5 sm:w-6 sm:h-6 text-button" />
      </div>

      {/* Decorative Dots - Top Left */}
      <div className="absolute top-8 left-20 flex gap-1.5">
        <div className="w-2 h-2 bg-orange-300 rounded-full" />
        <div className="w-2 h-2 bg-orange-200 rounded-full" />
        <div className="w-2 h-2 bg-orange-100 rounded-full" />
      </div>

      {/* Decorative Dots - Left Vertical */}
      <div className="absolute left-8 top-20 flex flex-col gap-1.5">
        <div className="w-2 h-2 bg-orange-300 rounded-full" />
        <div className="w-2 h-2 bg-orange-200 rounded-full" />
        <div className="w-2 h-2 bg-orange-100 rounded-full" />
      </div>

      {/* Decorative Dots - Bottom Right Vertical */}
      <div className="absolute right-7   bottom-16 flex flex-col gap-1.5">
        <div className="w-2 h-2 bg-[#39394f] rounded-full" />
        <div className="w-2 h-2 bg-[#44445b] rounded-full" />
        <div className="w-2 h-2 bg-[#51516b] rounded-full" />
      </div>

      {/* Decorative Dots - Bottom Right Horizontal */}
      <div className="absolute bottom-7 right-16 flex gap-1.5">
        <div className="w-2 h-2 bg-[#39394f] rounded-full" />
        <div className="w-2 h-2 bg-[#44445b] rounded-full" />
        <div className="w-2 h-2 bg-[#51516b] rounded-full" />
      </div>

      {/* Plus Icons */}
      <CirclePlus className="absolute top-6 right-6 text-[#44445c] w-5 h-5" />
      <CirclePlus className="absolute bottom-6 left-6 text-[#44445c] w-5 h-5" />
      <CirclePlus className="absolute bottom-6 right-6 text-[#44445c] w-5 h-5" />

      {/* Main Content */}
      <div className="relative z-10 px-6 md:px-10 py-4 w-full sm:w-fit max-h-[250px] overflow-y-auto scrollbar-none ">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center text-text-heading">
          {heading}
        </h2>

        <div className="text-sm sm:text-base text-text-heading/80 space-y-2">
          {subHeadings.map((item, index) => (
            <p key={index} className="flex items-start leading-relaxed">
              <span className="text-text-heading text-lg mr-2 mt-1">•</span>
              <span>{Object.values(item)[0]}</span>
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

function AboutSomething({ heading, subHeadings }) {
  return (
    <div className="relative flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-20 px-4 sm:px-6 lg:px-32 py-10 sm:py-16">
      {/* Background overlay */}
      <div className="absolute w-[100%] md:w-[70%] lg:w-[70%] max-w-5xl h-[280px] md:h-[350px] lg:h-[250px] rounded-lg overflow-hidden">
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
      <div className="relative z-10 w-full md:w-[70%] flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-16">
        <AboutCard heading={heading} subHeadings={subHeadings} />
      </div>
    </div>
  );
}

export default AboutSomething;
