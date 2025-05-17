export const apiConnector = async (method, url, bodyData, headers, params) => {
  // console.log("body data is -> ", bodyData);
  // console.log("headers is -> ", headers);
  // console.log("params is -> ", params);
  // return axiosInstance({
  //   method: method,
  //   url: url,
  //   data: bodyData ?? undefined,
  //   headers: headers ?? undefined,
  //   params: params ?? undefined,
  // });

  const queryString = params?.toString() ? `?${params.toString()}` : "";
  const response = await fetch(url + queryString, {
    method: method,
    headers: headers ? headers : {},
    body: bodyData ? bodyData : null,
  });
  return await response.json();
};
