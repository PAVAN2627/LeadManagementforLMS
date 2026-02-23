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
