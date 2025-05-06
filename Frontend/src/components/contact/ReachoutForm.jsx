function ReachoutForm() {
  return (
    <form className="space-y-6">
      <div>
        <label
          htmlFor="name"
          className="block mb-2 text-xl font-bold text-[var(--text-subheading)]"
        >
          Name
        </label>
        <input
          id="name"
          type="text"
          placeholder="Enter your Name"
          className="w-full px-2 bg-transparent border-b-2 border-[var(--text-body)] outline-none py-2 placeholder-[var(--text-body)] focus:border-[var(--text-highlighted)] transition duration-300"
        />
      </div>
      <div>
        <label
          htmlFor="email"
          className="block text-xl mb-2  font-bold text-[var(--text-subheading)]"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="Enter a valid email address"
          className="w-full px-2 bg-transparent border-b-2 border-[var(--text-body)] outline-none py-2 placeholder-[var(--text-body)] focus:border-[var(--text-highlighted)] transition duration-300"
        />
      </div>
      <div>
        <label
          htmlFor="subject"
          className="block text-xl mb-2  font-bold text-[var(--text-subheading)]"
        >
          Subject
        </label>
        <input
          id="subject"
          type="text"
          placeholder="Enter subject"
          className="w-full px-2 bg-transparent border-b-2 border-[var(--text-body)] outline-none py-2 placeholder-[var(--text-body)] focus:border-[var(--text-highlighted)] transition duration-300"
        />
      </div>

      <div>
        <label
          htmlFor="message"
          className="block mb-2 text-xl font-bold text-[var(--text-subheading)]"
        >
          Message
        </label>
        <textarea
          id="message"
          placeholder="Enter your message"
          className="w-full px-2 rounded-sm bg-transparent border-2 border-[var(--text-body)] outline-none py-2 placeholder-[var(--text-body)] focus:border-[var(--text-highlighted)] transition duration-300"
          rows="4"
        ></textarea>
      </div>

      <button
        type="submit"
        className="w-full bg-[var(--button)] hover:bg-[var(--button-hover)] text-white px-6 py-3 font-semibold rounded-lg transition-all duration-300"
      >
        SUBMIT
      </button>
    </form>
  );
}

export default ReachoutForm;
