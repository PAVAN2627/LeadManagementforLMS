import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';

export interface ILead extends Document {
    name: string;
    email: string;
    phone: string;
    company: string;
    source: string;
    status: "new" | "contacted" | "qualified" | "proposal" | "negotiation" | "converted" | "lost";
    assignedTo: mongoose.Types.ObjectId | IUser;
    date: Date;
    nextFollowUp?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const LeadSchema: Schema<ILead> = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        company: { type: String, required: true },
        source: { type: String, required: true },
        status: {
            type: String,
            enum: ["new", "contacted", "qualified", "proposal", "negotiation", "converted", "lost"],
            default: "new",
        },
        assignedTo: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        date: { type: Date, default: Date.now },
        nextFollowUp: { type: Date },
    },
    {
        timestamps: true,
    }
);

export const Lead = mongoose.models.Lead || mongoose.model<ILead>('Lead', LeadSchema);
