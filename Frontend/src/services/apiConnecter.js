import { toast } from "react-toastify";
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

    // Don't set Content-Type manually if sending FormData
    if (!isFormData) {
      options.headers["Content-Type"] = "application/json";
    }
  }

  const response = await fetch(url + queryString, options);
  const result = await response.json();

  if (!response.ok) {
    toast.error(
      result.message || "Something went wrong. Please try again after a while"
    );
  }

  return result;
};
