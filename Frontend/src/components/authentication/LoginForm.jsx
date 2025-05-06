import { useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link } from "react-router";
import ForgotPasswordModal from "./ForgotPassword"; // ✅ Import it

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const onSubmit = (data) => {
    console.log("Form submitted with data:", data);
    // Authentication logic
  };

  return (
    <div className="flex items-center justify-center h-[85vh] relative">
      <div className="w-full max-w-md p-8 rounded-lg shadow-lg bg-[var(--primary-light)] z-10">
        <h2 className="text-2xl font-semibold text-[var(--text-heading)] text-center mb-4">
          Log In
        </h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-y-4"
        >
          {/* Email Field */}
          <label className="w-full">
            <p className="mb-1 text-lg text-[var(--text-body)]">Email</p>
            <input
              type="email"
              placeholder="Enter your email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: "Invalid email format",
                },
              })}
              className="w-full focus:border-2 border-[var(--primary)] rounded-lg p-2 text-[var(--text-body)] focus:outline-none"
            />
            {errors.email && (
              <p className="text-[var(--statusColor.error)] text-xs">
                {errors.email.message}
              </p>
            )}
          </label>

          {/* Password Field */}
          <label className="relative">
            <p className="mb-1 text-lg text-[var(--text-body)]">Password</p>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              className="w-full focus:border-2 border-[var(--primary)] rounded-lg  p-2 text-[var(--text-body)] focus:outline-none"
            />
            <span
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-[38px] cursor-pointer text-[var(--text-body)]"
            >
              {showPassword ? (
                <AiOutlineEyeInvisible fontSize={24} />
              ) : (
                <AiOutlineEye fontSize={24} />
              )}
            </span>
            <p
              className="mt-1 text-md text-[var(--text-link)] hover:underline cursor-pointer"
              onClick={() => setShowForgotModal(true)}
            >
              Forgot Password?
            </p>
          </label>

          {/* Submit Button */}
          <button
            type="submit"
            className="mt-4 rounded-lg bg-[var(--button)] py-2 text-[var(--text-body)] font-semibold hover:bg-[var(--button-hover)] transition"
          >
            Sign In
          </button>

          {/* Signup Link */}
          <p className="mt-2 text-center text-[var(--text-body)]">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-[var(--text-link)] font-semibold"
            >
              Sign Up
            </Link>
          </p>
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
