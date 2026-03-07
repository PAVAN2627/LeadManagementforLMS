export const sendWelcomeEmail = async (email: string, name: string, password: string, loginUrl: string) => {
    const apiKey = process.env.BREVO_API_KEY;
    if (!apiKey) {
        console.error('BREVO_API_KEY is not set');
        return;
    }

    const payload = {
        sender: { name: process.env.BREVO_SENDER_NAME || 'GauravRawat', email: process.env.BREVO_SENDER_EMAIL || 'itsgauravrawat2005@gmail.com' },
        to: [{ email }],
        subject: 'Your LMS Account',
        htmlContent: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                <div style="background-color: #0f172a; color: white; padding: 20px; text-align: center;">
                    <h2 style="margin: 0; font-size: 24px;">Welcome to LMS!</h2>
                </div>
                <div style="padding: 30px; background-color: #ffffff;">
                    <p style="font-size: 16px; color: #333; margin-bottom: 20px;">Hello <strong>${name}</strong>,</p>
                    <p style="font-size: 16px; color: #555; line-height: 1.5;">Your account has been successfully created by the administrator. Below are your login credentials:</p>
                    
                    <div style="background-color: #f8fafc; padding: 15px; border-left: 4px solid #3b82f6; margin: 25px 0; border-radius: 4px;">
                        <p style="margin: 5px 0; font-size: 15px; color: #333;"><strong>Email:</strong> ${email}</p>
                        <p style="margin: 5px 0; font-size: 15px; color: #333;"><strong>Password:</strong> <span style="font-family: monospace; background: #e2e8f0; padding: 2px 6px; border-radius: 4px; letter-spacing: 1px;">${password}</span></p>
                    </div>

                    <p style="font-size: 16px; color: #555; text-align: center; margin-top: 30px;">
                        <a href="${loginUrl}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Log in to your account</a>
                    </p>
                    
                    <p style="font-size: 14px; color: #888; margin-top: 40px; text-align: center;">
                        If the button doesn't work, copy and paste this link into your browser:<br>
                        <a href="${loginUrl}" style="color: #3b82f6;">${loginUrl}</a>
                    </p>
                </div>
                <div style="background-color: #f1f5f9; padding: 15px; text-align: center; color: #64748b; font-size: 12px;">
                    &copy; ${new Date().getFullYear()} Lead Management System. All rights reserved.
                </div>
            </div>
        `
    };

    try {
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'api-key': apiKey,
                'content-type': 'application/json',
                'accept': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Failed to send Brevo email:', response.status, errorText);
        }
    } catch (e) {
        console.error('Exception sending Brevo email:', e);
    }
};

export const sendFollowUpReminder = async (
    agentEmail: string, 
    agentName: string, 
    leadName: string, 
    leadCompany: string,
    leadEmail: string,
    leadPhone: string,
    followUpDate: Date,
    leadId: string,
    dashboardUrl: string
) => {
    const apiKey = process.env.BREVO_API_KEY;
    if (!apiKey) {
        console.error('BREVO_API_KEY is not set');
        return;
    }

    const formattedDate = new Date(followUpDate).toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    const payload = {
        sender: { 
            name: process.env.BREVO_SENDER_NAME || 'Lead Management System', 
            email: process.env.BREVO_SENDER_EMAIL || 'itsgauravrawat2005@gmail.com' 
        },
        to: [{ email: agentEmail, name: agentName }],
        subject: `📅 Daily Reminder: Follow-up with ${leadName} - ${leadCompany}`,
        htmlContent: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                <div style="background: linear-gradient(135deg, #14b8a6 0%, #0891b2 100%); color: white; padding: 25px; text-align: center;">
                    <h2 style="margin: 0; font-size: 24px;">📅 Daily Follow-up Reminder</h2>
                </div>
                <div style="padding: 30px; background-color: #ffffff;">
                    <p style="font-size: 16px; color: #333; margin-bottom: 20px;">Hello <strong>${agentName}</strong>,</p>
                    <p style="font-size: 16px; color: #555; line-height: 1.5;">You have a scheduled follow-up today with the following lead:</p>
                    
                    <div style="background-color: #f0fdfa; padding: 20px; border-left: 4px solid #14b8a6; margin: 25px 0; border-radius: 4px;">
                        <h3 style="margin: 0 0 15px 0; color: #0f766e; font-size: 18px;">${leadName}</h3>
                        <p style="margin: 8px 0; font-size: 15px; color: #333;"><strong>Company:</strong> ${leadCompany}</p>
                        <p style="margin: 8px 0; font-size: 15px; color: #333;"><strong>Email:</strong> <a href="mailto:${leadEmail}" style="color: #0891b2;">${leadEmail}</a></p>
                        <p style="margin: 8px 0; font-size: 15px; color: #333;"><strong>Phone:</strong> <a href="tel:${leadPhone}" style="color: #0891b2;">${leadPhone}</a></p>
                        <p style="margin: 8px 0; font-size: 15px; color: #333;"><strong>Scheduled:</strong> ${formattedDate}</p>
                    </div>

                    <div style="background-color: #fef3c7; padding: 15px; border-left: 4px solid #f59e0b; margin: 25px 0; border-radius: 4px;">
                        <p style="margin: 0; font-size: 14px; color: #92400e;">
                            <strong>💡 Tip:</strong> Review previous notes and prepare talking points before reaching out.
                        </p>
                    </div>

                    <p style="font-size: 16px; color: #555; text-align: center; margin-top: 30px;">
                        <a href="${dashboardUrl}" style="background: linear-gradient(135deg, #14b8a6 0%, #0891b2 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">View Lead Details</a>
                    </p>
                    
                    <p style="font-size: 14px; color: #888; margin-top: 40px; text-align: center;">
                        If the button doesn't work, copy and paste this link into your browser:<br>
                        <a href="${dashboardUrl}" style="color: #0891b2;">${dashboardUrl}</a>
                    </p>
                </div>
                <div style="background-color: #f1f5f9; padding: 15px; text-align: center; color: #64748b; font-size: 12px;">
                    &copy; ${new Date().getFullYear()} Lead Management System. All rights reserved.
                </div>
            </div>
        `
    };

    try {
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'api-key': apiKey,
                'content-type': 'application/json',
                'accept': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Failed to send follow-up reminder email:', response.status, errorText);
            return false;
        }
        
        console.log(`Follow-up reminder sent to ${agentEmail} for lead ${leadName}`);
        return true;
    } catch (e) {
        console.error('Exception sending follow-up reminder email:', e);
        return false;
    }
};

export const sendEmail = async ({ to, subject, html }: { to: string; subject: string; html: string }) => {
    const apiKey = process.env.BREVO_API_KEY;
    if (!apiKey) {
        console.error('BREVO_API_KEY is not set');
        return;
    }

    const payload = {
        sender: { 
            name: process.env.BREVO_SENDER_NAME || 'Lead Management System', 
            email: process.env.BREVO_SENDER_EMAIL || 'itsgauravrawat2005@gmail.com' 
        },
        to: [{ email: to }],
        subject,
        htmlContent: html
    };

    try {
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'api-key': apiKey,
                'content-type': 'application/json',
                'accept': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Failed to send email:', response.status, errorText);
            return false;
        }
        
        return true;
    } catch (e) {
        console.error('Exception sending email:', e);
        return false;
    }
};
