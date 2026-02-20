import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Settings, Briefcase, Phone, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const Roles = () => {
  const navigate = useNavigate();

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

      {/* Roles Section */}
      <section className="py-12 md:py-20 relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/leadmgtback.png)',
          }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/85 via-blue-50/70 to-indigo-50/70" />
        
        <div className="relative mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto mb-10 md:mb-16 max-w-3xl text-center"
          >
            <Badge className="mb-3 md:mb-4 border-teal-200 bg-teal-50 px-3 md:px-4 py-1 md:py-1.5 text-xs font-semibold text-teal-700">
              ROLE-BASED ACCESS CONTROL
            </Badge>
            <h1 className="mb-3 md:mb-4 text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
              Built for Every Team Member
            </h1>
            <p className="text-base md:text-lg text-gray-600 px-4">
              Secure, role-specific interfaces with granular permissions for admins, managers, and sales agents
            </p>
          </motion.div>

          {/* Role Hierarchy Visual */}
          <motion.div 
            className="mb-10 md:mb-16 flex flex-wrap items-center justify-center gap-3 md:gap-4 text-base md:text-xl font-bold px-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
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
                animate={{ opacity: 1, y: 0 }}
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
                          animate={{ opacity: 1, x: 0 }}
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
    </div>
  );
};

export default Roles;
