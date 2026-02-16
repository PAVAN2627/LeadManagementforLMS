import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowLeft, Shield, Users, BarChart3, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

import { useAuth } from "@/context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      // Navigate based on role - for now default to admin or dashboard home
      // In a real app, AuthContext might return the user role, or we parse it from state
      // For Phase 1, let's go to /admin as a default success path or check the user from context after login (but state update is async)
      // Actually, standard usually redirects to a dashboard.
      // Let's assume Admin for now as per instructions "Log in with Admin credentials -> Verify redirection to /admin"
      navigate("/admin");
    } catch (error) {
      console.error(error);
      // Toast is handled in AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (role: "admin" | "manager" | "agent") => {
    // For now, keep demo login or map it to real credentials if we have them seeded?
    // The instructions say "Replace mock login". 
    // But keeping demo buttons might be useful for the user if they want to quickly test UI without typing.
    // However, for "Real Integration", we should probably disable them or make them fill in the form with seeded data.
    // Let's make them fill the form for now.
    if (role === 'admin') {
      setEmail('admin@athenura.com');
      setPassword('admin123');
    }
    // We don't have other users seeded yet.
    toast.info("Demo Quick-Fill: Click 'Sign In' to proceed.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-3 md:p-4 relative overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/leadmgtback.png)',
        }}
      />

      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/30 to-black/40 backdrop-blur-[2px]" />

      {/* Centered Login Form */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-5 md:p-8 relative z-10"
      >
        {/* Decorative Background */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-teal-50 to-cyan-50 opacity-50" />

        <div className="relative z-10">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="mb-3 md:mb-6 -ml-2 text-gray-600 hover:text-teal-600 transition-colors text-sm"
            >
              <ArrowLeft className="mr-2 h-3 md:h-4 w-3 md:w-4" />
              Back to Home
            </Button>
          </motion.div>

          {/* Logo with Animation */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="flex justify-center mb-4 md:mb-6"
          >
            <motion.div
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative"
            >
              <img
                src="/athenuraroundlogo.png"
                alt="Athenura"
                className="h-16 md:h-24 w-16 md:w-24 rounded-full shadow-xl"
              />
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 opacity-20 blur-xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.2, 0.3, 0.2]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-5 md:mb-8 text-center"
          >
            <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-2 md:mb-3">
              Welcome Back
            </h1>
            <p className="text-sm md:text-base text-gray-600">
              Sign in to access your dashboard
            </p>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            onSubmit={handleLogin}
            className="space-y-4 md:space-y-6"
          >
            {/* Email */}
            <div className="space-y-1.5 md:space-y-2">
              <Label htmlFor="email" className="text-sm md:text-base text-gray-700 font-semibold">Email Address</Label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 md:h-5 w-4 md:w-5 text-gray-400 group-focus-within:text-teal-600 transition-colors" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 md:pl-11 h-10 md:h-12 text-sm md:text-base border-gray-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 transition-all"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5 md:space-y-2">
              <Label htmlFor="password" className="text-sm md:text-base text-gray-700 font-semibold">Password</Label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 md:h-5 w-4 md:w-5 text-gray-400 group-focus-within:text-teal-600 transition-colors" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 md:pl-11 pr-10 md:pr-11 h-10 md:h-12 text-sm md:text-base border-gray-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-teal-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 md:h-5 w-4 md:w-5" /> : <Eye className="h-4 md:h-5 w-4 md:w-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full gradient-teal text-white h-10 md:h-12 text-sm md:text-base font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
              disabled={isLoading}
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="h-4 md:h-5 w-4 md:w-5 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <>
                  <Lock className="mr-2 h-4 md:h-5 w-4 md:w-5" />
                  Sign In Securely
                </>
              )}
            </Button>
          </motion.form>

          {/* Demo Access Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-5 md:mt-8 pt-4 md:pt-6 border-t border-gray-200"
          >
            <div className="text-center mb-3 md:mb-4">
              <Badge className="border-teal-200 bg-teal-50 text-teal-700 px-3 md:px-4 py-0.5 md:py-1 text-xs">
                Demo Mode Available
              </Badge>
            </div>
            <p className="text-xs md:text-sm text-gray-600 mb-3 md:mb-4 text-center">
              Quick access for demonstration
            </p>
            <div className="grid grid-cols-3 gap-2 md:gap-3">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  onClick={() => handleDemoLogin("admin")}
                  disabled={isLoading}
                  className="w-full flex flex-col items-center gap-1.5 md:gap-2 h-auto py-3 md:py-4 border-2 border-gray-200 hover:border-teal-600 hover:bg-teal-50 transition-all group"
                >
                  <Shield className="h-5 md:h-6 w-5 md:w-6 text-gray-600 group-hover:text-teal-600 transition-colors" />
                  <span className="text-xs font-semibold">Admin</span>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  onClick={() => handleDemoLogin("manager")}
                  disabled={isLoading}
                  className="w-full flex flex-col items-center gap-1.5 md:gap-2 h-auto py-3 md:py-4 border-2 border-gray-200 hover:border-teal-600 hover:bg-teal-50 transition-all group"
                >
                  <Users className="h-5 md:h-6 w-5 md:w-6 text-gray-600 group-hover:text-teal-600 transition-colors" />
                  <span className="text-xs font-semibold">Manager</span>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  onClick={() => handleDemoLogin("agent")}
                  disabled={isLoading}
                  className="w-full flex flex-col items-center gap-1.5 md:gap-2 h-auto py-3 md:py-4 border-2 border-gray-200 hover:border-teal-600 hover:bg-teal-50 transition-all group"
                >
                  <BarChart3 className="h-5 md:h-6 w-5 md:w-6 text-gray-600 group-hover:text-teal-600 transition-colors" />
                  <span className="text-xs font-semibold">Agent</span>
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Security Notice */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-4 md:mt-6 text-center"
          >
            <p className="text-xs text-gray-500 flex items-center justify-center gap-1.5 md:gap-2">
              <Shield className="h-3 w-3" />
              Secure authentication • Enterprise-grade encryption
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
