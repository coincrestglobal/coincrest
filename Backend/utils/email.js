const nodemailer = require("nodemailer");
const config = require("../config/config");

// Escape text to prevent HTML injection
const escapeHTML = (str) => {
  if (!str) return str;
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const generateEmailTemplate = ({ heading, message, buttonText, buttonUrl }) => {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4; margin: 0;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 8px;">
        
        <!-- Header Section -->
        <h2 style="color: #6a1b9a; text-align: center; font-size: 24px;">${heading}</h2>

        <!-- Main Message Section -->
        <p style="font-size: 16px; color: #555; line-height: 1.6;">${message}</p>
        
        <!-- Button Section -->
        <div style="margin: 30px 0; text-align: center;">
          <a href="${buttonUrl}" 
             style="background-color: #6a1b9a; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-size: 16px; display: inline-block;">
            ${buttonText}
          </a>
        </div>

        <!-- Footer Section with Company Info -->
        <div style="text-align: center; font-size: 14px; color: #999; margin-top: 30px;">
          <p>If you did not request this, please ignore this email.</p>
          <p style="margin: 5px 0;">${config.companyName}</p>
          <p style="margin: 5px 0;">Support: <a href="mailto:${
            config.supportEmail
          }" style="color: #6a1b9a;">${config.supportEmail}</a></p>
          <p style="margin-top: 20px; font-size: 12px; color: #aaa;">&copy; ${new Date().getFullYear()} ${
    config.companyName
  }. All rights reserved.</p>
        </div>

      </div>
    </div>
  `;
};

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: config.emailHost,
    port: config.emailPort,
    auth: {
      user: config.emailUser,
      pass: config.emailPass,
    },
  });

  let html = "";
  if (options.heading && options.buttonText && options.buttonUrl) {
    html = generateEmailTemplate({
      heading: escapeHTML(options.heading),
      message: escapeHTML(options.message),
      buttonText: escapeHTML(options.buttonText),
      buttonUrl: options.buttonUrl,
    });
  } else {
    html = `<p>${escapeHTML(options.message).replace(/\n/g, "<br>")}</p>`;
  }

  const mailOptions = {
    from: `"${config.companyName} Support" <noreply@${config.companyName}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
