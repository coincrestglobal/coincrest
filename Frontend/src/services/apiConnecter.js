export const apiConnector = async (
  method,
  url,
  bodyData = null,
  headers = {},
  params = null
) => {
  // console.log(bodyData);
  const queryString = params
    ? "?" + new URLSearchParams(params).toString()
    : "";

  const options = {
    method: method.toUpperCase(),
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  };

  if (bodyData && !["GET", "DELETE"].includes(method.toUpperCase())) {
    options.body = JSON.stringify(bodyData);
  }

  const response = await fetch(url + queryString, options);
  const result = await response.json();

  if (!response.ok) {
    console.error("API Error", result);
    throw new Error(result.message || "API call failed");
  }

  return result;
};
