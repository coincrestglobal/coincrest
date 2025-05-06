import useSafeNavigate from "../utils/useSafeNavigate";
function PrivacyPolicy() {
  const navigate = useSafeNavigate();
  return (
    <div className="max-w-3xl mt-20 mx-auto p-6 text-text-body bg-primary border border-button rounded shadow-lg">
      <h1 className="text-3xl bg-primary-light p-2 font-bold text-text-heading mb-6 text-center">
        🔒 Privacy Policy
      </h1>

      <div className="space-y-6 text-base leading-7">
        <div className="bg-primary-dark rounded p-2">
          <h2 className="font-semibold text-lg text-text-heading">
            1. Introduction
          </h2>
          <p>
            At Coin Crest, your privacy is of utmost importance. This Privacy
            Policy outlines how we collect, use, and protect your personal
            information when you visit and use our platform.
          </p>
        </div>

        <div className="bg-primary-dark rounded p-2">
          <h2 className="font-semibold text-lg text-text-heading">
            2. Information We Collect
          </h2>
          <p>
            We collect the following types of information:
            <ul className="list-disc ml-6">
              <li>
                Personal Information: such as name, email address, and contact
                details when you sign up.
              </li>
              <li>
                Transaction Data: including deposit and withdrawal details to
                process your transactions.
              </li>
              <li>
                Usage Data: details of how you use our website and services to
                improve your experience.
              </li>
            </ul>
          </p>
        </div>

        <div className="bg-primary-dark rounded p-2">
          <h2 className="font-semibold text-lg text-text-heading">
            3. How We Use Your Information
          </h2>
          <p>
            The information we collect is used for the following purposes:
            <ul className="list-disc ml-6">
              <li>To provide and improve our services.</li>
              <li>To process transactions and fulfill requests.</li>
              <li>
                To communicate with you about updates, offers, and promotions.
              </li>
              <li>
                To detect, prevent, and address fraud or other illegal
                activities.
              </li>
            </ul>
          </p>
        </div>

        <div className="bg-primary-dark rounded p-2">
          <h2 className="font-semibold text-lg text-text-heading">
            4. Data Security
          </h2>
          <p>
            We take the security of your data seriously. We implement various
            security measures, including encryption and secure server protocols,
            to protect your personal and financial information.
          </p>
        </div>

        <div className="bg-primary-dark rounded p-2">
          <h2 className="font-semibold text-lg text-text-heading">
            5. Sharing Your Information
          </h2>
          <p>
            We do not share or sell your personal information to third parties.
            However, we may share your information under the following
            circumstances:
            <ul className="list-disc ml-6">
              <li>To comply with legal obligations or government requests.</li>
              <li>
                To protect our rights, property, and safety, and those of
                others.
              </li>
            </ul>
          </p>
        </div>

        <div className="bg-primary-dark rounded p-2">
          <h2 className="font-semibold text-lg text-text-heading">
            6. Cookies
          </h2>
          <p>
            We use cookies to enhance your experience on our website. Cookies
            are small data files stored on your device to improve site
            functionality. You can control cookie settings through your browser.
          </p>
        </div>

        <div className="bg-primary-dark rounded p-2">
          <h2 className="font-semibold text-lg text-text-heading">
            7. Your Rights
          </h2>
          <p>
            You have the right to:
            <ul className="list-disc ml-6">
              <li>Access your personal data.</li>
              <li>Request corrections or deletions of your data.</li>
              <li>Opt-out of promotional communications.</li>
            </ul>
            To exercise your rights, please contact us at our support email.
          </p>
        </div>

        <div className="bg-primary-dark rounded p-2">
          <h2 className="font-semibold text-lg text-text-heading">
            8. Policy Changes
          </h2>
          <p>
            Coin Crest reserves the right to update this Privacy Policy from
            time to time. Any changes will be posted on this page, and we will
            notify you of significant updates.
          </p>
        </div>

        <div className="bg-primary-dark rounded p-2">
          <h2 className="font-semibold text-lg text-text-heading">
            9. Contact Us
          </h2>
          <p>
            If you have any questions or concerns about this Privacy Policy,
            please reach out to us using the button below:
          </p>
          <div className="mt-4">
            <button
              onClick={() => navigate("/contactus")}
              className="bg-button text-white py-2 px-4 rounded hover:bg-button-hover transition duration-300"
            >
              Go to Contact Us Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
