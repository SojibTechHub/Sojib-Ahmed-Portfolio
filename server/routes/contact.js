const express = require('express');
const nodemailer = require('nodemailer');
const { contactRateLimiter } = require('../middleware/rateLimiter');
const Contact = require('../models/Contact');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Input validation helper
const validateContact = (body) => {
  const { name, email, subject, message } = body;
  const errors = [];
  if (!name || name.trim().length < 2) errors.push('Name must be at least 2 characters');
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Valid email is required');
  if (!subject || subject.trim().length < 5) errors.push('Subject must be at least 5 characters');
  if (!message || message.trim().length < 20) errors.push('Message must be at least 20 characters');
  return errors;
};

// POST /api/contact (Public submit)
router.post('/', contactRateLimiter, async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    // Validate
    const errors = validateContact(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: errors[0] });
    }

    // Save to DB
    let savedContact = null;
    try {
      savedContact = await Contact.create({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        subject: subject.trim(),
        message: message.trim(),
        ip: req.ip,
      });
    } catch (dbErr) {
      console.log('DB save skipped:', dbErr.message);
    }

    // Send email notification
    try {
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        await transporter.sendMail({
          from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
          to: process.env.ADMIN_EMAIL || 'sojibahmedshorif998@gmail.com',
          subject: `📬 New Contact: ${subject}`,
          html: `
            <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; background: #0D0D14; color: #F0F0F5; padding: 30px; border-radius: 16px; border: 1px solid rgba(124,58,237,0.3);">
              <h2 style="color: #8B5CF6; margin-bottom: 20px;">New Portfolio Message</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 10px 0; color: #6B7280; font-size: 14px; width: 100px;">Name</td><td style="padding: 10px 0; font-weight: 600;">${name}</td></tr>
                <tr><td style="padding: 10px 0; color: #6B7280; font-size: 14px;">Email</td><td style="padding: 10px 0;"><a href="mailto:${email}" style="color: #06B6D4;">${email}</a></td></tr>
                <tr><td style="padding: 10px 0; color: #6B7280; font-size: 14px;">Subject</td><td style="padding: 10px 0;">${subject}</td></tr>
              </table>
              <div style="margin-top: 20px; padding: 16px; background: rgba(124,58,237,0.1); border-radius: 10px; border-left: 3px solid #7C3AED;">
                <p style="margin: 0; line-height: 1.7;">${message.replace(/\n/g, '<br>')}</p>
              </div>
              <p style="color: #6B7280; font-size: 12px; margin-top: 20px;">Sent from your portfolio contact form · ${new Date().toLocaleString()}</p>
            </div>
          `,
        });

        // Send auto-reply to sender
        await transporter.sendMail({
          from: `"Sojib Ahmed" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: `Re: ${subject} — Got your message! 🚀`,
          html: `
            <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; background: #0D0D14; color: #F0F0F5; padding: 30px; border-radius: 16px;">
              <h2 style="background: linear-gradient(135deg, #7C3AED, #06B6D4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 16px;">Got it, ${name}! 🎉</h2>
              <p style="color: #6B7280; line-height: 1.7;">Thank you for reaching out. I've received your message and will get back to you within <strong style="color: #F0F0F5;">2 hours</strong>.</p>
              <div style="margin-top: 24px; padding: 16px; background: rgba(124,58,237,0.08); border-radius: 10px;">
                <p style="margin: 0; color: #8B5CF6; font-size: 14px;">Your message:</p>
                <p style="margin: 8px 0 0; color: #6B7280; font-size: 14px; line-height: 1.6;">${message}</p>
              </div>
              <p style="color: #6B7280; font-size: 13px; margin-top: 24px;">— Sojib Ahmed<br>Full Stack Developer · Rangpur, Bangladesh</p>
            </div>
          `,
        });
      }
    } catch (emailErr) {
      console.log('Email sending skipped:', emailErr.message);
    }

    res.status(200).json({
      success: true,
      data: savedContact,
      message: "Message received! I'll reply within 2 hours.",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to send message. Please try again.' });
  }
});

// GET /api/contact (Admin only - fetch all messages)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 }).limit(100);
    const unreadCount = await Contact.countDocuments({ isRead: false });
    res.json({ success: true, data: messages, unreadCount, total: messages.length });
  } catch (err) {
    res.json({ success: true, data: [], unreadCount: 0, total: 0 });
  }
});

// PATCH /api/contact/:id/read (Admin only - mark as read/unread)
router.patch('/:id/read', authMiddleware, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ success: false, message: 'Message not found' });

    contact.isRead = !contact.isRead;
    await contact.save();

    res.json({ success: true, data: contact, message: 'Status updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/contact/:id (Admin only - delete message)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deleted = await Contact.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Message not found' });
    res.json({ success: true, message: 'Message deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
