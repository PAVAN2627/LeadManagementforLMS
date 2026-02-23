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

  const { data: allUsers = [] } = useQuery({
    queryKey: ['users'],
    queryFn: () => api.getUsers()
  });

  // Calculate Top Performers from real data
  const topPerformers = useMemo(() => {
    const agents = allUsers.filter((u: any) => u.role.toLowerCase() === 'agent');
    
    const performanceData = agents.map((agent: any) => {
      const agentLeads = leads.filter((l: ApiLead) => l.assignedTo?._id === agent._id);
      const converted = agentLeads.filter((l: ApiLead) => l.status === 'converted').length;
      const total = agentLeads.length;
      const score = total > 0 ? ((converted / total) * 100).toFixed(0) : "0";
      
      return {
        name: agent.name,
        metric: `${converted} conversions`,
        score: `${score}%`,
        trend: parseInt(score) >= 80 ? "up" : "down",
        convertedCount: converted
      };
    });

    // Sort by converted count and return top 5
    return performanceData
      .sort((a, b) => b.convertedCount - a.convertedCount)
      .slice(0, 5);
  }, [allUsers, leads]);

  // Calculate Conversion Trends from real data
  const conversionTrends = useMemo(() => {
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const thisMonthLeads = leads.filter((l: ApiLead) => {
      const leadDate = new Date(l.createdAt);
      return leadDate >= thisMonthStart;
    });

    const lastMonthLeads = leads.filter((l: ApiLead) => {
      const leadDate = new Date(l.createdAt);
      return leadDate >= lastMonthStart && leadDate <= lastMonthEnd;
    });

    const thisMonthConverted = thisMonthLeads.filter((l: ApiLead) => l.status === 'converted').length;
    const lastMonthConverted = lastMonthLeads.filter((l: ApiLead) => l.status === 'converted').length;

    const thisMonthRate = thisMonthLeads.length > 0 ? (thisMonthConverted / thisMonthLeads.length) * 100 : 0;
    const lastMonthRate = lastMonthLeads.length > 0 ? (lastMonthConverted / lastMonthLeads.length) * 100 : 0;
    const improvement = thisMonthRate - lastMonthRate;

    return {
      thisMonth: thisMonthRate.toFixed(1) + "%",
      lastMonth: lastMonthRate.toFixed(1) + "%",
      improvement: (improvement >= 0 ? "+" : "") + improvement.toFixed(1) + "%",
      thisMonthProgress: Math.min(thisMonthRate, 100),
      lastMonthProgress: Math.min(lastMonthRate, 100)
    };
  }, [leads]);

  // Calculate Team Performance from real data
  const teamPerformance = useMemo(() => {
    const departments = ['Sales', 'Marketing', 'Support'];
    
    return departments.map(dept => {
      const deptUsers = allUsers.filter((u: any) => u.department === dept);
      const deptLeads = leads.filter((l: ApiLead) => 
        deptUsers.some((u: any) => u._id === l.assignedTo?._id)
      );
      const converted = deptLeads.filter((l: ApiLead) => l.status === 'converted').length;
      const performance = deptLeads.length > 0 ? ((converted / deptLeads.length) * 100).toFixed(0) : "0";

      const colorMap: Record<string, string> = {
        Sales: "from-emerald-500 to-green-500",
        Marketing: "from-blue-500 to-blue-600",
        Support: "from-purple-500 to-purple-600"
      };

      const bgColorMap: Record<string, string> = {
        Sales: "bg-emerald-500",
        Marketing: "bg-blue-500",
        Support: "bg-purple-500"
      };

      return {
        department: `${dept} Team`,
        members: deptUsers.length,
        performance: parseInt(performance),
        color: colorMap[dept] || "from-gray-500 to-gray-600",
        bgColor: bgColorMap[dept] || "bg-gray-500"
      };
    });
  }, [allUsers, leads]);

  // Calculate Activity Overview from real data
  const activityOverview = useMemo(() => {
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const thisMonthLeads = leads.filter((l: ApiLead) => {
      const leadDate = new Date(l.createdAt);
      return leadDate >= thisMonthStart;
    });

    const lastMonthLeads = leads.filter((l: ApiLead) => {
      const leadDate = new Date(l.createdAt);
      return leadDate >= lastMonthStart && leadDate <= lastMonthEnd;
    });

    const calculateChange = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? "+100%" : "0%";
      const change = ((current - previous) / previous) * 100;
      return (change >= 0 ? "+" : "") + change.toFixed(0) + "%";
    };

    const thisMonthContacted = thisMonthLeads.filter((l: ApiLead) => 
      ['contacted', 'qualified', 'proposal', 'negotiation', 'converted'].includes(l.status)
    ).length;
    const lastMonthContacted = lastMonthLeads.filter((l: ApiLead) => 
      ['contacted', 'qualified', 'proposal', 'negotiation', 'converted'].includes(l.status)
    ).length;

    return [
      { 
        activity: "Leads Processed", 
        count: thisMonthLeads.length, 
        change: calculateChange(thisMonthLeads.length, lastMonthLeads.length),
        icon: Target
      },
      { 
        activity: "Leads Contacted", 
        count: thisMonthContacted, 
        change: calculateChange(thisMonthContacted, lastMonthContacted),
        icon: Users
      },
      { 
        activity: "Active Agents", 
        count: allUsers.filter((u: any) => u.role === 'agent' && u.status === 'active').length, 
        change: "+0%",
        icon: Activity
      },
      { 
        activity: "Conversions", 
        count: thisMonthLeads.filter((l: ApiLead) => l.status === 'converted').length, 
        change: calculateChange(
          thisMonthLeads.filter((l: ApiLead) => l.status === 'converted').length,
          lastMonthLeads.filter((l: ApiLead) => l.status === 'converted').length
        ),
        icon: Calendar
      },
    ];
  }, [leads, allUsers]);

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
    const agents = allUsers.filter((u: any) => u.role.toLowerCase() === 'agent');
    if (agents.length === 0) return undefined;

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
  }, [allUsers, leads]);

  // Export all reports function
  const exportAllReports = () => {
    const reportData = {
      exportDate: new Date().toISOString().split('T')[0],
      dateRange: dateRange,
      topPerformers: topPerformers,
      conversionTrends: conversionTrends,
      teamPerformance: teamPerformance,
      activityOverview: activityOverview,
      totalLeads: leads.length,
      totalUsers: allUsers.length,
      conversionRate: conversionRate,
      leadsByStatus: leadsByStatusData
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

  // Download all agent performance
  const downloadAllAgentPerformance = () => {
    const agents = allUsers.filter((u: any) => u.role.toLowerCase() === 'agent');
    
    const performanceData = agents.map((agent: any) => {
      const agentLeads = leads.filter((l: ApiLead) => l.assignedTo?._id === agent._id);
      const converted = agentLeads.filter((l: ApiLead) => l.status === 'converted').length;
      const total = agentLeads.length;
      const conversionRate = total > 0 ? ((converted / total) * 100).toFixed(1) : "0";
      
      return [
        agent.name,
        agent.email,
        total,
        converted,
        conversionRate + '%'
      ];
    });

    const csvContent = [
      ['Agent Name', 'Email', 'Total Leads', 'Converted', 'Conversion Rate'],
      ...performanceData
    ]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `all-agent-performance-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Download Complete",
      description: "All agent performance data has been downloaded.",
    });
  };

  // Download Leads Report
  const downloadLeadsReport = () => {
    const csvContent = [
      ['Lead Name', 'Email', 'Phone', 'Company', 'Status', 'Source', 'Agent', 'Date', 'Next Follow-up'],
      ...leads.map((lead: ApiLead) => [
        lead.name,
        lead.email,
        lead.phone,
        lead.company,
        lead.status,
        lead.source,
        lead.assignedTo?.name || 'Unassigned',
        new Date(lead.createdAt).toLocaleDateString(),
        lead.nextFollowUp ? new Date(lead.nextFollowUp).toLocaleDateString() : 'N/A'
      ])
    ]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `leads-report-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Download Complete",
      description: "Leads report has been downloaded.",
    });
  };

  // Download Manager Report
  const downloadManagerReport = () => {
    const managers = allUsers.filter((u: any) => u.role.toLowerCase() === 'manager');
    
    const managerData = managers.map((manager: any) => {
      const agents = allUsers.filter((u: any) => u.role === 'agent');
      const totalLeads = leads.length;
      const converted = leads.filter((l: ApiLead) => l.status === 'converted').length;
      
      return [
        manager.name,
        manager.email,
        agents.length,
        totalLeads,
        converted,
        totalLeads > 0 ? ((converted / totalLeads) * 100).toFixed(1) + '%' : '0%'
      ];
    });

    const csvContent = [
      ['Manager Name', 'Email', 'Team Size', 'Total Leads', 'Converted', 'Conversion Rate'],
      ...managerData
    ]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `manager-report-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Download Complete",
      description: "Manager report has been downloaded.",
    });
  };

  // Download Users Report
  const downloadUsersReport = () => {
    const csvContent = [
      ['Name', 'Email', 'Role', 'Department', 'Status', 'Phone', 'Created At'],
      ...allUsers.map((user: any) => [
        user.name,
        user.email,
        user.role,
        user.department || 'N/A',
        user.status,
        user.phone || 'N/A',
        new Date(user.createdAt).toLocaleDateString()
      ])
    ]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `users-report-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Download Complete",
      description: "Users report has been downloaded.",
    });
  };

  // Download Conversion Report
  const downloadConversionReport = () => {
    const convertedLeads = leads.filter((l: ApiLead) => l.status === 'converted');
    
    const csvContent = [
      ['Lead Name', 'Email', 'Company', 'Agent', 'Converted Date', 'Source'],
      ...convertedLeads.map((lead: ApiLead) => [
        lead.name,
        lead.email,
        lead.company,
        lead.assignedTo?.name || 'Unassigned',
        new Date(lead.updatedAt).toLocaleDateString(),
        lead.source
      ])
    ]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `conversion-report-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Download Complete",
      description: "Conversion report has been downloaded.",
    });
  };

  // Download Monthly Summary
  const downloadMonthlySummary = () => {
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisMonthLeads = leads.filter((l: ApiLead) => new Date(l.createdAt) >= thisMonthStart);
    const converted = thisMonthLeads.filter((l: ApiLead) => l.status === 'converted').length;
    
    const csvContent = [
      ['Metric', 'Value'],
      ['Month', now.toLocaleString('default', { month: 'long', year: 'numeric' })],
      ['Total Leads', thisMonthLeads.length],
      ['Converted Leads', converted],
      ['Conversion Rate', thisMonthLeads.length > 0 ? ((converted / thisMonthLeads.length) * 100).toFixed(1) + '%' : '0%'],
      ['Active Agents', allUsers.filter((u: any) => u.role === 'agent' && u.status === 'active').length],
      ['Total Users', allUsers.length],
      ['New Leads', thisMonthLeads.filter((l: ApiLead) => l.status === 'new').length],
      ['Contacted', thisMonthLeads.filter((l: ApiLead) => l.status === 'contacted').length],
      ['Qualified', thisMonthLeads.filter((l: ApiLead) => l.status === 'qualified').length]
    ]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `monthly-summary-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Download Complete",
      description: "Monthly summary has been downloaded.",
    });
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
                        { value: "analytics", icon: PieChart, label: "Analytics" },
                        { value: "reports", icon: FileText, label: "Reports" }
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
                <div className="p-6 bg-white">
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
                      className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                    >
                      <motion.div
                        whileHover={{ scale: 1.02, y: -5 }}
                        className="group"
                      >
                        <Card className="border-gray-200 shadow-lg hover:shadow-xl transition-all duration-500 rounded-2xl overflow-hidden bg-white">
                          <CardHeader className="bg-gradient-to-r from-teal-50 to-emerald-50 border-b border-gray-100">
                            <CardTitle className="flex items-center gap-3 text-gray-900">
                              <motion.div
                                animate={{ rotate: [0, 5, -5, 0] }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className="p-2 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg shadow-md"
                              >
                                <TrendingUp className="h-5 w-5 text-white" />
                              </motion.div>
                              Conversion Trends
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-6 bg-white">
                            <div className="space-y-6">
                              <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 1.3 }}
                                className="space-y-2"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium text-gray-600">This Month</span>
                                  <span className="font-bold text-xl text-gray-900">{conversionTrends.thisMonth}</span>
                                </div>
                                <div className="relative w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                  <motion.div
                                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-teal-500 to-teal-600 rounded-full"
                                    initial={{ width: "0%" }}
                                    animate={{ width: `${conversionTrends.thisMonthProgress}%` }}
                                    transition={{ delay: 1.5, duration: 1.5 }}
                                  />
                                </div>
                              </motion.div>

                              <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 1.4 }}
                                className="space-y-2"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium text-gray-600">Last Month</span>
                                  <span className="font-bold text-xl text-gray-900">{conversionTrends.lastMonth}</span>
                                </div>
                                <div className="relative w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                  <motion.div
                                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-gray-400 to-gray-500 rounded-full"
                                    initial={{ width: "0%" }}
                                    animate={{ width: `${conversionTrends.lastMonthProgress}%` }}
                                    transition={{ delay: 1.6, duration: 1.5 }}
                                  />
                                </div>
                              </motion.div>

                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.7 }}
                                className="pt-4 border-t border-gray-100"
                              >
                                <div className="flex items-center gap-2 text-emerald-600">
                                  {conversionTrends.improvement.startsWith('+') ? (
                                    <ArrowUp className="h-4 w-4" />
                                  ) : (
                                    <ArrowDown className="h-4 w-4" />
                                  )}
                                  <span className="font-semibold">{conversionTrends.improvement} improvement</span>
                                </div>
                              </motion.div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.02, y: -5 }}
                        className="group"
                      >
                        <Card className="border-gray-200 shadow-lg hover:shadow-xl transition-all duration-500 rounded-2xl overflow-hidden bg-white">
                          <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50 border-b border-gray-100">
                            <div className="flex items-center justify-between">
                              <CardTitle className="flex items-center gap-3 text-gray-900">
                                <motion.div
                                  animate={{ scale: [1, 1.1, 1] }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                  className="p-2 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg shadow-md"
                                >
                                  <Award className="h-5 w-5 text-white" />
                                </motion.div>
                                Top 3 Performers
                              </CardTitle>
                              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-xs"
                                  onClick={downloadAllAgentPerformance}
                                >
                                  <Download className="h-3 w-3 mr-1" />
                                  Download All
                                </Button>
                              </motion.div>
                            </div>
                          </CardHeader>
                          <CardContent className="p-6 bg-white">
                            <div className="space-y-4">
                              {topPerformers.slice(0, 3).map((performer, index) => (
                                <motion.div
                                  key={performer.name}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 1.3 + index * 0.1 }}
                                  whileHover={{ x: 5, scale: 1.02 }}
                                  className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-all duration-300"
                                >
                                  <div className="flex items-center gap-3">
                                    <motion.div
                                      animate={{ rotate: [0, 5, -5, 0] }}
                                      transition={{ duration: 4, repeat: Infinity, delay: index * 0.2 }}
                                      className="h-10 w-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-md"
                                    >
                                      {index + 1}
                                    </motion.div>
                                    <div>
                                      <div className="font-semibold text-gray-900">{performer.name}</div>
                                      <div className="text-sm text-gray-600">{performer.metric}</div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <Badge className="bg-green-100 text-green-800 font-semibold px-3 py-1">
                                      {performer.score}
                                    </Badge>
                                    <motion.div
                                      animate={{
                                        y: performer.trend === "up" ? [0, -2, 0] : [0, 2, 0],
                                        rotate: performer.trend === "up" ? [0, 5, 0] : [0, -5, 0]
                                      }}
                                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                                    >
                                      {performer.trend === "up" ? (
                                        <ArrowUp className="h-4 w-4 text-emerald-600" />
                                      ) : (
                                        <ArrowDown className="h-4 w-4 text-red-600" />
                                      )}
                                    </motion.div>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
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
                              {teamPerformance.map((team, index) => (
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
                              {activityOverview.map((item, index) => (
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

                  <TabsContent value="reports" className="space-y-6 mt-0">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.2 }}
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                      {/* Leads Report */}
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.3 }}
                        whileHover={{ y: -5, scale: 1.02 }}
                      >
                        <Card className="border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden">
                          <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-gray-100">
                            <CardTitle className="flex items-center gap-3 text-gray-900">
                              <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg shadow-md">
                                <Target className="h-5 w-5 text-white" />
                              </div>
                              <div>
                                <div className="text-base font-bold">Leads Report</div>
                                <div className="text-xs text-gray-600 font-normal">All leads with details</div>
                              </div>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-6">
                            <p className="text-sm text-gray-600 mb-4">
                              Download complete list of all leads with name, email, company, status, source, and assigned agent.
                            </p>
                            <Button
                              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
                              onClick={downloadLeadsReport}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download CSV
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>

                      {/* Agent Performance Report */}
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.4 }}
                        whileHover={{ y: -5, scale: 1.02 }}
                      >
                        <Card className="border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden">
                          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-100">
                            <CardTitle className="flex items-center gap-3 text-gray-900">
                              <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg shadow-md">
                                <Users className="h-5 w-5 text-white" />
                              </div>
                              <div>
                                <div className="text-base font-bold">Agent Performance</div>
                                <div className="text-xs text-gray-600 font-normal">Individual agent metrics</div>
                              </div>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-6">
                            <p className="text-sm text-gray-600 mb-4">
                              Download performance metrics for all agents including total leads, conversions, and conversion rates.
                            </p>
                            <Button
                              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                              onClick={downloadAllAgentPerformance}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download CSV
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>

                      {/* Manager Report */}
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.5 }}
                        whileHover={{ y: -5, scale: 1.02 }}
                      >
                        <Card className="border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden">
                          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-100">
                            <CardTitle className="flex items-center gap-3 text-gray-900">
                              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-md">
                                <BarChart3 className="h-5 w-5 text-white" />
                              </div>
                              <div>
                                <div className="text-base font-bold">Manager Report</div>
                                <div className="text-xs text-gray-600 font-normal">Team overview & stats</div>
                              </div>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-6">
                            <p className="text-sm text-gray-600 mb-4">
                              Download comprehensive manager report with team performance, lead distribution, and conversion metrics.
                            </p>
                            <Button
                              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                              onClick={downloadManagerReport}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download CSV
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>

                      {/* Users Report */}
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.6 }}
                        whileHover={{ y: -5, scale: 1.02 }}
                      >
                        <Card className="border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden">
                          <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 border-b border-gray-100">
                            <CardTitle className="flex items-center gap-3 text-gray-900">
                              <div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg shadow-md">
                                <Users className="h-5 w-5 text-white" />
                              </div>
                              <div>
                                <div className="text-base font-bold">Users Report</div>
                                <div className="text-xs text-gray-600 font-normal">All system users</div>
                              </div>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-6">
                            <p className="text-sm text-gray-600 mb-4">
                              Download complete list of all users with name, email, role, department, status, and contact info.
                            </p>
                            <Button
                              className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white"
                              onClick={downloadUsersReport}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download CSV
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>

                      {/* Conversion Report */}
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.7 }}
                        whileHover={{ y: -5, scale: 1.02 }}
                      >
                        <Card className="border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden">
                          <CardHeader className="bg-gradient-to-r from-teal-50 to-green-50 border-b border-gray-100">
                            <CardTitle className="flex items-center gap-3 text-gray-900">
                              <div className="p-2 bg-gradient-to-br from-teal-500 to-green-500 rounded-lg shadow-md">
                                <TrendingUp className="h-5 w-5 text-white" />
                              </div>
                              <div>
                                <div className="text-base font-bold">Conversion Report</div>
                                <div className="text-xs text-gray-600 font-normal">Converted leads only</div>
                              </div>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-6">
                            <p className="text-sm text-gray-600 mb-4">
                              Download list of all converted leads with conversion dates, assigned agents, and lead details.
                            </p>
                            <Button
                              className="w-full bg-gradient-to-r from-teal-600 to-green-600 hover:from-teal-700 hover:to-green-700 text-white"
                              onClick={downloadConversionReport}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download CSV
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>

                      {/* Monthly Summary */}
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.8 }}
                        whileHover={{ y: -5, scale: 1.02 }}
                      >
                        <Card className="border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden">
                          <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-gray-100">
                            <CardTitle className="flex items-center gap-3 text-gray-900">
                              <div className="p-2 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-lg shadow-md">
                                <FileText className="h-5 w-5 text-white" />
                              </div>
                              <div>
                                <div className="text-base font-bold">Monthly Summary</div>
                                <div className="text-xs text-gray-600 font-normal">Current month stats</div>
                              </div>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-6">
                            <p className="text-sm text-gray-600 mb-4">
                              Download comprehensive monthly summary with all key metrics, trends, and performance indicators.
                            </p>
                            <Button
                              className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white"
                              onClick={downloadMonthlySummary}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download CSV
                            </Button>
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