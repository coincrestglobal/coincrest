import { userDashboardEndPoints } from "../apis";
import { apiConnector } from "../apiConnecter";
import { toast } from "react-toastify";

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
  GET_REFERRAL_CODE_AND_LINK,
} = userDashboardEndPoints;

export const getPlans = async () => {
  let result = [];
  try {
    const response = await apiConnector("GET", GET_PLANS);

    result = response;
  } catch (error) {}
  return result;
};

export const getBalance = async (token) => {
  try {
    const response = await apiConnector("GET", GET_BALANCE, null, {
      Authorization: `Bearer ${token}`,
    });

    return response;
  } catch (error) {}
};

//investments
export const investInPlan = async (token, data) => {
  try {
    const response = await apiConnector("POST", INVEST_IN_PLAN, data, {
      Authorization: `Bearer ${token}`,
    });
    toast.success(response.message);
    return response;
  } catch (error) {
    toast.error("Investment failed");
  }
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

    toast.success(response.message);

    return response;
  } catch (error) {
    toast.error("Failed to redeem plan");
  }
};

//deposits

export const verifyDeposit = async (token, data) => {
  let response;
  try {
    response = await apiConnector("POST", VERIFY_DEPOSIT, data, {
      Authorization: `Bearer ${token}`,
    });
    toast.success(response.message);
  } catch (error) {
    toast.error(response.message);
  }
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

export const withdraw = async (token, data) => {
  try {
    const response = await apiConnector("POST", WITHDRAW, data, {
      Authorization: `Bearer ${token}`,
    });
    toast.success(response.message);
  } catch (error) {
    toast.error("Withdrawal request failed");
  }
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
    toast.success(response.message);
    return response;
  } catch (error) {
    toast.error("Failed to update personal details");
  }
};

export const updateProfilePhoto = async (token, data) => {
  try {
    const response = await apiConnector("PATCH", UPDATE_PROFILE_PHOTO, data, {
      Authorization: `Bearer ${token}`,
    });
    toast.success(response.message);

    return response;
  } catch (error) {
    toast.error("Failed to update profile photo");
  }
};

//pass update

export const updatePassword = async (token, data) => {
  try {
    const response = await apiConnector("PATCH", UPDATE_PASSWORD, data, {
      Authorization: `Bearer ${token}`,
    });
    toast.success(response.message);
  } catch (error) {
    toast.error("Password update failed");
  }
};

// Update Wallet
export const addOrUpdateWallet = async (token, updatedData) => {
  //in params wallet ID
  try {
    const response = await apiConnector("POST", UPDATE_WALLET, updatedData, {
      Authorization: `Bearer ${token}`,
    });
    toast.success(response.message);
    return response;
  } catch (error) {
    toast.error("Failed to update wallet");
  }
};

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

//bonus history
export const getBonustHistory = async (token, params) => {
  let result = [];
  try {
    const response = await apiConnector(
      "GET",
      GET_BONUS_HISTORY,
      null,
      {
        Authorization: `Bearer ${token}`,
      },
      params
    );
    if (!response?.data?.success) {
    }

    result = response;
  } catch (error) {}
  return result;
};
