import { userDashboardEndPoints } from "../apis";
import { apiConnector } from "../apiConnecter";

const {
  GET_PLANS,
  VERIFY_DEPOSIT,
  USER_DEPOSIT_HISTORY,
  GET_DEPOSIT_ADDRESS_API,
  GET_BALANCE,
  INVEST_IN_PLAN,
  REDEEM_INVESTED_PLAN,
  INVEST_HISTORY,
  WITHDRAW,
  USER_WITHDRAWS_HISTORY,
  UPDATE_PERSONAL_DETAILS,
  UPDATE_PROFILE_PHOTO,
  UPDATE_PASSWORD,
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

//investments
export const investInPlan = async (token, data) => {
  try {
    const response = await apiConnector("POST", INVEST_IN_PLAN, data, {
      Authorization: `Bearer ${token}`,
    });
    if (!response?.data?.success) {
    }
    return response;
  } catch (error) {}
};

export const investingHistory = async (token, params) => {
  try {
    const response = await apiConnector(
      "GET",
      INVEST_HISTORY,
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

export const redeemInvestPlan = async (token, id) => {
  try {
    const response = await apiConnector(
      "PATCH",
      `${REDEEM_INVESTED_PLAN}/${id}`,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );

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
export const getDepositAddresses = async (token) => {
  try {
    const response = await apiConnector("GET", GET_DEPOSIT_ADDRESS_API, null, {
      Authorization: `Bearer ${token}`,
    });
    if (!response?.data?.success) {
    }
    return response;
  } catch (error) {}
};

export const getUserDeposits = async (token, params) => {
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

export const getUserWithdrawals = async (token) => {
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
export const updatePersonalDetails = async (token, data) => {
  try {
    const response = await apiConnector(
      "PATCH",
      UPDATE_PERSONAL_DETAILS,
      data,
      {
        Authorization: `Bearer ${token}`,
      }
    );
    return response;
  } catch (error) {}
};

export const updateProfilePhoto = async (token, data) => {
  try {
    const response = await apiConnector("PATCH", UPDATE_PROFILE_PHOTO, data, {
      Authorization: `Bearer ${token}`,
    });
    return response;
  } catch (error) {}
};

//pass update

export const updatePassword = async (token, data) => {
  try {
    const response = await apiConnector("PATCH", UPDATE_PASSWORD, data, {
      Authorization: `Bearer ${token}`,
    });
  } catch (error) {}
};

// Update Wallet
export const addOrUpdateWallet = async (token, updatedData) => {
  //in params wallet ID
  try {
    const response = await apiConnector("POST", UPDATE_WALLET, updatedData, {
      Authorization: `Bearer ${token}`,
    });
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

export const getReferredUsers = async (token) => {
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
