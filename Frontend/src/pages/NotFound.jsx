import { AlertTriangle } from "lucide-react";
function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-primary-light">
      <AlertTriangle className=" text-6xl mb-4" />
      <h1 className="text-4xl font-bold text-text-heading">404</h1>
      <p className="text-lg mt-2 text-text-subheading">
        The page you’re looking for doesn’t exist.
      </p>
      <a
        href="/"
        className="mt-6 px-6 py-3 bg-button text-text-heading rounded-md hover:bg-button-hover transition"
      >
        Go Home
      </a>
    </div>
  );
}

export default NotFound;
