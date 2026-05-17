import nodemailer from 'nodemailer';
import { logInfo, logError } from '../logs/logger.js';
import dotenv from 'dotenv';
dotenv.config();

export async function sendNewsletterEmail(subject, htmlContent, recipients) {
    try {
        // Create reusable transporter object using SMTP
        let transporter = nodemailer.createTransport({
            service: 'gmail', // Change if using Outlook/Yahoo
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS // App Password, NOT standard password
            }
        });

        // Send mail to the array of recipients
        let info = await transporter.sendMail({
            from: `"AI Newsletter Agent" <${process.env.EMAIL_USER}>`,
            to: recipients.join(', '),
            subject: subject,
            html: htmlContent
        });

        logInfo(`Email sent successfully: ${info.messageId}`);
        return true;
    } catch (error) {
        logError(`Failed to send email: ${error.message}`);
        return false;
    }
}
