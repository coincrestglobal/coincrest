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

const generateEmailTemplate = ({
  heading,
  greeting,
  message,
  buttonText,
  buttonUrl,
}) => {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <style>
        body {
          margin: 0;
          padding: 0;
          background-color: #f4f4f4;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        .container {
          max-width: 600px;
          margin: auto;
          background-color: #ffffff;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }
        h2 {
          text-align: center;
          color: #6a1b9a;
          margin-bottom: 20px;
        }
        p {
          font-size: 16px;
          color: #333;
          line-height: 1.5;
          margin: 10px 0;
        }
        .button-wrapper {
          text-align: center;
          margin: 30px 0;
        }
        .button {
          background-color: #6a1b9a;
          color: white;
          padding: 12px 25px;
          text-decoration: none;
          border-radius: 5px;
          font-size: 16px;
          display: inline-block;
        }
        .footer {
          text-align: center;
          font-size: 14px;
          color: #999;
          margin-top: 40px;
        }
        .footer a {
          color: #6a1b9a;
          text-decoration: none;
        }

        @media only screen and (max-width: 600px) {
          .container {
            padding: 20px;
          }
          .button {
            padding: 10px 20px;
            font-size: 15px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>${heading}</h2>

        ${greeting ? `<p><strong>${greeting}</strong></p>` : ""}

        <p>${message}</p>

        <div class="button-wrapper">
          <a href="${buttonUrl}" class="button">${buttonText}</a>
        </div>

        <div class="footer">
          <p>If you did not request this, please ignore this email.</p>
          <p>${config.companyName}</p>
          <p>Support: <a href="mailto:${config.supportEmail}">${
    config.supportEmail
  }</a></p>
          <p style="font-size: 12px; color: #aaa;">&copy; ${new Date().getFullYear()} ${
    config.companyName
  }. All rights reserved.</p>
        </div>
      </div>
    </body>
  </html>
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
      greeting: options.greeting ? escapeHTML(options.greeting) : "",
      message: escapeHTML(options.message).replace(/\n/g, "<br>"),
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
