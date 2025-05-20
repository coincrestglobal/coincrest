const BASE_URL = "http://localhost:5000/api/v1";

// AUTH ENDPOINTS
export const authEndpoints = {
  SIGNUP_API: BASE_URL + "/auth/signup",
  LOGIN_API: BASE_URL + "/auth/login",
  RESETPASSTOKEN_API: BASE_URL + "/auth/reset-password-token",
  RESETPASSWORD_API: BASE_URL + "/auth/reset-password",
};

// PROFILE ENDPOINTS
export const profileEndpoints = {
  GET_USER_DETAILS_API: BASE_URL + "/profile/getUserDetails",
};

// PROFILE ENDPOINTS
export const ownerAndAdminDashboardEndPoints = {
  GET_ALL_USERS_API: BASE_URL + "/management/getUsers",
  GET_USER_DETAILS_API: BASE_URL + "/management/getUser",
};

export const userDashboardEndPoints = {
  GET_PLANS: BASE_URL + "/plans",
};
