import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowLeft, Shield, Users, BarChart3, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const { login } = useAuth();
  /* eslint-enable @typescript-eslint/no-unused-vars */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

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
    } catch (error) {
      console.error('Login error:', error);
      // Ideally show toast error here
    } finally {
      setIsLoading(false);
    }
  };

  // Demo login - modified to hit API if needed or kept as mock for now? 
  // Requirement says "Replace any mock auth logic".
  // Let's remove demo login or update it to use a hardcoded demo account against API if exists.
  // For now, let's keep it but make it clear it's a demo bypass or remove it.
  // The plan tasks say "Update Login.tsx to use useAuth().login".
  // I will comment out demo login for now or remove it.
  // Actually, let's remove it to strictly follow "Replace mock data".


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

          {/* Demo Access Section Removed */}

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
