import ReachoutForm from "./ReachoutForm";
import GradientBackground from "../common/Gradient";

function ContactLayout() {
  return (
    <div className="bg-[var(--primary)] px-4 md:px-16 lg:px-32 py-10 sm:py-16 grid grid-cols-1 md:grid-cols-2 gap-8 rounded-xl shadow-lg overflow-hidden relative">
      <GradientBackground clor1="var(--grad2)" size="48%" top="15%" left="3%" />
      <GradientBackground size="40%" top="50%" left="99%" />

      {/* Left Side: Text + Image */}
      <div className="flex flex-col justify-center space-y-4 sm:space-y-6 text-text-body">
        <h2 className="text-2xl sm:text-4xl font-bold text-text-heading">
          GET IN TOUCH
        </h2>

        <p className="font-semibold text-text-highlighted text-base sm:text-lg">
          We can ensure reliability, low cost fares and most important, with
          safety and comfort in mind.
        </p>

        <p className="text-sm sm:text-md leading-relaxed">
          Whether you have a question, a project idea, or just want to chat,
          feel free to reach out. I’ll get back to you as soon as possible!
        </p>

        <img
          src="/images/contact-us.jpg"
          alt="Contact"
          className="w-full h-52 sm:h-72 object-cover rounded-lg mt-4 sm:mt-6 shadow-md"
        />
      </div>

      {/* Right Side: Form */}
      <div className="bg-white/10 backdrop-blur-md p-6 sm:p-8 rounded-xl shadow-xl">
        <ReachoutForm />
      </div>
    </div>
  );
}

export default ContactLayout;
