import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";


export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // 1. Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // 2. Generate secure reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // 3. Save token + expiry in DB (1 hour)
    user.resetToken = resetToken;
    user.resetTokenExpiration = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save();

    // 4. Reset URL
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    // 5. Email content
    const message = `
      <h2>Password Reset Request</h2>
      <p>You requested a password reset. Click the link below:</p>
      <a href="${resetUrl}" target="_blank">${resetUrl}</a>
      <p>This link will expire in <b>1 hour</b>.</p>
    `;

    // 6. Send email
    await sendEmail(user.email, "Password Reset", message);

    res.status(200).json({ message: "Reset email sent" });
  } catch (err) {
    console.error("ForgotPassword Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc    Reset Password - Update password with token
 * @route   POST /api/auth/reset-password/:token
 * @access  Public
 */
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    // 1. Check if valid token
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() }, // token not expired
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // 2. Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Update user password & clear token
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("ResetPassword Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
