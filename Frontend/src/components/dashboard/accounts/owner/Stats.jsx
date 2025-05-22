import { useState, useEffect } from "react";
import { IndianRupee, CheckCircle, Clock } from "lucide-react";
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
const stakedAmount = {
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
const payoutAmmount = {
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

function Stats() {
  const [timeFilter, setTimeFilter] = useState("24h");
  const [data, setData] = useState(null);

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
          title={"Total Staked Amount of Users"}
          timeFilter={timeFilter}
          statsData={stakedAmount}
        />
        <StakedAmountChart
          title={"Total Payout Amount to Users"}
          timeFilter={timeFilter}
          statsData={payoutAmmount}
        />
      </div>
    </div>
  );
}

export default Stats;
