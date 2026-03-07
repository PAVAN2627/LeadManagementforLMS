import React, { useState } from "react";
import {
  Users,
  TrendingUp,
  Plus,
  Search,
  Eye,
  CheckCircle,
  Download,
} from "lucide-react";
import * as XLSX from 'xlsx';
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { SummaryCard } from "@/components/ui/summary-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, ApiLead } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { LeadViewModal } from "@/components/agent/LeadViewModal";

const AgentDashboard = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch Leads (Backend filters by agent role automatically)
  const { data: leads = [], isLoading } = useQuery({
    queryKey: ['leads'],
    queryFn: api.getLeads,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedLead, setSelectedLead] = useState<ApiLead | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);

  // New Lead State
  const [newLead, setNewLead] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    notes: ""
  });

  // Mutation for creating lead
  const createLeadMutation = useMutation({
    mutationFn: (data: any) => api.createLead({
      ...data,
      source: data.source || 'Manual',
      // assignedTo is omitted — backend auto-assigns to the agent
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast({ title: "Success", description: "Lead created successfully" });
      setIsAddLeadOpen(false);
      setNewLead({ name: "", email: "", phone: "", company: "", notes: "" });
    },
    onError: (error: Error) => {
      // If error is about assignedTo, we know we need to fix backend/frontend logic
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });


  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: ApiLead['status'] }) =>
      api.updateLead(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast({ title: "Updated", description: "Lead status updated" });
      setIsDetailOpen(false);
    }
  });


  const bulkCreateLeadsMutation = useMutation({
    mutationFn: api.bulkCreateLeads,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast({ title: "Success", description: data.message });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet) as any[];

      if (json.length === 0) {
        toast({ title: "Error", description: "Empty or invalid Excel file", variant: "destructive" });
        return;
      }

      const parsedLeads = json.map(row => ({
        name: row.Name || row.name || '',
        email: row.Email || row.email || '',
        phone: (row.Phone || row.phone || '').toString(),
        company: row.Company || row.company || '',
        source: row.Source || row.source || 'Website',
        status: row.Status || row.status || 'new',
        date: row.Date || row.date || new Date().toISOString(),
      }));

      bulkCreateLeadsMutation.mutate(parsedLeads);
      if (e.target) {
        e.target.value = '';
      }
    };
    reader.readAsArrayBuffer(file);
  };

 main
  const filteredLeads = leads.filter((lead: ApiLead) => {
    const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Fetch Analytics
  const { data: analytics } = useQuery({
    queryKey: ['analytics'],
    queryFn: api.getAnalytics,
  });

  const totalLeads = analytics?.totalLeads || 0;
  const convertedLeads = analytics?.convertedLeads || 0;
  const qualifiedLeads = analytics?.qualifiedLeads || 0;
  const newLeads = analytics?.newLeads || 0;

  const handleViewLead = (lead: ApiLead) => {
    setSelectedLead(lead);
    setIsDetailOpen(true);
  };

  return (
    <DashboardLayout role="agent" title="Agent Dashboard">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Agent Dashboard</h1>
            <p className="text-gray-600">Manage your leads and grow your sales pipeline.</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="border-teal-200 text-teal-700 hover:bg-teal-50"
              onClick={() => document.getElementById('dashboard-excel-upload')?.click()}
              disabled={bulkCreateLeadsMutation.isPending}
            >
              <Download className="mr-2 h-4 w-4" />
              {bulkCreateLeadsMutation.isPending ? "Importing..." : "Bulk Import"}
            </Button>
            <input
              type="file"
              id="dashboard-excel-upload"
              className="hidden"
              accept=".xlsx, .xls, .csv"
              onChange={handleFileUpload}
            />
            <Dialog open={isAddLeadOpen} onOpenChange={setIsAddLeadOpen}>
              <DialogTrigger asChild>
                <Button className="bg-teal-600 hover:bg-teal-700 text-white">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Lead
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[95vw] max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-gray-900">Add New Lead</DialogTitle>
                </DialogHeader>
                <form className="space-y-4 mt-4" onSubmit={(e) => {
                  e.preventDefault();
                  createLeadMutation.mutate({ ...newLead, source: 'Manual' });
                }}>
                  <div className="space-y-2">
                    <Label htmlFor="leadName" className="text-gray-700">Full Name</Label>
                    <Input
                      id="leadName"
                      placeholder="Enter lead name"
                      className="border-gray-300"
                      value={newLead.name}
                      onChange={e => setNewLead({ ...newLead, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="leadEmail" className="text-gray-700">Email</Label>
                    <Input
                      id="leadEmail"
                      type="email"
                      placeholder="email@company.com"
                      className="border-gray-300"
                      value={newLead.email}
                      onChange={e => setNewLead({ ...newLead, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="leadPhone" className="text-gray-700">Phone</Label>
                    <Input
                      id="leadPhone"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      className="border-gray-300"
                      value={newLead.phone}
                      onChange={e => setNewLead({ ...newLead, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="leadCompany" className="text-gray-700">Company</Label>
                    <Input
                      id="leadCompany"
                      placeholder="Company name"
                      className="border-gray-300"
                      value={newLead.company}
                      onChange={e => setNewLead({ ...newLead, company: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="leadNotes" className="text-gray-700">Notes</Label>
                    <Textarea
                      id="leadNotes"
                      placeholder="Initial notes about the lead..."
                      className="border-gray-300"
                      value={newLead.notes}
                      onChange={e => setNewLead({ ...newLead, notes: e.target.value })}
                    />
                  </div>
                  <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                    Add Lead
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <SummaryCard
            title="My Total Leads"
            value={totalLeads}
            icon={Users}
            delay={0}
          />
          <SummaryCard
            title="New Leads"
            value={newLeads}
            icon={Plus}
            variant="primary"
            delay={0.1}
          />
          <SummaryCard
            title="Qualified"
            value={qualifiedLeads}
            icon={TrendingUp}
            delay={0.2}
          />
          <SummaryCard
            title="Converted"
            value={convertedLeads}
            icon={CheckCircle}
            variant="success"
            delay={0.3}
          />
        </div>

        {/* Leads Management */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 md:p-6 border-b border-gray-200 gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">My Leads</h2>
              <p className="text-sm text-gray-600">Manage your assigned leads and track progress</p>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search leads..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full sm:w-64 border-gray-300"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32 border-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="qualified">Qualified</SelectItem>
                  <SelectItem value="converted">Converted</SelectItem>
                  <SelectItem value="lost">Lost</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Mobile View - Cards */}
          <div className="md:hidden space-y-4 p-4">
            {filteredLeads.map((lead, index) => (
              <div key={lead._id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-gray-900 text-lg">{lead.name}</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-gray-100"
                    onClick={() => handleViewLead(lead)}
                  >
                    <Eye className="h-4 w-4 text-gray-600" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Company:</span>
                    <span className="text-sm font-medium text-gray-900 text-right">{lead.company}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Email:</span>
                    <span className="text-sm text-gray-700 text-right truncate max-w-[180px]">{lead.email}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Phone:</span>
                    <span className="text-sm text-gray-700 text-right">{lead.phone}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Status:</span>
                    <Badge
                      className={
                        lead.status === "new" ? "bg-blue-50 text-blue-700 border border-blue-200" :
                          lead.status === "contacted" ? "bg-purple-50 text-purple-700 border border-purple-200" :
                            lead.status === "qualified" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                              lead.status === "proposal" ? "bg-indigo-50 text-indigo-700 border border-indigo-200" :
                                lead.status === "negotiation" ? "bg-orange-50 text-orange-700 border border-orange-200" :
                                  lead.status === "converted" ? "bg-green-50 text-green-700 border border-green-200" :
                                    "bg-red-50 text-red-700 border border-red-200"
                      }
                    >
                      {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop View - Table */}
          <div className="hidden md:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 border-gray-200">
                  <TableHead className="min-w-[150px] text-gray-700">Name</TableHead>
                  <TableHead className="min-w-[150px] text-gray-700">Company</TableHead>
                  <TableHead className="min-w-[200px] text-gray-700">Email</TableHead>
                  <TableHead className="min-w-[120px] text-gray-700">Phone</TableHead>
                  <TableHead className="min-w-[100px] text-gray-700">Status</TableHead>
                  <TableHead className="text-right min-w-[100px] text-gray-700">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead) => (
                  <TableRow key={lead._id} className="hover:bg-gray-50 border-gray-200">
                    <TableCell className="font-medium text-gray-900">{lead.name}</TableCell>
                    <TableCell className="text-gray-600">{lead.company}</TableCell>
                    <TableCell className="text-gray-600">{lead.email}</TableCell>
                    <TableCell className="text-gray-600">{lead.phone}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          lead.status === "new" ? "bg-blue-50 text-blue-700 border border-blue-200" :
                            lead.status === "contacted" ? "bg-purple-50 text-purple-700 border border-purple-200" :
                              lead.status === "qualified" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                                lead.status === "proposal" ? "bg-indigo-50 text-indigo-700 border border-indigo-200" :
                                  lead.status === "negotiation" ? "bg-orange-50 text-orange-700 border border-orange-200" :
                                    lead.status === "converted" ? "bg-green-50 text-green-700 border border-green-200" :
                                      "bg-red-50 text-red-700 border border-red-200"
                        }
                      >
                        {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-gray-100"
                        onClick={() => handleViewLead(lead)}
                      >
                        <Eye className="h-4 w-4 text-gray-600" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Lead Detail Modal - View Only */}
      <LeadViewModal
        lead={selectedLead}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />
    </DashboardLayout>
  );
};

export default AgentDashboard;