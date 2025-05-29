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
  GET_CONTROL_STATS,
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

export const controlPannelStats = async (token) => {
  try {
    const response = await apiConnector("GET", GET_CONTROL_STATS, null, {
      Authorization: `Bearer ${token}`,
    });
    return response;
  } catch {}
};

//users

export const getAllUsers = async (token, params) => {
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

    return response;
  } catch (error) {}
};

export const getUserDetails = async (token, params) => {
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
    return response;
  } catch (error) {}
};

//withdrawals

export const getWithdrawRequests = async (token, params) => {
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
    return response;
  } catch (error) {
    // Handle error if needed
  }
};

export const approveWithdrawRequest = async (token, withdrawal_id) => {
  try {
    const response = await apiConnector(
      "PATCH",
      `${APPROVE_WITHDRAW_REQUEST_API}/${withdrawal_id}`,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );
    if (response.status === "success") toast.success(response.message);
    return response;
  } catch (error) {
    toast.error(error.message || "Failed to approve withdrawal request");
  }
};

//deposits

export const getAllUsersDepositHistory = async (token, params) => {
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

    return response;
  } catch (error) {}
};

//reviews

export const getAllReviews = async (token, params) => {
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
    return response;
  } catch (error) {}
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
    if (response.status === "success") toast.success(response.message);
    return response;
  } catch (error) {
    toast.error(error.response || "Failed to accept review");
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
    if (response.status === "success") toast.success(response.message);
    return response;
  } catch (error) {
    toast.error(error.response || "Failed to reject review");
  }
};

//feedbacks

export const getAllFeedbacks = async (token, params) => {
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
    return response;
  } catch (error) {}
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
    if (response.status === "success") toast.success(response.message);
    return response;
  } catch (error) {
    toast.error(error.message || "Failed to respond to feedback");
  }
};

//FAQs

export const getAllFaqs = async () => {
  try {
    const response = await apiConnector("GET", GET_ALL_FAQS_API);
    return response;
  } catch (error) {}
};

export const addFaq = async (faqData) => {
  try {
    const response = await apiConnector("POST", ADD_FAQ_API, faqData);
    if (response.status === "success") toast.success(response.message);
    return response;
  } catch (error) {
    toast.error(error.message || "Failed to add FAQ");
  }
};

export const deleteFaq = async (faqId) => {
  try {
    const response = await apiConnector("DELETE", `${DELETE_FAQ_API}/${faqId}`);
    if (response.status === "success") toast.success(response.message);
    return response;
  } catch (error) {
    toast.error(error.message || "Failed to delete FAQ");
  }
};

//T&C

export const getTerms = async () => {
  try {
    const response = await apiConnector("GET", GET_TERMS_API);
    return response;
  } catch (error) {}
};

export const addTerms = async (termsData) => {
  try {
    const response = await apiConnector("POST", ADD_TERMS_API, termsData);
    if (response.status === "success") toast.success(response.message);
    return response;
  } catch (error) {
    toast.error(error.message || "Failed to add terms");
  }
};

export const deleteTerms = async (termsId) => {
  try {
    const response = await apiConnector(
      "DELETE",
      `${DELETE_TERMS_API}/${termsId}`
    );
    if (response.status === "success") toast.success(response.message);
    return response;
  } catch (error) {
    toast.error(error.message || "Failed to delete terms");
  }
};

//Privacy Policy

export const getPrivacyPolicy = async () => {
  try {
    const response = await apiConnector("GET", GET_PRIVACY_API);
    return response;
  } catch (error) {}
};

export const addPrivacyPolicy = async (privacyData) => {
  try {
    const response = await apiConnector("POST", ADD_PRIVACY_API, privacyData);
    if (response.status === "success") toast.success(response.message);
    return response;
  } catch (error) {
    toast.error(error.message || "Failed to add privacy policy");
  }
};

export const deletePrivacyPolicy = async (privacyId) => {
  try {
    const response = await apiConnector(
      "DELETE",
      `${DELETE_PRIVACY_API}/${privacyId}`
    );
    if (response.status === "success") toast.success(response.message);
    return response;
  } catch (error) {
    toast.error(error.message || "Failed to delete privacy policy");
  }
};

// Get all admins

export const getAllAdmins = async () => {
  try {
    const response = await apiConnector("GET", GET_ALL_ADMINS);
    return response;
  } catch (error) {}
};

// Add new admin

export const addNewAdmin = async (token, adminData) => {
  try {
    const response = await apiConnector("POST", ADD_NEW_ADMIN, adminData, {
      Authorization: `Bearer ${token}`,
    });
    if (response.status === "success") toast.success(response.message);

    return response;
  } catch (error) {
    toast.error(error.message || "Failed to add new admin");
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
    if (response.status === "success") toast.success(response.message);
    return response;
  } catch (error) {
    toast.error(error.message || "Failed to remove admin");
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
      },
      params
    );
    return response;
  } catch (error) {}
};

// Add a new announcement

export const addAnnouncement = async (token, data) => {
  try {
    const response = await apiConnector("POST", ADD_ANNOUNCEMENT, data, {
      Authorization: `Bearer ${token}`,
    });
    if (response.status === "success") toast.success(response.message);
    return response;
  } catch (error) {
    toast.error(error.message || "Failed to add announcement");
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
    if (response.status === "success") toast.success(response.message);
    return response;
  } catch (error) {
    toast.error(error.message || "Failed to delete announcement");
  }
};
