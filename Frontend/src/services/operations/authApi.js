import { authEndpoints } from "../apis";
import { apiConnector } from "../apiConnecter";
import { toast } from "react-toastify";

const {
  SIGNUP_API,
  LOGIN_API,
  VERIFY_EMAIL,
  RESETPASSTOKEN_API,
  RESETPASSWORD_API,
} = authEndpoints;

export const signUp = async (data, params) => {
  try {
    const response = await apiConnector("POST", SIGNUP_API, data, {}, params);

    if (response.status === "success") {
      toast.success(response.message);
    }
  } catch (error) {
    toast.error(
      error.message ||
        "Something went wrong while signing up. Please try again."
    );
  }
};

export const login = async (data, navigate, setUser) => {
  let response = null;
  try {
    response = await apiConnector("POST", LOGIN_API, data);

    const { token, user } = response.data;

    const nameParts = user.name.trim().split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ");
    const userData = {
      token,
      name: user.name,
      firstName,
      lastName,
      email: user.email,
      role: user.role,
      profilePicUrl: user.profilePicUrl || null,
      wallets: user.withdrawalAddresses || [],
      referralCode: user.referralCode || "",
    };

    setUser(userData);
    if (response.status === "success") toast.success(response.message);

    if (user.role === "admin") {
      navigate("/dashboard/admin");
    } else if (user.role === "owner") {
      navigate("/dashboard/owner");
    } else {
      navigate("/dashboard/user");
    }
  } catch (error) {
    toast.error(error.message || "Unable to login. Please try again later.");
  }
};

export const emailVerification = async (token, navigate) => {
  try {
    const response = await apiConnector("GET", `${VERIFY_EMAIL}/${token}`);
    if (response.status === "success") {
      toast.success(response.message);
    }
    navigate("/login");
  } catch (error) {
    toast.error(error.message || "Verification link is invalid or expired.");
    navigate("/login");
  }
};

export const getPasswordResetToken = async (email) => {
  try {
    const response = await apiConnector("POST", RESETPASSTOKEN_API, { email });
    if (response.status === "success") toast.success(response.message);
  } catch (error) {
    toast.error(
      error.message || "Unable to send reset email. Please try later."
    );
  }
};

export const resetPassword = async (data, token, navigate) => {
  try {
    const response = await apiConnector(
      "PATCH",
      `${RESETPASSWORD_API}/${token}`,
      data
    );

    if (response.status === "success") toast.success(response.message);
    navigate("/login");
  } catch (error) {
    toast.error(error.message || "Something went wrong. Please try again.");
  }
};
