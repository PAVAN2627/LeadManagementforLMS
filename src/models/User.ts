import mongoose, { Schema, Document, Model } from 'mongoose';

export enum UserRole {
    ADMIN = 'admin',
    MANAGER = 'manager',
    AGENT = 'agent',
}

export type UserRoleType = 'admin' | 'manager' | 'agent';

// Define Interface
export interface IUser extends Document {
    name: string;
    email: string;
    passwordHash: string;
    role: UserRoleType;
    status: 'active' | 'inactive';
    phone?: string;
    company?: string;
    bio?: string;
    department?: string;
    avatar?: string;
    location?: string;
    settings?: any;
      adminSecretKey?: string;
    createdAt: Date;
    updatedAt: Date;
}

// Define Schema
const UserSchema: Schema<IUser> = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide a name'],
            trim: true,
            maxlength: [60, 'Name cannot be more than 60 characters'],
        },
        email: {
            type: String,
            required: [true, 'Please provide an email'],
            unique: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please provide a valid email',
            ],
        },
        passwordHash: {
            type: String,
            required: [true, 'Please provide a password'],
            select: false, // Do not return password by default
        },
        role: {
            type: String,
            enum: Object.values(UserRole),
            default: UserRole.AGENT,
        },
        status: {
            type: String,
            enum: ['active', 'inactive'],
            default: 'active',
        },
        phone: String,
        company: String,
        bio: String,
        department: String,
        avatar: String,
        location: String,
        settings: Object,
         adminSecretKey: {
            type: String,
            select: false, 
        },
    },
    {
        timestamps: true,
    }
);

// Prevent overwriting model if already compiled
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
