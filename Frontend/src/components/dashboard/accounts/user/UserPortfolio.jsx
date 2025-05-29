import StatBox from "./StatBox";
import InvestCard from "./InvestCard";
import { useEffect, useState } from "react";
import { useUser } from "../../../common/UserContext";
import { getBalance } from "../../../../services/operations/userDashboardApi";
import Loading from "../../../../pages/Loading";

function UserPortfolio() {
  const { user } = useUser();
  const [userInvestableBalance, setUserInvestableBalance] = useState(0);
  const [userWithdrawableBalance, setUserWithdrawableBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchBalance = async () => {
      setLoading(true);
      try {
        const response = await getBalance(user.token);
        setUserInvestableBalance(response.data.investableBalance);
        setUserWithdrawableBalance(response.data.withdrawableBalance);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [user.token]);

  if (loading) {
    return <Loading />;
  }
  return (
    <div className="relative bg-primary-dark mx-2 sm:mx-4 md:mx-auto max-w-7xl rounded-md px-4 sm:px-6 md:px-10 lg:px-16 py-6 sm:py-8 md:py-10 space-y-6 sm:space-y-8">
      <div className="flex flex-wrap justify-between gap-4">
        <div className="flex-1 basis-full sm:basis-[45%] md:basis-[220px]">
          <StatBox
            heading={userWithdrawableBalance}
            subHeading="Available Balance"
          />
        </div>
        <div className="flex-1 basis-full sm:basis-[45%] md:basis-[220px]">
          <StatBox
            heading={userInvestableBalance}
            subHeading="Unstaked Balance"
          />
        </div>
      </div>

      <InvestCard />
    </div>
  );
}

export default UserPortfolio;
