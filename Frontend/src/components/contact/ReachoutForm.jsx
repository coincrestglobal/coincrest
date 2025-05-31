import { useForm } from "react-hook-form";
import { submitContactForm } from "../../services/operations/contactusPageApi";

function ReachoutForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data) => {
    const response = await submitContactForm(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 text-text-heading"
    >
      {/* Name Field */}
      <div>
        <label
          htmlFor="name"
          className="block mb-2 text-lg sm:text-xl font-bold text-[var(--text-subheading)]"
        >
          Name
        </label>
        <input
          id="name"
          type="text"
          placeholder="Enter your name"
          {...register("name", { required: "Name is required" })}
          className="w-full py-2 bg-transparent border-b-2 border-[var(--text-body)] outline-none placeholder-[var(--text-body)] focus:border-[var(--text-highlighted)] transition duration-300 text-sm sm:text-base"
        />
        {errors.name && (
          <p className="text-text-error text-xs mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* Email Field */}
      <div>
        <label
          htmlFor="email"
          className="block mb-2 text-lg sm:text-xl font-bold text-[var(--text-subheading)]"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="Enter a valid email address"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Invalid email address",
            },
          })}
          className="w-full py-2 bg-transparent border-b-2 border-[var(--text-body)] outline-none placeholder-[var(--text-body)] focus:border-[var(--text-highlighted)] transition duration-300 text-sm sm:text-base"
        />
        {errors.email && (
          <p className="text-text-error text-xs mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Subject Field */}
      <div>
        <label
          htmlFor="subject"
          className="block mb-2 text-lg sm:text-xl font-bold text-[var(--text-subheading)]"
        >
          Subject
        </label>
        <input
          id="subject"
          type="text"
          placeholder="Enter subject"
          {...register("subject", { required: "Subject is required" })}
          className="w-full py-2 bg-transparent border-b-2 border-[var(--text-body)] outline-none placeholder-[var(--text-body)] focus:border-[var(--text-highlighted)] transition duration-300 text-sm sm:text-base"
        />
        {errors.subject && (
          <p className="text-text-error text-xs mt-1">
            {errors.subject.message}
          </p>
        )}
      </div>

      {/* Message Field */}
      <div>
        <label
          htmlFor="message"
          className="block mb-2 text-lg sm:text-xl font-bold text-[var(--text-subheading)]"
        >
          Message
        </label>
        <textarea
          id="message"
          placeholder="Enter your message"
          {...register("message", { required: "Message is required" })}
          className="w-full px-1 py-2 bg-transparent border-2 border-[var(--text-body)] rounded-md outline-none placeholder-[var(--text-body)] focus:border-[var(--text-highlighted)] transition duration-300 text-sm sm:text-base"
          rows="4"
        ></textarea>
        {errors.message && (
          <p className="text-text-error text-xs mt-1">
            {errors.message.message}
          </p>
        )}
      </div>

      {/* Certification Checkbox */}
      <label className="flex items-start gap-2 text-sm text-text-heading">
        <input
          type="checkbox"
          {...register("certifyInfo", {
            required: "You must confirm the accuracy of the information",
          })}
          className="mt-1 accent-primary"
        />
        <span>
          I hereby confirm that the information provided in this form is true
          and accurate .
        </span>
      </label>
      {errors.certifyInfo && (
        <p className="text-text-error text-xs">{errors.certifyInfo.message}</p>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-[var(--button)] hover:bg-[var(--button-hover)] text-white px-6 py-3 font-semibold rounded-lg transition-all duration-300 text-base sm:text-lg"
      >
        SUBMIT
      </button>
    </form>
  );
}

export default ReachoutForm;
