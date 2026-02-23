import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Benefits", path: "/benefits" },
    { label: "Features", path: "/features" },
    { label: "Roles", path: "/roles" },
    { label: "Lifecycle", path: "/lifecycle" },
  ];

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-lg shadow-sm"
    >
      <div className="mx-auto flex h-16 md:h-20 items-center justify-between px-4 md:px-6 lg:px-8">
        <motion.div 
          className="flex items-center cursor-pointer"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
          onClick={() => navigate("/")}
        >
          <img src="/Athenura logo.png" alt="Athenura LMS" className="h-8 md:h-12 w-auto" />
        </motion.div>
        
        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-2">
          {navItems.map((item) => (
            <motion.div
              key={item.path}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="ghost"
                onClick={() => navigate(item.path)}
                className="px-5 py-2.5 text-base font-semibold text-gray-700 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all"
              >
                {item.label}
              </Button>
            </motion.div>
          ))}
          
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
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-gray-200 bg-white"
          >
            <nav className="flex flex-col p-4 space-y-2">
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  variant="ghost"
                  onClick={() => {
                    navigate(item.path);
                    setMobileMenuOpen(false);
                  }}
                  className="justify-start text-base font-semibold text-gray-700 hover:text-teal-600 hover:bg-teal-50"
                >
                  {item.label}
                </Button>
              ))}
              <Button
                onClick={() => {
                  navigate("/login");
                  setMobileMenuOpen(false);
                }}
                className="bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 text-white font-bold"
              >
                Login
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
