import { ownerAndAdminDashboardEndPoints } from "../apis";
import { apiConnector } from "../apiConnecter";

const { GET_ALL_USERS_API, GET_USER_DETAILS_API } =
  ownerAndAdminDashboardEndPoints;

export const getAllUsers = async (params) => {
  let result = [];
  try {
    const response = await apiConnector(
      "GET",
      GET_ALL_USERS_API,
      null,
      {},
      params
    );
    if (!response?.data?.success) {
    }
    result = response;
  } catch (error) {
    console.log(error);
  }
  return result;
};
export const getUserDetails = async (params) => {
  let result = [];
  try {
    const response = await apiConnector(
      "GET",
      GET_USER_DETAILS_API,
      null,
      {},
      params
    );
    if (!response?.data?.success) {
    }
    result = response;
  } catch (error) {}
  return result;
};
