import { useRouteError } from "react-router";

function Error() {
  const error = useRouteError();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-purple-50">
      <div className="bg-purple-100 border border-purple-500 rounded-lg p-6 max-w-md text-center">
        <h1 className="text-2xl font-semibold text-purple-700">
          Oops! Something went wrong.
        </h1>
        <p className="text-purple-600 mt-3">
          {error.statusText || error.message}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-5 px-4 py-2 bg-purple-600 text-text-heading rounded hover:bg-purple-700 transition"
        >
          Refresh Page
        </button>
      </div>
    </div>
  );
}

export default Error;
