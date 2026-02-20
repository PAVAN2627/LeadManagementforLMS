import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", leads: 45 },
  { month: "Feb", leads: 52 },
  { month: "Mar", leads: 48 },
  { month: "Apr", leads: 70 },
  { month: "May", leads: 65 },
  { month: "Jun", leads: 85 },
  { month: "Jul", leads: 92 },
  { month: "Aug", leads: 88 },
  { month: "Sep", leads: 105 },
  { month: "Oct", leads: 115 },
  { month: "Nov", leads: 125 },
  { month: "Dec", leads: 140 },
];

export function MonthlyGrowthChart() {
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="month"
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
          <Line
            type="monotone"
            dataKey="leads"
            stroke="#1F8A98"
            strokeWidth={3}
            dot={{ fill: "#1F8A98", strokeWidth: 0, r: 4 }}
            activeDot={{ r: 6, fill: "#1F8A98" }}
            animationDuration={1500}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
