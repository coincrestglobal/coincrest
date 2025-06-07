import { toast } from "react-toastify";

let hasToastShowed = false;

export const apiConnector = async (
  method,
  url,
  bodyData = null,
  headers = {},
  params = null
) => {
  const queryString = params
    ? "?" + new URLSearchParams(params).toString()
    : "";

  const isFormData = bodyData instanceof FormData;

  const options = {
    method: method.toUpperCase(),
    headers: {
      ...headers,
    },
  };

  if (bodyData && !["GET", "DELETE"].includes(method.toUpperCase())) {
    options.body = isFormData ? bodyData : JSON.stringify(bodyData);
    if (!isFormData) {
      options.headers["Content-Type"] = "application/json";
    }
  }

  // Utility to fetch with timeout (default 15s)
  const fetchWithTimeout = (resource, options = {}, timeout = 15000) => {
    return Promise.race([
      fetch(resource, options),
      new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("Request timed out after 15s")),
          timeout
        )
      ),
    ]);
  };

  // Internal request attempt with retry fallback
  const makeRequest = async (attempt = 1) => {
    try {
      const response = await fetchWithTimeout(url + queryString, options);
      const result = await response.json();

      if (result.isOldDevice) {
        localStorage.removeItem("user");
        if (!hasToastShowed) {
          toast.error(result.message);
          hasToastShowed = true;
        }
        setTimeout(() => {
          window.location.href = "/";
        }, 5000);
        return result;
      }

      if (!response.ok) {
        throw new Error(result.message || "API request failed");
      }

      return result;
    } catch (error) {
      if (attempt === 1) {
        return makeRequest(2); // Retry once only
      }
      throw error;
    }
  };

  return makeRequest(); // Auto-retry logic triggered internally
};
