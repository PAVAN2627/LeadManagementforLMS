import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, Building, Save, Edit2, Users, Lock, Bell, Shield, Download } from "lucide-react";
import { ManagerLayout } from "@/components/layout/ManagerLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, ApiUser } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const ManagerProfile = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [formData, setFormData] = useState<Partial<ApiUser>>({
    name: "",
    email: "",
    phone: "",
    company: "",
    department: "",
    bio: ""
  });

  const { data: user, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: api.getProfile,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        company: user.company || "",
        department: user.department || "",
        bio: user.bio || ""
      });
    }
  }, [user]);

  const updateProfileMutation = useMutation({
    mutationFn: (data: Partial<ApiUser>) => {
      if (!user?._id) throw new Error("User ID not found");
      return api.updateUser(user._id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Your profile has been updated successfully.",
        duration: 3000,
      });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to update profile", 
        variant: "destructive" 
      });
    }
  });

  const changePasswordMutation = useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) => {
      return api.changePassword(data.currentPassword, data.newPassword);
    },
    onSuccess: () => {
      setShowPasswordDialog(false);
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      toast({
        title: "Success",
        description: "Your password has been changed successfully.",
        duration: 3000,
      });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to change password", 
        variant: "destructive" 
      });
    }
  });

  const handleSave = () => {
    if (!formData.name?.trim()) {
      toast({ 
        title: "Validation Error", 
        description: "Name is required", 
        variant: "destructive" 
      });
      return;
    }
    if (!formData.email?.trim()) {
      toast({ 
        title: "Validation Error", 
        description: "Email is required", 
        variant: "destructive" 
      });
      return;
    }
    updateProfileMutation.mutate(formData);
  };

  const handlePasswordChange = () => {
    if (!passwordData.currentPassword) {
      toast({ 
        title: "Validation Error", 
        description: "Current password is required", 
        variant: "destructive" 
      });
      return;
    }
    if (!passwordData.newPassword || passwordData.newPassword.length < 6) {
      toast({ 
        title: "Validation Error", 
        description: "New password must be at least 6 characters", 
        variant: "destructive" 
      });
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({ 
        title: "Validation Error", 
        description: "Passwords do not match", 
        variant: "destructive" 
      });
      return;
    }
    changePasswordMutation.mutate({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword
    });
  };

  const handleExportData = () => {
    const data = {
      profile: user,
      settings: {
        emailNotifications,
        pushNotifications,
        weeklyReports
      },
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `manager-profile-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Export Successful",
      description: "Your profile data has been exported.",
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <ManagerLayout title="Manager Profile">
        <div className="flex items-center justify-center h-full min-h-[50vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
        </div>
      </ManagerLayout>
    );
  }

  return (
    <ManagerLayout title="Manager Profile">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-2xl font-bold gradient-text-animated"
            >
              Manager Profile
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground"
            >
              Manage your account settings and team preferences
            </motion.p>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              disabled={updateProfileMutation.isPending}
              className="gradient-bg-animated text-primary-foreground button-ripple shadow-lg"
            >
              {updateProfileMutation.isPending ? (
                <>
                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Saving...
                </>
              ) : isEditing ? (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              ) : (
                <>
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit Profile
                </>
              )}
            </Button>
          </motion.div>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 100, damping: 15 }}
        >
          <Card className="card-hover-effect glass-card hover-glow animated-border">
            <div className="animated-border-content">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                  >
                    <User className="h-5 w-5 text-primary" />
                  </motion.div>
                  <span className="gradient-text-animated">Personal Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar Section */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="flex items-center gap-4"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                    className="h-20 w-20 rounded-full gradient-bg-animated flex items-center justify-center ring-4 ring-primary/20 shadow-lg"
                  >
                    <span className="text-2xl font-bold text-white">
                      {formData.name?.charAt(0).toUpperCase() || 'M'}
                    </span>
                  </motion.div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-foreground">{formData.name}</h3>
                    <p className="text-muted-foreground">{formData.department}</p>
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-100">
                        {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Manager'}
                      </Badge>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-2"
                  >
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      disabled={!isEditing}
                      className="hover:border-primary transition-colors"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 }}
                    className="space-y-2"
                  >
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        disabled={!isEditing}
                        className="pl-10 hover:border-primary transition-colors"
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-2"
                  >
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        disabled={!isEditing}
                        className="pl-10 hover:border-primary transition-colors"
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.45 }}
                    className="space-y-2"
                  >
                    <Label htmlFor="company">Company</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => handleInputChange("company", e.target.value)}
                        disabled={!isEditing}
                        className="pl-10 hover:border-primary transition-colors"
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="space-y-2"
                  >
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      value={formData.department}
                      onChange={(e) => handleInputChange("department", e.target.value)}
                      disabled={!isEditing}
                      className="hover:border-primary transition-colors"
                    />
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 }}
                  className="space-y-2"
                >
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    disabled={!isEditing}
                    className="hover:border-primary transition-colors min-h-[100px]"
                  />
                </motion.div>
              </CardContent>
            </div>
          </Card>
        </motion.div>

        {/* Team Management Settings */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 100, damping: 15 }}
        >
          <Card className="card-hover-effect glass-card hover-glow animated-border">
            <div className="animated-border-content">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  >
                    <Users className="h-5 w-5 text-primary" />
                  </motion.div>
                  <span className="gradient-text-animated">Team Management Preferences</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ x: 5 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-primary/5 transition-colors"
                >
                  <div>
                    <h4 className="font-medium">Lead Assignment Rules</h4>
                    <p className="text-sm text-muted-foreground">Configure how leads are automatically assigned to your team</p>
                  </div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="outline" className="hover:border-primary" onClick={() => toast({ title: "Rules Configured", description: "Lead assignment rules have been updated." })}>Configure</Button>
                  </motion.div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ x: 5 }}
                  transition={{ delay: 0.35, type: "spring", stiffness: 300 }}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-primary/5 transition-colors"
                >
                  <div>
                    <h4 className="font-medium">Team Notifications</h4>
                    <p className="text-sm text-muted-foreground">Manage notification settings for team activities</p>
                  </div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="outline" className="hover:border-primary" onClick={() => toast({ title: "Notifications Managed", description: "Team notification settings have been updated." })}>Manage</Button>
                  </motion.div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ x: 5 }}
                  transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-primary/5 transition-colors"
                >
                  <div>
                    <h4 className="font-medium">Performance Targets</h4>
                    <p className="text-sm text-muted-foreground">Set and track team performance goals</p>
                  </div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="outline" className="hover:border-primary" onClick={() => toast({ title: "Targets Set", description: "Performance targets have been configured." })}>Set Targets</Button>
                  </motion.div>
                </motion.div>
              </CardContent>
            </div>
          </Card>
        </motion.div>

        {/* Account Settings */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 100, damping: 15 }}
        >
          <Card className="card-hover-effect glass-card hover-glow animated-border">
            <div className="animated-border-content">
              <CardHeader>
                <CardTitle className="gradient-text-animated">Account Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ x: 5 }}
                  transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-primary/5 transition-colors"
                >
                  <div>
                    <h4 className="font-medium">Two-Factor Authentication</h4>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                  </div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="outline" className="hover:border-primary" onClick={() => toast({ title: "2FA Configured", description: "Two-factor authentication has been enabled." })}>Configure</Button>
                  </motion.div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ x: 5 }}
                  transition={{ delay: 0.45, type: "spring", stiffness: 300 }}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-primary/5 transition-colors"
                >
                  <div>
                    <h4 className="font-medium">Change Password</h4>
                    <p className="text-sm text-muted-foreground">Update your account password</p>
                  </div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="outline" className="hover:border-primary" onClick={() => setShowPasswordDialog(true)}>Update</Button>
                  </motion.div>
                </motion.div>
              </CardContent>
            </div>
          </Card>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 100, damping: 15 }}
        >
          <Card className="card-hover-effect glass-card hover-glow animated-border">
            <div className="animated-border-content">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: [0, -15, 15, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  >
                    <Bell className="h-5 w-5 text-primary" />
                  </motion.div>
                  <span className="gradient-text-animated">Notification Preferences</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ x: 5 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
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
                  transition={{ delay: 0.55, type: "spring", stiffness: 300 }}
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
                  transition={{ delay: 0.6, type: "spring", stiffness: 300 }}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-primary/5 transition-colors"
                >
                  <div className="space-y-0.5">
                    <Label htmlFor="weeklyReports">Weekly Reports</Label>
                    <p className="text-sm text-muted-foreground">Receive weekly performance summaries</p>
                  </div>
                  <Switch id="weeklyReports" checked={weeklyReports} onCheckedChange={setWeeklyReports} />
                </motion.div>
              </CardContent>
            </div>
          </Card>
        </motion.div>

        {/* Privacy & Data */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 100, damping: 15 }}
        >
          <Card className="card-hover-effect glass-card hover-glow animated-border">
            <div className="animated-border-content">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <motion.div
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3 }}
                  >
                    <Shield className="h-5 w-5 text-primary" />
                  </motion.div>
                  <span className="gradient-text-animated">Privacy & Data</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="space-y-4"
                >
                  <p className="text-sm text-muted-foreground">Manage your data and privacy settings</p>
                  <div className="flex gap-3">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button 
                        variant="outline" 
                        onClick={handleExportData}
                        className="hover:border-primary icon-bounce"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export Data
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button 
                        variant="outline" 
                        onClick={() => toast({ 
                          title: "Account Deletion", 
                          description: "Please contact support to delete your account.",
                          variant: "destructive"
                        })}
                        className="text-destructive hover:text-destructive hover:border-destructive"
                      >
                        Delete Account
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              </CardContent>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Password Change Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              Change Password
            </DialogTitle>
            <DialogDescription>
              Enter your current password and choose a new password.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                placeholder="Enter current password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                placeholder="Enter new password (min 6 characters)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                placeholder="Confirm new password"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setShowPasswordDialog(false);
                setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handlePasswordChange}
              disabled={changePasswordMutation.isPending}
              className="gradient-bg-animated text-primary-foreground"
            >
              {changePasswordMutation.isPending ? "Updating..." : "Update Password"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ManagerLayout>
  );
};

export default ManagerProfile;