import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  ClipboardList,
  UserCheck,
  Activity,
  FileText,
  Mail,
  BarChart3,
  Shield,
  Lock,
  Users,
  TrendingUp,
  Target,
  CheckCircle,
  ArrowRight,
  Search,
  Bell,
  Zap,
  Database,
  Filter,
  MessageSquare,
  PieChart,
  UserCog,
  Briefcase,
  Phone,
  Calendar,
  Award,
  LineChart,
  Settings,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  const modules = [
    {
      icon: ClipboardList,
      title: "Lead Capture",
      description: "Capture leads from website forms, marketing campaigns, social media ads, and manual entry. Store structured customer information for easy filtering, searching, and analysis.",
      color: "from-teal-500 to-cyan-600",
    },
    {
      icon: UserCheck,
      title: "Lead Assignment",
      description: "Assign leads manually or automatically to agents. Ensure every lead gets attention, avoid missed opportunities, and balance workload across your team.",
      color: "from-blue-500 to-indigo-600",
    },
    {
      icon: Activity,
      title: "Status Tracking",
      description: "Track each lead through every stage of the sales funnel. Monitor pipeline health, forecast revenue, and measure performance in real-time.",
      color: "from-purple-500 to-pink-600",
    },
    {
      icon: FileText,
      title: "Notes & Activity",
      description: "Record every conversation with complete activity history. Document requirements, budgets, meeting outcomes, and follow-up dates for each lead.",
      color: "from-orange-500 to-red-600",
    },
    {
      icon: Mail,
      title: "Email Communication",
      description: "Send automated welcome emails and manual proposals. Maintain professional communication with complete email history tracking.",
      color: "from-green-500 to-emerald-600",
    },
    {
      icon: BarChart3,
      title: "Dashboard & Reporting",
      description: "Real-time analytics and business insights. Monitor total leads, conversions, losses, and team KPIs to make data-driven decisions.",
      color: "from-cyan-500 to-teal-600",
    },
    {
      icon: Search,
      title: "Search & Filter",
      description: "Powerful search by name, email, phone, company. Advanced filters by status, source, date, and assigned agent for quick lead access.",
      color: "from-violet-500 to-purple-600",
    },
    {
      icon: Bell,
      title: "Notifications",
      description: "Stay updated with new lead assignments, follow-up reminders, and status updates. Ensure timely action on every opportunity.",
      color: "from-pink-500 to-rose-600",
    },
    {
      icon: Shield,
      title: "Security & Access Control",
      description: "Enterprise-grade security with login authentication, session management, and role-based access control to protect sensitive customer data.",
      color: "from-indigo-500 to-blue-600",
    },
  ];

  const roles = [
    {
      title: "Admin",
      subtitle: "System Controller",
      icon: Settings,
      description: "Full system control with superuser privileges",
      responsibilities: [
        "Create Manager and Agent accounts",
        "Assign roles and control system access",
        "View and reassign all leads",
        "Monitor dashboards and performance reports",
        "Control complete system operations",
      ],
      color: "from-red-500 to-orange-600",
    },
    {
      title: "Manager",
      subtitle: "Team Supervisor",
      icon: Briefcase,
      description: "Operational oversight and team coordination",
      responsibilities: [
        "Assign leads to Agents efficiently",
        "Monitor follow-ups and track progress",
        "Ensure no lead is ignored or missed",
        "Evaluate Agent performance metrics",
        "Bridge between Admin and Agents",
      ],
      color: "from-blue-500 to-cyan-600",
    },
    {
      title: "Agent",
      subtitle: "Sales Executive",
      icon: Phone,
      description: "Direct lead handling and customer communication",
      responsibilities: [
        "Contact leads via call, email, or meeting",
        "Update lead status and activity notes",
        "Move leads through lifecycle stages",
        "Convert leads into customers",
        "Handle assigned leads professionally",
      ],
      color: "from-green-500 to-emerald-600",
    },
  ];

  const lifecycle = [
    { stage: "New", description: "Lead is created and entered into system", icon: Target, color: "bg-blue-500" },
    { stage: "Contacted", description: "First interaction completed", icon: Phone, color: "bg-cyan-500" },
    { stage: "Qualified", description: "Lead shows genuine interest", icon: CheckCircle, color: "bg-teal-500" },
    { stage: "Proposal Sent", description: "Pricing and details shared", icon: FileText, color: "bg-green-500" },
    { stage: "Negotiation", description: "Discussion and terms ongoing", icon: MessageSquare, color: "bg-yellow-500" },
    { stage: "Converted", description: "Deal successful - customer won", icon: Award, color: "bg-emerald-500" },
    { stage: "Lost", description: "Deal failed - opportunity closed", icon: Activity, color: "bg-red-500" },
  ];

  const benefits = [
    { icon: Database, title: "Centralized Data", description: "All lead information in one secure platform" },
    { icon: TrendingUp, title: "Increased Productivity", description: "Streamlined workflows and automation" },
    { icon: Shield, title: "Data Security", description: "No data loss with structured records" },
    { icon: Zap, title: "Faster Follow-ups", description: "Automated reminders reduce delays" },
    { icon: LineChart, title: "Performance Monitoring", description: "Real-time team performance tracking" },
    { icon: Target, title: "Higher Conversion", description: "Data-driven insights improve close rates" },
  ];

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-lg shadow-sm"
      >
        <div className="mx-auto flex h-16 md:h-20 items-center justify-between px-4 md:px-6 lg:px-8">
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <img src="/Athenura logo.png" alt="Athenura LMS" className="h-8 md:h-12 w-auto" />
          </motion.div>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-2">
            <motion.a 
              href="#benefits" 
              className="px-5 py-2.5 text-base font-semibold text-gray-700 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Benefits
            </motion.a>
            <motion.a 
              href="#modules" 
              className="px-5 py-2.5 text-base font-semibold text-gray-700 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Features
            </motion.a>
            <motion.a 
              href="#roles" 
              className="px-5 py-2.5 text-base font-semibold text-gray-700 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Roles
            </motion.a>
            <motion.a 
              href="#lifecycle" 
              className="px-5 py-2.5 text-base font-semibold text-gray-700 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Lifecycle
            </motion.a>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <button
                onClick={() => navigate("/login")}
                className="px-5 py-2.5 text-base font-semibold text-gray-700 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all flex items-center gap-2"
              >
                <Lock className="h-5 w-5" />
                Secure Login
              </button>
            </motion.div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-700 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all"
          >
            {mobileMenuOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden border-t border-gray-200 bg-white"
            >
              <nav className="flex flex-col p-4 space-y-2">
                <a 
                  href="#benefits" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 text-base font-semibold text-gray-700 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all"
                >
                  Benefits
                </a>
                <a 
                  href="#modules" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 text-base font-semibold text-gray-700 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all"
                >
                  Features
                </a>
                <a 
                  href="#roles" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 text-base font-semibold text-gray-700 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all"
                >
                  Roles
                </a>
                <a 
                  href="#lifecycle" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 text-base font-semibold text-gray-700 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all"
                >
                  Lifecycle
                </a>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate("/login");
                  }}
                  className="px-4 py-3 text-base font-semibold text-white gradient-teal rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  <Lock className="h-5 w-5" />
                  Secure Login
                </button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 md:py-24 lg:py-32 bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(20, 184, 166, 0.1) 0%, transparent 50%),
                             radial-gradient(circle at 80% 80%, rgba(6, 182, 212, 0.1) 0%, transparent 50%),
                             radial-gradient(circle at 40% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)`,
          }} />
        </div>
        
        {/* Floating Shapes */}
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-72 h-72 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <div className="relative mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mx-auto max-w-5xl text-center"
          >
            <motion.h1 
              className="mb-6 md:mb-8 text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight tracking-tight text-gray-900"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                Transform Leads Into{" "}
              </motion.span>
              <motion.span 
                className="bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent inline-block"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  delay: 0.8, 
                  duration: 0.8,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
              >
                Loyal Customers
              </motion.span>
            </motion.h1>
            
            <motion.p 
              className="mx-auto mb-8 md:mb-12 max-w-3xl text-lg md:text-2xl leading-relaxed text-gray-600 px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              A comprehensive web-based platform to capture, manage, track, and convert potential customers 
              efficiently. Centralize your sales operations with role-based access control and real-time analytics.
            </motion.p>
            
            <motion.div 
              className="flex flex-col items-center justify-center gap-4 sm:flex-row px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  className="w-full sm:w-auto h-14 md:h-16 px-8 md:px-12 text-lg md:text-xl font-semibold gradient-teal text-white shadow-2xl transition-all hover:shadow-teal-500/50"
                  onClick={() => navigate("/login")}
                >
                  Access Dashboard
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
              </motion.div>
            </motion.div>
            
            <motion.p 
              className="mt-6 md:mt-8 text-sm md:text-base text-gray-500 flex items-center justify-center gap-2 px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
            >
              <Lock className="h-4 md:h-5 w-4 md:w-5 text-teal-600" />
              Authorized Personnel Only • Secure Access Required
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="bg-white py-12 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto mb-10 md:mb-16 max-w-3xl text-center"
          >
            <h2 className="mb-3 md:mb-4 text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
              Why Lead Management System?
            </h2>
            <p className="text-base md:text-lg text-gray-600 px-4">
              Replace scattered spreadsheets and emails with a centralized platform designed for sales success
            </p>
          </motion.div>

          <div className="grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
              >
                <Card className="h-full border-gray-200 bg-white transition-all hover:shadow-2xl hover:border-teal-300">
                  <CardContent className="p-6 md:p-8">
                    <div className="mb-4 md:mb-5 inline-flex rounded-xl gradient-teal p-3 md:p-4 text-white shadow-lg">
                      <benefit.icon className="h-6 md:h-8 w-6 md:w-8" />
                    </div>
                    <h3 className="mb-2 md:mb-3 text-lg md:text-xl font-bold text-gray-900">{benefit.title}</h3>
                    <p className="text-sm md:text-base leading-relaxed text-gray-600">{benefit.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section id="modules" className="bg-gradient-to-b from-gray-50 to-white py-12 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto mb-10 md:mb-16 max-w-3xl text-center"
          >
            <Badge className="mb-3 md:mb-4 border-teal-200 bg-teal-50 px-3 md:px-4 py-1 md:py-1.5 text-xs font-semibold text-teal-700">
              PLATFORM MODULES
            </Badge>
            <h2 className="mb-3 md:mb-4 text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
              Complete Feature Set
            </h2>
            <p className="text-base md:text-lg text-gray-600 px-4">
              Nine powerful modules working together to streamline your entire sales process
            </p>
          </motion.div>

          <div className="grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {modules.map((module, index) => (
              <motion.div
                key={module.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              >
                <Card className="h-full border-gray-200 bg-white transition-all hover:shadow-2xl hover:border-teal-300 group">
                  <CardContent className="p-6 md:p-8">
                    <div className={`mb-4 md:mb-5 inline-flex rounded-2xl bg-gradient-to-br ${module.color} p-4 md:p-5 text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <module.icon className="h-6 md:h-8 w-6 md:w-8" />
                    </div>
                    <h3 className="mb-2 md:mb-3 text-lg md:text-2xl font-bold text-gray-900">{module.title}</h3>
                    <p className="text-sm md:text-base leading-relaxed text-gray-600">{module.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Role Structure Section */}
      <section id="roles" className="bg-white py-12 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto mb-10 md:mb-16 max-w-3xl text-center"
          >
            <Badge className="mb-3 md:mb-4 border-teal-200 bg-teal-50 px-3 md:px-4 py-1 md:py-1.5 text-xs font-semibold text-teal-700">
              ROLE-BASED ACCESS CONTROL
            </Badge>
            <h2 className="mb-3 md:mb-4 text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
              Built for Every Team Member
            </h2>
            <p className="text-base md:text-lg text-gray-600 px-4">
              Secure, role-specific interfaces with granular permissions for admins, managers, and sales agents
            </p>
          </motion.div>

          {/* Role Hierarchy Visual */}
          <motion.div 
            className="mb-10 md:mb-16 flex flex-wrap items-center justify-center gap-3 md:gap-4 text-base md:text-xl font-bold px-4"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div 
              className="px-6 md:px-8 py-3 md:py-4 rounded-2xl bg-gradient-to-r from-red-500 to-orange-600 text-white shadow-xl"
              whileHover={{ scale: 1.1, rotate: 2 }}
            >
              Admin
            </motion.div>
            <ArrowRight className="h-6 md:h-8 w-6 md:w-8 text-gray-400" />
            <motion.div 
              className="px-6 md:px-8 py-3 md:py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-xl"
              whileHover={{ scale: 1.1, rotate: -2 }}
            >
              Manager
            </motion.div>
            <ArrowRight className="h-6 md:h-8 w-6 md:w-8 text-gray-400" />
            <motion.div 
              className="px-6 md:px-8 py-3 md:py-4 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-xl"
              whileHover={{ scale: 1.1, rotate: 2 }}
            >
              Agent
            </motion.div>
          </motion.div>

          <div className="grid gap-6 md:gap-8 lg:grid-cols-3">
            {roles.map((role, index) => (
              <motion.div
                key={role.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
              >
                <Card className="h-full border-gray-200 bg-white transition-all hover:shadow-2xl hover:border-teal-300 group">
                  <CardContent className="p-6 md:p-8">
                    <div className={`mb-4 md:mb-6 inline-flex rounded-2xl bg-gradient-to-br ${role.color} p-4 md:p-6 text-white shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                      <role.icon className="h-8 md:h-10 w-8 md:w-10" />
                    </div>
                    <h3 className="mb-2 text-2xl md:text-3xl font-bold text-gray-900">{role.title}</h3>
                    <p className="mb-3 md:mb-4 text-base md:text-lg font-semibold text-teal-600">{role.subtitle}</p>
                    <p className="mb-4 md:mb-6 text-sm md:text-base text-gray-600">{role.description}</p>
                    <div className="space-y-2 md:space-y-3">
                      {role.responsibilities.map((item, idx) => (
                        <motion.div 
                          key={idx} 
                          className="flex items-start gap-2 md:gap-3"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.1 * idx }}
                        >
                          <div className="mt-1 flex-shrink-0 rounded-full bg-teal-100 p-1">
                            <CheckCircle className="h-3 md:h-4 w-3 md:w-4 text-teal-600" />
                          </div>
                          <span className="text-xs md:text-sm leading-relaxed text-gray-700">{item}</span>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lead Lifecycle Section */}
      <section id="lifecycle" className="bg-gradient-to-b from-gray-50 to-white py-12 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto mb-10 md:mb-16 max-w-3xl text-center"
          >
            <Badge className="mb-3 md:mb-4 border-teal-200 bg-teal-50 px-3 md:px-4 py-1 md:py-1.5 text-xs font-semibold text-teal-700">
              LEAD JOURNEY
            </Badge>
            <h2 className="mb-3 md:mb-4 text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
              Structured Lead Lifecycle
            </h2>
            <p className="text-base md:text-lg text-gray-600 px-4">
              Track every lead through a defined journey from first contact to conversion
            </p>
          </motion.div>

          <div className="grid gap-4 md:gap-6 grid-cols-2 lg:grid-cols-4">
            {lifecycle.map((stage, index) => (
              <motion.div
                key={stage.stage}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <Card className="h-full border-gray-200 bg-white transition-all hover:shadow-xl hover:border-teal-300 group">
                  <CardContent className="p-4 md:p-6 text-center">
                    <div className={`mx-auto mb-3 md:mb-4 inline-flex h-12 w-12 md:h-16 md:w-16 items-center justify-center rounded-2xl ${stage.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <stage.icon className="h-6 md:h-8 w-6 md:w-8" />
                    </div>
                    <div className="mb-2 inline-flex h-6 w-6 md:h-8 md:w-8 items-center justify-center rounded-full bg-gray-100 text-xs md:text-sm font-bold text-gray-700">
                      {index + 1}
                    </div>
                    <h3 className="mb-2 text-base md:text-xl font-bold text-gray-900">{stage.stage}</h3>
                    <p className="text-xs md:text-sm text-gray-600">{stage.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="border-t border-teal-700 gradient-teal py-12 md:py-16">
        <div className="w-full px-4 md:px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-8 md:gap-12 mb-8 md:mb-12">
            <div>
              <div className="flex items-center justify-start gap-4 mb-4 md:mb-6 -ml-[7.25rem] md:-ml-[9rem]">
                <div className="h-20 md:h-24 w-full max-w-[360px] md:max-w-[420px] overflow-hidden">
                  <img
                    src="/athenurawhitelogo.png"
                    alt="Athenura"
                    className="h-full w-full object-contain scale-[1.25] origin-left"
                  />
                </div>
              </div>
              <p className="text-base md:text-lg text-white font-semibold mb-2 md:mb-3">
                Next-gen software engineering for the modern enterprise.
              </p>
              <p className="text-sm md:text-base text-white/90 mb-6">
                We build the systems that drive the world.
              </p>
              <p className="text-xs md:text-sm font-semibold text-white mb-3 uppercase tracking-wider">Follow Us</p>
              <div className="flex items-center gap-3">
                <a
                  href="https://www.linkedin.com/company/athenura/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 rounded-full bg-white text-teal-700 flex items-center justify-center hover:scale-105 transition-transform"
                  aria-label="LinkedIn"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/athenura.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 rounded-full bg-white text-teal-700 flex items-center justify-center hover:scale-105 transition-transform"
                  aria-label="Instagram"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                  </svg>
                </a>
                <a
                  href="https://x.com/athenura_in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 rounded-full bg-white text-teal-700 flex items-center justify-center hover:scale-105 transition-transform"
                  aria-label="Twitter/X"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a
                  href="https://github.com/athenura"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 rounded-full bg-white text-teal-700 flex items-center justify-center hover:scale-105 transition-transform"
                  aria-label="GitHub"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Company</h3>
              <ul className="space-y-3 text-white/90">
                <li><a href="/about" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="/career" className="hover:text-white transition-colors">Career</a></li>
                <li><a href="/internship" className="hover:text-white transition-colors">Internship Program</a></li>
                <li><a href="/internship-policy" className="hover:text-white transition-colors">Internship Policy</a></li>
                <li><a href="/faqs" className="hover:text-white transition-colors">FAQs</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Services</h3>
              <ul className="space-y-3 text-white/90">
                <li><a href="/services/custom-software" className="hover:text-white transition-colors">Custom Software Development</a></li>
                <li><a href="/services/web-apps" className="hover:text-white transition-colors">Web Application Development</a></li>
                <li><a href="/services/maintenance" className="hover:text-white transition-colors">Website Maintenance</a></li>
                <li><a href="/services/testing" className="hover:text-white transition-colors">Software Testing and QA</a></li>
                <li><a href="/services/automation" className="hover:text-white transition-colors">Business Automation Solutions</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Contact Us</h3>
              <ul className="space-y-4 text-white/90">
                <li>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-white text-teal-700 flex items-center justify-center">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs text-white/70">Email</p>
                      <a href="mailto:official@athenura.in" className="text-sm hover:text-white transition-colors">
                        official@athenura.in
                      </a>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-white text-teal-700 flex items-center justify-center">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs text-white/70">Phone</p>
                      <a href="tel:+919835051934" className="text-sm hover:text-white transition-colors">
                        +91 98350 51934
                      </a>
                    </div>
                  </div>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Location</h3>
              <div className="rounded-lg overflow-hidden border border-white/20 shadow-sm">
                <iframe
                  title="Athenura location"
                  src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d14689.457017026245!2d72.5716!3d23.0225!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1700000000000"
                  className="h-28 w-full"
                  loading="lazy"
                />
              </div>
              <p className="text-sm text-white/90 mt-3">
                Sector 62, Noida, Uttar Pradesh
              </p>
            </div>
          </div>

          <div className="pt-6 md:pt-8 border-t border-white/20">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-white/80">
              <p className="text-xs md:text-sm text-center md:text-left">
                © 2026 Athenura Solutions Inc. All rights reserved.
              </p>
              <div className="flex items-center gap-6 text-xs md:text-sm">
                <a href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
