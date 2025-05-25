import { earningEndPoints } from "../apis";
import { apiConnector } from "../apiConnecter";

const { GET_REFERRAL_PLAN, GET_TEAM_REWARDS } = earningEndPoints;
export const getReferralPlan = async () => {
  try {
    const response = await apiConnector("GET", GET_REFERRAL_PLAN);
    return response;
  } catch (error) {
    console.error("Error fetching referral plan:", error);
    throw error;
  }
};
export const getTeamBasedRewards = async () => {
  try {
    const response = await apiConnector("GET", GET_TEAM_REWARDS);
    return response;
  } catch (error) {
    console.error("Error fetching team-based rewards:", error);
    throw error;
  }
};
