import { useEffect, useState } from "react";
import { getPrivacyPolicy } from "../services/operations/adminAndOwnerDashboardApi";
import Loading from "./Loading";

function PrivacyPolicy() {
  const [privacyPolicyData, setPrivacyPolicyData] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        setLoading(true);
        const response = await getPrivacyPolicy();
        setPrivacyPolicyData(response.data.policies);
      } catch {
      } finally {
        setLoading(false);
      }
    };
    fetchPolicies();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="max-w-3xl mt-20 mx-auto p-6 text-text-body bg-primary border border-button rounded shadow-lg">
      <h1 className="text-3xl bg-primary-light p-2 font-bold text-text-heading mb-6 text-center">
        🔒 Privacy Policy
      </h1>
      <div className="space-y-6 text-base leading-7">
        {privacyPolicyData.map((item, index) => (
          <div key={index} className="bg-primary-dark rounded p-2">
            <h2 className="font-semibold text-lg text-text-heading">
              {index + 1}. {item.title}
            </h2>
            <p>{item.policy}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PrivacyPolicy;
