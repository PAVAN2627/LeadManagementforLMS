import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Target, Phone, CheckCircle, FileText, MessageSquare, Award, Activity, ArrowLeft, CheckCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const Lifecycle = () => {
  const navigate = useNavigate();

  const lifecycle = [
    { stage: "New", description: "Lead is created and entered into system", icon: Target, color: "bg-blue-500" },
    { stage: "Contacted", description: "First interaction completed", icon: Phone, color: "bg-cyan-500" },
    { stage: "Qualified", description: "Lead shows genuine interest", icon: CheckCircle, color: "bg-teal-500" },
    { stage: "Proposal Sent", description: "Pricing and details shared", icon: FileText, color: "bg-green-500" },
    { stage: "Negotiation", description: "Discussion and terms ongoing", icon: MessageSquare, color: "bg-yellow-500" },
    { stage: "Converted", description: "Deal successful - customer won", icon: Award, color: "bg-emerald-500" },
    { stage: "Lost", description: "Deal failed - opportunity closed", icon: Activity, color: "bg-red-500" },
    { stage: "Completed", description: "Process finished and archived", icon: CheckCheck, color: "bg-purple-500" },
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

      {/* Lifecycle Section */}
      <section className="py-12 md:py-20 relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/leadmgtback.png)',
          }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/85 via-purple-50/70 to-pink-50/70" />
        
        <div className="relative mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto mb-10 md:mb-16 max-w-3xl text-center"
          >
            <Badge className="mb-3 md:mb-4 border-teal-200 bg-teal-50 px-3 md:px-4 py-1 md:py-1.5 text-xs font-semibold text-teal-700">
              LEAD JOURNEY
            </Badge>
            <h1 className="mb-3 md:mb-4 text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
              Structured Lead Lifecycle
            </h1>
            <p className="text-base md:text-lg text-gray-600 px-4">
              Track every lead through a defined journey from first contact to conversion
            </p>
          </motion.div>

          <div className="grid gap-4 md:gap-6 grid-cols-2 lg:grid-cols-4">
            {lifecycle.map((stage, index) => (
              <motion.div
                key={stage.stage}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
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
    </div>
  );
};

export default Lifecycle;
