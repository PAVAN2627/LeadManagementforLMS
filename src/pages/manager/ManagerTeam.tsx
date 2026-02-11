import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  UserPlus,
  Mail,
  Phone,
  MoreVertical,
  Award,
  TrendingUp,
  Clock,
  Target,
  CheckCircle2,
  AlertCircle,
  BarChart3,
} from "lucide-react";
import { ManagerLayout } from "@/components/layout/ManagerLayout";
import { SummaryCard } from "@/components/ui/summary-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { mockAgents } from "@/data/mockData";

const ManagerTeam = () => {
  const totalAgents = mockAgents.length;
  const activeAgents = mockAgents.filter((a) => a.pending > 0).length;
  const avgConversionRate = Math.round(
    mockAgents.reduce((acc, agent) => acc + (agent.converted / agent.leadsAssigned) * 100, 0) / mockAgents.length
  );
  const topPerformer = mockAgents.reduce((prev, current) => 
    (current.converted / current.leadsAssigned) > (prev.converted / prev.leadsAssigned) ? current : prev
  );

  return (
    <ManagerLayout title="Team Performance">
      {/* Summary Cards with Enhanced Animations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0, duration: 0.6, type: "spring", bounce: 0.4 }}
          className="card-hover-effect hover-glow"
        >
          <SummaryCard
            title="Total Agents"
            value={totalAgents}
            icon={Users}
            variant="primary"
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
            title="Active Agents"
            value={activeAgents}
            icon={TrendingUp}
            variant="success"
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
            title="Avg Conversion Rate"
            value={`${avgConversionRate}%`}
            icon={Award}
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
            title="Top Performer"
            value={topPerformer.name.split(" ")[0]}
            icon={Award}
            variant="primary"
            delay={0.3}
          />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
        {mockAgents.map((agent, index) => {
          const conversionRate = Math.round((agent.converted / agent.leadsAssigned) * 100);
          const initials = agent.name.split(" ").map(n => n[0]).join("");
          
          return (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ delay: index * 0.1, type: "spring", stiffness: 300 }}
            >
              <Card className="p-6 card-hover-effect glass-card hover-glow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <Avatar className="h-12 w-12 gradient-bg-animated ring-2 ring-primary/20">
                        <AvatarFallback className="text-primary-foreground font-semibold">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                    </motion.div>
                    <div>
                      <h3 className="font-semibold text-foreground">{agent.name}</h3>
                      <p className="text-sm text-muted-foreground">Sales Agent</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="hover:scale-110 transition-transform icon-spin">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>Send Message</DropdownMenuItem>
                      <DropdownMenuItem>Assign Leads</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{agent.name.toLowerCase().replace(" ", ".")}@athenura.com</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>+1 (555) {Math.floor(Math.random() * 900) + 100}-{Math.floor(Math.random() * 9000) + 1000}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col items-center p-3 bg-primary/5 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 bg-primary/10 rounded-full">
                          <Target className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-foreground">{agent.leadsAssigned}</p>
                      <p className="text-xs text-muted-foreground font-medium">Assigned</p>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-success/5 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 bg-success/10 rounded-full">
                          <CheckCircle2 className="h-6 w-6 text-success" />
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-success">{agent.converted}</p>
                      <p className="text-xs text-muted-foreground font-medium">Converted</p>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-warning/5 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 bg-warning/10 rounded-full">
                          <AlertCircle className="h-6 w-6 text-warning" />
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-warning">{agent.pending}</p>
                      <p className="text-xs text-muted-foreground font-medium">Pending</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1">
                      <BarChart3 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Conversion Rate</span>
                    </div>
                    <motion.span
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.5 }}
                      className="text-sm font-semibold"
                    >
                      {conversionRate}%
                    </motion.span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${conversionRate}%` }}
                      transition={{ duration: 1, delay: index * 0.1 + 0.6, ease: "easeOut" }}
                      className="h-full bg-gradient-bg-animated rounded-full"
                    />
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
        className="rounded-xl border border-border bg-card shadow-sm overflow-hidden card-hover-effect animated-border"
      >
        <div className="animated-border-content">
        <div className="p-4 md:p-6 border-b border-border bg-gradient-to-r from-primary/5 to-transparent flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
            >
              <Users className="h-6 w-6 text-primary" />
            </motion.div>
            <h2 className="text-lg font-semibold text-foreground gradient-text-animated">Detailed Performance</h2>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button className="gradient-bg-animated text-primary-foreground button-ripple shadow-lg w-full sm:w-auto">
              <UserPlus className="h-4 w-4 mr-2" />
              Add Agent
            </Button>
          </motion.div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Agent</TableHead>
                <TableHead className="text-center">Assigned</TableHead>
                <TableHead className="text-center">Converted</TableHead>
                <TableHead className="text-center">Pending</TableHead>
                <TableHead className="text-center">Conv. Rate</TableHead>
                <TableHead className="text-center">Avg Response</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockAgents.map((agent, index) => {
                const conversionRate = Math.round((agent.converted / agent.leadsAssigned) * 100);
                const avgResponse = `${Math.floor(Math.random() * 3) + 1}.${Math.floor(Math.random() * 9)} hrs`;
                const isActive = agent.pending > 0;
                
                return (
                  <motion.tr
                    key={agent.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ backgroundColor: "rgba(23, 162, 184, 0.05)", x: 5 }}
                    transition={{ delay: index * 0.05, type: "spring", stiffness: 300 }}
                    className="transition-all duration-200 cursor-pointer"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          <Avatar className="h-8 w-8 gradient-bg-animated ring-2 ring-primary/20">
                            <AvatarFallback className="text-primary-foreground text-xs font-semibold">
                              {agent.name.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                        </motion.div>
                        <span className="font-medium">{agent.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">{agent.leadsAssigned}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="p-1.5 bg-success/10 rounded-full">
                          <CheckCircle2 className="h-5 w-5 text-success" />
                        </div>
                        <span className="text-success font-bold text-base">{agent.converted}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="p-1.5 bg-warning/10 rounded-full">
                          <AlertCircle className="h-5 w-5 text-warning" />
                        </div>
                        <span className="text-warning font-bold text-base">{agent.pending}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${conversionRate}%` }}
                            transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
                            className="h-full bg-gradient-bg-animated rounded-full"
                          />
                        </div>
                        <span className="text-sm font-medium">{conversionRate}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{avgResponse}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={isActive ? "default" : "secondary"}>
                        {isActive ? "Active" : "Idle"}
                      </Badge>
                    </TableCell>
                  </motion.tr>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-border">
          {mockAgents.map((agent, index) => {
            const conversionRate = Math.round((agent.converted / agent.leadsAssigned) * 100);
            const avgResponse = `${Math.floor(Math.random() * 3) + 1}.${Math.floor(Math.random() * 9)} hrs`;
            const isActive = agent.pending > 0;
            
            return (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ x: 5 }}
                transition={{ delay: index * 0.05, type: "spring", stiffness: 300 }}
                className="p-4 space-y-3 hover:bg-primary/5 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <Avatar className="h-10 w-10 gradient-bg-animated ring-2 ring-primary/20">
                        <AvatarFallback className="text-primary-foreground text-sm font-semibold">
                          {agent.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                    </motion.div>
                    <div>
                      <p className="font-medium text-foreground">{agent.name}</p>
                      <Badge variant={isActive ? "default" : "secondary"} className="mt-1">
                        {isActive ? "Active" : "Idle"}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                  <div className="flex flex-col items-center p-3 bg-primary/5 rounded-lg border border-primary/20">
                    <div className="p-2 bg-primary/10 rounded-full mb-2">
                      <Target className="h-5 w-5 text-primary" />
                    </div>
                    <p className="text-lg font-bold text-foreground">{agent.leadsAssigned}</p>
                    <p className="text-xs text-muted-foreground font-medium">Assigned</p>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-success/5 rounded-lg border border-success/20">
                    <div className="p-2 bg-success/10 rounded-full mb-2">
                      <CheckCircle2 className="h-5 w-5 text-success" />
                    </div>
                    <p className="text-lg font-bold text-success">{agent.converted}</p>
                    <p className="text-xs text-muted-foreground font-medium">Converted</p>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-warning/5 rounded-lg border border-warning/20">
                    <div className="p-2 bg-warning/10 rounded-full mb-2">
                      <AlertCircle className="h-5 w-5 text-warning" />
                    </div>
                    <p className="text-lg font-bold text-warning">{agent.pending}</p>
                    <p className="text-xs text-muted-foreground font-medium">Pending</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Conversion Rate</span>
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 + 0.3 }}
                      className="font-semibold"
                    >
                      {conversionRate}%
                    </motion.span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${conversionRate}%` }}
                      transition={{ duration: 1, delay: index * 0.05 + 0.4 }}
                      className="h-full bg-gradient-bg-animated rounded-full"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Avg Response</span>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span>{avgResponse}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        </div>
      </motion.div>
    </ManagerLayout>
  );
};

export default ManagerTeam;