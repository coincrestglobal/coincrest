import ReachoutForm from "./ReachoutForm";
import GradientBackground from "../common/Gradient";

function ContactLayout() {
  return (
    <div className="mt-16 mx-8 md:mx-32">
      {/* <ReachoutOptions /> */}
      <div className="bg-[var(--primary)] px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-8 rounded-xl shadow-lg overflow-hidden">
        <GradientBackground
          clor1="rgba(14,102,64,0.8)"
          size="48%"
          top="15%"
          left="3%"
        />

        <GradientBackground size="40%" top="50%" left="99%" />

        {/* Left side: Text + Image */}
        <div className="flex flex-col justify-center space-y-6 text-text-body">
          <h2 className="text-4xl font-bold text-text-heading">GET IN TOUCH</h2>
          <p className="font-semibold text-text-highlighted text-lg">
            We can ensure reliability, low cost fares and most important, with
            safety and comfort in mind.
          </p>
          <p className="text-md leading-relaxed">
            Whether you have a question, a project idea, or just want to chat,
            feel free to reach out. I’ll get back to you as soon as possible!
          </p>

          <img
            src="/images/contact-us.jpg"
            alt="Contact"
            className="w-full h-72 object-cover rounded-lg mt-6 shadow-md"
          />
        </div>

        {/* Right side: Form */}
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-xl">
          <ReachoutForm />
        </div>
      </div>
    </div>
  );
}

export default ContactLayout;
