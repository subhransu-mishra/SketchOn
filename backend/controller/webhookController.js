const { Webhook } = require("svix");
const User = require("../schema/user.js");
const { sendWelcomeEmail } = require("../services/emailService.js");

/**
 * Express handler for Clerk webhook requests.
 * Verifies signatures using Svix, extracts user data,
 * and triggers idempotent welcome emails.
 */
exports.handleClerkWebhook = async (req, res, next) => {
  try {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error("CLERK_WEBHOOK_SECRET is missing from environment variables.");
      return res.status(500).json({
        success: false,
        message: "Server configuration error: Webhook secret is not set.",
      });
    }

    // Get the headers for verification
    const svixId = req.headers["svix-id"];
    const svixTimestamp = req.headers["svix-timestamp"];
    const svixSignature = req.headers["svix-signature"];

    // Ensure all required headers are present
    if (!svixId || !svixTimestamp || !svixSignature) {
      console.warn("Missing Svix headers in webhook request.");
      return res.status(400).json({
        success: false,
        message: "Missing Svix verification headers.",
      });
    }

    // Clerk webhooks send JSON bodies, which we parse raw using express.json({ verify })
    // If rawBody is not present, we fall back to req.body stringification as a safety measure
    const payload = req.rawBody || JSON.stringify(req.body);

    if (!payload) {
      console.warn("Empty request body received in Clerk webhook.");
      return res.status(400).json({
        success: false,
        message: "Empty payload.",
      });
    }

    // Verify signature using Svix Webhook client
    const wh = new Webhook(webhookSecret);
    let evt;

    try {
      evt = wh.verify(payload, {
        "svix-id": svixId,
        "svix-timestamp": svixTimestamp,
        "svix-signature": svixSignature,
      });
    } catch (err) {
      console.error("Svix webhook signature verification failed:", err.message);
      return res.status(400).json({
        success: false,
        message: "Invalid webhook signature.",
      });
    }

    const { type: eventType, data } = evt;
    console.log(`Clerk webhook received. Event type: ${eventType}`);

    // We only process user.created events
    if (eventType !== "user.created") {
      return res.status(200).json({
        success: true,
        message: `Event type "${eventType}" acknowledged but not processed.`,
      });
    }

    // Extract user parameters from event payload
    const { id, first_name, last_name, email_addresses, primary_email_address_id } = data;

    // Find primary email
    const primaryEmailObj =
      email_addresses.find((email) => email.id === primary_email_address_id) ||
      email_addresses[0];
    
    const emailAddress = primaryEmailObj ? primaryEmailObj.email_address : null;

    if (!emailAddress) {
      console.warn(`No email address found for created user: ${id}`);
    }

    // Query database for existing user record
    let user = await User.findOne({ clerkUserId: id });

    // Handle duplicate prevention and idempotence
    if (user && user.welcomeEmailSent) {
      console.log(`Welcome email already sent for user: ${id}. Request ignored.`);
      return res.status(200).json({
        success: true,
        message: "Duplicate request. Welcome email has already been sent for this user.",
      });
    }

    // Create user in DB if they do not exist
    if (!user) {
      user = new User({
        clerkUserId: id,
        email: emailAddress,
        firstName: first_name,
        lastName: last_name,
        welcomeEmailSent: false,
        credits: 10,
        isSubscribed: false,
        plan: "basic",
      });
      await user.save();
      console.log(`Saved new user record to MongoDB: ${id}`);
    } else {
      // If user exists but email not sent, sync missing details
      user.email = emailAddress || user.email;
      user.firstName = first_name || user.firstName;
      user.lastName = last_name || user.lastName;
      await user.save();
    }

    // Attempt to send welcome email
    if (emailAddress) {
      try {
        await sendWelcomeEmail(emailAddress, first_name);
        
        // Mark as sent upon success to prevent duplicate sends
        user.welcomeEmailSent = true;
        await user.save();
        
        console.log(`Marked welcomeEmailSent as true for user: ${id}`);
      } catch (emailError) {
        console.error(`Error sending welcome email for user ${id}:`, emailError);
        
        // Return 500 error code so Clerk will retry the webhook delivery
        return res.status(500).json({
          success: false,
          message: "Failed to send welcome email. Retrying event is recommended.",
          error: emailError.message,
        });
      }
    } else {
      console.warn(`Skipping welcome email for user ${id} due to missing email address.`);
    }

    return res.status(200).json({
      success: true,
      message: "Webhook processed and welcome email sent.",
    });
  } catch (error) {
    console.error("General error handling Clerk webhook:", error);
    next(error);
  }
};
