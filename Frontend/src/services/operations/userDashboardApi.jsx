import { userDashboardEndPoints } from "../apis";
import { apiConnector } from "../apiConnecter";

const { GET_PLANS } = userDashboardEndPoints;

export const getPlans = async () => {
  let result = [];
  try {
    const response = await apiConnector("GET", GET_PLANS);
    if (!response?.data?.success) {
    }
    result = response;
  } catch (error) {}
  return result;
};
