import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Briefcase, Home, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const Careers = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-8">Career Opportunities</h1>
          
          <div className="bg-white p-8 rounded-2xl shadow-lg mb-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Work where your ideas matter</h2>
              <p className="text-lg text-gray-600 mb-6">
                Athenura isn't just a company; it's a launchpad. We are looking for visionaries ready to tackle the world's toughest technical challenges.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="p-6 bg-teal-50 rounded-xl">
                <Home className="h-8 w-8 text-teal-600 mb-3" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">100% Remote First</h3>
                <p className="text-gray-600">Work from anywhere with flexible hours and work-life balance</p>
              </div>
              <div className="p-6 bg-teal-50 rounded-xl">
                <Star className="h-8 w-8 text-teal-600 mb-3" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">4.9 Glassdoor Rating</h3>
                <p className="text-gray-600">Highly rated by our team members for culture and growth</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-teal-500 to-cyan-500 p-8 rounded-xl text-white text-center">
              <Briefcase className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-3">Join the Revolution</h3>
              <p className="text-lg mb-6">Building the Future</p>
              <a 
                href="https://www.athenura.in/career" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button className="bg-white text-teal-600 hover:bg-gray-100">
                  View Open Positions
                </Button>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Careers;
