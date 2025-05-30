import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import StakedAmountChart from "./StakeChart";
import { statsData } from "../../../../services/operations/adminAndOwnerDashboardApi";
import { useUser } from "../../../common/UserContext";
import Loading from "../../../../pages/Loading";

function SummaryCard({ title, value, inc = null, filter }) {
  return (
    <div className="bg-primary-dark rounded-md py-2 px-2 flex items-center justify-between transition-all duration-300 w-full">
      <div className="bg-secondary text-text-heading p-2 rounded-full">
        <h2 className="text-sm sm:text-lg text-text-heading font-medium">
          {title}
        </h2>
        <p className="text-base sm:text-xl text-text-heading font-bold">
          {value}
        </p>
      </div>
      <div className="flex flex-col items-end gap-1 sm:gap-2">
        <p className="text-sm sm:text-xl text-text-heading text-right">
          {filter}
        </p>
        {inc && (
          <p className="text-sm sm:text-xl text-text-linkHover font-bold text-right">
            + {inc}
          </p>
        )}
      </div>
    </div>
  );
}

function DepositWithdrawAreaChart({ data }) {
  return (
    <div className="bg-primary-dark p-3 sm:p-4 md:p-6 rounded-xl shadow-md w-full h-full flex flex-col">
      <h3 className="text-text-heading font-bold text-center text-base sm:text-lg md:text-xl mb-3 sm:mb-4">
        Deposit vs Withdrawal Amount
      </h3>

      <div className="w-full h-[200px] sm:h-[250px] md:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <XAxis
              dataKey="name"
              stroke="#fff"
              tick={{ fill: "#ccc", fontSize: 10 }}
            />
            <YAxis stroke="#fff" tick={{ fill: "#ccc", fontSize: 10 }} />
            <Tooltip
              contentStyle={{ backgroundColor: "#222", borderColor: "#555" }}
              itemStyle={{ color: "#fff" }}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="deposit"
              stackId="1"
              stroke="#22c55e"
              fill="#4ade80"
              name="Deposit"
            />
            <Area
              type="monotone"
              dataKey="withdraw"
              stackId="1"
              stroke="#ef4444"
              fill="#f87171"
              name="Withdrawal"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function Stats() {
  const { user, setUser } = useUser();
  const [timeFilter, setTimeFilter] = useState("24h");
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDeposit: 0,
    totalProfit: 0,
    payouts: 0,
    incTotalUsers: 0,
    incTotalDeposit: 0,
    incTotalProfit: 0,
    incPayouts: 0,
  });
  const [userStats, setUserStats] = useState([]);

  const [depositStats, setDepositStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getStatsData = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        let formattedTimeFilter = timeFilter;

        switch (timeFilter) {
          case "24h":
            formattedTimeFilter = "1d";
            break;
          case "1 week":
            formattedTimeFilter = "1w";
            break;
          case "1 month":
            formattedTimeFilter = "1m";
            break;
          case "1 year":
            formattedTimeFilter = "1y";
            break;
          case "all time":
            formattedTimeFilter = "lifetime";
            break;
        }

        params.append("range", formattedTimeFilter);

        const response = await statsData(user.token, params);

        setStats({
          totalUsers: response.totalUsers || 0,
          totalDeposit: response.totalDeposit || 0,
          totalProfit: response.totalProfit || 0,
          payouts: response.payouts || 0,
          incTotalUsers: response.incTotalUsers || 0,
          incTotalDeposit: response.incTotalDeposit || 0,
          incTotalProfit: response.incTotalProfit || 0,
          incPayouts: response.incPayouts || 0,
        });

        setDepositStats(response.depositWithdrawChartData || []);
        setUserStats(response.usersChartData || []);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    getStatsData();
  }, [timeFilter]);

  if (loading) {
    return <Loading />;
  }
  return (
    <div className="bg-primary-light space-y-2 h-full p-2 sm:p-4 overflow-y-auto scrollbar-hide">
      {/* Time Filter */}
      <div className="flex flex-wrap justify-between items-center gap-2 sm:px-32 text-text-heading">
        {["24h", "1 week", "1 month", "1 year", "all time"].map((filter) => (
          <p
            key={filter}
            onClick={() => setTimeFilter(filter)}
            className={`cursor-pointer text-sm sm:text-base ${
              timeFilter === filter
                ? "font-bold text-text-linkHover bg-primary-dark py-1 px-3 rounded-3xl"
                : "text-text-body"
            }`}
          >
            {filter}
          </p>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-2">
        <SummaryCard
          title="Total Users"
          value={stats.totalUsers}
          inc={stats.incTotalUsers}
          filter={timeFilter}
        />
        <SummaryCard
          title="Total Profit"
          value={stats.totalProfit}
          inc={stats.incTotalProfit}
          filter={timeFilter}
        />
        <SummaryCard
          title="Total Deposit Amount"
          value={stats.totalDeposit}
          inc={stats.incTotalDeposit}
          filter={timeFilter}
        />
        <SummaryCard
          title="Payouts to Users"
          value={stats.payouts}
          inc={stats.incPayouts}
          filter={timeFilter}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StakedAmountChart
          title={"Total Number of Users"}
          timeFilter={timeFilter}
          statsData={userStats}
        />
        <DepositWithdrawAreaChart data={depositStats} />
      </div>
    </div>
  );
}

export default Stats;
