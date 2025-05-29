import { useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { resetPassword } from "../../services/operations/authApi";
import useSafeNavigate from "../../utils/useSafeNavigate";
import { useParams } from "react-router-dom";
import Loading from "../../pages/Loading";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useSafeNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await resetPassword(data, token, navigate);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex items-center justify-center h-screen bg-[var(--primary-light)]">
      <div className="w-full max-w-md bg-primary-dark p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-[var(--text-heading)] mb-6">
          Reset Password
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          {/* New Password */}
          <label className="relative">
            <p className="mb-1 text-[var(--text-body)]">New Password</p>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              {...register("password", {
                required: "New password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              className="w-full border-[var(--primary)] rounded-lg p-2 pr-10 focus:outline-none "
            />
            <span
              className="absolute right-3 top-[38px] text-gray-500 cursor-pointer"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? (
                <AiOutlineEyeInvisible size={22} />
              ) : (
                <AiOutlineEye size={22} />
              )}
            </span>
            {errors.password && (
              <p className="text-red-400 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </label>

          {/* Confirm Password */}
          <label className="relative">
            <p className="mb-1 text-[var(--text-body)]">Confirm Password</p>
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Re-enter new password"
              {...register("confirmPassword", {
                required: "Confirm your new password",
                validate: (value) =>
                  value === watch("password") || "Passwords do not match",
              })}
              className="w-full border-[var(--primary)] rounded-lg p-2 pr-10 focus:outline-none "
            />
            <span
              className="absolute right-3 top-[38px] text-gray-500 cursor-pointer"
              onClick={() => setShowConfirm((prev) => !prev)}
            >
              {showConfirm ? (
                <AiOutlineEyeInvisible size={22} />
              ) : (
                <AiOutlineEye size={22} />
              )}
            </span>
            {errors.confirmPassword && (
              <p className="text-red-400 text-xs mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </label>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-[var(--button)] hover:bg-[var(--button-hover)] text-black font-semibold py-2 rounded-lg"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
