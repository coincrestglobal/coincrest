import StatBox from "./StatBox";
import InvestCard from "./InvestCard";
import { useEffect } from "react";
import { useUser } from "../../../common/UserContext";
import { getBalance } from "../../../../services/operations/userDashboardApi";

function UserPortfolio() {
  const { user } = useUser();
  let investableBalance = 0;
  let withdrawableBalance = 0;
  useEffect(() => {
    const fetchBalance = async () => {
      const response = await getBalance(user.token);
      investableBalance = response.data.investableBalance;
      withdrawableBalance = response.data.withdrawableBalance;
    };
    fetchBalance();
  }, []);
  return (
    <div className="relative bg-primary-dark mx-2 sm:mx-4 md:mx-auto max-w-7xl rounded-md px-4 sm:px-6 md:px-10 lg:px-16 py-6 sm:py-8 md:py-10 space-y-6 sm:space-y-8">
      <div className="flex flex-wrap justify-between gap-4">
        <div className="flex-1 basis-full sm:basis-[45%] md:basis-[220px]">
          <StatBox
            heading={withdrawableBalance}
            subHeading="Available Balance"
          />
        </div>
        <div className="flex-1 basis-full sm:basis-[45%] md:basis-[220px]">
          <StatBox heading={investableBalance} subHeading="Unstaked Balance" />
        </div>
      </div>

      <InvestCard />
    </div>
  );
}

export default UserPortfolio;
