import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Phone, Mail, Building2, Calendar, Clock, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Lead } from "@/components/tables/LeadsTable";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface LeadDetailModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (lead: Lead, updates: any) => void;
}

const statusColors: Record<string, string> = {
  new: "bg-blue-500/10 text-blue-600 border border-blue-200",
  contacted: "bg-purple-500/10 text-purple-600 border border-purple-200",
  qualified: "bg-amber-500/10 text-amber-600 border border-amber-200",
  proposal: "bg-indigo-500/10 text-indigo-600 border border-indigo-200",
  negotiation: "bg-orange-500/10 text-orange-600 border border-orange-200",
  converted: "bg-green-500/10 text-green-600 border border-green-200",
  lost: "bg-red-500/10 text-red-600 border border-red-200",
};

export const LeadDetailModal = ({
  lead,
  isOpen,
  onClose,
  onSave,
}: LeadDetailModalProps) => {
  const [editedStatus, setEditedStatus] = useState("");
  const [originalStatus, setOriginalStatus] = useState("");
  const [editedNotes, setEditedNotes] = useState("");
  const [editedFollowUpDate, setEditedFollowUpDate] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showValidationError, setShowValidationError] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");

  useEffect(() => {
    if (lead) {
      setEditedStatus(lead.status);
      setOriginalStatus(lead.status);
      setEditedNotes("");
      setEditedFollowUpDate(lead.nextFollowUp || "");
      setShowValidationError(false);
      setValidationMessage("");
    }
  }, [lead]);

  const handleStatusChange = (newStatus: string) => {
    setEditedStatus(newStatus);
    setShowValidationError(false);
  };

  const handleSave = () => {
    // Check if status changed
    const statusChanged = editedStatus !== originalStatus;
    
    // Validation: If status changed, notes and follow-up date are mandatory
    if (statusChanged) {
      if (!editedNotes.trim()) {
        setShowValidationError(true);
        setValidationMessage("Note is mandatory when updating lead status");
        return;
      }
      if (!editedFollowUpDate) {
        setShowValidationError(true);
        setValidationMessage("Next follow-up date is mandatory when updating lead status");
        return;
      }
    }

    setIsSaving(true);
    if (lead && onSave) {
      const updates: any = {
        status: editedStatus,
        nextFollowUp: editedFollowUpDate,
      };

      // Only add note if there's content
      if (editedNotes.trim()) {
        updates.notes = editedNotes.trim();
      }

      onSave(lead, updates);
    }
    setTimeout(() => {
      setIsSaving(false);
      onClose();
    }, 500);
  };

  if (!lead) return null;

  const statusChanged = editedStatus !== originalStatus;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{lead.name}</DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">{lead.company}</p>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 mt-6"
        >
          {/* Validation Error Alert */}
          <AnimatePresence>
            {showValidationError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{validationMessage}</AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Lead Contact Information */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">
              Contact Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-muted/30 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium break-all">{lead.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm font-medium">{lead.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Building2 className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Company</p>
                  <p className="text-sm font-medium">{lead.company}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="text-xs mt-px">
                  {lead.source}
                </Badge>
              </div>
            </div>
          </div>

          {/* Lead Metadata */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">
              Lead Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground mb-2 block">
                  Current Status
                </Label>
                <div className="flex items-center gap-2">
                  <Badge className={statusColors[lead.status]}>
                    {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                  </Badge>
                </div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-2 block">
                  Lead Date
                </Label>
                <p className="text-sm font-medium">{lead.date}</p>
              </div>
              {lead.nextFollowUp && (
                <div>
                  <Label className="text-xs text-muted-foreground mb-2 block">
                    Current Follow-up Date
                  </Label>
                  <p className="text-sm font-medium flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-teal-600" />
                    {new Date(lead.nextFollowUp).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Previous Notes & Follow-up History */}
          {lead.notes && lead.notes.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Follow-up History</h3>
              <div className="max-h-96 overflow-y-auto bg-muted/30 rounded-lg border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 sticky top-0 z-10">
                    <tr className="border-b border-border">
                      <th className="text-left p-3 font-semibold text-xs text-muted-foreground">Date & Time</th>
                      <th className="text-left p-3 font-semibold text-xs text-muted-foreground">Status</th>
                      <th className="text-left p-3 font-semibold text-xs text-muted-foreground">Notes</th>
                      <th className="text-left p-3 font-semibold text-xs text-muted-foreground">Next Follow-up</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lead.notes.map((note: any, index: number) => (
                      <motion.tr
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-border last:border-b-0 hover:bg-muted/20 transition-colors"
                      >
                        <td className="p-3 align-top">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
                            <Clock className="h-3 w-3 flex-shrink-0" />
                            <span>{new Date(note.createdAt || note.date).toLocaleString()}</span>
                          </div>
                        </td>
                        <td className="p-3 align-top">
                          {note.status && (
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${statusColors[note.status] || 'bg-gray-100 text-gray-700'}`}
                            >
                              {note.status.charAt(0).toUpperCase() + note.status.slice(1)}
                            </Badge>
                          )}
                        </td>
                        <td className="p-3 align-top">
                          <p className="text-sm text-foreground whitespace-pre-wrap max-w-md">
                            {note.content || note.text}
                          </p>
                        </td>
                        <td className="p-3 align-top">
                          {note.nextFollowUp && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
                              <Calendar className="h-3 w-3 flex-shrink-0" />
                              <span>{new Date(note.nextFollowUp).toLocaleString()}</span>
                            </div>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Status Update */}
          <div className="space-y-3 bg-accent/20 p-4 rounded-lg border border-accent/30">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">
                Update Lead Status
              </h3>
              {statusChanged && (
                <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
                  Status Changed
                </Badge>
              )}
            </div>
            <Select value={editedStatus} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="qualified">Qualified</SelectItem>
                <SelectItem value="proposal">Proposal</SelectItem>
                <SelectItem value="negotiation">Negotiation</SelectItem>
                <SelectItem value="converted">Converted</SelectItem>
                <SelectItem value="lost">Lost</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notes - Mandatory if status changed */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold">
                Add Notes {statusChanged && <span className="text-red-500">*</span>}
              </Label>
              {statusChanged && (
                <span className="text-xs text-red-500">Required</span>
              )}
            </div>
            <Textarea
              placeholder="Add interaction notes, observations, or next steps..."
              className={`min-h-[120px] resize-none ${statusChanged && !editedNotes.trim() ? 'border-red-300 focus:border-red-500' : ''}`}
              value={editedNotes}
              onChange={(e) => {
                setEditedNotes(e.target.value);
                if (e.target.value.trim()) {
                  setShowValidationError(false);
                }
              }}
            />
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Character count: {editedNotes.length}/500
              </p>
              {statusChanged && !editedNotes.trim() && (
                <p className="text-xs text-red-500">Note is required when status changes</p>
              )}
            </div>
          </div>

          {/* Follow-up Date - Mandatory if status changed */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="followup-date" className="text-sm font-semibold">
                Next Follow-up Date {statusChanged && <span className="text-red-500">*</span>}
              </Label>
              {statusChanged && (
                <span className="text-xs text-red-500">Required</span>
              )}
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                id="followup-date"
                type="datetime-local"
                value={editedFollowUpDate}
                onChange={(e) => {
                  setEditedFollowUpDate(e.target.value);
                  if (e.target.value) {
                    setShowValidationError(false);
                  }
                }}
                className={`pl-10 ${statusChanged && !editedFollowUpDate ? 'border-red-300 focus:border-red-500' : ''}`}
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>
            {statusChanged && !editedFollowUpDate && (
              <p className="text-xs text-red-500">Follow-up date is required when status changes</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
            <Button
              className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default LeadDetailModal;
