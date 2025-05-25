// import { setLoading, setToken, setUser } from "../../slices/userSlice";
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

export function signUp(data, navigate) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", SIGNUP_API, data);

      if (response.status === "success") {
        toast.success(response.message);
      }
    } catch (error) {
      navigate("/signup");
    }
    dispatch(setLoading(false));
  };
}

export const login = async (data, navigate, setUser) => {
  try {
    const response = await apiConnector("POST", LOGIN_API, data);

    if (!response.data.success) {
    }
    const { token, user } = response.data;

    if (response.status === "success") {
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
        review: user.review || null,
        lastWithdrawalDate: user.lastWithdrawalDate || null,
      };

      setUser(userData);
    }
    if (user.role === "admin") {
      navigate("/dashboard/admin");
    } else if (user.role === "owner") {
      navigate("/dashboard/owner");
    } else {
      navigate("/dashboard/user");
    }
  } catch (error) {
    console.log("LOGIN API ERROR............", error);
    toast.error(error.response.data.message);
  }
};

export const emailVerification = async (token, navigate) => {
  try {
    const response = await apiConnector("GET", `${VERIFY_EMAIL}/${token}`);
    console.log(response);
    if (response.status === "success") {
      toast.success(response.message);
    }
    navigate("/login");
  } catch {}
};

export const getPasswordResetToken = async (email) => {
  try {
    const response = await apiConnector("POST", RESETPASSTOKEN_API, {
      email,
    });
    console.log(response);
    if (!response.status) {
      toast.error(response.data.message);
      throw new Error(response.data.message);
    }

    toast.success("Reset Email Sent");
  } catch (error) {
    console.log("FORGOTPASSWORD ERROR............", error);
  }
};

export const resetPassword = async (data, token, navigate) => {
  try {
    const response = await apiConnector(
      "PATCH",
      `${RESETPASSWORD_API}/${token}`,
      data
    );

    if (!response.status) {
      throw new Error(response.data.message);
    }
    toast.success("Password Reset Successfully");
    navigate("/login");
  } catch (error) {
    console.log("RESETPASSWORD ERROR............", error);
    toast.error("Failed To Reset Password");
  }
};
