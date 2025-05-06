import { useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

function UpdatePassword() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const onSubmit = (data) => {
    console.log("Password change request:", data);

    // Simulate API call
    setSuccessMessage("Your password has been successfully updated!");
    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-[var(--primary-light)]">
      <div className="w-full max-w-md bg-primary-dark p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-[var(--text-heading)] mb-6">
          Update Password
        </h2>

        {successMessage ? (
          <p className="text-[var(--statusColor.success)] text-center mb-4">
            {successMessage}
          </p>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            {/* New Password */}
            <label className="relative">
              <p className="mb-1 text-[var(--text-body)]">New Password</p>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                {...register("newPassword", {
                  required: "New password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className="w-full border-[var(--primary)] rounded-lg p-2 pr-10 focus:outline-none text-[var(--text-body)]"
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
              {errors.newPassword && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.newPassword.message}
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
                    value === watch("newPassword") || "Passwords do not match",
                })}
                className="w-full border-[var(--primary)] rounded-lg p-2 pr-10 focus:outline-none text-[var(--text-body)]"
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
              Update Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default UpdatePassword;
