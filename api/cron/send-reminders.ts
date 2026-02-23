import type { VercelRequest, VercelResponse } from '@vercel/node';
import dbConnect from '../../src/lib/db.js';
import { Lead } from '../../src/models/Lead.js';
import { sendFollowUpReminder } from '../../src/lib/email.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Only allow GET requests (for cron jobs)
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    // Verify cron secret to prevent unauthorized access
    const cronSecret = req.headers['x-cron-secret'] || req.query.secret;
    if (cronSecret !== process.env.CRON_SECRET) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        await dbConnect();

        // Get current time and time 1 hour from now
        const now = new Date();
        const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

        // Find leads with follow-ups due in the next hour that haven't been reminded yet
        const leadsToRemind = await Lead.find({
            nextFollowUp: {
                $gte: now,
                $lte: oneHourFromNow
            },
            // Only active leads (not converted or lost)
            status: { $nin: ['converted', 'lost'] }
        }).populate('assignedTo', 'name email');

        console.log(`Found ${leadsToRemind.length} leads with upcoming follow-ups`);

        const results = {
            total: leadsToRemind.length,
            sent: 0,
            failed: 0,
            errors: [] as string[]
        };

        // Send reminder emails
        for (const lead of leadsToRemind) {
            if (!lead.assignedTo || typeof lead.assignedTo === 'string') {
                console.log(`Skipping lead ${lead._id}: No assigned agent`);
                results.failed++;
                results.errors.push(`Lead ${lead.name}: No assigned agent`);
                continue;
            }

            const agent = lead.assignedTo as any;
            
            if (!agent.email) {
                console.log(`Skipping lead ${lead._id}: Agent has no email`);
                results.failed++;
                results.errors.push(`Lead ${lead.name}: Agent has no email`);
                continue;
            }

            try {
                const dashboardUrl = process.env.FRONTEND_URL || 'https://lead-managementfor-lms-peach.vercel.app';
                
                const success = await sendFollowUpReminder(
                    agent.email,
                    agent.name,
                    lead.name,
                    lead.company,
                    lead.email,
                    lead.phone,
                    lead.nextFollowUp!,
                    lead._id.toString(),
                    `${dashboardUrl}/agent/leads`
                );

                if (success) {
                    results.sent++;
                } else {
                    results.failed++;
                    results.errors.push(`Lead ${lead.name}: Email send failed`);
                }
            } catch (error: any) {
                console.error(`Error sending reminder for lead ${lead._id}:`, error);
                results.failed++;
                results.errors.push(`Lead ${lead.name}: ${error.message}`);
            }
        }

        return res.status(200).json({
            message: 'Reminder emails processed',
            timestamp: new Date().toISOString(),
            results
        });

    } catch (error: any) {
        console.error('Error in send-reminders cron:', error);
        return res.status(500).json({ 
            message: 'Internal Server Error',
            error: error.message 
        });
    }
}
