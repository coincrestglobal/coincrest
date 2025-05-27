import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

function StakedAmountChart({ timeFilter, statsData, title }) {
  const currentStatsData = statsData[timeFilter];

  return (
    <div className="bg-primary-dark p-3 sm:p-4 md:p-6 rounded-xl shadow-md flex flex-col justify-center items-center w-full">
      <h3 className="text-text-heading font-bold text-center text-base sm:text-lg md:text-xl mb-3 sm:mb-4">
        {title}
      </h3>

      <div className="w-full h-[200px] sm:h-[250px] md:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={currentStatsData}>
            <XAxis
              dataKey="name"
              stroke="var(--text-heading)"
              tick={{ fill: "var(--text-body)", fontSize: 10 }}
            />
            <YAxis
              stroke="var(--text-heading)"
              tick={{ fill: "var(--text-body)", fontSize: 10 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--primary-dark)",
                borderColor: "var(--text-heading)",
              }}
              itemStyle={{ color: "var(--text-heading)" }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="var(--text-highlighted)"
              strokeWidth={3}
              dot={{
                fill: "var(--secondary)",
                stroke: "var(--text-heading)",
                strokeWidth: 2,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default StakedAmountChart;
