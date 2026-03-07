import { motion } from "framer-motion";
import { Phone, Mail, Building2, Calendar, Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Lead } from "@/components/tables/LeadsTable";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface LeadViewModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
}

const statusColors: Record<string, string> = {
  new: "bg-blue-50 text-blue-700 border border-blue-200",
  contacted: "bg-purple-50 text-purple-700 border border-purple-200",
  qualified: "bg-amber-50 text-amber-700 border border-amber-200",
  proposal: "bg-indigo-50 text-indigo-700 border border-indigo-200",
  negotiation: "bg-orange-50 text-orange-700 border border-orange-200",
  converted: "bg-green-50 text-green-700 border border-green-200",
  lost: "bg-red-50 text-red-700 border border-red-200",
};

export const LeadViewModal = ({
  lead,
  isOpen,
  onClose,
}: LeadViewModalProps) => {
  // Fetch notes for the lead
  const { data: notes = [], isLoading: notesLoading } = useQuery({
    queryKey: ['lead-notes', lead?._id],
    queryFn: () => lead?._id ? api.getLeadNotes(lead._id) : Promise.resolve([]),
    enabled: !!lead?._id && isOpen,
  });

  if (!lead) return null;

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
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Source</p>
                  <Badge variant="outline" className="text-xs mt-1">
                    {lead.source}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Lead Status & Follow-up */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">
              Lead Status & Follow-up
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-muted/30 p-4 rounded-lg">
              <div>
                <Label className="text-xs text-muted-foreground mb-2 block">
                  Current Status
                </Label>
                <Badge className={statusColors[lead.status]}>
                  {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                </Badge>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-2 block">
                  Lead Date
                </Label>
                <p className="text-sm font-medium">{lead.date}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-2 block">
                  Next Follow-up
                </Label>
                {lead.nextFollowUp ? (
                  <p className="text-sm font-medium flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-teal-600" />
                    {new Date(lead.nextFollowUp).toLocaleString()}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">Not scheduled</p>
                )}
              </div>
            </div>
          </div>

          {/* Follow-up History & Notes */}
          {notesLoading ? (
            <div className="text-center py-4 text-muted-foreground">Loading notes...</div>
          ) : notes && notes.length > 0 ? (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Follow-up History & Notes ({notes.length})</h3>
              <div className="max-h-96 overflow-y-auto bg-muted/30 rounded-lg border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 sticky top-0 z-10">
                    <tr className="border-b border-border">
                      <th className="text-left p-3 font-semibold text-xs text-muted-foreground">Date & Time</th>
                      <th className="text-left p-3 font-semibold text-xs text-muted-foreground">Author</th>
                      <th className="text-left p-3 font-semibold text-xs text-muted-foreground">Status</th>
                      <th className="text-left p-3 font-semibold text-xs text-muted-foreground">Notes</th>
                      <th className="text-left p-3 font-semibold text-xs text-muted-foreground">Next Follow-up</th>
                    </tr>
                  </thead>
                  <tbody>
                    {notes.map((note: any, index: number) => (
                      <motion.tr
                        key={note._id || index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-border last:border-b-0 hover:bg-muted/20 transition-colors"
                      >
                        <td className="p-3 align-top">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
                            <Clock className="h-3 w-3 flex-shrink-0" />
                            <span>{new Date(note.createdAt).toLocaleString()}</span>
                          </div>
                        </td>
                        <td className="p-3 align-top">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                              {note.author?.name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
                            </div>
                            <span className="text-xs text-muted-foreground">{note.author?.name || 'Unknown'}</span>
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
                            {note.content}
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
          ) : (
            <div className="text-center py-6 text-muted-foreground bg-muted/20 rounded-lg border border-dashed border-border">
              No follow-up history yet.
            </div>
          )}

          {/* Close Button */}
          <div className="flex justify-end pt-4 border-t border-border">
            <Button onClick={onClose} className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white">
              Close
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default LeadViewModal;
