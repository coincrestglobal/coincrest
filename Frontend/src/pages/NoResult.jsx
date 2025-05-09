import { AlertCircle } from "lucide-react";

function NoResult() {
  return (
    <div className="flex flex-col items-center justify-center h-[500px] bg-primary-light">
      {/* Icon */}
      <AlertCircle className="text-button text-6xl mb-4" />

      {/* Title */}
      <h1 className="text-3xl font-bold text-text-heading">No Results Found</h1>

      {/* Message */}
      <p className="text-lg mt-2 text-center px-4 text-text-subheading">
        Sorry, we couldn’t find any matching results for your search or filter
        criteria.
      </p>

      {/* Button to Reset */}
      <button
        onClick={() => window.location.reload()}
        className="mt-6 px-6 py-3 bg-button text-text-heading rounded-md hover:bg-button-hover cursor-pointer transition"
      >
        Reset Filters
      </button>
    </div>
  );
}

export default NoResult;
