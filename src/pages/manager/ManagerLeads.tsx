import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Download,
  RefreshCw,
  UserPlus,
} from "lucide-react";
import { ManagerLayout } from "@/components/layout/ManagerLayout";
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

const ManagerLeads = () => {
  const [selectedAgent, setSelectedAgent] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [bulkAssignOpen, setBulkAssignOpen] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);

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
    <ManagerLayout title="Lead Assignment">
      <div className="grid grid-cols-1 gap-4 md:gap-6 mb-6 md:mb-8">
        {/* Lead Assignment Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
          className="rounded-xl border border-border bg-card shadow-sm overflow-hidden card-hover-effect animated-border"
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
                    <UserPlus className="h-6 w-6 text-primary" />
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
                <motion.div whileHover={{ scale: 1.02 }} className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search by name or email..." 
                    className="pl-9 hover:border-primary transition-colors" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }}>
                  <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                    <SelectTrigger className="w-full sm:w-40 hover:border-primary transition-colors">
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
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }}>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-full sm:w-40 hover:border-primary transition-colors">
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
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }}>
                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger className="w-full sm:w-40 hover:border-primary transition-colors">
                      <SelectValue placeholder="All Time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                    </SelectContent>
                  </Select>
                </motion.div>
              </div>
            </div>
          </div>
          
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
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  transition={{ delay: index * 0.05, type: "spring", stiffness: 300 }}
                  className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm card-hover-effect glass-card"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        className="rounded border-gray-300 text-primary focus:ring-primary mt-1"
                        checked={selectedLeads.includes(lead.id)}
                        onChange={() => toggleLeadSelection(lead.id)}
                      />
                      <h3 className="font-semibold text-gray-900 text-lg">{lead.name}</h3>
                    </div>
                    <Badge className={statusColors[lead.status]}>
                      {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Assigned Agent:</span>
                      <div className="w-36">
                        <Select defaultValue={lead.assignedAgent}>
                          <SelectTrigger className="h-8 text-sm">
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
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Priority:</span>
                      <div className="w-24">
                        <Select defaultValue="medium">
                          <SelectTrigger className="h-8 text-sm">
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
                    
                    <div className="pt-2">
                      <Button size="sm" className="w-full gradient-bg-animated text-primary-foreground button-ripple shadow-md hover:scale-105 transition-all">
                        Assign Lead
                      </Button>
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
                      transition={{ delay: index * 0.05, type: "spring", stiffness: 300 }}
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
        </motion.div>
      </div>
    </ManagerLayout>
  );
};

export default ManagerLeads;
