function StatBox({ heading, subHeading }) {
  return (
    <div className="bg-primary-light text-text-heading rounded-xl border border-[#2D2642] min-w-[220px] px-10 h-[120px] flex items-center justify-center relative shadow-sm shadow-text-link ">
      {/* Left dots + circle */}
      <div className="absolute left-4 top-10 flex flex-col items-center space-y-1">
        <div className="w-4 h-4 border-2 rounded-full mb-1 bg-button" />
        <span className="w-1 h-1 bg-text-link rounded-full" />
        <span className="w-1 h-1 bg-text-link rounded-full" />
        <span className="w-1 h-1 bg-text-link rounded-full" />
      </div>

      {/* Main Content */}
      <div className="text-center space-y-2">
        <div className="text-4xl font-semibold">{heading}</div>
        <div className="text-sm text-gray-300">{subHeading}</div>
      </div>

      {/* Right dots + circle */}
      <div className="absolute right-4 top-10 flex flex-col items-center space-y-1">
        <div className="w-4 h-4 border-2 rounded-full mb-1 bg-button" />
        <span className="w-1 h-1 bg-text-link rounded-full" />
        <span className="w-1 h-1 bg-text-link rounded-full" />
        <span className="w-1 h-1 bg-text-link rounded-full" />
      </div>
    </div>
  );
}

export default StatBox;
