function ReachoutForm() {
  return (
    <form className="space-y-6 text-text-heading">
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
          className="w-full  py-2 bg-transparent border-b-2 border-[var(--text-body)] outline-none placeholder-[var(--text-body)] focus:border-[var(--text-highlighted)] transition duration-300 text-sm sm:text-base"
        />
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
          className="w-full  py-2 bg-transparent border-b-2 border-[var(--text-body)] outline-none placeholder-[var(--text-body)] focus:border-[var(--text-highlighted)] transition duration-300 text-sm sm:text-base"
        />
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
          className="w-full  py-2 bg-transparent border-b-2 border-[var(--text-body)] outline-none placeholder-[var(--text-body)] focus:border-[var(--text-highlighted)] transition duration-300 text-sm sm:text-base"
        />
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
          className="w-full px-1 py-2 bg-transparent border-2 border-[var(--text-body)] rounded-md outline-none placeholder-[var(--text-body)] focus:border-[var(--text-highlighted)] transition duration-300 text-sm sm:text-base"
          rows="4"
        ></textarea>
      </div>

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
