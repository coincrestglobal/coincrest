const BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api/v1`;

// AUTH ENDPOINTS
export const authEndpoints = {
  SIGNUP_API: BASE_URL + "/auth/signup",
  LOGIN_API: BASE_URL + "/auth/login",
  SEND_OTP_API: BASE_URL + "/auth/sendOtp",
  VERIFY_OTP_API: BASE_URL + "/auth/verifyOtp",
  RESETPASSTOKEN_API: BASE_URL + "/auth/forgotPassword",
  RESETPASSWORD_API: BASE_URL + "/auth/resetPassword",
  VERIFY_EMAIL: BASE_URL + "/auth/verify",
  VALIDATE_TOKEN: BASE_URL + "/auth/validateToken",
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
  GET_REVIEWS_API: BASE_URL + "/review/getReviewById",
  APPROVE_REVIEW_API: BASE_URL + "/review/approve",
  REJECT_REVIEW_API: BASE_URL + "/review/delete",

  // Feedback
  GET_ALL_FEEDBACKS_API: BASE_URL + "/feedback",
  RESPOND_FEEDBACK_API: BASE_URL + "/feedback/reply",

  // FAQs
  GET_ALL_FAQS_API: BASE_URL + "/faq",
  ADD_FAQ_API: BASE_URL + "/faq/create",
  DELETE_FAQ_API: BASE_URL + "/faq/delete",

  // Terms & Conditions
  GET_TERMS_API: BASE_URL + "/term",
  ADD_TERMS_API: BASE_URL + "/term/create",
  DELETE_TERMS_API: BASE_URL + "/term/delete",

  // Privacy Policy
  GET_PRIVACY_API: BASE_URL + "/policy",
  ADD_PRIVACY_API: BASE_URL + "/policy/create",
  DELETE_PRIVACY_API: BASE_URL + "/policy/delete",

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
  ADD_NEW_ADMIN: BASE_URL + "/management/createAdmin",
  REMOVE_ADMIN: BASE_URL + "/management/deleteAdmin",

  // Announcements
  GET_ALL_ANNOUNCEMENTS: BASE_URL + "/announcement",
  ADD_ANNOUNCEMENT: BASE_URL + "/announcement/create",
  DELETE_ANNOUNCEMENT: BASE_URL + "/announcement",

  //stats
  GET_STATS: BASE_URL + "/stat",
  GET_CONTROL_STATS: BASE_URL + "/stat/statCount",
};

//user dashboard
export const userDashboardEndPoints = {
  GET_USER_DETAILS_API: BASE_URL + "/profile/getUserDetails",
  GET_PLANS: BASE_URL + "/plans",
  GET_DEPOSIT_ADDRESS_API: BASE_URL + "/wallet/getDepositAddresses",
  VERIFY_DEPOSIT: BASE_URL + "/account/verifyDeposit",
  USER_DEPOSIT_HISTORY: BASE_URL + "/account/deposits",
  GET_BALANCE: BASE_URL + "/account/balance",
  INVEST_IN_PLAN: BASE_URL + "/account/invest",
  REDEEM_INVESTED_PLAN: BASE_URL + "/account/redeem",
  INVEST_HISTORY: BASE_URL + "/account/getInvestments",
  WITHDRAW: BASE_URL + "/account/withdraw",
  USER_WITHDRAWS_HISTORY: BASE_URL + "/account/withdraw",
  UPDATE_PERSONAL_DETAILS: BASE_URL + "/auth/updateName",
  UPDATE_PROFILE_PHOTO: BASE_URL + "/auth/updateProfilePicture",
  UPDATE_PASSWORD: BASE_URL + "/auth/updateMyPassword",
  ADD_WALLET: BASE_URL + "/wallet/add",
  REMOVE_WALLET: BASE_URL + "/wallet/remove",
  UPDATE_WALLET: BASE_URL + "/account/upsertWithdrawalAddress",
  GET_REFERRAL_CODE: BASE_URL + "/referral/code",
  GET_REFERRAL_LINK: BASE_URL + "/referral/link",
  GET_REFERRAL_CODE_AND_LINK: BASE_URL + "/account/getReferredUsers",
  GET_BONUS_HISTORY: BASE_URL + "/account/getReferralBonus",
  GET_NOTIFICATIONS: BASE_URL + "/notification",
  MARK_READ: BASE_URL + "/notification/markRead",
  GET_UNREAD: BASE_URL + "/notification/hasUnread",
};
