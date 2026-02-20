import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Database, TrendingUp, Shield, Zap, LineChart, Target, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Benefits = () => {
  const navigate = useNavigate();

  const benefits = [
    { icon: Database, title: "Centralized Data", description: "All lead information in one secure platform" },
    { icon: TrendingUp, title: "Increased Productivity", description: "Streamlined workflows and automation" },
    { icon: Shield, title: "Data Security", description: "No data loss with structured records" },
    { icon: Zap, title: "Faster Follow-ups", description: "Automated reminders reduce delays" },
    { icon: LineChart, title: "Performance Monitoring", description: "Real-time team performance tracking" },
    { icon: Target, title: "Higher Conversion", description: "Data-driven insights improve close rates" },
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

      {/* Benefits Section */}
      <section className="py-12 md:py-20 relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/leadmgtback.png)',
          }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/85 via-teal-50/70 to-cyan-50/70" />
        
        <div className="relative mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto mb-10 md:mb-16 max-w-3xl text-center"
          >
            <h1 className="mb-3 md:mb-4 text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
              Why Lead Management System?
            </h1>
            <p className="text-base md:text-lg text-gray-600 px-4">
              Replace scattered spreadsheets and emails with a centralized platform designed for sales success
            </p>
          </motion.div>

          <div className="grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
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
    </div>
  );
};

export default Benefits;
