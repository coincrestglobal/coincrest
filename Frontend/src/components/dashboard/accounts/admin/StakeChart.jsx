import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function StakedAmountChart({ timeFilter, statsData, title }) {
  const currentStatsData = statsData[timeFilter];
  return (
    <div className="bg-primary p-4 rounded-xl shadow-md flex flex-col justify-center items-center w-full">
      <h3 className="text-text-heading font-bold mb-4 text-center">{title}</h3>

      <div className="w-full">
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={currentStatsData}>
            <XAxis
              dataKey="name"
              stroke="var(--text-heading)"
              tick={{ fill: "var(--text-body)" }}
            />
            <YAxis
              stroke="var(--text-heading)"
              tick={{ fill: "var(--text-body)" }}
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
