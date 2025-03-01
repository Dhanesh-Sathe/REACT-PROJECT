const nodemailer = require('nodemailer');
const Team = require('../models/HackathonRegistrationModel');

// Registration endpoint
const HackathonRegistration = async (req, res) => {
    try {
        const { leader, teamMembers, teamSize, teamName, paymentScreenshot } = req.body;

        // Validate required fields
        if (!leader || !teamMembers || !teamSize || !teamName || !paymentScreenshot) {
            return res.status(400).json({
                message: 'Missing required information. Please ensure all fields including payment are filled.'
            });
        }

        // Check if team name already exists
        const existingTeam = await Team.findOne({ teamName });
        if (existingTeam) {
            return res.status(400).json({
                message: 'Team name already exists. Please choose a different name.'
            });
        }

        // Create and save the team document
        const team = new Team({
            teamSize,
            teamName,
            leader,
            teamMembers,
            paymentScreenshot,
            registrationStatus: 'pending'
        });

        const savedTeam = await team.save();

        // Send confirmation email with WhatsApp link
        await sendWhatsAppLink(leader.email, leader, teamMembers, teamName, teamSize);

        res.status(201).json({
            message: 'Team registered successfully. Your registration is pending verification.',
            teamId: savedTeam._id
        });

    } catch (error) {
        console.error('Registration error:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: 'Validation error. Please check all required fields.'
            });
        }
        res.status(500).json({ message: 'Server error during registration' });
    }
};

// Function to send email with WhatsApp link
const sendWhatsAppLink = async (email, leader, teamMembers, teamName, teamSize) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            }
        });

        // WhatsApp Group Link (Replace with actual link)
        const whatsappGroupLink = "https://chat.whatsapp.com/ETJwyyrr9ugCsRqHHmrp8F";

        // Generate team members' details
        const membersList = teamMembers.map((member, index) => 
            `<tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: left;">
                    <strong>Member ${index + 1}:</strong> ${member.firstName} ${member.lastName} 
                    (<a href="mailto:${member.email}" style="color: #007bff; text-decoration: none;">${member.email}</a>)
                </td>
            </tr>`
        ).join('');

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: '🎉 Hackathon Registration Successful!',
            html: `
                <div style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px; text-align: center;">
                    <div style="background: #ffffff; padding: 30px; border-radius: 10px; max-width: 600px; margin: auto; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
                        <h2 style="color: #2c3e50;">✅ Hackathon Registration Successful!</h2>
                        <p style="font-size: 16px; color: #555;">Dear <strong>${leader.firstName} ${leader.lastName}</strong>,</p>
                        <p style="font-size: 16px; color: #555;">Congratulations! Your team <strong style="color: #27ae60;">${teamName}</strong> has been successfully registered for the hackathon.</p>
                        
                        <hr style="border: 1px solid #ddd;">

                        <h3 style="color: #e67e22;">📢 Join WhatsApp Group:</h3>
                        <p>Stay updated with important announcements. Click below to join our WhatsApp group:</p>
                        <a href="${whatsappGroupLink}" 
                           style="display: inline-block; background: #27ae60; color: white; padding: 12px 20px; text-decoration: none; font-size: 16px; font-weight: bold; border-radius: 5px;">
                            👉 Join WhatsApp Group
                        </a>

                        <hr style="border: 1px solid #ddd;">

                        <h3 style="color: #34495e;">🔹 Team Details:</h3>
                        <div style="background: #ecf0f1; padding: 15px; border-radius: 8px; text-align: left;">
                            <p><strong>🏆 Team Name:</strong> <span style="color: #3498db;">${teamName}</span></p>
                            <p><strong>👥 Team Size:</strong> <span style="color: #e74c3c; font-size: 18px;">${teamSize}</span></p>
                        </div>

                        <h3 style="color: #34495e;">👤 Leader Details:</h3>
                        <div style="background: #f9e79f; padding: 15px; border-radius: 8px; text-align: left;">
                            <p><strong>📌 Name:</strong> ${leader.firstName} ${leader.lastName}</p>
                            <p><strong>✉ Email:</strong> <a href="mailto:${leader.email}" style="color: #007bff; text-decoration: none;">${leader.email}</a></p>
                            <p><strong>🏛 Institute:</strong> ${leader.instituteName}</p>
                        </div>

                        <h3 style="color: #34495e;">👥 Team Members:</h3>
                        <table style="width: 100%; border-collapse: collapse; background: #d4efdf; border-radius: 8px;">
                            ${membersList}
                        </table>

                        <hr style="border: 1px solid #ddd;">

                    
                        <br><br>
                        <p style="font-size: 14px; color: #777;">Best Regards,<br><strong>Hackathon Team</strong></p>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`Confirmation email sent to ${email}`);

    } catch (error) {
        console.error('Error sending email:', error);
    }
};


module.exports = HackathonRegistration;
