const fs = require("fs").promises;
const path = require("path");
const { Resend } = require("resend");

// Initialize Resend with the API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Sends a welcome email to a newly registered user using Resend.
 * @param {string} email - Recipient's email address
 * @param {string} firstName - User's first name
 * @returns {Promise<object>} Resend send result
 */
async function sendWelcomeEmail(email, firstName) {
  try {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured in environment variables.");
    }

    // Load the HTML email template
    const templatePath = path.join(__dirname, "../templates/welcomeEmail.html");
    let htmlContent = await fs.readFile(templatePath, "utf8");

    // Replace placeholders
    const appUrl = process.env.APP_URL || "http://localhost:5173";
    const dashboardUrl = `${appUrl}/dashboard`;
    
    htmlContent = htmlContent
      .replace(/\{\{firstName\}\}/g, firstName || "there")
      .replace(/\{\{dashboardUrl\}\}/g, dashboardUrl);

    // Send the email via Resend
    // By default, Resend testing uses onboarding@resend.dev
    // If a custom domain is verified, it can be set in environment variables
    const fromAddress = process.env.EMAIL_FROM || "SketchOn <onboarding@resend.dev>";

    console.log(`Sending welcome email to ${email}...`);
    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to: email,
      subject: "Welcome to SketchOn! 🎨",
      html: htmlContent,
    });

    if (error) {
      console.error(`Resend API error sending welcome email to ${email}:`, error);
      throw new Error(`Resend email sending failed: ${error.message}`);
    }

    console.log(`Welcome email successfully sent to ${email}. ID: ${data?.id}`);
    return data;
  } catch (error) {
    console.error(`Failed to send welcome email to ${email}:`, error);
    throw error;
  }
}

module.exports = {
  sendWelcomeEmail,
};
