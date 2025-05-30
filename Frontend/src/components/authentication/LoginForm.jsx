import { useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link } from "react-router";
import ForgotPasswordModal from "./ForgotPassword";
import useSafeNavigate from "../../utils/useSafeNavigate";
import { useUser } from "../common/UserContext";
import Loading from "../../pages/Loading";
import { handleVerifyOtp, sendOtp } from "../../services/operations/authApi";

function LoginForm() {
  const { setUser } = useUser();
  const navigate = useSafeNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");

  const handleSendOtp = async () => {
    const { email, password } = getValues();
    try {
      setLoading(true);
      const response = await sendOtp({ email, password });
      setStep(2);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerification = async () => {
    const { email } = getValues();
    try {
      setLoading(true);
      const response = await handleVerifyOtp({ email, otp }, navigate, setUser);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="flex items-center justify-center h-[85vh] relative">
      <div className="w-full max-w-md p-8 rounded-lg shadow-lg bg-[var(--primary-light)] z-10">
        <h2 className="text-2xl font-semibold text-[var(--text-heading)] text-center mb-4">
          {step === 1 ? "Log In" : "Enter OTP"}
        </h2>

        <form
          onSubmit={handleSubmit(
            step === 1 ? handleSendOtp : handleOtpVerification
          )}
          className="flex flex-col gap-y-4"
        >
          {/* Step 1: Email + Password */}
          {step === 1 && (
            <>
              {/* Email */}
              <label className="w-full">
                <p className="mb-1 text-lg text-text-heading">Email</p>
                <input
                  type="email"
                  placeholder="Enter your email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value:
                        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                      message: "Invalid email format",
                    },
                  })}
                  className="w-full focus:border-2 border-[var(--primary)] rounded-lg p-2 focus:outline-none"
                />
                {errors.email && (
                  <p className="text-[var(--statusColor.error)] text-xs">
                    {errors.email.message}
                  </p>
                )}
              </label>

              {/* Password */}
              <label className="relative">
                <p className="mb-1 text-lg text-text-heading">Password</p>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Minimum 6 characters",
                    },
                  })}
                  className="w-full focus:border-2 border-[var(--primary)] rounded-lg p-2 focus:outline-none"
                />
                <span
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-[38px] cursor-pointer text-[var(--primary)]"
                >
                  {showPassword ? (
                    <AiOutlineEyeInvisible fontSize={24} />
                  ) : (
                    <AiOutlineEye fontSize={24} />
                  )}
                </span>
                <p
                  className="mt-1 text-md text-[var(--text-link)] hover:text-text-linkHover hover:underline cursor-pointer"
                  onClick={() => setShowForgotModal(true)}
                >
                  Forgot Password?
                </p>
                {errors.password && (
                  <p className="text-[var(--statusColor.error)] text-xs">
                    {errors.password.message}
                  </p>
                )}
              </label>
            </>
          )}

          {/* Step 2: OTP */}
          {step === 2 && (
            <label className="w-full">
              <p className="mb-1 text-lg text-text-heading">OTP</p>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full focus:border-2 border-[var(--primary)] rounded-lg p-2 focus:outline-none"
              />
            </label>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="mt-4 rounded-lg bg-[var(--button)] py-2 text-[var(--text-body)] font-semibold hover:bg-[var(--button-hover)] transition"
          >
            {step === 1 ? "Send OTP" : "Verify OTP & Login"}
          </button>

          {/* Signup Link */}
          {step === 1 && (
            <p className="mt-2 text-center text-[var(--text-body)]">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-[var(--text-link)] hover:text-text-linkHover font-semibold"
              >
                Sign Up
              </Link>
            </p>
          )}
        </form>
      </div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={showForgotModal}
        onClose={() => setShowForgotModal(false)}
      />
    </div>
  );
}

export default LoginForm;
