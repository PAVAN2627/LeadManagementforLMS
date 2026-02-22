import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Lock, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/layout/Footer";

const LandingPage = () => {
  const navigate = useNavigate();
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
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="ghost"
                onClick={() => navigate("/benefits")}
                className="px-5 py-2.5 text-base font-semibold text-gray-700 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all"
              >
                Benefits
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="ghost"
                onClick={() => navigate("/features")}
                className="px-5 py-2.5 text-base font-semibold text-gray-700 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all"
              >
                Features
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="ghost"
                onClick={() => navigate("/roles")}
                className="px-5 py-2.5 text-base font-semibold text-gray-700 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all"
              >
                Roles
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="ghost"
                onClick={() => navigate("/lifecycle")}
                className="px-5 py-2.5 text-base font-semibold text-gray-700 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all"
              >
                Lifecycle
              </Button>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.08, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <button
                onClick={() => navigate("/login")}
                className="px-6 py-2.5 text-base font-bold text-white bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 hover:from-teal-600 hover:via-cyan-600 hover:to-blue-600 rounded-lg shadow-lg hover:shadow-xl transition-all"
              >
                Login
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
                <button 
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate("/benefits");
                  }}
                  className="px-4 py-3 text-base font-semibold text-gray-700 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all text-left"
                >
                  Benefits
                </button>
                <button 
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate("/features");
                  }}
                  className="px-4 py-3 text-base font-semibold text-gray-700 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all text-left"
                >
                  Features
                </button>
                <button 
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate("/roles");
                  }}
                  className="px-4 py-3 text-base font-semibold text-gray-700 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all text-left"
                >
                  Roles
                </button>
                <button 
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate("/lifecycle");
                  }}
                  className="px-4 py-3 text-base font-semibold text-gray-700 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all text-left"
                >
                  Lifecycle
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate("/login");
                  }}
                  className="px-4 py-3 text-base font-bold text-white bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 rounded-lg shadow-lg transition-all"
                >
                  Login
                </button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Hero Section with Background Image */}
      <section className="relative overflow-hidden min-h-[calc(100vh-5rem)]">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/leadmgtback.png)',
          }}
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-900/70 via-cyan-900/60 to-blue-900/70" />
        
        {/* Floating Shapes */}
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-teal-400/20 rounded-full mix-blend-multiply filter blur-xl"
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
          className="absolute bottom-20 right-10 w-72 h-72 bg-cyan-400/20 rounded-full mix-blend-multiply filter blur-xl"
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
        
        <div className="relative mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-16 md:py-24 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mx-auto max-w-5xl text-center"
          >
            <motion.h1 
              className="mb-6 md:mb-8 text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight tracking-tight text-white"
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
                className="bg-gradient-to-r from-teal-300 via-cyan-300 to-blue-300 bg-clip-text text-transparent inline-block"
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
              className="mx-auto mb-8 md:mb-12 max-w-3xl text-lg md:text-2xl leading-relaxed text-white/90 px-4"
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
                  className="w-full sm:w-auto h-14 md:h-16 px-8 md:px-12 text-lg md:text-xl font-semibold bg-white text-teal-600 hover:bg-gray-100 shadow-2xl transition-all"
                  onClick={() => navigate("/login")}
                >
                  Access Dashboard
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
              </motion.div>
            </motion.div>
            
            <motion.p 
              className="mt-6 md:mt-8 text-sm md:text-base text-white/80 flex items-center justify-center gap-2 px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
            >
              <Lock className="h-4 md:h-5 w-4 md:w-5 text-teal-300" />
              Authorized Personnel Only • Secure Access Required
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
