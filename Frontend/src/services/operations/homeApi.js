import { homeEndPoints } from "../apis";
import { apiConnector } from "../apiConnecter";
import { toast } from "react-toastify";

const { GET_REVIEWS, ADD_REVIEW, EDIT_REVIEW, GET_FAQS } = homeEndPoints;

// GET all reviews
export const getHomeReviews = async (token) => {
  try {
    const response = await apiConnector("GET", GET_REVIEWS, null, {
      Authorization: `Bearer ${token}`,
    });
    return response;
  } catch (error) {}
};

// ADD a new review
export const addReview = async (reviewData, token) => {
  try {
    const response = await apiConnector("POST", ADD_REVIEW, reviewData, {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    });
    toast.success(response.message);
    return response;
  } catch (error) {
    toast.error("Error adding review:", error);
  }
};

// EDIT an existing review
export const editReview = async (reviewId, updatedData, token) => {
  try {
    const response = await apiConnector(
      "PATCH",
      `${EDIT_REVIEW}/${reviewId}`,
      updatedData,
      {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    );
    toast.success(response.message);
    return response;
  } catch (error) {
    toast.error("Error editing review:", error);
  }
};

//get all FAQS
export const getAllFaqs = async () => {
  try {
    const response = await apiConnector("GET", GET_FAQS);
    return response;
  } catch (error) {
    toast.error("Error fetching FAQs:", error);
  }
};
