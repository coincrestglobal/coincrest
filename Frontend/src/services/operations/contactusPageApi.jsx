import { contactUsEndPoints } from "../apis";
import { apiConnector } from "../apiConnecter";

const { CONTACT_US } = contactUsEndPoints;

export const submitContactForm = async (formData) => {
  try {
    const response = await apiConnector("POST", CONTACT_US, formData, {
      "Content-Type": "application/json",
    });

    return response; // Optional: return to show a success message or status
  } catch (error) {
    console.error("Contact Form Submission Error:", error);
    throw error;
  }
};
