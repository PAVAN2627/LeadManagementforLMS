import mongoose, { Schema, Document } from 'mongoose';
import { ILead } from './Lead.js';
import { IUser } from './User.js';

export interface INote extends Document {
    content: string;
    lead: mongoose.Types.ObjectId | ILead;
    author: mongoose.Types.ObjectId | IUser;
    createdAt: Date;
    updatedAt: Date;
}

const NoteSchema: Schema<INote> = new Schema(
    {
        content: { type: String, required: true },
        lead: {
            type: Schema.Types.ObjectId,
            ref: 'Lead',
            required: true,
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export const Note = mongoose.models.Note || mongoose.model<INote>('Note', NoteSchema);
