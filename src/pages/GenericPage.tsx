import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Footer from "@/components/layout/Footer";

const GenericPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const getPageTitle = () => {
    const path = location.pathname.replace(/\//g, ' ').trim();
    return path.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50">
      <div className="container mx-auto px-4 py-12">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-8">{getPageTitle()}</h1>
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <p className="text-lg text-gray-600 mb-4">
              This page is currently under development. We're working hard to bring you the best experience.
            </p>
            <p className="text-gray-600">
              For more information, please contact our support team at{" "}
              <a href="mailto:support@athenura.in" className="text-teal-600 hover:underline">
                support@athenura.in
              </a>
            </p>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default GenericPage;
