import { useEffect, useState } from "react";
import { getTerms } from "../services/operations/adminAndOwnerDashboardApi";
import Loading from "./Loading";

function TermsAndConditions() {
  const [termsData, setTermsData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        setLoading(true);
        const response = await getTerms();
        setTermsData(response.data.terms);
      } catch (error) {
        console.error("Failed to fetch terms:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTerms();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="max-w-3xl mb-2 mt-20 mx-auto p-6 text-text-body bg-primary border border-button rounded  shadow-lg ">
      <h1 className="text-3xl bg-primary-light  p-2 font-bold text-text-heading mb-6 text-center">
        📜 Terms & Conditions
      </h1>

      <div className="space-y-6 text-base leading-7">
        {termsData.map((item, index) => (
          <div key={index} className="bg-primary-dark rounded p-2">
            <h2 className="font-semibold text-lg text-text-heading">
              {index + 1}. {item.title}
            </h2>
            <p>{item.condition}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TermsAndConditions;
