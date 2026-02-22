import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  ClipboardList,
  Clock,
  TrendingUp,
  Users,
  Search,
  Download,
  UserPlus,
  RefreshCw,
} from "lucide-react";
import { ManagerLayout } from "@/components/layout/ManagerLayout";
import { SummaryCard } from "@/components/ui/summary-card";
import { AgentPerformanceChart } from "@/components/charts/AgentPerformanceChart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, ApiLead, ApiUser } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

const statusColors: Record<string, string> = {
  new: "bg-primary text-primary-foreground",
  contacted: "bg-accent text-accent-foreground",
  qualified: "bg-warning text-warning-foreground",
  proposal: "bg-primary/80 text-primary-foreground",
  negotiation: "bg-warning/80 text-warning-foreground",
  converted: "bg-success text-success-foreground",
  lost: "bg-destructive text-destructive-foreground",
};

const ManagerDashboard = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedAgent, setSelectedAgent] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [bulkAssignOpen, setBulkAssignOpen] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  // Track per-row selected agent (key: leadId, value: agentId)
  const [rowAgentMap, setRowAgentMap] = useState<Record<string, string>>({});

  const { data: leads = [], isLoading: isLoadingLeads } = useQuery({
    queryKey: ['leads'],
    queryFn: api.getLeads,
  });

  const { data: users = [], isLoading: isLoadingAgents } = useQuery({
    queryKey: ['users'],
    queryFn: () => api.getUsers(),
  });

  const agents = useMemo(() => users.filter((u: ApiUser) => u.role === 'agent'), [users]);

  // Fetch Analytics
  const { data: analytics } = useQuery({
    queryKey: ['analytics'],
    queryFn: api.getAnalytics,
  });

  const totalAssigned = analytics?.totalAssigned || 0;
  const pendingFollowUp = analytics?.pendingFollowUp || 0;
  const convertedThisMonth = analytics?.convertedThisMonth || 0;
  const agentsUnder = analytics?.agentsUnder || 0;

  const filteredLeads = useMemo(() => {
    return leads.filter((lead: ApiLead) => {
      if (selectedAgent !== "all" && lead.assignedTo?._id !== selectedAgent) return false; // Match by ID
      if (selectedStatus !== "all" && lead.status !== selectedStatus) return false;
      if (searchQuery && !lead.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !lead.email.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (dateFilter !== "all") {
        const leadDate = new Date(lead.date);
        const today = new Date();
        if (dateFilter === "today") return leadDate.toDateString() === today.toDateString();
        // Simple approximation for week/month logic
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

        if (dateFilter === "week" && leadDate < weekAgo) return false;
        if (dateFilter === "month" && leadDate < monthAgo) return false;
      }
      return true;
    });
  }, [leads, selectedAgent, selectedStatus, searchQuery, dateFilter]);

  const updateLeadMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ApiLead> }) => api.updateLead(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast({ title: "Success", description: "Lead updated" });
    }
  });

  const handleBulkAssign = (agentId: string) => {
    const agent = agents.find((a: ApiUser) => a._id === agentId);
    if (!agent) return;

    selectedLeads.forEach(leadId => {
      updateLeadMutation.mutate({ id: leadId, data: { assignedTo: agent._id } as any });
    });

    toast({ title: "Bulk Assign", description: `Assigned leads to ${agent.name}` });
    setSelectedLeads([]);
    setBulkAssignOpen(false);
  };

  const toggleLeadSelection = (leadId: string) => {
    setSelectedLeads(prev =>
      prev.includes(leadId) ? prev.filter(id => id !== leadId) : [...prev, leadId]
    );
  };

  // Derived agent performance
  const agentPerformance = useMemo(() => {
    return agents.map((agent: ApiUser) => {
      const agentLeads = leads.filter((l: ApiLead) => l.assignedTo?._id === agent._id);
      const converted = agentLeads.filter((l: ApiLead) => l.status === 'converted').length;
      const pending = agentLeads.filter((l: ApiLead) => ['new', 'contacted', 'qualified', 'proposal', 'negotiation'].includes(l.status)).length;
      const lost = agentLeads.filter((l: ApiLead) => l.status === 'lost').length;

      return {
        id: agent._id,
        name: agent.name,
        leadsAssigned: agentLeads.length,
        converted,
        pending,
        lost,
        conversionRate: agentLeads.length ? Math.round((converted / agentLeads.length) * 100) : 0
      };
    });
  }, [agents, leads]);

  return (
    <ManagerLayout title="Manager Dashboard">
      {/* Summary Cards with Enhanced Animations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0, duration: 0.6, type: "spring", bounce: 0.4 }}
          className="card-hover-effect hover-glow"
        >
          <SummaryCard
            title="Total Assigned Leads"
            value={totalAssigned}
            icon={ClipboardList}
            trend={{ value: 12, isPositive: true }}
            delay={0}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6, type: "spring", bounce: 0.4 }}
          className="card-hover-effect hover-glow"
        >
          <SummaryCard
            title="Pending Follow-ups"
            value={pendingFollowUp}
            icon={Clock}
            variant="warning"
            delay={0.1}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, type: "spring", bounce: 0.4 }}
          className="card-hover-effect hover-glow"
        >
          <SummaryCard
            title="Converted This Month"
            value={convertedThisMonth}
            icon={TrendingUp}
            variant="success"
            trend={{ value: 8, isPositive: true }}
            delay={0.2}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6, type: "spring", bounce: 0.4 }}
          className="card-hover-effect hover-glow"
        >
          <SummaryCard
            title="Agents Under You"
            value={agentsUnder}
            icon={Users}
            variant="primary"
            delay={0.3}
          />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
        {/* Lead Assignment Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
          className="xl:col-span-2 rounded-xl border border-border bg-card shadow-sm overflow-hidden card-hover-effect animated-border"
        >
          <div className="animated-border-content">
            <div className="p-4 md:p-6 border-b border-border bg-gradient-to-r from-primary/5 to-transparent">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    >
                      <ClipboardList className="h-6 w-6 text-primary" />
                    </motion.div>
                    <h2 className="text-lg font-semibold text-foreground gradient-text-animated">Lead Assignment</h2>
                    {selectedLeads.length > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 15 }}
                      >
                        <Badge variant="secondary" className="bg-primary/10 text-primary animate-pulse-glow">
                          {selectedLeads.length} selected
                        </Badge>
                      </motion.div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {selectedLeads.length > 0 && (
                      <Dialog open={bulkAssignOpen} onOpenChange={setBulkAssignOpen}>
                        <DialogTrigger asChild>
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button size="sm" className="gradient-bg-animated text-primary-foreground button-ripple shadow-lg">
                              <UserPlus className="h-4 w-4 mr-2" />
                              Bulk Assign
                            </Button>
                          </motion.div>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Bulk Assign Leads</DialogTitle>
                            <DialogDescription>
                              Assign {selectedLeads.length} selected lead(s) to an agent
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label>Select Agent</Label>
                              <Select onValueChange={handleBulkAssign}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Choose an agent" />
                                </SelectTrigger>
                                <SelectContent>
                                  {agents.map((agent) => (
                                    <SelectItem key={agent._id} value={agent._id}>
                                      {agent.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                    <Button variant="outline" size="sm" className="hover:scale-105 transition-transform hover:border-primary icon-bounce">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                    <Button variant="outline" size="sm" className="hover:scale-105 transition-transform hover:border-primary icon-spin">
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Enhanced Filters */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name or email..."
                      className="pl-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue placeholder="All Agents" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Agents</SelectItem>
                      {agents.map((agent) => (
                        <SelectItem key={agent._id} value={agent.name}>
                          {agent.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="qualified">Qualified</SelectItem>
                      <SelectItem value="proposal">Proposal</SelectItem>
                      <SelectItem value="negotiation">Negotiation</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue placeholder="All Time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div>
              {/* Mobile View - Cards */}
              <div className="md:hidden space-y-3 p-3 sm:p-4">
                {filteredLeads.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12 text-muted-foreground"
                  >
                    <div className="text-4xl mb-2">📋</div>
                    <p>No leads found</p>
                  </motion.div>
                ) : (
                  filteredLeads.slice(0, 8).map((lead, index) => (
                    <motion.div
                      key={lead._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="bg-white p-4 rounded-xl border border-gray-200 shadow-md mobile-card glass-card"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <motion.div whileTap={{ scale: 0.9 }} className="shrink-0">
                            <input
                              type="checkbox"
                              className="rounded border-gray-300 text-primary focus:ring-primary checkbox-animated cursor-pointer w-5 h-5"
                              checked={selectedLeads.includes(lead._id)}
                              onChange={() => toggleLeadSelection(lead._id)}
                            />
                          </motion.div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-bold text-gray-900 text-base truncate">{lead.name}</h3>
                            <p className="text-xs text-gray-500 truncate">{lead.email}</p>
                          </div>
                        </div>
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: index * 0.05 + 0.1, type: "spring" }}
                        >
                          <Badge className={`${statusColors[lead.status]} badge-pulse text-xs`}>
                            {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                          </Badge>
                        </motion.div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center gap-2">
                          <span className="text-sm text-gray-600 font-medium">Agent:</span>
                          <Select defaultValue={lead.assignedTo?.name || "Unassigned"}>
                            <SelectTrigger className="h-9 text-sm flex-1 max-w-[180px] select-animated">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {agents.map((agent) => (
                                <SelectItem key={agent._id} value={agent.name}>
                                  {agent.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex justify-between items-center gap-2">
                          <span className="text-sm text-gray-600 font-medium">Priority:</span>
                          <Select defaultValue="medium">
                            <SelectTrigger className="h-9 text-sm w-28 select-animated">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="low">Low</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <motion.div whileTap={{ scale: 0.95 }} className="pt-2">
                          <Button size="sm" className="w-full gradient-bg-animated text-primary-foreground button-ripple shadow-md h-10 font-semibold touch-feedback">
                            Assign Lead
                          </Button>
                        </motion.div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Desktop View - Table */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow className="table-header-glow border-b-2 border-primary/20">
                      <TableHead className="bg-muted/50 w-12">
                        <motion.div
                          whileHover={{ scale: 1.2, rotate: 5 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-primary focus:ring-primary checkbox-animated cursor-pointer"
                            checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedLeads(filteredLeads.map(l => l._id));
                              } else {
                                setSelectedLeads([]);
                              }
                            }}
                          />
                        </motion.div>
                      </TableHead>
                      <TableHead className="font-bold text-foreground bg-muted/50">Lead Name</TableHead>
                      <TableHead className="font-bold text-foreground bg-muted/50">Status</TableHead>
                      <TableHead className="font-bold text-foreground bg-muted/50">Assign Agent</TableHead>
                      <TableHead className="font-bold text-foreground bg-muted/50">Priority</TableHead>
                      <TableHead className="text-right font-bold text-foreground bg-muted/50">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLeads.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            No leads found matching your filters
                          </motion.div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredLeads.slice(0, 8).map((lead, index) => (
                        <motion.tr
                          key={lead._id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05, type: "spring", stiffness: 300 }}
                          className="table-row-hover border-b border-border/50"
                        >
                          <TableCell>
                            <motion.div
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <input
                                type="checkbox"
                                className="rounded border-gray-300 text-primary focus:ring-primary checkbox-animated cursor-pointer"
                                checked={selectedLeads.includes(lead._id)}
                                onChange={() => toggleLeadSelection(lead._id)}
                              />
                            </motion.div>
                          </TableCell>
                          <TableCell className="font-medium">
                            <motion.span
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: index * 0.05 + 0.1 }}
                            >
                              {lead.name}
                            </motion.span>
                          </TableCell>
                          <TableCell>
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: index * 0.05 + 0.15, type: "spring" }}
                            >
                              <Badge className={`${statusColors[lead.status]} badge-pulse`}>
                                {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                              </Badge>
                            </motion.div>
                          </TableCell>
                          <TableCell>
                            <Select
                              value={rowAgentMap[lead._id] || lead.assignedTo?._id || ""}
                              onValueChange={(val) => setRowAgentMap(prev => ({ ...prev, [lead._id]: val }))}
                            >
                              <SelectTrigger className="w-32 h-8 select-animated">
                                <SelectValue placeholder="Select agent" />
                              </SelectTrigger>
                              <SelectContent>
                                {agents.map((agent) => (
                                  <SelectItem key={agent._id} value={agent._id}>
                                    {agent.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Select defaultValue="medium">
                              <SelectTrigger className="w-24 h-8 select-animated">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="low">Low</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="text-right">
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Button
                                size="sm"
                                className="gradient-bg-animated text-primary-foreground button-ripple hover:scale-105 transition-all shadow-md"
                                onClick={() => {
                                  const agentId = rowAgentMap[lead._id] || lead.assignedTo?._id || "";
                                  if (!agentId) return;
                                  updateLeadMutation.mutate({ id: lead._id, data: { assignedTo: agentId } as any });
                                }}
                                disabled={(!rowAgentMap[lead._id] && !lead.assignedTo?._id) || updateLeadMutation.isPending}
                              >
                                {updateLeadMutation.isPending ? "Saving..." : "Assign"}
                              </Button>
                            </motion.div>
                          </TableCell>
                        </motion.tr>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Agent Performance */}
        <AgentPerformanceChart data={agentPerformance} />
      </div>

      {/* Agent Performance Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
        className="rounded-xl border border-border bg-card shadow-sm overflow-hidden card-hover-effect animated-border"
      >
        <div className="animated-border-content">
          <div className="p-4 md:p-6 border-b border-border bg-gradient-to-r from-primary/5 to-transparent">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <Users className="h-6 w-6 text-primary" />
              </motion.div>
              <h2 className="text-lg font-semibold text-foreground gradient-text-animated">Agent Performance</h2>
            </div>
          </div>
          <div>
            {/* Mobile View - Cards */}
            <div className="md:hidden space-y-3 p-3 sm:p-4">
              {agentPerformance.map((agent, index) => {
                const conversionRate = agent.conversionRate;
                return (
                  <motion.div
                    key={agent.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="bg-white p-4 rounded-xl border border-gray-200 shadow-md mobile-card glass-card"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          className="h-12 w-12 rounded-full gradient-bg-animated flex items-center justify-center ring-2 ring-primary/20 shadow-md shrink-0"
                        >
                          <span className="text-lg font-bold text-white">
                            {agent.name.split(" ").map(n => n[0]).join("")}
                          </span>
                        </motion.div>
                        <div className="min-w-0">
                          <h3 className="font-bold text-gray-900 text-base truncate">{agent.name}</h3>
                          <p className="text-xs text-gray-500">Sales Agent</p>
                        </div>
                      </div>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.05 + 0.1, type: "spring" }}
                      >
                        <Badge
                          className={`badge-pulse text-xs ${conversionRate >= 70 ? 'bg-green-100 text-green-800' :
                            conversionRate >= 50 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}
                        >
                          {conversionRate}%
                        </Badge>
                      </motion.div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="text-center p-2 rounded-lg bg-gray-50">
                        <p className="text-xl font-bold text-gray-900">{agent.leadsAssigned}</p>
                        <p className="text-xs text-gray-600">Assigned</p>
                      </div>
                      <div className="text-center p-2 rounded-lg bg-green-50">
                        <p className="text-xl font-bold text-green-600">{agent.converted}</p>
                        <p className="text-xs text-gray-600">Converted</p>
                      </div>
                      <div className="text-center p-2 rounded-lg bg-yellow-50">
                        <p className="text-xl font-bold text-yellow-600">{agent.pending}</p>
                        <p className="text-xs text-gray-600">Pending</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between text-xs text-gray-600 mb-2 font-medium">
                        <span>Conversion Rate</span>
                        <span>{conversionRate}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${conversionRate}%` }}
                          transition={{ duration: 1, delay: index * 0.1 + 0.5, ease: "easeOut" }}
                          className={`h-3 rounded-full transition-all duration-500 ${conversionRate >= 70 ? 'bg-gradient-to-r from-green-500 to-green-600' :
                            conversionRate >= 50 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                              'bg-gradient-to-r from-red-500 to-red-600'
                            }`}
                        />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Desktop View - Table */}
            <div className="hidden md:block w-full overflow-x-auto">
              <table className="w-full text-sm" style={{ tableLayout: 'fixed', borderCollapse: 'collapse' }}>
                <colgroup>
                  <col style={{ width: '25%' }} />
                  <col style={{ width: '18%' }} />
                  <col style={{ width: '18%' }} />
                  <col style={{ width: '18%' }} />
                  <col style={{ width: '21%' }} />
                </colgroup>
                <thead>
                  <tr className="border-b-2 border-primary/20 bg-muted/50">
                    <th className="h-12 px-4 text-left font-bold text-foreground">Agent Name</th>
                    <th className="h-12 px-4 text-center font-bold text-foreground">Leads Assigned</th>
                    <th className="h-12 px-4 text-center font-bold text-foreground">Converted</th>
                    <th className="h-12 px-4 text-center font-bold text-foreground">Pending</th>
                    <th className="h-12 px-4 text-center font-bold text-foreground">Conversion Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {agentPerformance.map((agent, index) => {
                    const conversionRate = agent.conversionRate;
                    return (
                      <tr
                        key={agent.id}
                        className="border-b border-border/50 hover:bg-primary/5 transition-colors"
                      >
                        <td className="h-16 px-4 font-medium text-left align-middle">
                          {agent.name}
                        </td>
                        <td className="h-16 px-4 text-center align-middle">
                          {agent.leadsAssigned}
                        </td>
                        <td className="h-16 px-4 text-center align-middle text-success font-medium">
                          {agent.converted}
                        </td>
                        <td className="h-16 px-4 text-center align-middle text-warning font-medium">
                          {agent.pending}
                        </td>
                        <td className="h-16 px-4 text-center align-middle">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                style={{ width: `${conversionRate}%` }}
                                className="h-full bg-primary rounded-full transition-all duration-1000"
                              />
                            </div>
                            <span className="text-sm font-medium min-w-[40px]">{conversionRate}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </motion.div>
    </ManagerLayout>
  );
};

export default ManagerDashboard;
