import { userDashboardEndPoints } from "../apis";
import { apiConnector } from "../apiConnecter";

const {
  GET_PLANS,
  VERIFY_DEPOSIT,
  USER_DEPOSIT_HISTORY,
  GET_BALANCE,
  INVEST_IN_PLAN,
  WITHDRAW,
  USER_WITHDRAWS_HISTORY,
  UPDATE_PERSONAL_DETAILS,
  UPDATE_PROFILE_PHOTO,
  UPDATE_PASSWORD,
  ADD_WALLET,
  REMOVE_WALLET,
  UPDATE_WALLET,
  GET_REFERRAL_CODE,
  GET_REFERRAL_LINK,
  GET_REFERRAL_CODE_AND_LINK,
} = userDashboardEndPoints;

export const getPlans = async () => {
  let result = [];
  try {
    const response = await apiConnector("GET", GET_PLANS);
    if (!response?.data?.success) {
    }
    result = response;
  } catch (error) {}
  return result;
};

export const getBalance = async (token) => {
  try {
    const response = await apiConnector("GET", GET_BALANCE, null, {
      Authorization: `Bearer ${token}`,
    });
    if (!response?.data?.success) {
    }
    return response;
  } catch (error) {}
};

export const investInPlan = async (data) => {
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MWE2MjU5NGYwMjI5N2UzMzIzY2EyNSIsImlhdCI6MTc0NzkxMzc1NiwiZXhwIjoxNzU1Njg5NzU2fQ.Cbi6Cii4VoDKXNGQBLfQGQuTBuCM3ZtCT2ITsxg_x2c";
  try {
    const response = await apiConnector("POST", INVEST_IN_PLAN, data, {
      Authorization: `Bearer ${token}`,
    });
    if (!response?.data?.success) {
    }
    return response;
  } catch (error) {}
};

//deposits

export const verifyDeposit = async (data) => {
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MWE0NmQ3YmVkODZhZWNkMGVhYzQ5MCIsImlhdCI6MTc0NzkwNjQyOCwiZXhwIjoxNzU1NjgyNDI4fQ.XW-2MYErz22krRs0TxxaMBBDKoxtuuq66d9eCDVdYuU";
  try {
    const response = await apiConnector("POST", VERIFY_DEPOSIT, data, {
      Authorization: `Bearer ${token}`,
    });
    if (!response?.data?.success) {
    }
  } catch (error) {}
};

export const getUserDeposits = async (params) => {
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MWE2MjU5NGYwMjI5N2UzMzIzY2EyNSIsImlhdCI6MTc0NzkxMzc1NiwiZXhwIjoxNzU1Njg5NzU2fQ.Cbi6Cii4VoDKXNGQBLfQGQuTBuCM3ZtCT2ITsxg_x2c";
  try {
    const response = await apiConnector(
      "GET",
      USER_DEPOSIT_HISTORY,
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

//withdraws

export const withdraw = async (data) => {
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MWE2MjU5NGYwMjI5N2UzMzIzY2EyNSIsImlhdCI6MTc0NzkxMzc1NiwiZXhwIjoxNzU1Njg5NzU2fQ.Cbi6Cii4VoDKXNGQBLfQGQuTBuCM3ZtCT2ITsxg_x2c";

  try {
    const response = await apiConnector("POST", WITHDRAW, data, {
      Authorization: `Bearer ${token}`,
    });
    if (!response?.data?.success) {
    }
  } catch (error) {}
};

export const getUserWithdrawss = async () => {
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MWE2MjU5NGYwMjI5N2UzMzIzY2EyNSIsImlhdCI6MTc0NzkxMzc1NiwiZXhwIjoxNzU1Njg5NzU2fQ.Cbi6Cii4VoDKXNGQBLfQGQuTBuCM3ZtCT2ITsxg_x2c";
  try {
    const response = await apiConnector("GET", USER_WITHDRAWS_HISTORY, null, {
      Authorization: `Bearer ${token}`,
    });
    if (!response?.data?.success) {
    }
    return response;
  } catch (error) {}
};

//personal
export const updatePersonalDetails = async (data) => {
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MWE2MjU5NGYwMjI5N2UzMzIzY2EyNSIsImlhdCI6MTc0NzkxMzc1NiwiZXhwIjoxNzU1Njg5NzU2fQ.Cbi6Cii4VoDKXNGQBLfQGQuTBuCM3ZtCT2ITsxg_x2c";
  try {
    const response = await apiConnector("POST", UPDATE_PERSONAL_DETAILS, data, {
      Authorization: `Bearer ${token}`,
    });
  } catch (error) {}
};

export const updateProfilePhoto = async (data) => {
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MWE2MjU5NGYwMjI5N2UzMzIzY2EyNSIsImlhdCI6MTc0NzkxMzc1NiwiZXhwIjoxNzU1Njg5NzU2fQ.Cbi6Cii4VoDKXNGQBLfQGQuTBuCM3ZtCT2ITsxg_x2c";
  try {
    const response = await apiConnector("POST", UPDATE_PROFILE_PHOTO, data, {
      Authorization: `Bearer ${token}`,
    });
  } catch (error) {}
};

//pass update

export const updatePassword = async (data) => {
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MWE2MjU5NGYwMjI5N2UzMzIzY2EyNSIsImlhdCI6MTc0NzkxMzc1NiwiZXhwIjoxNzU1Njg5NzU2fQ.Cbi6Cii4VoDKXNGQBLfQGQuTBuCM3ZtCT2ITsxg_x2c";
  try {
    const response = await apiConnector("POST", UPDATE_PASSWORD, data, {
      Authorization: `Bearer ${token}`,
    });
  } catch (error) {}
};

// Add Wallet
export const addWallet = async (data) => {
  try {
    const response = await apiConnector("POST", ADD_WALLET, data, {
      Authorization: `Bearer ${token}`,
    });
    return response;
  } catch (error) {
    console.error("Add Wallet Error:", error);
    throw error;
  }
};

// Remove Wallet
export const removeWallet = async (params) => {
  //in params wallet ID
  try {
    const response = await apiConnector("DELETE", REMOVE_WALLET, null, {
      Authorization: `Bearer ${token}`,
      params,
    });
    return response;
  } catch (error) {
    console.error("Remove Wallet Error:", error);
    throw error;
  }
};

// Update Wallet
export const updateWallet = async (params, updatedData) => {
  //in params wallet ID
  try {
    const response = await apiConnector(
      "PUT",
      UPDATE_WALLET,
      updatedData,
      {
        Authorization: `Bearer ${token}`,
      },
      params
    );
    return response;
  } catch (error) {
    console.error("Update Wallet Error:", error);
    throw error;
  }
};

// Get Referral Code
// export const getReferralCode = async () => {
//   try {
//     const response = await apiConnector("GET", GET_REFERRAL_CODE, null, {
//       Authorization: `Bearer ${token}`,
//     });
//     return response;
//   } catch (error) {
//     console.error("Get Referral Code Error:", error);
//     throw error;
//   }
// };

// // Get Referral Link
// export const getReferralLink = async () => {
//   try {
//     const response = await apiConnector("GET", GET_REFERRAL_LINK, null, {
//       Authorization: `Bearer ${token}`,
//     });
//     return response;
//   } catch (error) {
//     console.error("Get Referral Link Error:", error);
//     throw error;
//   }
// };

//get both referral code and link
export const getReferralInfo = async () => {
  try {
    const response = await apiConnector(
      "GET",
      GET_REFERRAL_CODE_AND_LINK,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );
    return response;
  } catch (error) {
    console.error("Get Referral Info Error:", error);
    throw error;
  }
};
