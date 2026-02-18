
import mongoose from 'mongoose';
import User, { UserRole } from '../src/models/User';
import { Lead } from '../src/models/Lead';
import { Note } from '../src/models/Note';
import { hashPassword } from '../src/lib/auth-utils';
import { mockUsers, mockLeads, mockActivities } from '../src/data/mockData';

// DB Connection
import 'dotenv/config';
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('Missing MONGODB_URI environment variable');
    process.exit(1);
}

async function seed() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI as string);
        console.log('Connected!');

        // Clear existing data
        console.log('Clearing existing data...');
        await User.deleteMany({});
        await Lead.deleteMany({});
        await Note.deleteMany({});

        // Seed Users
        console.log('Seeding Users...');
        const userMap = new Map<string, any>(); // Map Name -> User Document

        const adminPasswordHash = await hashPassword('password123'); // Default password
        const userPasswordHash = await hashPassword('password123');

        for (const mockUser of mockUsers) {
            const user = await User.create({
                name: mockUser.name,
                email: mockUser.email,
                passwordHash: mockUser.role === 'Admin' ? adminPasswordHash : userPasswordHash, // Use hashed password
                role: mockUser.role.toLowerCase(), // Convert 'Admin' -> 'admin'
                status: mockUser.status.toLowerCase(), // Convert 'Active' -> 'active'
            });
            userMap.set(user.name, user);
            console.log(`Created user: ${user.name}`);
        }

        // Seed Leads
        console.log('Seeding Leads...');
        const leadMap = new Map<string, any>(); // Map Lead Name -> Lead Document

        for (const mockLead of mockLeads) {
            // Find assigned agent
            const agent = userMap.get(mockLead.assignedAgent);

            if (!agent) {
                console.warn(`Agent '${mockLead.assignedAgent}' not found for lead '${mockLead.name}'. Skipping assignment.`);
                continue; // Or assign to a default admin
            }

            const lead = await Lead.create({
                name: mockLead.name,
                email: mockLead.email,
                phone: mockLead.phone,
                company: mockLead.company,
                source: mockLead.source,
                status: mockLead.status,
                assignedTo: agent._id,
                date: new Date(mockLead.date),
                nextFollowUp: mockLead.nextFollowUp ? new Date(mockLead.nextFollowUp) : undefined,
            });
            leadMap.set(lead.name, lead);
            console.log(`Created lead: ${lead.name}`);
        }

        // Seed Notes (from activities where type is 'note')
        console.log('Seeding Notes...');
        const notes = mockActivities.filter(a => a.type === 'note');

        // We need to associate notes with leads. 
        // START_HEURISTIC: The mock data message often contains the lead name "Updated contact info for Alex Thompson"
        // We will try to extract lead name from message or just assign randomly/evenly for demo purposes if not found.
        // Actually, looking at mockActivities, they have descriptive messages. Let's try to match names.

        for (const activity of notes) {
            let linkedLead = null;
            let linkedUser = null;

            // Try to find lead name in message
            for (const [leadName, leadDoc] of leadMap.entries()) {
                if (activity.message.includes(leadName)) {
                    linkedLead = leadDoc;
                    break;
                }
            }

            // If no lead found in message, pick the first one for demo purposes, or skip
            if (!linkedLead) {
                // For demo completeness, let's just pick one or skip. 
                // Let's skip to be safe/accurate, or maybe assign to the most recently created lead?
                console.log(`Could not match lead for note: "${activity.message}" - Skipping`);
                continue;
            }

            // Assign author - mockActivities doesn't have author. Assign to the lead's assigned agent.
            linkedUser = await User.findById(linkedLead.assignedTo);

            if (linkedLead && linkedUser) {
                await Note.create({
                    content: activity.message,
                    lead: linkedLead._id,
                    author: linkedUser._id,
                    createdAt: new Date(), // Or parse 'time' if possible ("2 days ago" is hard to parse without library)
                });
                console.log(`Created note for lead: ${linkedLead.name}`);
            }
        }

        console.log('Seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
}

seed();
