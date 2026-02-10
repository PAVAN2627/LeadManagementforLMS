import { useState } from "react";
import { motion } from "framer-motion";
import {
  ClipboardList,
  Clock,
  TrendingUp,
  Users,
  Search,
  Download,
  RefreshCw,
  UserPlus,
} from "lucide-react";
import { ManagerLayout } from "@/components/layout/ManagerLayout";
import { SummaryCard } from "@/components/ui/summary-card";
import { AgentPerformanceChart } from "@/components/charts/AgentPerformanceChart";
import { mockLeads, mockAgents } from "@/data/mockData";
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
  const [selectedAgent, setSelectedAgent] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [bulkAssignOpen, setBulkAssignOpen] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);

  const totalAssigned = mockLeads.length;
  const pendingFollowUp = mockLeads.filter(
    (l) => l.nextFollowUp && new Date(l.nextFollowUp) <= new Date()
  ).length;
  const convertedThisMonth = mockLeads.filter((l) => l.status === "converted").length;
  const agentsUnder = mockAgents.length;

  const filteredLeads = mockLeads.filter((lead) => {
    if (selectedAgent !== "all" && lead.assignedAgent !== selectedAgent) return false;
    if (selectedStatus !== "all" && lead.status !== selectedStatus) return false;
    if (searchQuery && !lead.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !lead.email.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (dateFilter !== "all") {
      const leadDate = new Date(lead.date);
      const today = new Date();
      if (dateFilter === "today" && leadDate.toDateString() !== today.toDateString()) return false;
      if (dateFilter === "week") {
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        if (leadDate < weekAgo) return false;
      }
      if (dateFilter === "month") {
        const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        if (leadDate < monthAgo) return false;
      }
    }
    return true;
  });

  const handleBulkAssign = (agentName: string) => {
    console.log(`Assigning ${selectedLeads.length} leads to ${agentName}`);
    setSelectedLeads([]);
    setBulkAssignOpen(false);
  };

  const toggleLeadSelection = (leadId: string) => {
    setSelectedLeads(prev => 
      prev.includes(leadId) ? prev.filter(id => id !== leadId) : [...prev, leadId]
    );
  };

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
                                {mockAgents.map((agent) => (
                                  <SelectItem key={agent.id} value={agent.name}>
                                    {agent.name} ({agent.pending} pending)
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
                    {mockAgents.map((agent) => (
                      <SelectItem key={agent.id} value={agent.name}>
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
            <div className="md:hidden space-y-4 p-4">
              {filteredLeads.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No leads found matching your filters
                </div>
              ) : (
                filteredLeads.slice(0, 8).map((lead, index) => (
                  <motion.div
                    key={lead.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm card-hover-effect glass-card"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <input 
                          type="checkbox" 
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                          checked={selectedLeads.includes(lead.id)}
                          onChange={() => toggleLeadSelection(lead.id)}
                        />
                        <h3 className="font-semibold text-gray-900 text-lg">{lead.name}</h3>
                      </div>
                      <Button size="sm" className="gradient-bg-animated text-primary-foreground button-ripple hover:scale-105 transition-all text-xs px-3 py-1 h-7 shadow-md">
                        Assign
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Status:</span>
                        <Badge className={statusColors[lead.status]}>
                          {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                        </Badge>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Assigned Agent:</span>
                        <Select defaultValue={lead.assignedAgent}>
                          <SelectTrigger className="w-32 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {mockAgents.map((agent) => (
                              <SelectItem key={agent.id} value={agent.name}>
                                {agent.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Priority:</span>
                        <Select defaultValue="medium">
                          <SelectTrigger className="w-24 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Desktop View - Table */}
            <div className="hidden md:block overflow-x-auto">
              <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-12">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                      checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedLeads(filteredLeads.map(l => l.id));
                        } else {
                          setSelectedLeads([]);
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead className="min-w-[150px]">Lead Name</TableHead>
                  <TableHead className="min-w-[120px]">Status</TableHead>
                  <TableHead className="min-w-[140px]">Assign Agent</TableHead>
                  <TableHead className="min-w-[100px]">Priority</TableHead>
                  <TableHead className="text-right min-w-[100px]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No leads found matching your filters
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLeads.slice(0, 8).map((lead, index) => (
                    <motion.tr
                      key={lead.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      whileHover={{ backgroundColor: "rgba(23, 162, 184, 0.05)", x: 5 }}
                      transition={{ delay: index * 0.05 }}
                      className="transition-all duration-200 cursor-pointer"
                    >
                      <TableCell>
                        <input 
                          type="checkbox" 
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                          checked={selectedLeads.includes(lead.id)}
                          onChange={() => toggleLeadSelection(lead.id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{lead.name}</TableCell>
                      <TableCell>
                        <Badge className={statusColors[lead.status]}>
                          {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Select defaultValue={lead.assignedAgent}>
                          <SelectTrigger className="w-32 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {mockAgents.map((agent) => (
                              <SelectItem key={agent.id} value={agent.name}>
                                {agent.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select defaultValue="medium">
                          <SelectTrigger className="w-24 h-8">
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
                        <Button size="sm" className="gradient-bg-animated text-primary-foreground button-ripple hover:scale-105 transition-all shadow-md">
                          Assign
                        </Button>
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
        <AgentPerformanceChart />
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
          <div className="md:hidden space-y-4 p-4">
            {mockAgents.map((agent, index) => {
              const conversionRate = Math.round(
                (agent.converted / agent.leadsAssigned) * 100
              );
              return (
                <motion.div
                  key={agent.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm card-hover-effect glass-card"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-gray-900 text-lg">{agent.name}</h3>
                    <Badge 
                      className={`${
                        conversionRate >= 70 ? 'bg-green-100 text-green-800' :
                        conversionRate >= 50 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}
                    >
                      {conversionRate}%
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Leads Assigned:</span>
                      <span className="text-sm font-medium text-gray-900">{agent.leadsAssigned}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Converted:</span>
                      <span className="text-sm font-medium text-green-600">{agent.converted}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Pending:</span>
                      <span className="text-sm font-medium text-yellow-600">{agent.pending}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Conversion Rate:</span>
                      <span className="text-sm font-medium text-gray-900">{conversionRate}%</span>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Progress</span>
                      <span>{conversionRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          conversionRate >= 70 ? 'bg-green-600' :
                          conversionRate >= 50 ? 'bg-yellow-600' :
                          'bg-red-600'
                        }`}
                        style={{ width: `${conversionRate}%` }}
                      ></div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Desktop View - Table */}
          <div className="hidden md:block overflow-x-auto">
            <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="min-w-[150px]">Agent Name</TableHead>
                <TableHead className="text-center min-w-[120px]">Leads Assigned</TableHead>
                <TableHead className="text-center min-w-[100px]">Converted</TableHead>
                <TableHead className="text-center min-w-[100px]">Pending</TableHead>
                <TableHead className="text-center min-w-[150px]">Conversion Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockAgents.map((agent, index) => {
                const conversionRate = Math.round(
                  (agent.converted / agent.leadsAssigned) * 100
                );
                return (
                  <motion.tr
                    key={agent.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ backgroundColor: "rgba(23, 162, 184, 0.05)", x: 5 }}
                    transition={{ delay: index * 0.05 }}
                    className="transition-all duration-200 cursor-pointer"
                  >
                    <TableCell className="font-medium">{agent.name}</TableCell>
                    <TableCell className="text-center">{agent.leadsAssigned}</TableCell>
                    <TableCell className="text-center text-success">{agent.converted}</TableCell>
                    <TableCell className="text-center text-warning">{agent.pending}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${conversionRate}%` }}
                            transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
                            className="h-full bg-primary rounded-full"
                          />
                        </div>
                        <span className="text-sm font-medium whitespace-nowrap">{conversionRate}%</span>
                      </div>
                    </TableCell>
                  </motion.tr>
                );
              })}
            </TableBody>
          </Table>
          </div>
        </div>
        </div>
      </motion.div>
    </ManagerLayout>
  );
};

export default ManagerDashboard;
