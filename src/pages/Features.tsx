import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ClipboardList,
  UserCheck,
  Activity,
  FileText,
  Mail,
  BarChart3,
  Search,
  Bell,
  Shield,
  ArrowLeft,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const Features = () => {
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-lg shadow-sm">
        <div className="mx-auto flex h-16 md:h-20 items-center justify-between px-4 md:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="text-gray-700 hover:text-teal-600"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </div>
          <img src="/Athenura logo.png" alt="Athenura LMS" className="h-8 md:h-12 w-auto" />
        </div>
      </header>

      {/* Features Section */}
      <section className="py-12 md:py-20 relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/leadmgtback.png)',
          }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/85 via-cyan-50/70 to-blue-50/70" />
        
        <div className="relative mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto mb-10 md:mb-16 max-w-3xl text-center"
          >
            <Badge className="mb-3 md:mb-4 border-teal-200 bg-teal-50 px-3 md:px-4 py-1 md:py-1.5 text-xs font-semibold text-teal-700">
              PLATFORM MODULES
            </Badge>
            <h1 className="mb-3 md:mb-4 text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
              Complete Feature Set
            </h1>
            <p className="text-base md:text-lg text-gray-600 px-4">
              Nine powerful modules working together to streamline your entire sales process
            </p>
          </motion.div>

          <div className="grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {modules.map((module, index) => (
              <motion.div
                key={module.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
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
    </div>
  );
};

export default Features;
