import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Navigate } from "react-router-dom";
import { Mail, Lock, ArrowLeft, Shield, Eye, EyeOff, CheckCircle2, Key, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const { login, user, isAuthenticated, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secret, setSecret] = useState("");
  const [isLogin, setIsLogin] = useState(true);
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

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isLogin) {
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
      } else {
        const response = await fetch('/api/auth/admin-signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password, secret }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Admin signup failed');
        }

        toast({
          title: "Admin Account Created",
          description: "Please sign in with your new credentials.",
        });
        setIsLogin(true);
        setPassword("");
        setSecret("");
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      toast({
        variant: "destructive",
        title: isLogin ? "Login Failed" : "Signup Failed",
        description: error.message || (isLogin ? "Invalid credentials" : "An error occurred"),
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
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex lg:w-1/2 relative z-10 flex-col justify-start pt-20 p-12 xl:p-20"
      >
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
            className="mb-4"
          >
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
      </motion.div>

      {/* Right Side - Login Form */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full lg:w-1/2 relative z-10 flex items-center justify-center p-6 md:p-12"
      >
        <div className="w-full max-w-md">
          {/* Mobile Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="lg:hidden mb-6 -ml-2 text-white hover:text-white/80 hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>

          {/* Login Card */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 md:p-10 scale-110">
            {/* Logo for all screens */}
            <div className="flex justify-center mb-6">
              <img
                src="/athenuraroundlogo.png"
                alt="Athenura"
                className="h-28 w-28 rounded-full shadow-lg"
              />
            </div>

            {/* Header */}
            <div className="mb-8 text-center lg:text-left">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {isLogin ? "Welcome Back" : "Admin Sign Up"}
              </h2>
              <p className="text-gray-600 text-base">
                {isLogin ? "Sign in to access your dashboard" : "Create a new admin account"}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleAuth} className="space-y-5">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-semibold text-base">Email Address</Label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-teal-600 transition-colors" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-11 h-12 border-gray-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 transition-all text-base"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-semibold text-base">Password</Label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-teal-600 transition-colors" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-11 pr-11 h-12 border-gray-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 transition-all text-base"
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

              {/* Security Key for Admin Signup */}
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="secret" className="text-gray-700 font-semibold text-base">Admin Secret</Label>
                  <div className="relative group">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-teal-600 transition-colors" />
                    <Input
                      id="secret"
                      type="password"
                      placeholder="Enter admin secret key"
                      value={secret}
                      onChange={(e) => setSecret(e.target.value)}
                      className="pl-11 h-12 border-gray-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 transition-all text-base"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full gradient-teal text-white h-12 font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] text-base"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="h-5 w-5 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  <>
                    {isLogin ? <Lock className="mr-2 h-5 w-5" /> : <UserPlus className="mr-2 h-5 w-5" />}
                    {isLogin ? "Sign In Securely" : "Create Admin Account"}
                  </>
                )}
              </Button>
            </form>

            {/* Toggle Login/Signup */}
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-teal-600 hover:text-teal-800 font-semibold transition-colors"
              >
                {isLogin ? "Need an admin account? Sign up" : "Already have an account? Sign in"}
              </button>
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
