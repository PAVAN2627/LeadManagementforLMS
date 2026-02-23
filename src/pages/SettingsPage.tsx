import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  User, 
  Lock, 
  Bell, 
  Database, 
  Palette, 
  Shield, 
  Mail, 
  Smartphone,
  Globe,
  Save,
  Check,
  AlertTriangle,
  LogOut,
  Edit2,
  Camera
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";

const SettingsPage = () => {
  const { toast } = useToast();
  const [profile, setProfile] = useState({
    name: "Admin User",
    email: "admin@athenura.com",
    phone: "+1 234 567 8900",
    role: "Admin",
    department: "Sales",
    bio: "Lead management system administrator with 5+ years of experience."
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [notifications, setNotifications] = useState({
    emailNewLead: true,
    emailAssignment: true,
    emailDailyReport: false,
    emailWeeklyReport: true,
    pushNewLead: false,
    pushFollowup: true,
    pushTargetReached: true,
    smsImportant: false
  });

  const [system, setSystem] = useState({
    leadAssignment: "round-robin",
    autoFollowup: 7,
    sessionTimeout: 30,
    dateFormat: "MM/DD/YYYY",
    timeZone: "UTC-8",
    theme: "light",
    language: "en"
  });

  const [security, setSecurity] = useState({
    twoFactor: false,
    loginNotifications: true,
    sessionLogs: true,
    passwordExpiry: 90
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "New passwords do not match"
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Password must be at least 6 characters"
      });
      return;
    }

    setIsChangingPassword(true);
    try {
      await api.changePassword(passwordData.currentPassword, passwordData.newPassword);
      toast({
        title: "Success",
        description: "Password changed successfully"
      });
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to change password"
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <DashboardLayout role="admin" title="Settings">
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600">Manage your account and system preferences</p>
          </div>
          <Button 
            onClick={handleSave}
            className="bg-teal-600 hover:bg-teal-700 text-white"
            disabled={saved}
          >
            {saved ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Saved
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Tabs defaultValue="profile" className="space-y-4">
            <TabsList className="grid w-full grid-cols-5 bg-gray-100">
              <TabsTrigger 
                value="profile" 
                className="data-[state=active]:bg-teal-600 data-[state=active]:text-white"
              >
                <User className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger 
                value="notifications"
                className="data-[state=active]:bg-teal-600 data-[state=active]:text-white"
              >
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </TabsTrigger>
              <TabsTrigger 
                value="system"
                className="data-[state=active]:bg-teal-600 data-[state=active]:text-white"
              >
                <Database className="h-4 w-4 mr-2" />
                System
              </TabsTrigger>
              <TabsTrigger 
                value="security"
                className="data-[state=active]:bg-teal-600 data-[state=active]:text-white"
              >
                <Shield className="h-4 w-4 mr-2" />
                Security
              </TabsTrigger>
              <TabsTrigger 
                value="appearance"
                className="data-[state=active]:bg-teal-600 data-[state=active]:text-white"
              >
                <Palette className="h-4 w-4 mr-2" />
                Appearance
              </TabsTrigger>
            </TabsList>

            {/* Profile Settings */}
            <TabsContent value="profile" className="space-y-4">
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <User className="h-5 w-5 text-teal-600" />
                    Profile Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Profile Picture */}
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="h-20 w-20 bg-teal-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        AU
                      </div>
                      <Button 
                        size="icon" 
                        className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-white border-2 border-gray-200 hover:bg-gray-50"
                      >
                        <Camera className="h-4 w-4 text-gray-600" />
                      </Button>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{profile.name}</h3>
                      <Badge variant="secondary" className="bg-teal-100 text-teal-800">
                        {profile.role}
                      </Badge>
                    </div>
                  </div>

                  <Separator />

                  {/* Personal Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-gray-700">Full Name</Label>
                      <Input 
                        id="name"
                        value={profile.name}
                        onChange={(e) => setProfile({...profile, name: e.target.value})}
                        className="border-gray-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-700">Email Address</Label>
                      <Input 
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({...profile, email: e.target.value})}
                        className="border-gray-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-gray-700">Phone Number</Label>
                      <Input 
                        id="phone"
                        value={profile.phone}
                        onChange={(e) => setProfile({...profile, phone: e.target.value})}
                        className="border-gray-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department" className="text-gray-700">Department</Label>
                      <Select value={profile.department} onValueChange={(value) => setProfile({...profile, department: value})}>
                        <SelectTrigger className="border-gray-300">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Sales">Sales</SelectItem>
                          <SelectItem value="Marketing">Marketing</SelectItem>
                          <SelectItem value="Administration">Administration</SelectItem>
                          <SelectItem value="Operations">Operations</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-gray-700">Bio</Label>
                    <Textarea 
                      id="bio"
                      value={profile.bio}
                      onChange={(e) => setProfile({...profile, bio: e.target.value})}
                      className="border-gray-300"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Change Password */}
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <Lock className="h-5 w-5 text-teal-600" />
                    Change Password
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-gray-700">Current Password</Label>
                      <Input 
                        type="password" 
                        className="border-gray-300"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-700">New Password</Label>
                      <Input 
                        type="password" 
                        className="border-gray-300"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-700">Confirm Password</Label>
                      <Input 
                        type="password" 
                        className="border-gray-300"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                      />
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-gray-300"
                    onClick={handleChangePassword}
                    disabled={isChangingPassword || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                  >
                    {isChangingPassword ? "Updating..." : "Update Password"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notification Settings */}
            <TabsContent value="notifications" className="space-y-4">
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <Mail className="h-5 w-5 text-teal-600" />
                    Email Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { key: 'emailNewLead', label: 'New lead assignments', description: 'Get notified when new leads are assigned to you' },
                    { key: 'emailAssignment', label: 'Lead status updates', description: 'Receive updates when lead statuses change' },
                    { key: 'emailDailyReport', label: 'Daily performance reports', description: 'Daily summary of your lead activity' },
                    { key: 'emailWeeklyReport', label: 'Weekly analytics reports', description: 'Weekly business intelligence reports' }
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between py-2">
                      <div className="space-y-1">
                        <div className="font-medium text-gray-900">{item.label}</div>
                        <div className="text-sm text-gray-600">{item.description}</div>
                      </div>
                      <Switch 
                        checked={notifications[item.key as keyof typeof notifications]} 
                        onCheckedChange={(checked) => setNotifications({...notifications, [item.key]: checked})}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <Smartphone className="h-5 w-5 text-teal-600" />
                    Push & SMS Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { key: 'pushNewLead', label: 'New lead alerts', description: 'Browser notifications for new leads' },
                    { key: 'pushFollowup', label: 'Follow-up reminders', description: 'Reminders for scheduled follow-ups' },
                    { key: 'pushTargetReached', label: 'Target achievements', description: 'Celebrate when targets are reached' },
                    { key: 'smsImportant', label: 'Important SMS alerts', description: 'Critical updates via SMS' }
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between py-2">
                      <div className="space-y-1">
                        <div className="font-medium text-gray-900">{item.label}</div>
                        <div className="text-sm text-gray-600">{item.description}</div>
                      </div>
                      <Switch 
                        checked={notifications[item.key as keyof typeof notifications]} 
                        onCheckedChange={(checked) => setNotifications({...notifications, [item.key]: checked})}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* System Settings */}
            <TabsContent value="system" className="space-y-4">
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <Database className="h-5 w-5 text-teal-600" />
                    Lead Management Rules
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-gray-700">Lead Assignment Method</Label>
                      <Select value={system.leadAssignment} onValueChange={(value) => setSystem({...system, leadAssignment: value})}>
                        <SelectTrigger className="border-gray-300">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="round-robin">Round Robin</SelectItem>
                          <SelectItem value="manual">Manual Assignment</SelectItem>
                          <SelectItem value="performance">Performance Based</SelectItem>
                          <SelectItem value="territory">Territory Based</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-700">Auto Follow-up Days</Label>
                      <Select value={system.autoFollowup.toString()} onValueChange={(value) => setSystem({...system, autoFollowup: parseInt(value)})}>
                        <SelectTrigger className="border-gray-300">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 Day</SelectItem>
                          <SelectItem value="3">3 Days</SelectItem>
                          <SelectItem value="7">7 Days</SelectItem>
                          <SelectItem value="14">14 Days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <Globe className="h-5 w-5 text-teal-600" />
                    Regional & Format Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-gray-700">Time Zone</Label>
                      <Select value={system.timeZone} onValueChange={(value) => setSystem({...system, timeZone: value})}>
                        <SelectTrigger className="border-gray-300">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UTC-8">Pacific Time (UTC-8)</SelectItem>
                          <SelectItem value="UTC-5">Eastern Time (UTC-5)</SelectItem>
                          <SelectItem value="UTC+0">UTC (UTC+0)</SelectItem>
                          <SelectItem value="UTC+5:30">India Time (UTC+5:30)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-700">Date Format</Label>
                      <Select value={system.dateFormat} onValueChange={(value) => setSystem({...system, dateFormat: value})}>
                        <SelectTrigger className="border-gray-300">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                          <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                          <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-700">Language</Label>
                      <Select value={system.language} onValueChange={(value) => setSystem({...system, language: value})}>
                        <SelectTrigger className="border-gray-300">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                          <SelectItem value="de">German</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Settings */}
            <TabsContent value="security" className="space-y-4">
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <Shield className="h-5 w-5 text-teal-600" />
                    Account Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between py-2">
                    <div className="space-y-1">
                      <div className="font-medium text-gray-900">Two-factor Authentication</div>
                      <div className="text-sm text-gray-600">Add an extra layer of security to your account</div>
                    </div>
                    <Switch 
                      checked={security.twoFactor} 
                      onCheckedChange={(checked) => setSecurity({...security, twoFactor: checked})}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between py-2">
                    <div className="space-y-1">
                      <div className="font-medium text-gray-900">Login Notifications</div>
                      <div className="text-sm text-gray-600">Get notified of login attempts</div>
                    </div>
                    <Switch 
                      checked={security.loginNotifications} 
                      onCheckedChange={(checked) => setSecurity({...security, loginNotifications: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between py-2">
                    <div className="space-y-1">
                      <div className="font-medium text-gray-900">Session Logging</div>
                      <div className="text-sm text-gray-600">Keep logs of user sessions</div>
                    </div>
                    <Switch 
                      checked={security.sessionLogs} 
                      onCheckedChange={(checked) => setSecurity({...security, sessionLogs: checked})}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200 border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-800">
                    <AlertTriangle className="h-5 w-5" />
                    Danger Zone
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Button variant="destructive" className="w-full">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out of All Devices
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Appearance Settings */}
            <TabsContent value="appearance" className="space-y-4">
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <Palette className="h-5 w-5 text-teal-600" />
                    Theme & Display
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-gray-700">Theme</Label>
                    <Select value={system.theme} onValueChange={(value) => setSystem({...system, theme: value})}>
                      <SelectTrigger className="border-gray-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="auto">Auto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Label className="text-gray-700">Color Scheme Preview</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="p-4 rounded-lg border-2 border-teal-600 bg-teal-50">
                        <div className="w-full h-8 bg-teal-600 rounded mb-2"></div>
                        <div className="text-xs text-center text-teal-800 font-medium">Primary - Teal</div>
                      </div>
                      <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
                        <div className="w-full h-8 bg-gray-900 rounded mb-2"></div>
                        <div className="text-xs text-center text-gray-700 font-medium">Secondary - Dark</div>
                      </div>
                      <div className="p-4 rounded-lg border border-gray-200 bg-white">
                        <div className="w-full h-8 bg-white border border-gray-300 rounded mb-2"></div>
                        <div className="text-xs text-center text-gray-700 font-medium">Background</div>
                      </div>
                      <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
                        <div className="w-full h-8 bg-gray-600 rounded mb-2"></div>
                        <div className="text-xs text-center text-gray-700 font-medium">Text - Gray</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;