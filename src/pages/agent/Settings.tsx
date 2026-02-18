import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, ApiUser } from "@/lib/api";
import {
  User,
  Bell,
  Zap,
  Save,
  X,
  CheckCircle2,
  AlertCircle,
  Clock,
  Mail,
  Phone,
  MapPin,
  Smartphone,
  ArrowLeft,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface SettingsFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  defaultLeadSource: string;
  defaultLeadPriority: string;
  workStartTime: string;
  workEndTime: string;
  notificationsEmail: boolean;
  notificationsSMS: boolean;
  notificationsInApp: boolean;
  notificationNewLead: boolean;
  notificationLeadUpdate: boolean;
  notificationFollowUp: boolean;
  autoAssignLeads: boolean;
  leadSourceLinkedIn: boolean;
  leadSourceEmail: boolean;
  leadSourcePhone: boolean;
  leadSourceReferral: boolean;
  leadSourceWebsite: boolean;
}

interface SettingsErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeSection, setActiveSection] = useState<"profile" | "notifications" | "preferences">(
    "profile"
  );
  // const [isSubmitting, setIsSubmitting] = useState(false); // Managed by mutation
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errors, setErrors] = useState<SettingsErrors>({});
  const [hasChanges, setHasChanges] = useState(false);

  // Fetch User
  const { data: user, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: api.getProfile,
  });

  const [formData, setFormData] = useState<SettingsFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    defaultLeadSource: "LinkedIn",
    defaultLeadPriority: "Medium",
    workStartTime: "09:00",
    workEndTime: "17:00",
    notificationsEmail: true,
    notificationsSMS: false,
    notificationsInApp: true,
    notificationNewLead: true,
    notificationLeadUpdate: true,
    notificationFollowUp: true,
    autoAssignLeads: false,
    leadSourceLinkedIn: true,
    leadSourceEmail: true,
    leadSourcePhone: false,
    leadSourceReferral: true,
    leadSourceWebsite: true,
  });

  useEffect(() => {
    if (user) {
      const [first, ...rest] = (user.name || "").split(" ");
      const last = rest.join(" ");

      const settings = user.settings || {};

      setFormData(prev => ({
        ...prev,
        firstName: first || "",
        lastName: last || "",
        email: user.email || "",
        phone: user.phone || "",
        location: user.location || "",
        bio: user.bio || "",
        ...settings // Spread saved settings to override defaults
      }));
    }
  }, [user]);

  const updateSettingsMutation = useMutation({
    mutationFn: (data: any) => {
      if (!user?._id) throw new Error("User ID not found");
      return api.updateUser(user._id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setShowSuccess(true);
      setSuccessMessage("Settings saved successfully!");
      setHasChanges(false);
      setTimeout(() => setShowSuccess(false), 3000);
    },
    onError: (error: Error) => {
      console.error(error);
      // Handle error (maybe show toast)
    }
  });

  const validateForm = (): boolean => {
    const newErrors: SettingsErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name: string; value: string }>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setHasChanges(true);
    if (errors[name as keyof SettingsErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
    setHasChanges(true);
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setHasChanges(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Separate profile fields vs settings fields
    const { firstName, lastName, email, phone, location, bio, ...settings } = formData;

    const updateData = {
      name: `${firstName} ${lastName}`.trim(),
      email,
      phone,
      location,
      bio,
      settings
    };

    updateSettingsMutation.mutate(updateData);
  };

  const handleCancel = () => {
    if (hasChanges) {
      if (window.confirm("Discard unsaved changes?")) {
        navigate("/agent");
      }
    } else {
      navigate("/agent");
    }
  };

  const sectionConfig = {
    profile: {
      icon: User,
      label: "Profile",
    },
    notifications: {
      icon: Bell,
      label: "Notifications",
    },
    preferences: {
      icon: Zap,
      label: "Preferences",
    },
  };

  const activeSectionConfig = sectionConfig[activeSection];
  const ActiveIcon = activeSectionConfig.icon;

  if (isLoading) {
    return (
      <DashboardLayout role="agent" title="Settings">
        <div className="flex items-center justify-center h-full min-h-[50vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="agent" title="Settings">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header with Back Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ x: -4 }}
              onClick={handleCancel}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
            <div>
              <h1 className="text-3xl font-bold">Settings</h1>
              <p className="text-muted-foreground mt-1">Manage your profile and preferences</p>
            </div>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 border-b">
          {(["profile", "notifications", "preferences"] as const).map((section) => {
            const config = sectionConfig[section];
            const Icon = config.icon;
            const isActive = activeSection === section;

            return (
              <motion.button
                key={section}
                onClick={() => setActiveSection(section)}
                whileHover={{ y: -2 }}
                className={`flex items-center justify-center sm:justify-start gap-2 px-3 sm:px-4 py-3 font-medium transition-colors border-b-2 w-full sm:w-auto ${isActive
                  ? "text-foreground border-primary"
                  : "text-muted-foreground border-transparent hover:text-foreground"
                  }`}
              >
                <Icon className="w-4 h-4" />
                {config.label}
                {section === "profile" && hasChanges && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2 h-2 bg-yellow-500 rounded-full"
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Section */}
          {activeSection === "profile" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Personal Information Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>Update your profile details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">
                        First Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="John"
                        className="mt-2"
                      />
                      {errors.firstName && (
                        <div className="flex items-center gap-1 mt-2 text-destructive text-sm">
                          <AlertCircle className="w-4 h-4" />
                          {errors.firstName}
                        </div>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="lastName">
                        Last Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Doe"
                        className="mt-2"
                      />
                      {errors.lastName && (
                        <div className="flex items-center gap-1 mt-2 text-destructive text-sm">
                          <AlertCircle className="w-4 h-4" />
                          {errors.lastName}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email Address <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className="mt-2"
                      />
                      {errors.email && (
                        <div className="flex items-center gap-1 mt-2 text-destructive text-sm">
                          <AlertCircle className="w-4 h-4" />
                          {errors.email}
                        </div>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="phone" className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Phone Number <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+1 (555) 123-4567"
                        className="mt-2"
                      />
                      {errors.phone && (
                        <div className="flex items-center gap-1 mt-2 text-destructive text-sm">
                          <AlertCircle className="w-4 h-4" />
                          {errors.phone}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="location" className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Location
                    </Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="San Francisco, CA"
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      placeholder="Tell others about yourself..."
                      maxLength={200}
                      rows={4}
                      className="mt-2 resize-none"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {formData.bio.length}/200 characters
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Working Hours Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Working Hours
                  </CardTitle>
                  <CardDescription>Set your preferred working hours</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="workStartTime">Start Time</Label>
                    <Input
                      id="workStartTime"
                      name="workStartTime"
                      type="time"
                      value={formData.workStartTime}
                      onChange={handleChange}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="workEndTime">End Time</Label>
                    <Input
                      id="workEndTime"
                      name="workEndTime"
                      type="time"
                      value={formData.workEndTime}
                      onChange={handleChange}
                      className="mt-2"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Notifications Section */}
          {activeSection === "notifications" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Notification Channels */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Notification Channels
                  </CardTitle>
                  <CardDescription>Choose how you want to be notified</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { key: "notificationsEmail", label: "Email Notifications", icon: Mail, desc: "Receive notifications via email" },
                    { key: "notificationsSMS", label: "SMS Notifications", icon: Smartphone, desc: "Receive notifications via SMS" },
                    { key: "notificationsInApp", label: "In-App Notifications", icon: Bell, desc: "Receive notifications in the app" },
                  ].map(({ key, label, icon: Icon, desc }) => (
                    <div key={key} className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
                      <Checkbox
                        id={key}
                        checked={formData[key as keyof SettingsFormData] as boolean}
                        onCheckedChange={(checked) => handleCheckboxChange(key, checked as boolean)}
                      />
                      <div className="flex-1">
                        <Label htmlFor={key} className="text-base cursor-pointer flex items-center gap-2">
                          <Icon className="w-4 h-4" />
                          {label}
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">{desc}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Notification Types */}
              <Card>
                <CardHeader>
                  <CardTitle>Notification Types</CardTitle>
                  <CardDescription>Choose what events you want to be notified about</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { key: "notificationNewLead", label: "New Leads Assigned" },
                    { key: "notificationLeadUpdate", label: "Lead Status Updates" },
                    { key: "notificationFollowUp", label: "Follow-up Reminders" },
                  ].map(({ key, label }) => (
                    <div key={key} className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                      <Checkbox
                        id={key}
                        checked={formData[key as keyof SettingsFormData] as boolean}
                        onCheckedChange={(checked) => handleCheckboxChange(key, checked as boolean)}
                      />
                      <Label htmlFor={key} className="cursor-pointer">
                        {label}
                      </Label>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Preferences Section */}
          {activeSection === "preferences" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Lead Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Lead Preferences
                  </CardTitle>
                  <CardDescription>Configure how leads are managed</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="defaultLeadPriority">Default Lead Priority</Label>
                    <Select value={formData.defaultLeadPriority} onValueChange={(value) => handleSelectChange("defaultLeadPriority", value)}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="defaultLeadSource">Default Lead Source</Label>
                    <Select value={formData.defaultLeadSource} onValueChange={(value) => handleSelectChange("defaultLeadSource", value)}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                        <SelectItem value="Email">Email</SelectItem>
                        <SelectItem value="Phone">Phone</SelectItem>
                        <SelectItem value="Referral">Referral</SelectItem>
                        <SelectItem value="Website">Website</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                    <Checkbox
                      id="autoAssignLeads"
                      checked={formData.autoAssignLeads}
                      onCheckedChange={(checked) => handleCheckboxChange("autoAssignLeads", checked as boolean)}
                    />
                    <div className="flex-1">
                      <Label htmlFor="autoAssignLeads" className="cursor-pointer">
                        Auto-assign New Leads
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Automatically assign leads matching your criteria
                      </p>
                    </div>
                    <Tooltip>
                      <TooltipTrigger>
                        <AlertCircle className="w-4 h-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        Automatically assign leads based on your industry and location preferences
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </CardContent>
              </Card>

              {/* Lead Sources */}
              <Card>
                <CardHeader>
                  <CardTitle>Active Lead Sources</CardTitle>
                  <CardDescription>Select which lead sources you want to track</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { key: "leadSourceLinkedIn", label: "LinkedIn", desc: "LinkedIn connections and InMail" },
                    { key: "leadSourceEmail", label: "Email", desc: "Email campaigns and inquiries" },
                    { key: "leadSourcePhone", label: "Phone", desc: "Direct phone calls and voicemails" },
                    { key: "leadSourceReferral", label: "Referral", desc: "Referrals from existing clients" },
                    { key: "leadSourceWebsite", label: "Website", desc: "Website contact forms and chat" },
                  ].map(({ key, label, desc }) => (
                    <div key={key} className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                      <Checkbox
                        id={key}
                        checked={formData[key as keyof SettingsFormData] as boolean}
                        onCheckedChange={(checked) => handleCheckboxChange(key, checked as boolean)}
                      />
                      <div className="flex-1">
                        <Label htmlFor={key} className="cursor-pointer">
                          {label}
                        </Label>
                        <p className="text-sm text-muted-foreground mt-0.5">{desc}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Success Message */}
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="p-4 rounded-lg bg-green-950/20 border border-green-600/50 flex items-center gap-3"
            >
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
              <p className="text-green-700 dark:text-green-400 font-medium">{successMessage}</p>
            </motion.div>
          )}

          {/* Action Buttons */}
          <Separator />
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="text-sm text-muted-foreground">
              {hasChanges && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                  <span>You have unsaved changes</span>
                </div>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Button
                type="button"
                onClick={handleCancel}
                variant="outline"
                className="w-full sm:w-auto"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
                <Button
                  type="submit"
                  disabled={updateSettingsMutation.isPending}
                  className="w-full sm:w-auto"
                >
                  {updateSettingsMutation.isPending ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="inline-block mr-2"
                      >
                        <Save className="w-4 h-4" />
                      </motion.div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </motion.div>
            </div>
          </div>
        </form>
      </motion.div>
    </DashboardLayout>
  );
};

export default Settings;
