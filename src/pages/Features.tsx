import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, Zap, Shield, Users, BarChart3, Bell, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Footer from "@/components/layout/Footer";

const Features = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Users,
      title: "Lead Management",
      description: "Capture, organize, and track leads from multiple sources in one centralized platform."
    },
    {
      icon: BarChart3,
      title: "Analytics & Reports",
      description: "Real-time insights and comprehensive reports to track performance and make data-driven decisions."
    },
    {
      icon: Bell,
      title: "Smart Notifications",
      description: "Stay updated with intelligent alerts for lead activities, follow-ups, and important events."
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level encryption and role-based access control to keep your data secure."
    },
    {
      icon: Zap,
      title: "Automation",
      description: "Automate repetitive tasks and workflows to save time and increase productivity."
    },
    {
      icon: FileText,
      title: "Custom Reports",
      description: "Generate detailed reports tailored to your business needs with flexible filtering options."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50">
      <div className="container mx-auto px-4 py-12">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Platform Features</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to manage leads and grow your business
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all"
            >
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Features;
