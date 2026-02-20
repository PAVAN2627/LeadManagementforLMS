import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Navigate } from "react-router-dom";
import { Mail, Lock, ArrowLeft, Shield, Users, BarChart3, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const { login, user, isAuthenticated, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // If session is still loading, show nothing (ProtectedRoute handles spinner)
  if (isLoading) return null;

  // Already authenticated — send user to their own dashboard
  if (isAuthenticated && user) {
    const dashboardMap: Record<string, string> = {
      admin: '/admin',
      manager: '/manager',
      agent: '/agent',
    };
    return <Navigate to={dashboardMap[user.role] || '/'} replace />;
  }



  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      login(data.token, data.user);

      const role = data.user.role;
      navigate(`/${role}`);
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.message || "Invalid credentials",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = async (role: string) => {
    const demoCredentials: Record<string, { email: string; password: string }> = {
      admin: { email: "admin@athenura.com", password: "admin123" },
      manager: { email: "manager@athenura.com", password: "manager123" },
      agent: { email: "agent@athenura.com", password: "agent123" },
    };

    const credentials = demoCredentials[role];
    if (!credentials) return;

    setEmail(credentials.email);
    setPassword(credentials.password);

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      login(data.token, data.user);
      navigate(`/${role}`);
    } catch (error: any) {
      console.error('Demo login error:', error);
      toast({
        variant: "destructive",
        title: "Demo Login Failed",
        description: error.message || "Could not log in with demo credentials",
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Full Gradient Background - Teal Theme */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500" />
      
      {/* Left Side - Information */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex lg:w-1/2 relative z-10 flex-col justify-start pt-20 p-12 xl:p-20"
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

        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="absolute top-8 left-8 text-white hover:text-white/80 hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <div className="max-w-xl">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-1"
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

            <img 
              src="/athenurawhitelogo.png" 
              alt="Athenura" 
              className="h-36"
            />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl xl:text-5xl font-bold text-white mb-6"
          >
            Lead Management System
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-white/90 mb-8"
          >
            Next-gen software engineering for the modern enterprise. Streamline your lead management process with powerful tools and insights.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-4"
          >
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-6 w-6 text-white flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-white mb-1">Real-time Analytics</h3>
                <p className="text-sm text-white/80">Track your leads and team performance with live dashboards</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-6 w-6 text-white flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-white mb-1">Role-based Access</h3>
                <p className="text-sm text-white/80">Secure access control for Admin, Manager, and Agent roles</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-6 w-6 text-white flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-white mb-1">Enterprise Security</h3>
                <p className="text-sm text-white/80">Bank-level encryption and data protection</p>
              </div>
            </div>
          </motion.div>
        </div>
        </div>
      </motion.div>

      {/* Right Side - Login Form */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full lg:w-1/2 relative z-10 flex items-center justify-center p-6 md:p-12"
      >
        <div className="w-full max-w-md">
          {/* Mobile Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="lg:hidden mb-6 -ml-2 text-gray-700 hover:text-teal-600 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>

          {/* Login Card */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 md:p-10">
            {/* Logo for all screens */}
            <div className="flex justify-center mb-6">
              <img 
                src="/athenuraroundlogo.png" 
                alt="Athenura" 
                className="h-24 w-24 rounded-full shadow-lg"
              />
            </div>

            {/* Header */}
            <div className="mb-8 text-center lg:text-left">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-600">
                Sign in to access your dashboard
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-semibold">Email Address</Label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-teal-600 transition-colors" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-11 h-12 border-gray-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-semibold">Password</Label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-teal-600 transition-colors" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-11 pr-11 h-12 border-gray-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-teal-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full gradient-teal text-white h-12 font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="h-5 w-5 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  <>
                    <Lock className="mr-2 h-5 w-5" />
                    Sign In Securely
                  </>
                )}
              </Button>
            </form>

            {/* Demo Access Section */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="text-center mb-4">
                <Badge className="border-teal-200 bg-teal-50 text-teal-700 px-4 py-1">
                  Demo Mode Available
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mb-4 text-center">
                Quick access for demonstration
              </p>
              <div className="grid grid-cols-3 gap-3">
                <Button
                  variant="outline"
                  onClick={() => handleDemoLogin("admin")}
                  disabled={isLoading}
                  className="flex flex-col items-center gap-2 h-auto py-4 border-2 border-gray-200 hover:border-teal-600 hover:bg-teal-50 transition-all"
                >
                  <Shield className="h-6 w-6 text-gray-600" />
                  <span className="text-xs font-semibold">Admin</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleDemoLogin("manager")}
                  disabled={isLoading}
                  className="flex flex-col items-center gap-2 h-auto py-4 border-2 border-gray-200 hover:border-teal-600 hover:bg-teal-50 transition-all"
                >
                  <Users className="h-6 w-6 text-gray-600" />
                  <span className="text-xs font-semibold">Manager</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleDemoLogin("agent")}
                  disabled={isLoading}
                  className="flex flex-col items-center gap-2 h-auto py-4 border-2 border-gray-200 hover:border-teal-600 hover:bg-teal-50 transition-all"
                >
                  <BarChart3 className="h-6 w-6 text-gray-600" />
                  <span className="text-xs font-semibold">Agent</span>
                </Button>
              </div>
            </div>

            {/* Security Notice */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500 flex items-center justify-center gap-2">
                <Shield className="h-3 w-3" />
                Secure authentication • Enterprise-grade encryption
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
