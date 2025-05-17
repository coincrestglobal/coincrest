function Loading() {
  return (
    <div className="flex items-center justify-center h-screen bg-primary-light">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-button-hover"></div>
        <div className="mt-4 text-white text-lg font-semibold flex items-center space-x-1">
          <span>Loading</span>
          <span className="animate-bounce [animation-delay:0s]">.</span>
          <span className="animate-bounce [animation-delay:0.2s]">.</span>
          <span className="animate-bounce [animation-delay:0.4s]">.</span>
        </div>
      </div>
    </div>
  );
}

export default Loading;
