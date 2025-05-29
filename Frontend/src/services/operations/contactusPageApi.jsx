import { contactUsEndPoints } from "../apis";
import { apiConnector } from "../apiConnecter";
import { toast } from "react-toastify";

const { CONTACT_US } = contactUsEndPoints;

export const submitContactForm = async (formData, token) => {
  try {
    const response = await apiConnector("POST", CONTACT_US, formData, {
      Authorization: `Bearer ${token}`,
    });
    if (response.status === "success") toast.success(response.message);
    return response;
  } catch (error) {
    toast.error(error.message || "Contact Form Submission Error:");
  }
};
