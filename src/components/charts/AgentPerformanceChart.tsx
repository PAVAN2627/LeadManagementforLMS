import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const data = [
  { name: "John", converted: 24, pending: 8, lost: 3 },
  { name: "Sarah", converted: 18, pending: 12, lost: 5 },
  { name: "Mike", converted: 28, pending: 6, lost: 2 },
  { name: "Emily", converted: 22, pending: 10, lost: 4 },
  { name: "David", converted: 15, pending: 14, lost: 6 },
];

interface AgentPerformanceChartProps {
  data?: {
    name: string;
    converted: number;
    pending: number;
    lost: number;
  }[];
}

export function AgentPerformanceChart({ data: propData }: AgentPerformanceChartProps) {
  const chartData = propData || data;

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="name"
            stroke="#6B7280"
            fontSize={12}
            tickLine={false}
          />
          <YAxis
            stroke="#6B7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #E5E7EB",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              color: "#374151"
            }}
          />
          <Legend
            verticalAlign="top"
            height={36}
            formatter={(value) => (
              <span className="text-sm capitalize text-gray-700">{value}</span>
            )}
          />
          <Bar
            dataKey="converted"
            fill="#1F8A98"
            radius={[4, 4, 0, 0]}
            animationDuration={1000}
          />
          <Bar
            dataKey="pending"
            fill="#F59E0B"
            radius={[4, 4, 0, 0]}
            animationDuration={1200}
          />
          <Bar
            dataKey="lost"
            fill="#EF4444"
            radius={[4, 4, 0, 0]}
            animationDuration={1400}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
