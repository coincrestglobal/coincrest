// const BASE_URL = "http://localhost:5000/api/v1"; //for desktop  only
const BASE_URL = "http://192.168.61.172:5000/api/v1"; // for mobile only

// AUTH ENDPOINTS
export const authEndpoints = {
  SIGNUP_API: BASE_URL + "/auth/signup",
  LOGIN_API: BASE_URL + "/auth/login",
  RESETPASSTOKEN_API: BASE_URL + "/auth/forgotPassword",
  RESETPASSWORD_API: BASE_URL + "/auth/resetPassword",
  VERIFY_EMAIL: BASE_URL + "/auth/verify",
};

//home
export const homeEndPoints = {
  GET_REVIEWS: BASE_URL + "/review/recentReviews",
  ADD_REVIEW: BASE_URL + "/review/add",
  EDIT_REVIEW: BASE_URL + "/review/edit",
  GET_FAQS: BASE_URL + "/faqs",
};

//earnings
export const earningEndPoints = {
  GET_REFERRAL_PLAN: BASE_URL + "/setting/getDepositBonus",
  GET_TEAM_REWARDS: BASE_URL + "/setting/getTeamBonus",
};

//conatct us
export const contactUsEndPoints = {
  CONTACT_US: BASE_URL + "/feedback/create",
};

// PROFILE ENDPOINTS

//owner and admin dashboard
export const ownerAndAdminDashboardEndPoints = {
  // User Management
  GET_ALL_USERS_API: BASE_URL + "/management/getUsers",
  GET_USER_DETAILS_API: BASE_URL + "/management/getUser",

  // Withdrawals
  GET_WITHDRAW_REQUESTS_API: BASE_URL + "/management/getWithdrawals",
  APPROVE_WITHDRAW_REQUEST_API: BASE_URL + "/management/approveWithdrawal",

  // Deposits
  GET_ALL_DEPOSITS_API: BASE_URL + "/management/getDeposits",

  // Reviews
  GET_ALL_REVIEWS_API: BASE_URL + "/review",
  APPROVE_REVIEW_API: BASE_URL + "/management/reviews/approve",
  REJECT_REVIEW_API: BASE_URL + "/management/reviews/reject",

  // Feedback
  GET_ALL_FEEDBACKS_API: BASE_URL + "/feedback",
  RESPOND_FEEDBACK_API: BASE_URL + "/feedback/reply",

  // FAQs
  GET_ALL_FAQS_API: BASE_URL + "/management/faqs",
  ADD_FAQ_API: BASE_URL + "/management/faqs/add",
  DELETE_FAQ_API: BASE_URL + "/management/faqs/delete",

  // Terms & Conditions
  GET_TERMS_API: BASE_URL + "/management/terms",
  ADD_TERMS_API: BASE_URL + "/management/terms/add",
  DELETE_TERMS_API: BASE_URL + "/management/terms/delete",

  // Privacy Policy
  GET_PRIVACY_API: BASE_URL + "/management/privacy",
  ADD_PRIVACY_API: BASE_URL + "/management/privacy/add",
  DELETE_PRIVACY_API: BASE_URL + "/management/privacy/delete",

  // Plan Levels
  GET_PLANS_API: BASE_URL + "/management/plans",
  UPDATE_PLAN_API: BASE_URL + "/management/plans/update",

  // Referrals
  GET_REFERRAL_API: BASE_URL + "/management/referral",
  UPDATE_REFERRAL_API: BASE_URL + "/management/referral/update",

  // Team Bonuses
  GET_TEAM_BONUSES_API: BASE_URL + "/management/teamBonuses",
  UPDATE_TEAM_BONUSES_API: BASE_URL + "/management/teamBonuses/update",

  // Admin Controls
  GET_ALL_ADMINS: BASE_URL + "/management/admins",
  ADD_NEW_ADMIN: BASE_URL + "/management/admins/add",
  REMOVE_ADMIN: BASE_URL + "/management/deleteAdmin",

  // Announcements
  GET_ALL_ANNOUNCEMENTS: BASE_URL + "/management/announcements",
  ADD_ANNOUNCEMENT: BASE_URL + "/management/announcements/add",
  DELETE_ANNOUNCEMENT: BASE_URL + "/management/announcements/delete",
};

//user dashboard
export const userDashboardEndPoints = {
  GET_USER_DETAILS_API: BASE_URL + "/profile/getUserDetails",
  GET_PLANS: BASE_URL + "/plans",
  VERIFY_DEPOSIT: BASE_URL + "/account/verifyDeposit",
  USER_DEPOSIT_HISTORY: BASE_URL + "/account/deposits",
  GET_BALANCE: BASE_URL + "/account/balance",
  INVEST_IN_PLAN: BASE_URL + "/account/invest",
  INVEST_HISTORY: BASE_URL + "/account/getInvestments",
  WITHDRAW: BASE_URL + "/account/withdraw",
  USER_WITHDRAWS_HISTORY: BASE_URL + "/account/withdrawals",
  UPDATE_PERSONAL_DETAILS: BASE_URL + "/user/update-details",
  UPDATE_PROFILE_PHOTO: BASE_URL + "/user/update-photo",
  UPDATE_PASSWORD: BASE_URL + "/user/update-password",
  ADD_WALLET: BASE_URL + "/wallet/add",
  REMOVE_WALLET: BASE_URL + "/wallet/remove",
  UPDATE_WALLET: BASE_URL + "/wallet/update",
  GET_REFERRAL_CODE: BASE_URL + "/referral/code",
  GET_REFERRAL_LINK: BASE_URL + "/referral/link",
  GET_REFERRAL_CODE_AND_LINK: BASE_URL + "/referral/link",
};
