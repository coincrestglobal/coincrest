import { ownerAndAdminDashboardEndPoints } from "../apis";
import { apiConnector } from "../apiConnecter";
import { toast } from "react-toastify";

const {
  GET_ALL_USERS_API,
  GET_USER_DETAILS_API,
  GET_WITHDRAW_REQUESTS_API,
  APPROVE_WITHDRAW_REQUEST_API,
  GET_ALL_DEPOSITS_API,
  GET_ALL_REVIEWS_API,
  GET_REVIEWS_API,
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
  GET_ALL_ADMINS,
  ADD_NEW_ADMIN,
  REMOVE_ADMIN,
  GET_ALL_ANNOUNCEMENTS,
  ADD_ANNOUNCEMENT,
  DELETE_ANNOUNCEMENT,
  GET_STATS,
} = ownerAndAdminDashboardEndPoints;

//stats

//Fetch overall dashboard statistics for a given range.

export const statsData = async (token, params) => {
  try {
    const response = await apiConnector(
      "GET",
      GET_STATS,
      null,
      {
        Authorization: `Bearer ${token}`,
      },
      params
    );
    return response;
  } catch {}
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
    toast.success(response.message);
    result = response;
  } catch (error) {
    toast.error("Failed to approve withdrawal request");
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
export const getReviewById = async (token, id) => {
  try {
    const response = await apiConnector(
      "GET",
      `${GET_REVIEWS_API}/${id}`,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );
    return response;
  } catch (error) {}
};

export const acceptReview = async (token, reviewId) => {
  try {
    const response = await apiConnector(
      "PATCH",
      `${APPROVE_REVIEW_API}/${reviewId}`,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );
    toast.success(response.message);
    return response;
  } catch (error) {
    toast.error("Failed to accept review");
  }
};
export const rejectReview = async (token, reviewId) => {
  try {
    const response = await apiConnector(
      "DELETE",
      `${REJECT_REVIEW_API}/${reviewId}`,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );
    toast.success(response.message);
    return response;
  } catch (error) {
    toast.error("Failed to reject review");
  }
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
    toast.success(response.message);
    return response;
  } catch (error) {
    toast.error("Failed to respond to feedback");
  }
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
    toast.success(response.message);
    return response;
  } catch (error) {
    toast.error("Failed to add FAQ");
    return null;
  }
};

export const deleteFaq = async (faqId) => {
  try {
    const response = await apiConnector("DELETE", `${DELETE_FAQ_API}/${faqId}`);
    toast.success(response.message);
    return response;
  } catch (error) {
    toast.error("Failed to delete FAQ");
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
    toast.success(response.message);
    return response;
  } catch (error) {
    toast.error("Failed to add terms");
    return null;
  }
};

export const deleteTerms = async (termsId) => {
  try {
    const response = await apiConnector(
      "DELETE",
      `${DELETE_TERMS_API}/${termsId}`
    );
    toast.success(response.message);
    return response;
  } catch (error) {
    toast.error("Failed to delete terms");
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
    toast.success(response.message);
    return response;
  } catch (error) {
    toast.error("Failed to add privacy policy");
    return null;
  }
};

export const deletePrivacyPolicy = async (privacyId) => {
  try {
    const response = await apiConnector(
      "DELETE",
      `${DELETE_PRIVACY_API}/${privacyId}`
    );
    toast.success(response.message);
    return response;
  } catch (error) {
    toast.error("Failed to delete privacy policy");
    return null;
  }
};

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

export const addNewAdmin = async (token, adminData) => {
  try {
    const response = await apiConnector("POST", ADD_NEW_ADMIN, adminData, {
      Authorization: `Bearer ${token}`,
    });
    toast.success(response.message);

    return response;
  } catch (error) {
    toast.error("Failed to add new admin");
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
    toast.success(response.message);
    return response;
  } catch (error) {
    toast.error("Failed to remove admin");
    return null;
  }
};

//announcements

// Get all announcements

export const getAllAnnouncements = async (token, params) => {
  try {
    const response = await apiConnector(
      "GET",
      GET_ALL_ANNOUNCEMENTS,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
      // params
    );
    return response;
  } catch (error) {
    return null;
  }
};

// Add a new announcement

export const addAnnouncement = async (token, data) => {
  try {
    const response = await apiConnector("POST", ADD_ANNOUNCEMENT, data, {
      Authorization: `Bearer ${token}`,
    });
    toast.success(response.message);
    return response;
  } catch (error) {
    toast.error("Failed to add announcement");
    return null;
  }
};

// Delete an announcement by ID

export const deleteAnnouncements = async (token, announcementId) => {
  try {
    const response = await apiConnector(
      "DELETE",
      `${DELETE_ANNOUNCEMENT}/${announcementId}`,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );
    toast.success(response.message);
    return response;
  } catch (error) {
    toast.error("Failed to delete announcement");
    return null;
  }
};
