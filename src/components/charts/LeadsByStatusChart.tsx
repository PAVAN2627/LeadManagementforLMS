import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

const mockData = [
  { name: "New", value: 45, color: "#1F8A98" },
  { name: "Contacted", value: 30, color: "#17A2B8" },
  { name: "Qualified", value: 20, color: "#20C997" },
  { name: "Converted", value: 35, color: "#28A745" },
  { name: "Lost", value: 15, color: "#DC3545" },
];

interface LeadsByStatusChartProps {
  data?: {
    name: string;
    value: number;
    color: string;
  }[];
}

export function LeadsByStatusChart({ data }: LeadsByStatusChartProps) {
  const chartData = data || mockData;

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
            animationBegin={0}
            animationDuration={1000}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
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
            verticalAlign="bottom"
            height={36}
            formatter={(value) => (
              <span className="text-sm text-gray-700">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
