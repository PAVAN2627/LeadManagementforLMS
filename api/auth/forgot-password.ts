import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectDB } from '../../src/lib/db';
import User from '../../src/models/User';
import { sendEmail } from '../../src/lib/email';
import { hashPassword } from '../../src/lib/auth-utils';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Don't reveal if user exists or not for security
      return res.status(200).json({ message: 'If an account exists with this email, a password reset link has been sent.' });
    }

    // Generate temporary password
    const tempPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8).toUpperCase();
    
    // Hash and save temporary password
    user.password = await hashPassword(tempPassword);
    await user.save();

    // Send email with temporary password
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1F8A98;">Password Reset Request</h2>
        <p>Hello ${user.name},</p>
        <p>We received a request to reset your password. Your temporary password is:</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <code style="font-size: 18px; font-weight: bold; color: #333;">${tempPassword}</code>
        </div>
        <p><strong>Important:</strong> Please log in with this temporary password and change it immediately in your profile settings.</p>
        <p>If you didn't request this password reset, please contact support immediately.</p>
        <p>Login here: <a href="https://lead-managementfor-lms.vercel.app/login">https://lead-managementfor-lms.vercel.app/login</a></p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
        <p style="color: #666; font-size: 12px;">This is an automated email. Please do not reply.</p>
      </div>
    `;

    await sendEmail({
      to: user.email,
      subject: 'Password Reset - Athenura Lead Management',
      html: emailHtml
    });

    res.status(200).json({ message: 'If an account exists with this email, a password reset link has been sent.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
