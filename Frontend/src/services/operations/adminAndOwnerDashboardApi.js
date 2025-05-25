import { ownerAndAdminDashboardEndPoints } from "../apis";
import { apiConnector } from "../apiConnecter";

const {
  GET_ALL_USERS_API,
  GET_USER_DETAILS_API,
  GET_WITHDRAW_REQUESTS_API,
  APPROVE_WITHDRAW_REQUEST_API,
  GET_ALL_DEPOSITS_API,
  GET_ALL_REVIEWS_API,
  APPROVE_REVIEW_API,
  REJECT_REVIEW_API,
  GET_ALL_FEEDBACKS_API,
  RESPOND_FEEDBACK_API,
  GET_ALL_FAQS_API,
  ADD_FAQ_API,
  DELETE_FAQ_API,
  GET_TERMS_API,
  ADD_TERMS_API,
  DELETE_TERMS_API,
  GET_PRIVACY_API,
  ADD_PRIVACY_API,
  DELETE_PRIVACY_API,
  GET_PLANS_API,
  UPDATE_PLAN_API,
  GET_REFERRAL_API,
  UPDATE_REFERRAL_API,
  GET_TEAM_BONUSES_API,
  UPDATE_TEAM_BONUSES_API,
  GET_ALL_ADMINS,
  ADD_NEW_ADMIN,
  REMOVE_ADMIN,
  GET_ALL_ANNOUNCEMENTS,
  ADD_ANNOUNCEMENT,
  DELETE_ANNOUNCEMENT,
  GET_DASHBOARD_STATS_API,
  GET_DASHBOARD_STAKED_API,
  GET_DASHBOARD_PAYOUT_API,
} = ownerAndAdminDashboardEndPoints;

// <---------------- in all these Links, token is missing we have to add it for security purpose for each call ---------------->

//stats

//Fetch overall dashboard statistics for a given range.

export const fetchDashboardStats = async (params) => {
  let result = [];
  try {
    const response = await apiConnector(
      "GET",
      GET_DASHBOARD_STATS_API,
      null,
      {},
      params
    );
    if (response?.data?.success) {
      result = response.data;
    }
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
  }
  return result;
};

//Fetch staked amount chart data for a given range.

export const fetchStakedChartData = async (params) => {
  let result = [];
  try {
    const response = await apiConnector(
      "GET",
      GET_DASHBOARD_STAKED_API,
      null,
      {},
      params
    );
    if (response?.data?.success) {
      result = response.data;
    }
  } catch (error) {
    console.error("Failed to fetch staked data:", error);
  }
  return result;
};

//Fetch payout chart data for a given range.

export const fetchPayoutChartData = async (params) => {
  let result = [];
  try {
    const response = await apiConnector(
      "GET",
      GET_DASHBOARD_PAYOUT_API,
      null,
      {},
      params
    );
    if (response?.data?.success) {
      result = response.data;
    }
  } catch (error) {
    console.error("Failed to fetch payout data:", error);
  }
  return result;
};

//users

export const getAllUsers = async (token, params) => {
  let result = [];
  try {
    const response = await apiConnector(
      "GET",
      GET_ALL_USERS_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      },
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

export const getUserDetails = async (token, params) => {
  let result = [];
  try {
    const response = await apiConnector(
      "GET",
      GET_USER_DETAILS_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      },
      params
    );
    if (!response?.data?.success) {
    }
    result = response;
  } catch (error) {}
  return result;
};

//withdrawals

export const getWithdrawRequests = async (token, params) => {
  let result = [];
  try {
    const response = await apiConnector(
      "GET",
      GET_WITHDRAW_REQUESTS_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      },
      params
    );
    if (!response?.data?.success) {
      // Handle unsuccessful response if needed
    }
    result = response;
  } catch (error) {
    // Handle error if needed
  }
  return result;
};

export const approveWithdrawRequest = async (token, withdrawal_id) => {
  let result = null;
  try {
    const response = await apiConnector(
      "PATCH",
      `${APPROVE_WITHDRAW_REQUEST_API}/${withdrawal_id}`,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );
    if (!response?.data?.success) {
      // Handle unsuccessful response if needed
    }
    result = response;
  } catch (error) {
    // Handle error if needed
  }
  return result;
};

//deposits

export const getAllUsersDepositHistory = async (token, params) => {
  let result = [];
  try {
    const response = await apiConnector(
      "GET",
      GET_ALL_DEPOSITS_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      },
      params
    );
    if (!response?.data?.success) {
    }

    result = response;
  } catch (error) {}
  return result;
};

//reviews

export const getAllReviews = async (token, params) => {
  let result = [];
  try {
    const response = await apiConnector(
      "GET",
      GET_ALL_REVIEWS_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      },
      params
    );
    if (!response?.data?.success) {
    }
    result = response;
  } catch (error) {}
  return result;
};

export const acceptReview = async (token, reviewId) => {
  try {
    const response = await apiConnector(
      "POST",
      `${APPROVE_REVIEW_API}/${reviewId}`,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );
    return response;
  } catch (error) {}
};
export const rejectReview = async (reviewId) => {
  try {
    const response = await apiConnector(
      "POST",
      `${REJECT_REVIEW_API}/${reviewId}`,
      null,
      {}
    );
    return response;
  } catch (error) {}
};

//feedbacks

export const getAllFeedbacks = async (token, params) => {
  let result = [];
  try {
    const response = await apiConnector(
      "GET",
      GET_ALL_FEEDBACKS_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      },
      params
    );
    if (!response?.data?.success) {
    }
    result = response;
  } catch (error) {}
  return result;
};

export const respondToFeedback = async (feedbackId, responseMessage, token) => {
  try {
    const response = await apiConnector(
      "PATCH",
      `${RESPOND_FEEDBACK_API}/${feedbackId}`,
      { message: responseMessage },
      {
        Authorization: `Bearer ${token}`,
      }
    );
    return response;
  } catch (error) {}
};

//FAQs

export const getAllFaqs = async () => {
  try {
    const response = await apiConnector("GET", GET_ALL_FAQS_API);
    return response;
  } catch (error) {
    // handle error
    return null;
  }
};

export const addFaq = async (faqData) => {
  try {
    const response = await apiConnector("POST", ADD_FAQ_API, faqData);
    return response;
  } catch (error) {
    // handle error
    return null;
  }
};

export const deleteFaq = async (faqId) => {
  try {
    const response = await apiConnector("DELETE", `${DELETE_FAQ_API}/${faqId}`);
    return response;
  } catch (error) {
    // handle error
    return null;
  }
};

//T&C

export const getTerms = async () => {
  try {
    const response = await apiConnector("GET", GET_TERMS_API);
    return response;
  } catch (error) {
    return null;
  }
};

export const addTerms = async (termsData) => {
  // termsData example: { content: "Your terms content here" }
  try {
    const response = await apiConnector("POST", ADD_TERMS_API, termsData);
    return response;
  } catch (error) {
    return null;
  }
};

export const deleteTerms = async (termsId) => {
  try {
    const response = await apiConnector(
      "DELETE",
      `${DELETE_TERMS_API}/${termsId}`
    );
    return response;
  } catch (error) {
    return null;
  }
};

//Privacy Policy
export const getPrivacyPolicy = async () => {
  try {
    const response = await apiConnector("GET", GET_PRIVACY_API);
    return response;
  } catch (error) {
    return null;
  }
};

export const addPrivacyPolicy = async (privacyData) => {
  // privacyData example: { content: "Your privacy policy content here" }
  try {
    const response = await apiConnector("POST", ADD_PRIVACY_API, privacyData);
    return response;
  } catch (error) {
    return null;
  }
};

export const deletePrivacyPolicy = async (privacyId) => {
  try {
    const response = await apiConnector(
      "DELETE",
      `${DELETE_PRIVACY_API}/${privacyId}`
    );
    return response;
  } catch (error) {
    return null;
  }
};

//Earnings Management

// Plan Levels
export const getPlans = async () => {
  try {
    const response = await apiConnector("GET", GET_PLANS_API);
    return response;
  } catch (error) {
    return null;
  }
};

export const updatePlan = async (planLevelsData) => {
  //id dneeded
  try {
    const response = await apiConnector("PUT", UPDATE_PLAN_API, planLevelsData);
    return response;
  } catch (error) {
    return null;
  }
};

// Referral
export const getReferral = async () => {
  try {
    const response = await apiConnector("GET", GET_REFERRAL_API);
    return response;
  } catch (error) {
    return null;
  }
};

export const updateReferral = async (referralData) => {
  try {
    const response = await apiConnector(
      "PUT",
      UPDATE_REFERRAL_API,
      referralData
    );
    return response;
  } catch (error) {
    return null;
  }
};

// Team Bonuses
export const getTeamBonuses = async () => {
  try {
    const response = await apiConnector("GET", GET_TEAM_BONUSES_API);
    return response;
  } catch (error) {
    return null;
  }
};

export const updateTeamBonus = async (bonusesData) => {
  //id dneeded
  try {
    const response = await apiConnector(
      "PUT",
      UPDATE_TEAM_BONUSES_API,
      bonusesData
    );
    return response;
  } catch (error) {
    return null;
  }
};

//admins

// Get all admins
export const getAllAdmins = async () => {
  try {
    const response = await apiConnector("GET", GET_ALL_ADMINS);
    return response;
  } catch (error) {
    return null;
  }
};

// Add new admin
export const addNewAdmin = async (adminData, token) => {
  try {
    const response = await apiConnector("POST", ADD_NEW_ADMIN, adminData, {
      Authorization: `Bearer ${token}`,
    });
    return response;
  } catch (error) {
    return null;
  }
};

// Remove (fire) an admin
export const fireAdmin = async (id, token, password) => {
  try {
    const response = await apiConnector(
      "PATCH",
      `${REMOVE_ADMIN}/${id}`,
      { ownerPassword: password },
      {
        Authorization: `Bearer ${token}`,
      }
    );
    return response;
  } catch (error) {
    return null;
  }
};

//announcements

// Get all announcements
export const getAllAnnouncements = async () => {
  try {
    const response = await apiConnector("GET", GET_ALL_ANNOUNCEMENTS);
    return response;
  } catch (error) {
    return null;
  }
};

// Add a new announcement
export const addAnnouncement = async (data) => {
  try {
    const response = await apiConnector("POST", ADD_ANNOUNCEMENT, data);
    return response;
  } catch (error) {
    return null;
  }
};

// Delete an announcement by ID
export const deleteAnnouncement = async (announcementId) => {
  try {
    const response = await apiConnector("DELETE", DELETE_ANNOUNCEMENT, {
      id: announcementId,
    });
    return response;
  } catch (error) {
    return null;
  }
};
