import { useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link } from "react-router";

function SignupForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit = (data) => {
    console.log("Signup Data:", data);
    // Handle signup logic (e.g., API call)
  };

  return (
    <div className="mt-16 flex items-center justify-center h-[85vh]">
      <div className="w-full max-w-md p-8 rounded-lg shadow-lg bg-primary-light">
        <h2 className="text-2xl font-semibold text-text-heading text-center mb-4">
          Create an Account
        </h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-y-4"
        >
          {/* First & Last Name Fields */}
          <div className="flex gap-x-4">
            <label className="w-full">
              <p className="mb-1 text-lg text-text-heading">First Name</p>
              <input
                type="text"
                placeholder="First Name"
                {...register("firstName", {
                  required: "First name is required",
                })}
                className="w-full focus:border-2 border-primary rounded-lg  p-2 text-text-body focus:outline-none"
              />
              {errors.firstName && (
                <p className="text-error text-xs">{errors.firstName.message}</p>
              )}
            </label>
            <label className="w-full">
              <p className="mb-1 text-lg text-text-heading">Last Name</p>
              <input
                type="text"
                placeholder="Last Name"
                {...register("lastName", { required: "Last name is required" })}
                className="w-full focus:border-2 border-primary rounded-lg  p-2 text-text-body focus:outline-none"
              />
              {errors.lastName && (
                <p className="text-error text-xs">{errors.lastName.message}</p>
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
              className="w-full focus:border-2 border-primary rounded-lg  p-2 text-text-body focus:outline-none"
            />
            {errors.email && (
              <p className="text-error text-xs">{errors.email.message}</p>
            )}
          </label>

          {/* Contact Field */}
          <label className="w-full">
            <p className="mb-1 text-lg text-text-heading">Contact</p>
            <div className="flex gap-x-4">
              <select
                {...register("countryCode", { required: "Code is required" })}
                className="w-1/3 focus:border-2 border-primary rounded-lg p-2 text-text-body focus:outline-none"
              >
                <option value="+1">+1 (US)</option>
                <option value="+91">+91 (IN)</option>
                <option value="+44">+44 (UK)</option>
                <option value="+61">+61 (AU)</option>
                <option value="+81">+81 (JP)</option>
              </select>

              <input
                type="tel"
                placeholder="Enter contact number"
                {...register("contactNumber", {
                  required: "Contact number is required",
                  pattern: {
                    value: /^[0-9]{7,15}$/,
                    message: "Invalid contact number",
                  },
                })}
                className="w-2/3 focus:border-2 border-primary rounded-lg p-2 text-text-body focus:outline-none"
              />
            </div>
            {(errors.countryCode || errors.contactNumber) && (
              <p className="text-error text-xs mt-1">
                {errors.countryCode?.message || errors.contactNumber?.message}
              </p>
            )}
          </label>

          {/* Password Fields */}
          <div className="flex gap-x-4">
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
                className="w-full focus:border-2 border-primary rounded-lg  p-2 pr-10 text-text-body focus:outline-none"
              />
              <span
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-[38px] cursor-pointer text-gray-400"
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible fontSize={24} />
                ) : (
                  <AiOutlineEye fontSize={24} />
                )}
              </span>
              {errors.password && (
                <p className="text-error text-xs">{errors.password.message}</p>
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
                className="w-full focus:border-2 border-primary rounded-lg  p-2 pr-10 text-text-body focus:outline-none"
              />
              <span
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-[38px] cursor-pointer text-gray-400"
              >
                {showConfirmPassword ? (
                  <AiOutlineEyeInvisible fontSize={24} />
                ) : (
                  <AiOutlineEye fontSize={24} />
                )}
              </span>
              {errors.confirmPassword && (
                <p className="text-error text-xs">
                  {errors.confirmPassword.message}
                </p>
              )}
            </label>
          </div>

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
              className="text-text-link hover:text-text-link-hover font-semibold"
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
