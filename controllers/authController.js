import bcrypt from 'bcryptjs';
import crypto from 'crypto';

import User from '../models/User.js';
import sendEmail from '../utils/sendEmail.js';


export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
  
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found. Please check your email.' });
    }


    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetToken = resetToken;
    user.resetTokenExpiration = Date.now() + 3600000; // valid for 1 hour
    await user.save();

   
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    const message = `
      <p>Hello ${user.name || ''},</p>
      <p>You requested a password reset.</p>
      <p>Click this <a href="${resetUrl}">link</a> to reset your password.</p>
      <p>This link will expire in 1 hour.</p>
    `;

    // Send email
    await sendEmail(user.email, 'Password Reset Request', message);

    res.json({ message: 'Password reset email has been sent.' });
  } catch (err) {
    console.error('ForgotPassword Error:', err);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

// ==================== Reset Password ====================
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    // Find user with valid reset token
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token.' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;

    // Clear reset token
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;

    await user.save();

    res.json({ message: 'Password updated successfully. You can now log in.' });
  } catch (err) {
    console.error('ResetPassword Error:', err);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};
