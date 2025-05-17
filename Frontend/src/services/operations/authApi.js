import { setLoading, setToken, setUser } from "../../slices/userSlice";
import { authEndpoints } from "../apis";
import { apiConnector } from "../apiconnector";
import useSafeNavigate from "../../utils/useSafeNavigate";
import { toast } from "react-toastify";

const {
  SIGNUP_API,
  // LOGIN_API,
  // RESETPASSTOKEN_API,
  // RESETPASSWORD_API,
} = authEndpoints;

export function signUp(
  firstName,
  lastName,
  email,
  password,
  confirmPassword,
  otp
) {
  const navigate = useSafeNavigate();

  return async () => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", SIGNUP_API, {
        accountType,
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        otp,
      });

      if (!response.data.success) {
      }

      toast.success("Signup Successful");
      navigate("/login");
    } catch (error) {
      toast.error("Signup Failed");
      navigate("/signup");
    }
    dispatch(setLoading(false));
  };
}

export function login(email, password, navigate) {
  return async () => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", LOGIN_API, {
        email,
        password,
      });

      if (!response.data.success) {
      }

      toast.success("Login Successful");
      dispatch(setToken(response.data.token));
      // const userImage = response.data?.user?.image
      //   ? response.data.user.image
      //   : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName} ${response.data.user.lastName}`;
      // dispatch(setUser({ ...response.data.user, image: userImage }));
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("token", JSON.stringify(response.data.token));
      navigate("/dashboard/my-profile");
    } catch (error) {
      console.log("LOGIN API ERROR............", error);
      toast.error(error.response.data.message);
    }
    dispatch(setLoading(false));
  };
}

export function logout(navigate) {
  return () => {
    dispatch(setToken(null));
    dispatch(setUser(null));
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged Out");
    navigate("/");
  };
}
