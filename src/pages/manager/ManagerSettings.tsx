import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, Lock, Bell, Shield, Save } from "lucide-react";
import { ManagerLayout } from "@/components/layout/ManagerLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

const ManagerSettings = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(false);

  return (
    <ManagerLayout title="Settings">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Information */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
        >
          <Card className="p-6 card-hover-effect glass-card hover-glow animated-border">
            <div className="animated-border-content p-6">
              <div className="flex items-center gap-3 mb-6">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                >
                  <User className="h-6 w-6 text-primary" />
                </motion.div>
                <h2 className="text-xl font-semibold gradient-text-animated">Profile Information</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-2"
                >
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue="John" className="hover:border-primary transition-colors" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                  className="space-y-2"
                >
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue="Manager" className="hover:border-primary transition-colors" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-2"
                >
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="email" type="email" className="pl-10 hover:border-primary transition-colors" defaultValue="john.manager@athenura.com" />
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 }}
                  className="space-y-2"
                >
                  <Label htmlFor="phone">Phone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="phone" type="tel" className="pl-10 hover:border-primary transition-colors" defaultValue="+1 (555) 123-4567" />
                  </div>
                </motion.div>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-6 flex justify-end"
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button className="gradient-bg-animated text-primary-foreground button-ripple shadow-lg">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </Card>
        </motion.div>

        {/* Security */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 100, damping: 15 }}
        >
          <Card className="p-6 card-hover-effect glass-card hover-glow animated-border">
            <div className="animated-border-content p-6">
              <div className="flex items-center gap-3 mb-6">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Lock className="h-6 w-6 text-primary" />
                </motion.div>
                <h2 className="text-xl font-semibold gradient-text-animated">Security</h2>
              </div>
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-2"
                >
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" className="hover:border-primary transition-colors" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 }}
                  className="space-y-2"
                >
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" className="hover:border-primary transition-colors" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-2"
                >
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" className="hover:border-primary transition-colors" />
                </motion.div>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="mt-6 flex justify-end"
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" className="hover:border-primary">Update Password</Button>
                </motion.div>
              </motion.div>
            </div>
          </Card>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 100, damping: 15 }}
        >
          <Card className="p-6 card-hover-effect glass-card hover-glow animated-border">
            <div className="animated-border-content p-6">
              <div className="flex items-center gap-3 mb-6">
                <motion.div
                  animate={{ rotate: [0, -15, 15, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Bell className="h-6 w-6 text-primary" />
                </motion.div>
                <h2 className="text-xl font-semibold gradient-text-animated">Notifications</h2>
              </div>
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ x: 5 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-primary/5 transition-colors"
                >
                  <div className="space-y-0.5">
                    <Label htmlFor="emailNotif">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive email updates about your team</p>
                  </div>
                  <Switch id="emailNotif" checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                </motion.div>
                <Separator />
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ x: 5 }}
                  transition={{ delay: 0.35, type: "spring", stiffness: 300 }}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-primary/5 transition-colors"
                >
                  <div className="space-y-0.5">
                    <Label htmlFor="pushNotif">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Get push notifications for important updates</p>
                  </div>
                  <Switch id="pushNotif" checked={pushNotifications} onCheckedChange={setPushNotifications} />
                </motion.div>
                <Separator />
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ x: 5 }}
                  transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-primary/5 transition-colors"
                >
                  <div className="space-y-0.5">
                    <Label htmlFor="weeklyReports">Weekly Reports</Label>
                    <p className="text-sm text-muted-foreground">Receive weekly performance summaries</p>
                  </div>
                  <Switch id="weeklyReports" checked={weeklyReports} onCheckedChange={setWeeklyReports} />
                </motion.div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Privacy & Data */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 100, damping: 15 }}
        >
          <Card className="p-6 card-hover-effect glass-card hover-glow animated-border">
            <div className="animated-border-content p-6">
              <div className="flex items-center gap-3 mb-6">
                <motion.div
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Shield className="h-6 w-6 text-primary" />
                </motion.div>
                <h2 className="text-xl font-semibold gradient-text-animated">Privacy & Data</h2>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-4"
              >
                <p className="text-sm text-muted-foreground">Manage your data and privacy settings</p>
                <div className="flex gap-3">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="outline" className="hover:border-primary icon-bounce">Export Data</Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="outline" className="text-destructive hover:text-destructive hover:border-destructive">Delete Account</Button>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </Card>
        </motion.div>
      </div>
    </ManagerLayout>
  );
};

export default ManagerSettings;