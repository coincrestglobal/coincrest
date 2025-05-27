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

// Dummy data representing different time periods
const dummyData = {
  "24h": {
    totalUsers: 1000000,
    totalDeposit: 1000000,
    totalProfit: 1000000,
    payouts: 1000000,
    incTotalUsers: 100,
    incTotalDeposit: 100,
    incTotalProfit: 1000000,
    incPayouts: 1000000,
  },
  "1 week": {
    totalUsers: 1050000,
    totalDeposit: 1050000,
    totalProfit: 1050000,
    payouts: 1050000,
    incTotalUsers: 5000,
    incTotalDeposit: 5000,
    incTotalProfit: 500000,
    incPayouts: 500000,
  },
  "1 month": {
    totalUsers: 1100000,
    totalDeposit: 1100000,
    totalProfit: 1100000,
    payouts: 1100000,
    incTotalUsers: 10000,
    incTotalDeposit: 10000,
    incTotalProfit: 100000,
    incPayouts: 100000,
  },
  "1 year": {
    totalUsers: 1200000,
    totalDeposit: 1200000,
    totalProfit: 1200000,
    payouts: 1200000,
    incTotalUsers: 20000,
    incTotalDeposit: 20000,
    incTotalProfit: 500000,
    incPayouts: 500000,
  },
  "all time": {
    totalUsers: 1500000,
    totalDeposit: 1500000,
    totalProfit: 1500000,
    payouts: 1500000,
    incTotalUsers: 50000,
    incTotalDeposit: 50000,
    incTotalProfit: 2000000,
    incPayouts: 2000000,
  },
};
const users = {
  "24h": [
    { name: "00:00", value: 2000 },
    { name: "02:00", value: 2500 },
    { name: "04:00", value: 1500 },
    { name: "06:00", value: 2200 },
    { name: "08:00", value: 1700 },
    { name: "10:00", value: 1800 },
    { name: "12:00", value: 2500 },
    { name: "14:00", value: 2400 },
    { name: "16:00", value: 2700 },
    { name: "18:00", value: 2200 },
    { name: "20:00", value: 2400 },
    { name: "22:00", value: 2000 },
  ],
  "1 week": [
    { name: "Mon", value: 30000 },
    { name: "Tue", value: 32000 },
    { name: "Wed", value: 29000 },
    { name: "Thu", value: 31000 },
    { name: "Fri", value: 35000 },
    { name: "Sat", value: 40000 },
    { name: "Sun", value: 42000 },
  ],
  "1 month": [
    { name: "Week 1", value: 20000 },
    { name: "Week 2", value: 25000 },
    { name: "Week 3", value: 22000 },
    { name: "Week 4", value: 27000 },
  ],
  "1 year": [
    { name: "Jan", value: 20000 },
    { name: "Feb", value: 25000 },
    { name: "Mar", value: 22000 },
    { name: "Apr", value: 27000 },
    { name: "May", value: 30000 },
    { name: "Jun", value: 35000 },
    { name: "Jul", value: 33000 },
    { name: "Aug", value: 36000 },
    { name: "Sep", value: 40000 },
    { name: "Oct", value: 45000 },
    { name: "Nov", value: 47000 },
    { name: "Dec", value: 48000 },
  ],
  "all time": [
    { name: "2020", value: 20000 },
    { name: "2021", value: 30000 },
    { name: "2022", value: 10000 },
    { name: "2023", value: 12000 },
    { name: "2024", value: 14000 },
    { name: "2025", value: 8000 },
  ],
};

const dummyDepositWithdrawData = {
  "24h": [
    { name: "00:00", deposit: 2000, withdraw: 1800 },
    { name: "04:00", deposit: 2500, withdraw: 2700 },
    { name: "08:00", deposit: 1500, withdraw: 1300 },
    { name: "12:00", deposit: 2200, withdraw: 2100 },
    { name: "16:00", deposit: 1700, withdraw: 2000 },
    { name: "20:00", deposit: 1800, withdraw: 2200 },
  ],
  "1 week": [
    { name: "Mon", deposit: 30000, withdraw: 25000 },
    { name: "Tue", deposit: 32000, withdraw: 29000 },
    { name: "Wed", deposit: 29000, withdraw: 31000 },
    { name: "Thu", deposit: 31000, withdraw: 30000 },
    { name: "Fri", deposit: 35000, withdraw: 36000 },
    { name: "Sat", deposit: 40000, withdraw: 42000 },
    { name: "Sun", deposit: 42000, withdraw: 41000 },
  ],
  "1 month": [
    { name: "Week 1", deposit: 20000, withdraw: 19000 },
    { name: "Week 2", deposit: 25000, withdraw: 24000 },
    { name: "Week 3", deposit: 22000, withdraw: 23000 },
    { name: "Week 4", deposit: 27000, withdraw: 26000 },
  ],
  "1 year": [
    { name: "Jan", deposit: 20000, withdraw: 18000 },
    { name: "Feb", deposit: 25000, withdraw: 24000 },
    { name: "Mar", deposit: 22000, withdraw: 21000 },
    { name: "Apr", deposit: 27000, withdraw: 28000 },
    { name: "May", deposit: 30000, withdraw: 29000 },
    { name: "Jun", deposit: 35000, withdraw: 36000 },
    { name: "Jul", deposit: 33000, withdraw: 31000 },
    { name: "Aug", deposit: 36000, withdraw: 37000 },
    { name: "Sep", deposit: 40000, withdraw: 42000 },
    { name: "Oct", deposit: 45000, withdraw: 43000 },
    { name: "Nov", deposit: 47000, withdraw: 48000 },
    { name: "Dec", deposit: 48000, withdraw: 46000 },
  ],
  "all time": [
    { name: "2020", deposit: 20000, withdraw: 18000 },
    { name: "2021", deposit: 30000, withdraw: 32000 },
    { name: "2022", deposit: 10000, withdraw: 9000 },
    { name: "2023", deposit: 12000, withdraw: 13000 },
    { name: "2024", deposit: 14000, withdraw: 15000 },
    { name: "2025", deposit: 8000, withdraw: 7000 },
  ],
};

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
  const [timeFilter, setTimeFilter] = useState("24h");
  const [data, setData] = useState(null);
  const depositWithdrawData = dummyDepositWithdrawData[timeFilter] || [];

  useEffect(() => {
    setData(dummyData);
  }, []);

  if (!data) return <div className="text-center p-4">Loading...</div>;

  const currentData = data[timeFilter];

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
          value={currentData.totalUsers}
          inc={currentData.incTotalUsers}
          filter={timeFilter}
        />
        <SummaryCard
          title="Total Available Balance"
          value={currentData.totalProfit}
          inc={currentData.incTotalProfit}
          filter={timeFilter}
        />
        <SummaryCard
          title="Total Deposit Amount"
          value={currentData.totalDeposit}
          inc={currentData.incTotalDeposit}
          filter={timeFilter}
        />
        <SummaryCard
          title="Payouts to Users"
          value={currentData.payouts}
          inc={currentData.incPayouts}
          filter={timeFilter}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StakedAmountChart
          title={"Total Number of Users"}
          timeFilter={timeFilter}
          statsData={users}
        />
        <DepositWithdrawAreaChart data={depositWithdrawData} />
      </div>
    </div>
  );
}

export default Stats;
