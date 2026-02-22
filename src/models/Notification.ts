import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User.js';

export interface INotification extends Document {
    userId: mongoose.Types.ObjectId | IUser;
    type: 'assignment' | 'note' | 'system';
    message: string;
    isRead: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const NotificationSchema: Schema<INotification> = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        type: {
            type: String,
            enum: ['assignment', 'note', 'system'],
            default: 'system',
        },
        message: {
            type: String,
            required: true,
        },
        isRead: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

export const Notification = mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);
