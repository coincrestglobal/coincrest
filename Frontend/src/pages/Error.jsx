import { useRouteError } from "react-router";

function Error() {
  const error = useRouteError();

  return (
    <div className="flex flex-col items-center justify-center h-screen ">
      <div className="bg-primary-light border border-button rounded-lg p-6 max-w-md text-center">
        <h1 className="text-2xl font-semibold text-text-heading">
          Oops! Something went wrong.
        </h1>
        <p className="text-text-subheading mt-3">
          {error.statusText || error.message}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-5 px-4 py-2 bg-button text-text-heading rounded hover:bg-button-hover transition"
        >
          Refresh Page
        </button>
      </div>
    </div>
  );
}

export default Error;
