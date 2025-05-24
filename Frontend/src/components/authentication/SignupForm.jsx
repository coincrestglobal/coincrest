import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link } from "react-router";
import { signUp } from "../../services/operations/authApi";
import useSafeNavigate from "../../utils/useSafeNavigate";

function SignupForm() {
  const navigate = useSafeNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const referralCode = queryParams.get("ref") || "";
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit = async (data) => {
    const data1 = {
      name: data.name,
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
    };

    await dispatch(signUp(data1, navigate));
    reset();
  };

  return (
    <div className="lg:mt-16 flex items-center justify-center px-4 sm:px-0 h-[85vh]">
      <div className="w-full max-w-md p-4 sm:p-8 rounded-lg shadow-lg bg-primary-light">
        <h2 className="text-2xl font-semibold text-text-heading text-center mb-3">
          Create an Account
        </h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-y-3"
        >
          {/* First & Last Name Fields */}
          <div className="flex flex-col sm:flex-row gap-y-4 sm:gap-y-0 sm:gap-x-4">
            <label className="w-full">
              <p className="mb-1 text-lg text-text-heading"> Name</p>
              <input
                type="text"
                placeholder=" Name"
                {...register("name", {
                  required: " Name is required",
                })}
                className="w-full focus:border-2 border-primary rounded-lg p-2 focus:outline-none"
              />
              {errors.name && (
                <p className="text-text-error text-xs">{errors.name.message}</p>
              )}
            </label>
          </div>

          {/* Email Field */}
          <label className="w-full">
            <p className="mb-1 text-lg text-text-heading">Email Address</p>
            <input
              type="email"
              placeholder="Enter email address"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: "Invalid email format",
                },
              })}
              className="w-full focus:border-2 border-primary rounded-lg p-2  focus:outline-none"
            />
            {errors.email && (
              <p className="text-text-error text-xs">{errors.email.message}</p>
            )}
          </label>

          {/* Password Fields */}
          <div className="flex flex-col sm:flex-row gap-y-4 sm:gap-y-0 sm:gap-x-4">
            <label className="relative w-full">
              <p className="mb-1 text-lg text-text-heading">Create Password</p>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className="w-full focus:border-2 border-primary rounded-lg p-2 pr-10  focus:outline-none"
              />
              <span
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-[38px] cursor-pointer text-primary"
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible fontSize={24} />
                ) : (
                  <AiOutlineEye fontSize={24} />
                )}
              </span>
              {errors.password && (
                <p className="text-text-error text-xs">
                  {errors.password.message}
                </p>
              )}
            </label>

            <label className="relative w-full">
              <p className="mb-1 text-lg text-text-heading">Confirm Password</p>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                {...register("confirmPassword", {
                  required: "Confirm password is required",
                  validate: (value) =>
                    value === watch("password") || "Passwords do not match",
                })}
                className="w-full focus:border-2 border-primary rounded-lg p-2 pr-10  focus:outline-none"
              />
              <span
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-[38px] cursor-pointer text-primary"
              >
                {showConfirmPassword ? (
                  <AiOutlineEyeInvisible fontSize={24} />
                ) : (
                  <AiOutlineEye fontSize={24} />
                )}
              </span>
              {errors.confirmPassword && (
                <p className="text-text-error text-xs">
                  {errors.confirmPassword.message}
                </p>
              )}
            </label>
          </div>
          <label className="w-full">
            <p className="mb-1 text-lg text-text-heading">Referral Code</p>
            <input
              type="text"
              placeholder="Referral Code (optional)"
              {...register("referral")}
              className="w-full focus:border-2 border-primary rounded-lg p-2 focus:outline-none"
              readOnly={!!referralCode} // Make read-only if set from URL
            />
          </label>
          {/* Terms and Conditions */}
          <label className="flex items-start gap-2 text-sm text-text-heading">
            <input
              type="checkbox"
              {...register("acceptTerms", {
                required: "You must accept the Terms and Conditions",
              })}
              className="mt-1 accent-primary-dark"
            />
            <span>
              I agree to the{" "}
              <Link
                to="/terms-and-conditions"
                className="text-text-linkHover underline"
              >
                Terms and Conditions
              </Link>{" "}
              and{" "}
              <Link
                to="/privacy-policy"
                className="text-text-linkHover underline"
              >
                Privacy Policy
              </Link>
              .
            </span>
          </label>
          {errors.acceptTerms && (
            <p className="text-text-error text-xs">
              {errors.acceptTerms.message}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="mt-4 rounded-lg bg-button py-2 text-text-body font-semibold hover:bg-button-hover transition"
          >
            Create Account
          </button>

          {/* Login Link */}
          <p className="mt-2 text-center text-text-heading">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-text-link hover:text-text-linkHover font-semibold"
            >
              Log In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignupForm;
