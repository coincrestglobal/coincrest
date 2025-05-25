import { contactUsEndPoints } from "../apis";
import { apiConnector } from "../apiConnecter";

const { CONTACT_US } = contactUsEndPoints;

export const submitContactForm = async (formData, token) => {
  try {
    const response = await apiConnector("POST", CONTACT_US, formData, {
      Authorization: `Bearer ${token}`,
    });

    return response; // Optional: return to show a success message or status
  } catch (error) {
    console.error("Contact Form Submission Error:", error);
    throw error;
  }
};
