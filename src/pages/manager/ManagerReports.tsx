import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Download,
  Filter,
} from "lucide-react";
import { ManagerLayout } from "@/components/layout/ManagerLayout";
import { Button } from "@/components/ui/button";
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
import { useQuery } from "@tanstack/react-query";
import { api, ApiLead } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

const ManagerReports = () => {
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState("month");
  const [reportType, setReportType] = useState("all");

  // Fetch real data
  const { data: leads = [] } = useQuery({
    queryKey: ['leads'],
    queryFn: api.getLeads,
  });

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: () => api.getUsers(),
  });

  const agents = useMemo(() => users.filter((u: any) => u.role === 'agent'), [users]);

  // Filter leads by time range
  const filteredLeads = useMemo(() => {
    const now = new Date();
    let startDate: Date;

    switch (timeRange) {
      case "week":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "quarter":
        const currentQuarter = Math.floor(now.getMonth() / 3);
        startDate = new Date(now.getFullYear(), currentQuarter * 3, 1);
        break;
      case "year":
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    return leads.filter((lead: ApiLead) => {
      const leadDate = new Date(lead.date);
      return leadDate >= startDate && leadDate <= now;
    });
  }, [leads, timeRange]);

  // Calculate real-time chart data based on filtered leads
  const leadsByStatusData = useMemo(() => {
    const statusCounts = {
      new: 0,
      contacted: 0,
      qualified: 0,
      proposal: 0,
      negotiation: 0,
      converted: 0,
      lost: 0
    };

    filteredLeads.forEach((lead: ApiLead) => {
      if (statusCounts.hasOwnProperty(lead.status)) {
        statusCounts[lead.status]++;
      }
    });

    return [
      { name: "New", value: statusCounts.new, color: "#1F8A98" },
      { name: "Contacted", value: statusCounts.contacted, color: "#17A2B8" },
      { name: "Qualified", value: statusCounts.qualified, color: "#20C997" },
      { name: "Proposal", value: statusCounts.proposal, color: "#FFC107" },
      { name: "Negotiation", value: statusCounts.negotiation, color: "#FF9800" },
      { name: "Converted", value: statusCounts.converted, color: "#28A745" },
      { name: "Lost", value: statusCounts.lost, color: "#DC3545" },
    ].filter(item => item.value > 0);
  }, [filteredLeads]);

  // Calculate monthly/weekly growth data based on time range
  const monthlyGrowthData = useMemo(() => {
    const now = new Date();
    
    if (timeRange === "week") {
      // Weekly data - last 7 days
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const dailyCounts: { [key: string]: number } = {};
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const dayName = days[date.getDay()];
        dailyCounts[dayName] = 0;
      }

      filteredLeads.forEach((lead: ApiLead) => {
        const leadDate = new Date(lead.date);
        const dayName = days[leadDate.getDay()];
        if (dailyCounts.hasOwnProperty(dayName)) {
          dailyCounts[dayName]++;
        }
      });

      return Object.keys(dailyCounts).map(day => ({
        month: day,
        leads: dailyCounts[day]
      }));
    } else if (timeRange === "year") {
      // Yearly data - all 12 months
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const currentYear = now.getFullYear();
      const monthlyCounts: { [key: string]: number } = {};

      monthNames.forEach(month => {
        monthlyCounts[month] = 0;
      });

      filteredLeads.forEach((lead: ApiLead) => {
        const leadDate = new Date(lead.date);
        if (leadDate.getFullYear() === currentYear) {
          const monthName = monthNames[leadDate.getMonth()];
          monthlyCounts[monthName]++;
        }
      });

      return monthNames.map(month => ({
        month,
        leads: monthlyCounts[month]
      }));
    } else {
      // Monthly or Quarter data - weeks in current period
      const weeks = ["Week 1", "Week 2", "Week 3", "Week 4"];
      const weeklyCounts: { [key: string]: number } = {};
      
      weeks.forEach(week => {
        weeklyCounts[week] = 0;
      });

      filteredLeads.forEach((lead: ApiLead) => {
        const leadDate = new Date(lead.date);
        const dayOfMonth = leadDate.getDate();
        const weekIndex = Math.min(Math.floor((dayOfMonth - 1) / 7), 3);
        const weekName = weeks[weekIndex];
        weeklyCounts[weekName]++;
      });

      return weeks.map(week => ({
        month: week,
        leads: weeklyCounts[week]
      }));
    }
  }, [filteredLeads, timeRange]);

  // Calculate agent performance data based on filtered leads
  const agentPerformanceData = useMemo(() => {
    return agents.map((agent: any) => {
      const agentLeads = filteredLeads.filter((l: ApiLead) => l.assignedTo?._id === agent._id);
      const converted = agentLeads.filter((l: ApiLead) => l.status === 'converted').length;
      const lost = agentLeads.filter((l: ApiLead) => l.status === 'lost').length;
      const pending = agentLeads.filter((l: ApiLead) => 
        !["converted", "lost"].includes(l.status)
      ).length;
      const conversionRate = agentLeads.length ? Math.round((converted / agentLeads.length) * 100) : 0;

      return {
        id: agent._id,
        name: agent.name,
        email: agent.email,
        phone: agent.phone,
        leadsAssigned: agentLeads.length,
        converted,
        pending,
        lost,
        conversionRate
      };
    });
  }, [filteredLeads, agents]);

  // Export all agents' performance data to CSV
  const handleExport = () => {
    const timeRangeLabel = {
      week: "This Week",
      month: "This Month",
      quarter: "This Quarter",
      year: "This Year"
    }[timeRange] || "This Month";

    // Prepare comprehensive agent performance data
    const csvRows = [
      ['Manager Department Report'],
      ['Generated Date', new Date().toLocaleString()],
      ['Time Range', timeRangeLabel],
      ['Total Agents', agents.length.toString()],
      ['Total Leads', filteredLeads.length.toString()],
      [''],
      ['AGENT PERFORMANCE SUMMARY'],
      ['Agent Name', 'Email', 'Phone', 'Leads Assigned', 'Converted', 'Pending', 'Lost', 'Conversion Rate (%)'],
      ...agentPerformanceData.map(agent => [
        agent.name,
        agent.email || 'N/A',
        agent.phone || 'N/A',
        agent.leadsAssigned.toString(),
        agent.converted.toString(),
        agent.pending.toString(),
        agent.lost.toString(),
        agent.conversionRate.toString() + '%'
      ]),
      [''],
      ['DEPARTMENT TOTALS'],
      ['Total Leads Assigned', agentPerformanceData.reduce((sum, a) => sum + a.leadsAssigned, 0).toString()],
      ['Total Converted', agentPerformanceData.reduce((sum, a) => sum + a.converted, 0).toString()],
      ['Total Pending', agentPerformanceData.reduce((sum, a) => sum + a.pending, 0).toString()],
      ['Total Lost', agentPerformanceData.reduce((sum, a) => sum + a.lost, 0).toString()],
      ['Overall Conversion Rate', 
        agentPerformanceData.reduce((sum, a) => sum + a.leadsAssigned, 0) > 0
          ? Math.round((agentPerformanceData.reduce((sum, a) => sum + a.converted, 0) / 
              agentPerformanceData.reduce((sum, a) => sum + a.leadsAssigned, 0)) * 100) + '%'
          : '0%'
      ],
      [''],
      ['LEAD STATUS BREAKDOWN'],
      ['Status', 'Count', 'Percentage'],
      ...leadsByStatusData.map(item => [
        item.name,
        item.value.toString(),
        filteredLeads.length > 0 
          ? Math.round((item.value / filteredLeads.length) * 100) + '%'
          : '0%'
      ]),
      [''],
      ['GROWTH TREND'],
      ['Period', 'Leads'],
      ...monthlyGrowthData.map(item => [item.month, item.leads.toString()]),
    ];

    const csvContent = csvRows
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    const fileName = `manager-department-report-${timeRange}-${new Date().toISOString().split('T')[0]}.csv`;
    
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Export Successful",
      description: `All ${agents.length} agents' performance data has been downloaded.`,
    });
  };

  return (
    <ManagerLayout title="Reports & Analytics">
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
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="ml-auto"
        >
          <Button 
            onClick={handleExport}
            className="gradient-bg-animated text-primary-foreground button-ripple shadow-lg relative overflow-visible export-button-animated group"
          >
            <motion.div
              className="absolute inset-0 bg-white/20 rounded-md"
              initial={{ opacity: 0 }}
              whileHover={{ 
                opacity: [0, 0.4, 0],
                transition: { 
                  duration: 0.8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
            />
            <motion.div
              animate={{ 
                rotate: [0, 360],
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
              className="inline-block mr-2"
            >
              <Download className="h-4 w-4" />
            </motion.div>
            <span className="relative z-10 font-semibold">Export Report</span>
            <motion.div
              className="absolute -inset-1 bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-400 rounded-md opacity-0 group-hover:opacity-30 blur-sm"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                backgroundSize: '200% 200%',
              }}
            />
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
            <MonthlyGrowthChart data={monthlyGrowthData} />
          </div>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.02, y: -5 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="card-hover-effect hover-glow rounded-xl overflow-hidden animated-border"
        >
          <div className="animated-border-content">
            <LeadsByStatusChart data={leadsByStatusData.length > 0 ? leadsByStatusData : undefined} />
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
          whileHover={{ scale: 1.02, y: -5 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="card-hover-effect hover-glow rounded-xl overflow-hidden animated-border"
        >
          <div className="animated-border-content">
            <AgentPerformanceChart data={agentPerformanceData.length > 0 ? agentPerformanceData : undefined} />
          </div>
        </motion.div>
      </motion.div>

      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, type: "spring", stiffness: 100 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6"
      >
        <motion.div
          whileHover={{ scale: 1.05, y: -5 }}
          className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="text-sm opacity-90 mb-1">Total Agents</div>
          <div className="text-3xl font-bold">{agents.length}</div>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05, y: -5 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="text-sm opacity-90 mb-1">Total Leads</div>
          <div className="text-3xl font-bold">{filteredLeads.length}</div>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05, y: -5 }}
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="text-sm opacity-90 mb-1">Converted</div>
          <div className="text-3xl font-bold">
            {agentPerformanceData.reduce((sum, a) => sum + a.converted, 0)}
          </div>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05, y: -5 }}
          className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="text-sm opacity-90 mb-1">Conversion Rate</div>
          <div className="text-3xl font-bold">
            {agentPerformanceData.reduce((sum, a) => sum + a.leadsAssigned, 0) > 0
              ? Math.round((agentPerformanceData.reduce((sum, a) => sum + a.converted, 0) / 
                  agentPerformanceData.reduce((sum, a) => sum + a.leadsAssigned, 0)) * 100)
              : 0}%
          </div>
        </motion.div>
      </motion.div>
    </ManagerLayout>
  );
};

export default ManagerReports;
