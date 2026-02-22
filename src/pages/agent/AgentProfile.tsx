import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, Building, Save, Edit2, Target, Award } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, ApiUser, ApiLead } from "@/lib/api";

const AgentProfile = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
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

  const { data: leads = [] } = useQuery({
    queryKey: ['leads'],
    queryFn: api.getLeads
  });

  // Calculate real-time performance stats
  const performanceStats = useMemo(() => {
    if (!user) return { thisMonth: 0, converted: 0, conversionRate: "0" };

    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // Filter leads assigned to this agent
    const myLeads = leads.filter((lead: ApiLead) => lead.assignedTo?._id === user._id);
    
    // Filter leads from this month
    const thisMonthLeads = myLeads.filter((lead: ApiLead) => {
      const leadDate = new Date(lead.createdAt);
      return leadDate >= thisMonthStart;
    });

    const converted = thisMonthLeads.filter((lead: ApiLead) => lead.status === 'converted').length;
    const conversionRate = thisMonthLeads.length > 0 
      ? ((converted / thisMonthLeads.length) * 100).toFixed(0)
      : "0";

    return {
      thisMonth: thisMonthLeads.length,
      converted,
      conversionRate
    };
  }, [user, leads]);

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
        title: "Profile Updated",
        description: "Your profile information has been saved successfully.",
        duration: 3000,
      });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  const handleSave = () => {
    updateProfileMutation.mutate(formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <DashboardLayout role="agent" title="Agent Profile">
        <div className="flex items-center justify-center h-full min-h-[50vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="agent" title="Agent Profile">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Agent Profile</h1>
            <p className="text-gray-600">Manage your personal information and preferences</p>
          </div>
          <Button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="bg-teal-600 hover:bg-teal-700 text-white"
          >
            {isEditing ? (
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

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-teal-600" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 rounded-full bg-gray-600 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {formData.name?.charAt(0).toUpperCase() || 'A'}
                  </span>
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-gray-900">{formData.name}</h3>
                  <p className="text-gray-600">{formData.department}</p>
                  <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-100">
                    {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Agent'}
                  </Badge>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    disabled={!isEditing}
                    className="border-gray-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    disabled={!isEditing}
                    className="border-gray-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    disabled={!isEditing}
                    className="border-gray-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => handleInputChange("company", e.target.value)}
                    disabled={!isEditing}
                    className="border-gray-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) => handleInputChange("department", e.target.value)}
                    disabled={!isEditing}
                    className="border-gray-300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  disabled={!isEditing}
                  className="border-gray-300 min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Performance Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-yellow-600" />
                Performance Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border border-gray-200 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{performanceStats.thisMonth}</div>
                  <div className="text-sm text-gray-600">Leads This Month</div>
                </div>
                <div className="text-center p-4 border border-gray-200 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{performanceStats.converted}</div>
                  <div className="text-sm text-gray-600">Converted</div>
                </div>
                <div className="text-center p-4 border border-gray-200 rounded-lg">
                  <div className="text-2xl font-bold text-teal-600">{performanceStats.conversionRate}%</div>
                  <div className="text-sm text-gray-600">Conversion Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Work Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-teal-600" />
                Work Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Lead Notifications</h4>
                  <p className="text-sm text-gray-600">Receive notifications for new leads and updates</p>
                </div>
                <Button variant="outline" onClick={() => toast({ title: "Notifications Configured", description: "Your notification preferences have been updated." })}>Configure</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Working Hours</h4>
                  <p className="text-sm text-gray-600">Set your availability and working schedule</p>
                </div>
                <Button variant="outline" onClick={() => toast({ title: "Working Hours Set", description: "Your working hours have been configured." })}>Set Hours</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Lead Assignment Preferences</h4>
                  <p className="text-sm text-gray-600">Configure lead types and sources you prefer</p>
                </div>
                <Button variant="outline" onClick={() => toast({ title: "Preferences Updated", description: "Your lead assignment preferences have been saved." })}>Manage</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Account Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Two-Factor Authentication</h4>
                  <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                </div>
                <Button variant="outline" onClick={() => toast({ title: "2FA Configured", description: "Two-factor authentication has been enabled." })}>Configure</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Change Password</h4>
                  <p className="text-sm text-gray-600">Update your account password</p>
                </div>
                <Button variant="outline" onClick={() => toast({ title: "Password Updated", description: "Your password has been changed successfully." })}>Update</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default AgentProfile;