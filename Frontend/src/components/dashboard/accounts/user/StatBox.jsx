function StatBox({ heading, subHeading }) {
  return (
    <div
      className="bg-primary-light text-text-heading rounded-xl border border-[#2D2642] 
                    min-w-[200px] px-6 sm:px-8 md:px-10 
                    h-[100px] sm:h-[110px] md:h-[120px] 
                    flex items-center justify-center relative 
                    shadow-sm shadow-text-link"
    >
      {/* Left dots + circle */}
      <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 flex flex-col items-center space-y-1">
        <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 rounded-full mb-1 bg-button" />
        <span className="w-1 h-1 bg-text-link rounded-full" />
        <span className="w-1 h-1 bg-text-link rounded-full" />
        <span className="w-1 h-1 bg-text-link rounded-full" />
      </div>

      {/* Main Content */}
      <div className="text-center space-y-1 sm:space-y-2">
        <div className="text-2xl sm:text-3xl md:text-4xl font-semibold">
          {heading}
        </div>
        <div className="text-xs sm:text-sm text-gray-300">{subHeading}</div>
      </div>

      {/* Right dots + circle */}
      <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 flex flex-col items-center space-y-1">
        <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 rounded-full mb-1 bg-button" />
        <span className="w-1 h-1 bg-text-link rounded-full" />
        <span className="w-1 h-1 bg-text-link rounded-full" />
        <span className="w-1 h-1 bg-text-link rounded-full" />
      </div>
    </div>
  );
}

export default StatBox;
