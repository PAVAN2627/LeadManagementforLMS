import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Brain, Zap, Eye, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

const AISolutions = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">AI & Machine Learning Solutions</h1>
            <p className="text-xl text-gray-600">
              Intelligent solutions powered by artificial intelligence to automate processes and gain data-driven insights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white p-8 rounded-2xl shadow-lg"
            >
              <div className="w-16 h-16 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                <Brain className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Predictive Analytics</h3>
              <p className="text-gray-600 mb-4">
                Leverage machine learning models to forecast trends, predict customer behavior, and make data-driven decisions.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-gray-600">
                  <span className="w-1.5 h-1.5 bg-teal-600 rounded-full"></span>
                  Time series forecasting
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <span className="w-1.5 h-1.5 bg-teal-600 rounded-full"></span>
                  Customer churn prediction
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <span className="w-1.5 h-1.5 bg-teal-600 rounded-full"></span>
                  Demand forecasting
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-8 rounded-2xl shadow-lg"
            >
              <div className="w-16 h-16 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                <Eye className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Computer Vision</h3>
              <p className="text-gray-600 mb-4">
                Build intelligent systems that can analyze and understand visual information from images and videos.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-gray-600">
                  <span className="w-1.5 h-1.5 bg-teal-600 rounded-full"></span>
                  Object detection & recognition
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <span className="w-1.5 h-1.5 bg-teal-600 rounded-full"></span>
                  Facial recognition systems
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <span className="w-1.5 h-1.5 bg-teal-600 rounded-full"></span>
                  Quality inspection automation
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white p-8 rounded-2xl shadow-lg"
            >
              <div className="w-16 h-16 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                <MessageSquare className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">NLP Solutions</h3>
              <p className="text-gray-600 mb-4">
                Natural Language Processing solutions to understand, interpret, and generate human language.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-gray-600">
                  <span className="w-1.5 h-1.5 bg-teal-600 rounded-full"></span>
                  Chatbots & virtual assistants
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <span className="w-1.5 h-1.5 bg-teal-600 rounded-full"></span>
                  Sentiment analysis
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <span className="w-1.5 h-1.5 bg-teal-600 rounded-full"></span>
                  Text classification & extraction
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white p-8 rounded-2xl shadow-lg"
            >
              <div className="w-16 h-16 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">AI Integration</h3>
              <p className="text-gray-600 mb-4">
                Seamlessly integrate AI capabilities into your existing systems and workflows.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-gray-600">
                  <span className="w-1.5 h-1.5 bg-teal-600 rounded-full"></span>
                  API development & integration
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <span className="w-1.5 h-1.5 bg-teal-600 rounded-full"></span>
                  Model deployment & optimization
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <span className="w-1.5 h-1.5 bg-teal-600 rounded-full"></span>
                  MLOps & monitoring
                </li>
              </ul>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-r from-teal-500 to-cyan-500 p-12 rounded-2xl text-white text-center"
          >
            <h2 className="text-3xl font-bold mb-4">50+ AI Models Deployed</h2>
            <p className="text-xl mb-6">
              Transform your business with cutting-edge AI solutions tailored to your needs
            </p>
            <Button className="bg-white text-teal-600 hover:bg-gray-100">
              Get Started with AI
            </Button>
          </motion.div>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AISolutions;
