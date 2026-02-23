import { useState, useMemo } from "react";
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

  // Calculate real-time chart data
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

    leads.forEach((lead: ApiLead) => {
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
  }, [leads]);

  // Calculate monthly growth data
  const monthlyGrowthData = useMemo(() => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentYear = new Date().getFullYear();
    const monthlyCounts: { [key: string]: number } = {};

    monthNames.forEach(month => {
      monthlyCounts[month] = 0;
    });

    leads.forEach((lead: ApiLead) => {
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
  }, [leads]);

  // Calculate agent performance data
  const agentPerformanceData = useMemo(() => {
    return agents.map((agent: any) => {
      const agentLeads = leads.filter((l: ApiLead) => l.assignedTo?._id === agent._id);
      const converted = agentLeads.filter((l: ApiLead) => l.status === 'converted').length;
      const lost = agentLeads.filter((l: ApiLead) => l.status === 'lost').length;
      const pending = agentLeads.filter((l: ApiLead) => 
        !["converted", "lost"].includes(l.status)
      ).length;

      return {
        name: agent.name,
        converted,
        pending,
        lost
      };
    }).slice(0, 5);
  }, [leads, agents]);

  // Export functionality
  const handleExport = () => {
    const csvContent = [
      ['Report Type', 'Manager Reports'],
      ['Generated Date', new Date().toLocaleDateString()],
      ['Time Range', timeRange],
      [''],
      ['Lead Summary'],
      ['Status', 'Count'],
      ...leadsByStatusData.map(item => [item.name, item.value]),
      [''],
      ['Monthly Growth'],
      ['Month', 'Leads'],
      ...monthlyGrowthData.map(item => [item.month, item.leads]),
      [''],
      ['Agent Performance'],
      ['Agent', 'Converted', 'Pending', 'Lost'],
      ...agentPerformanceData.map(agent => [agent.name, agent.converted, agent.pending, agent.lost]),
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
      title: "Export Successful",
      description: "Manager report has been downloaded as CSV.",
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
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="ml-auto"
        >
          <Button 
            onClick={handleExport}
            className="gradient-bg-animated text-primary-foreground button-ripple shadow-lg icon-bounce"
          >
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
          whileHover={{ scale: 1.01, y: -5 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="card-hover-effect hover-glow rounded-xl overflow-hidden animated-border"
        >
          <div className="animated-border-content">
            <AgentPerformanceChart data={agentPerformanceData.length > 0 ? agentPerformanceData : undefined} />
          </div>
        </motion.div>
      </motion.div>
    </ManagerLayout>
  );
};

export default ManagerReports;
