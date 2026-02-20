import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  Users,
  Target,
  Download,
  Calendar,
  Filter,
  RefreshCw,
  FileText,
  PieChart,
  LineChart,
  Activity,
  DollarSign,
  ArrowUp,
  ArrowDown,
  Award,
  Clock
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LeadsByStatusChart } from "@/components/charts/LeadsByStatusChart";
import { MonthlyGrowthChart } from "@/components/charts/MonthlyGrowthChart";
import { AgentPerformanceChart } from "@/components/charts/AgentPerformanceChart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { api, ApiLead, ApiUser } from "@/lib/api";

const AdminReports = () => {
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState("30");
  const [reportType, setReportType] = useState("leads");

  // Fetch data
  const { data: leads = [] } = useQuery({
    queryKey: ['leads'],
    queryFn: api.getLeads
  });

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: () => api.getUsers('agent')
  });

  // Compute Leads By Status
  const leadsByStatusData = useMemo(() => {
    const statusCounts = leads.reduce((acc: Record<string, number>, lead: ApiLead) => {
      // Normalize status to key (e.g. "new" -> "New")
      const rawStatus = lead.status;
      // Default to capitalized if valid status, else raw
      const status = rawStatus ? rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1) : "Unknown";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    const colorMap: Record<string, string> = {
      New: "#1F8A98",
      Contacted: "#17A2B8",
      Qualified: "#20C997",
      Converted: "#28A745",
      Lost: "#DC3545",
      Proposal: "#6f42c1",
      Negotiation: "#fd7e14",
      Unknown: "#6c757d"
    };

    return Object.keys(statusCounts).map(status => ({
      name: status,
      value: statusCounts[status],
      color: colorMap[status] || "#6c757d"
    })).filter(item => item.value > 0);
  }, [leads]);

  // Compute Agent Performance
  const agentPerformanceData = useMemo(() => {
    const agents = users.filter((u: any) => u.role.toLowerCase() === 'agent');
    if (agents.length === 0) return undefined; // Let chart use default if no agents or data not ready

    return agents.map((agent: any) => {
      const agentLeads = leads.filter((l: ApiLead) => l.assignedTo?._id === agent._id);
      const converted = agentLeads.filter((l: ApiLead) => l.status === 'converted').length;
      const lost = agentLeads.filter((l: ApiLead) => l.status === 'lost').length;
      const pending = agentLeads.length - converted - lost;

      return {
        name: agent.name.split(' ')[0],
        converted,
        pending,
        lost
      };
    });
  }, [users, leads]);

  // Export all reports function
  const exportAllReports = () => {
    const reportData = {
      exportDate: new Date().toISOString().split('T')[0],
      dateRange: dateRange,
      reportTemplates: reportTemplates,
      topPerformers: topPerformers,
      conversionTrends: {
        thisMonth: "18.4%",
        lastMonth: "16.3%",
        improvement: "+2.1%"
      },
      teamPerformance: [
        { department: "Sales Team", members: 12, performance: 92, color: "bg-green-500" },
        { department: "Marketing Team", members: 8, performance: 88, color: "bg-blue-500" },
        { department: "Support Team", members: 6, performance: 95, color: "bg-purple-500" },
      ],
      activityOverview: [
        { activity: "Leads Processed", count: 156, change: "+12%" },
        { activity: "Calls Made", count: 89, change: "+8%" },
        { activity: "Emails Sent", count: 234, change: "+15%" },
        { activity: "Meetings Scheduled", count: 45, change: "+5%" },
      ]
    };

    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `comprehensive-reports-${new Date().toISOString().split('T')[0]}.json`;
    link.click();

    toast({
      title: "Export Successful",
      description: "All reports have been exported successfully.",
    });
  };

  // Refresh data function
  const refreshReports = () => {
    // Simulate refresh
    setDateRange("30");
    setReportType("leads");

    toast({
      title: "Data Refreshed",
      description: "Reports data has been refreshed successfully.",
    });
  };

  // Calculate real conversion rate
  const conversionRate = useMemo(() => {
    if (leads.length === 0) return "0%";
    const converted = leads.filter((l: ApiLead) => l.status === 'converted').length;
    return ((converted / leads.length) * 100).toFixed(1) + "%";
  }, [leads]);



  const reportTemplates = [
    {
      title: "Lead Performance Report",
      description: "Comprehensive analysis of lead generation and conversion",
      icon: TrendingUp,
      type: "leads",
      lastGenerated: "2 hours ago"
    },
    {
      title: "Sales Team Report",
      description: "Individual and team performance metrics",
      icon: Users,
      type: "team",
      lastGenerated: "1 day ago"
    },
    {
      title: "Revenue Analysis",
      description: "Revenue trends and forecasting",
      icon: DollarSign,
      type: "revenue",
      lastGenerated: "3 hours ago"
    },
    {
      title: "Pipeline Health",
      description: "Sales pipeline status and bottlenecks",
      icon: Activity,
      type: "pipeline",
      lastGenerated: "5 hours ago"
    },
    {
      title: "Customer Journey",
      description: "Lead journey from first contact to conversion",
      icon: Target,
      type: "journey",
      lastGenerated: "1 day ago"
    },
    {
      title: "Monthly Summary",
      description: "Executive summary for monthly review",
      icon: FileText,
      type: "summary",
      lastGenerated: "2 days ago"
    }
  ];

  const topPerformers = [
    { name: "John Smith", metric: "24 conversions", score: "95%", trend: "up" },
    { name: "Emily Davis", metric: "18 conversions", score: "88%", trend: "up" },
    { name: "Mike Wilson", metric: "28 conversions", score: "92%", trend: "down" },
    { name: "Sarah Johnson", metric: "22 conversions", score: "90%", trend: "up" },
    { name: "David Lee", metric: "15 conversions", score: "78%", trend: "up" }
  ];

  const generateReport = (type: string) => {
    // Simulate report generation
    console.log(`Generating ${type} report...`);
  };

  return (
    <DashboardLayout role="admin" title="Reports & Analytics">
      <div className="space-y-8">
        {/* Premium Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl gradient-teal p-8 text-white"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, white 2px, transparent 2px), 
                               radial-gradient(circle at 75% 75%, white 2px, transparent 2px)`,
              backgroundSize: '60px 60px, 80px 80px'
            }} />
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Title Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="flex-1"
            >
              <div className="flex items-center gap-3 mb-3">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                  className="p-3 bg-white/20 backdrop-blur-sm rounded-xl"
                >
                  <BarChart3 className="h-6 w-6" />
                </motion.div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-teal-100 bg-clip-text text-transparent">
                    Reports & Analytics
                  </h1>
                  <p className="text-teal-100 mt-1">Comprehensive insights and performance metrics that drive success</p>
                </div>
              </div>

              {/* Live Metrics Ticker */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap items-center gap-6 text-sm"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2"
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-2 h-2 bg-green-400 rounded-full"
                  />
                  <span className="text-teal-100">Real-time Data</span>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2"
                >
                  <Activity className="h-4 w-4 text-teal-200" />
                  <span className="text-teal-100">Live Analytics</span>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2"
                >
                  <TrendingUp className="h-4 w-4 text-teal-200" />
                  <span className="text-teal-100">Performance Tracking</span>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap gap-3"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="w-40 bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="7">Last 7 days</SelectItem>
                    <SelectItem value="30">Last 30 days</SelectItem>
                    <SelectItem value="90">Last 3 months</SelectItem>
                    <SelectItem value="365">Last year</SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm transition-all duration-300 shadow-lg hover:shadow-xl"
                  onClick={refreshReports}
                >
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                  </motion.div>
                  Refresh
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="sm"
                  className="bg-white hover:bg-gray-50 text-teal-700 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
                  onClick={exportAllReports}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export All
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>


        {/* Enhanced Analytics Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="relative"
        >
          <div className="relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-xl">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0" style={{
                backgroundImage: `linear-gradient(45deg, #0f766e 25%, transparent 25%), 
                                 linear-gradient(-45deg, #0f766e 25%, transparent 25%), 
                                 linear-gradient(45deg, transparent 75%, #0f766e 75%), 
                                 linear-gradient(-45deg, transparent 75%, #0f766e 75%)`,
                backgroundSize: '20px 20px',
                backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
              }} />
            </div>

            <div className="relative z-10">
              <Tabs defaultValue="overview" className="space-y-0">
                {/* Enhanced Tab Header */}
                <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-teal-50 via-white to-emerald-50">
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="flex items-center justify-between mb-4"
                  >
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">Analytics Dashboard</h3>
                      <p className="text-sm text-gray-600">Real-time insights and performance metrics</p>
                    </div>

                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="p-2 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg shadow-md"
                    >
                      <Activity className="h-5 w-5 text-white" />
                    </motion.div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.0 }}
                  >
                    <TabsList className="grid w-full grid-cols-4 bg-white shadow-lg border border-gray-200 rounded-xl p-1 h-auto">
                      {[
                        { value: "overview", icon: BarChart3, label: "Overview" },
                        { value: "performance", icon: TrendingUp, label: "Performance" },
                        { value: "reports", icon: FileText, label: "Reports" },
                        { value: "analytics", icon: PieChart, label: "Analytics" }
                      ].map((tab, index) => (
                        <motion.div
                          key={tab.value}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1.1 + index * 0.1 }}
                        >
                          <TabsTrigger
                            value={tab.value}
                            className="relative flex items-center gap-2 p-3 rounded-lg font-semibold text-gray-600 
                                     data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-600 data-[state=active]:to-teal-700 
                                     data-[state=active]:text-white data-[state=active]:shadow-lg 
                                     transition-all duration-300 hover:bg-gray-50 data-[state=active]:hover:bg-teal-700"
                          >
                            <tab.icon className="h-4 w-4" />
                            <span className="hidden sm:inline">{tab.label}</span>

                            {/* Active indicator */}
                            <motion.div
                              className="absolute inset-0 rounded-lg bg-gradient-to-r from-teal-400/20 to-teal-600/20 opacity-0"
                              whileHover={{ opacity: 1 }}
                              transition={{ duration: 0.2 }}
                            />
                          </TabsTrigger>
                        </motion.div>
                      ))}
                    </TabsList>
                  </motion.div>
                </div>

                {/* Tab Content Areas */}
                <div className="p-6">
                  <TabsContent value="overview" className="space-y-6 mt-0">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.2 }}
                      className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
                    >
                      <motion.div whileHover={{ scale: 1.02 }} className="rounded-2xl overflow-hidden bg-white shadow-lg border border-gray-200">
                        <div className="bg-gradient-to-r from-teal-50 to-emerald-50 p-4">
                          <h3 className="font-semibold text-gray-900 mb-2">Leads by Status</h3>
                        </div>
                        <div className="bg-white p-6">
                          <LeadsByStatusChart data={leadsByStatusData.length > 0 ? leadsByStatusData : undefined} />
                        </div>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.02 }} className="rounded-2xl overflow-hidden bg-white shadow-lg border border-gray-200">
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
                          <h3 className="font-semibold text-gray-900 mb-2">Monthly Growth</h3>
                        </div>
                        <div className="bg-white p-6">
                          <MonthlyGrowthChart />
                        </div>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.02 }} className="rounded-2xl overflow-hidden bg-white shadow-lg border border-gray-200">
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4">
                          <h3 className="font-semibold text-gray-900 mb-2">Agent Performance</h3>
                        </div>
                        <div className="bg-white p-6">
                          <AgentPerformanceChart data={agentPerformanceData} />
                        </div>
                      </motion.div>
                    </motion.div>
                  </TabsContent>

                  <TabsContent value="performance" className="space-y-6 mt-0">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.2 }}
                      className="text-center py-12"
                    >
                      <p className="text-gray-500">Performance metrics coming soon...</p>
                    </motion.div>
                  </TabsContent>

                  <TabsContent value="reports" className="space-y-6 mt-0">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.2 }}
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                      {reportTemplates.map((report, index) => (
                        <motion.div
                          key={report.title}
                          initial={{ opacity: 0, y: 30, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{
                            delay: 1.3 + index * 0.1,
                            type: "spring",
                            stiffness: 100
                          }}
                          whileHover={{
                            y: -10,
                            scale: 1.05,
                            transition: { type: "spring", stiffness: 400 }
                          }}
                          className="group"
                        >
                          <Card className="relative overflow-hidden border-gray-200 hover:shadow-2xl transition-all duration-500 cursor-pointer rounded-2xl bg-white">
                            {/* Background Gradient */}
                            <motion.div
                              className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                              style={{
                                background: "linear-gradient(135deg, #0f766e, #047857, #065f46)"
                              }}
                              animate={{
                                background: [
                                  "linear-gradient(135deg, #0f766e, #047857, #065f46)",
                                  "linear-gradient(225deg, #0f766e, #047857, #065f46)",
                                  "linear-gradient(315deg, #0f766e, #047857, #065f46)",
                                  "linear-gradient(135deg, #0f766e, #047857, #065f46)"
                                ]
                              }}
                              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                            />

                            <CardHeader className="relative z-10 pb-3 bg-gradient-to-r from-gray-50 to-teal-25">
                              <div className="flex items-center gap-3">
                                <motion.div
                                  animate={{
                                    rotate: [0, 5, -5, 0],
                                    scale: [1, 1.1, 1]
                                  }}
                                  transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    delay: index * 0.2
                                  }}
                                  className="p-3 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl shadow-lg group-hover:shadow-2xl transition-shadow duration-500"
                                >
                                  <report.icon className="h-6 w-6 text-white" />
                                </motion.div>
                                <div className="flex-1">
                                  <CardTitle className="text-base font-bold text-gray-900 group-hover:text-teal-800 transition-colors">
                                    {report.title}
                                  </CardTitle>
                                  <p className="text-sm text-gray-600 mt-1 group-hover:text-gray-700 transition-colors">
                                    {report.description}
                                  </p>
                                </div>
                              </div>
                            </CardHeader>

                            <CardContent className="relative z-10 pt-0 p-6 bg-white">
                              <div className="flex items-center justify-between">
                                <motion.span
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: 1.4 + index * 0.1 }}
                                  className="text-xs text-gray-500 flex items-center gap-1"
                                >
                                  <Clock className="h-3 w-3" />
                                  Last: {report.lastGenerated}
                                </motion.span>

                                <motion.div
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <Button
                                    size="sm"
                                    className="bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                                    onClick={() => generateReport(report.type)}
                                  >
                                    <Download className="h-3 w-3 mr-1" />
                                    Generate
                                  </Button>
                                </motion.div>
                              </div>
                            </CardContent>

                            {/* Animated Border */}
                            <motion.div
                              className="absolute inset-0 rounded-2xl border-2 border-teal-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                              animate={{
                                borderColor: ["#14b8a6", "#0d9488", "#047857", "#14b8a6"]
                              }}
                              transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "linear"
                              }}
                            />
                          </Card>
                        </motion.div>
                      ))}
                    </motion.div>
                  </TabsContent>

                  <TabsContent value="analytics" className="space-y-6 mt-0">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.2 }}
                      className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                    >
                      <motion.div
                        whileHover={{ scale: 1.02, y: -5 }}
                        className="group"
                      >
                        <Card className="border-gray-200 shadow-lg hover:shadow-xl transition-all duration-500 rounded-2xl overflow-hidden bg-white">
                          <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-100">
                            <CardTitle className="flex items-center gap-3 text-gray-900">
                              <motion.div
                                animate={{ rotate: [0, 360] }}
                                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                className="p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg shadow-md"
                              >
                                <Users className="h-5 w-5 text-white" />
                              </motion.div>
                              Team Performance Overview
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-6 bg-white">
                            <div className="space-y-6">
                              {[
                                { department: "Sales Team", members: 12, performance: 92, color: "from-emerald-500 to-green-500", bgColor: "bg-emerald-500" },
                                { department: "Marketing Team", members: 8, performance: 88, color: "from-blue-500 to-blue-600", bgColor: "bg-blue-500" },
                                { department: "Support Team", members: 6, performance: 95, color: "from-purple-500 to-purple-600", bgColor: "bg-purple-500" },
                              ].map((team, index) => (
                                <motion.div
                                  key={team.department}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 1.3 + index * 0.1 }}
                                  whileHover={{ x: 5, scale: 1.02 }}
                                  className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-all duration-300"
                                >
                                  <div className="flex items-center gap-4">
                                    <motion.div
                                      animate={{ scale: [1, 1.1, 1] }}
                                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                                      className={`w-4 h-4 rounded-full ${team.bgColor} shadow-md`}
                                    />
                                    <div>
                                      <div className="font-semibold text-gray-900">{team.department}</div>
                                      <div className="text-sm text-gray-600">{team.members} members</div>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <motion.div
                                      className="font-bold text-xl text-gray-900"
                                      animate={{ scale: [1, 1.05, 1] }}
                                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                                    >
                                      {team.performance}%
                                    </motion.div>
                                    <div className="text-sm text-gray-600">avg. performance</div>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.02, y: -5 }}
                        className="group"
                      >
                        <Card className="border-gray-200 shadow-lg hover:shadow-xl transition-all duration-500 rounded-2xl overflow-hidden bg-white">
                          <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 border-b border-gray-100">
                            <CardTitle className="flex items-center gap-3 text-gray-900">
                              <motion.div
                                animate={{
                                  scale: [1, 1.1, 1],
                                  rotate: [0, 5, -5, 0]
                                }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg shadow-md"
                              >
                                <Activity className="h-5 w-5 text-white" />
                              </motion.div>
                              Activity Overview
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-6 bg-white">
                            <div className="space-y-5">
                              {[
                                { activity: "Leads Processed", count: 156, change: "+12%", icon: Target },
                                { activity: "Calls Made", count: 89, change: "+8%", icon: Users },
                                { activity: "Emails Sent", count: 234, change: "+15%", icon: Activity },
                                { activity: "Meetings Scheduled", count: 45, change: "+5%", icon: Calendar },
                              ].map((item, index) => (
                                <motion.div
                                  key={item.activity}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 1.3 + index * 0.1 }}
                                  whileHover={{ x: 5, scale: 1.02 }}
                                  className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-all duration-300"
                                >
                                  <div className="flex items-center gap-3">
                                    <motion.div
                                      animate={{ rotate: [0, 5, -5, 0] }}
                                      transition={{ duration: 3, repeat: Infinity, delay: index * 0.2 }}
                                      className="p-2 bg-gradient-to-br from-teal-100 to-teal-200 rounded-lg"
                                    >
                                      <item.icon className="h-4 w-4 text-teal-600" />
                                    </motion.div>
                                    <span className="font-medium text-gray-700">{item.activity}</span>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <motion.span
                                      className="font-bold text-xl text-gray-900"
                                      animate={{ scale: [1, 1.05, 1] }}
                                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.1 }}
                                    >
                                      {item.count}
                                    </motion.span>
                                    <motion.span
                                      className="text-sm font-semibold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full"
                                      animate={{ scale: [1, 1.1, 1] }}
                                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.15 }}
                                    >
                                      {item.change}
                                    </motion.span>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </motion.div>
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default AdminReports;