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
  GET_BONUS_HISTORY,
  GET_NOTIFICATIONS,
  MARK_READ,
  GET_UNREAD,
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
    const response = await apiConnector(
      "GET",
      GET_BALANCE,
      null,
      {
        Authorization: `Bearer ${token}`,
      },
      null
    );

    return response;
  } catch (error) {}
};

//investments
export const investInPlan = async (token, data) => {
  try {
    const response = await apiConnector(
      "POST",
      INVEST_IN_PLAN,
      data,
      {
        Authorization: `Bearer ${token}`,
      },
      null
    );
    if (response.status === "success") toast.success(response.message);
    return response;
  } catch (error) {
    toast.error(error.message || "failed to invest");
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

    if (response.status === "success") toast.success(response.message);

    return response;
  } catch (error) {
    toast.error(error.message || "Failed to redeem plan");
  }
};

//deposits

export const verifyDeposit = async (token, data) => {
  try {
    const response = await apiConnector("POST", VERIFY_DEPOSIT, data, {
      Authorization: `Bearer ${token}`,
    });

    if (response.status === "success") toast.success(response.message);
  } catch (error) {
    toast.error(error.message);
  }
};

export const getDepositAddresses = async (token) => {
  try {
    const response = await apiConnector(
      "GET",
      GET_DEPOSIT_ADDRESS_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      },
      null
    );
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
    if (response.status === "success") toast.success(response.message);
  } catch (error) {
    toast.error(error.message || "Withdrawal request failed");
  }
};

export const getUserWithdrawals = async (token, params) => {
  try {
    const response = await apiConnector(
      "GET",
      USER_WITHDRAWS_HISTORY,
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
    if (response.status === "success") toast.success(response.message);
    return response;
  } catch (error) {
    toast.error(error.message || "Failed to update personal details");
  }
};

export const updateProfilePhoto = async (token, data) => {
  try {
    const response = await apiConnector("PATCH", UPDATE_PROFILE_PHOTO, data, {
      Authorization: `Bearer ${token}`,
    });
    if (response.status === "success") toast.success(response.message);

    return response;
  } catch (error) {
    toast.error(error.message || "Failed to update profile photo");
  }
};

export const updatePassword = async (token, data) => {
  try {
    const response = await apiConnector("PATCH", UPDATE_PASSWORD, data, {
      Authorization: `Bearer ${token}`,
    });
    if (response.status === "success") toast.success(response.message);
  } catch (error) {
    toast.error(error.message || "Password update failed");
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
    toast.error(error.message || "Failed to update wallet");
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
  } catch (error) {}
};

//bonus history
export const getBonustHistory = async (token, params) => {
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

    return response;
  } catch (error) {}
};

//notification
export const getNotifications = async (token) => {
  try {
    const response = await apiConnector("GET", GET_NOTIFICATIONS, null, {
      Authorization: `Bearer ${token}`,
    });
    return response;
  } catch {}
};

export const markRead = async (token, id) => {
  try {
    const response = await apiConnector("PATCH", `${MARK_READ}/${id}`, null, {
      Authorization: `Bearer ${token}`,
    });
    return response;
  } catch {}
};

export const getUnreadValue = async (token) => {
  try {
    const response = await apiConnector("GET", GET_UNREAD, null, {
      Authorization: `Bearer ${token}`,
    });
    return response;
  } catch {}
};
