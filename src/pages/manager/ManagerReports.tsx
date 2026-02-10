import { useState } from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  Target,
  Calendar,
  Download,
  Filter,
  BarChart3,
  TrendingUp,
} from "lucide-react";
import { ManagerLayout } from "@/components/layout/ManagerLayout";
import { SummaryCard } from "@/components/ui/summary-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LeadsByStatusChart } from "@/components/charts/LeadsByStatusChart";
import { MonthlyGrowthChart } from "@/components/charts/MonthlyGrowthChart";
import { AgentPerformanceChart } from "@/components/charts/AgentPerformanceChart";

const ManagerReports = () => {
  const [timeRange, setTimeRange] = useState("month");
  const [reportType, setReportType] = useState("all");

  return (
    <ManagerLayout title="Reports & Analytics">
      {/* Summary Cards with Enhanced Animations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 0, duration: 0.6, type: "spring", bounce: 0.5 }}
          className="card-hover-effect hover-glow"
        >
          <SummaryCard
            title="Total Revenue"
            value="$124,500"
            icon={DollarSign}
            variant="success"
            trend={{ value: 15, isPositive: true }}
            delay={0}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 0.1, duration: 0.6, type: "spring", bounce: 0.5 }}
          className="card-hover-effect hover-glow"
        >
          <SummaryCard
            title="Conversion Rate"
            value="42%"
            icon={Target}
            variant="primary"
            trend={{ value: 5, isPositive: true }}
            delay={0.1}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, duration: 0.6, type: "spring", bounce: 0.5 }}
          className="card-hover-effect hover-glow"
        >
          <SummaryCard
            title="Avg. Deal Size"
            value="$8,300"
            icon={TrendingUp}
            trend={{ value: 3, isPositive: false }}
            delay={0.2}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, duration: 0.6, type: "spring", bounce: 0.5 }}
          className="card-hover-effect hover-glow"
        >
          <SummaryCard
            title="Team Performance"
            value="87%"
            icon={BarChart3}
            variant="primary"
            trend={{ value: 12, isPositive: true }}
            delay={0.3}
          />
        </motion.div>
      </div>

      {/* Filters with Enhanced Animations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
        className="flex flex-col sm:flex-row gap-4 mb-6"
      >
        <motion.div whileHover={{ scale: 1.02 }} className="w-full sm:w-48">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="hover:border-primary transition-colors hover-glow">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} className="w-full sm:w-48">
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="hover:border-primary transition-colors hover-glow">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reports</SelectItem>
              <SelectItem value="leads">Lead Reports</SelectItem>
              <SelectItem value="agents">Agent Reports</SelectItem>
              <SelectItem value="revenue">Revenue Reports</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="ml-auto"
        >
          <Button className="gradient-bg-animated text-primary-foreground button-ripple shadow-lg icon-bounce">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </motion.div>
      </motion.div>

      {/* Charts Grid with Enhanced Animations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6"
      >
        <motion.div
          whileHover={{ scale: 1.02, y: -5 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="card-hover-effect hover-glow rounded-xl overflow-hidden animated-border"
        >
          <div className="animated-border-content">
            <MonthlyGrowthChart />
          </div>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.02, y: -5 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="card-hover-effect hover-glow rounded-xl overflow-hidden animated-border"
        >
          <div className="animated-border-content">
            <LeadsByStatusChart />
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
        className="grid grid-cols-1 gap-6"
      >
        <motion.div
          whileHover={{ scale: 1.01, y: -5 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="card-hover-effect hover-glow rounded-xl overflow-hidden animated-border"
        >
          <div className="animated-border-content">
            <AgentPerformanceChart />
          </div>
        </motion.div>
      </motion.div>

      {/* Key Metrics with Enhanced Animations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, type: "spring", stiffness: 100 }}
        className="mt-6"
      >
        <Card className="p-6 card-hover-effect glass-card hover-glow animated-border">
          <div className="animated-border-content p-6">
            <div className="flex items-center gap-3 mb-4">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <BarChart3 className="h-6 w-6 text-primary" />
              </motion.div>
              <h3 className="text-lg font-semibold gradient-text-animated">Key Performance Indicators</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ x: 5 }}
                transition={{ delay: 0.8, type: "spring", stiffness: 300 }}
                className="space-y-2 p-4 rounded-lg hover:bg-primary/5 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Lead Response Time</span>
                  <motion.span
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.9 }}
                    className="text-sm font-medium"
                  >
                    2.3 hrs
                  </motion.span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "85%" }}
                    transition={{ delay: 1.0, duration: 1, ease: "easeOut" }}
                    className="h-full bg-gradient-bg-animated rounded-full"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ x: 5 }}
                transition={{ delay: 0.9, type: "spring", stiffness: 300 }}
                className="space-y-2 p-4 rounded-lg hover:bg-primary/5 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Follow-up Rate</span>
                  <motion.span
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.0 }}
                    className="text-sm font-medium"
                  >
                    94%
                  </motion.span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "94%" }}
                    transition={{ delay: 1.1, duration: 1, ease: "easeOut" }}
                    className="h-full bg-success rounded-full"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ x: 5 }}
                transition={{ delay: 1.0, type: "spring", stiffness: 300 }}
                className="space-y-2 p-4 rounded-lg hover:bg-primary/5 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Customer Satisfaction</span>
                  <motion.span
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.1 }}
                    className="text-sm font-medium"
                  >
                    4.8/5
                  </motion.span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "96%" }}
                    transition={{ delay: 1.2, duration: 1, ease: "easeOut" }}
                    className="h-full bg-gradient-bg-animated rounded-full"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </Card>
      </motion.div>
    </ManagerLayout>
  );
};

export default ManagerReports;
