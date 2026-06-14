const User = require("../schema/user.js");

// Get or create user profile
exports.getUserProfile = async (req, res) => {
  try {
    const clerkUserId = req.clerkUserId;
    if (!clerkUserId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    let user = await User.findOne({ clerkUserId });

    // If user does not exist in our database, create them (auto signup initialization)
    if (!user) {
      user = new User({
        clerkUserId,
        credits: 10,
        isSubscribed: false,
        plan: "basic",
      });
      await user.save();
      console.log(`Created new DB record for Clerk User: ${clerkUserId} with 10 credits`);
    }

    res.json({
      success: true,
      data: {
        clerkUserId: user.clerkUserId,
        credits: user.credits,
        isSubscribed: user.isSubscribed,
        plan: user.plan,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Get user profile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user profile",
      error: error.message,
    });
  }
};

// Add test credits (Testing Utility)
exports.addTestCredits = async (req, res) => {
  try {
    const clerkUserId = req.clerkUserId;
    const amount = parseInt(req.body.amount) || 10;

    let user = await User.findOne({ clerkUserId });

    if (!user) {
      user = new User({
        clerkUserId,
        credits: 10,
        isSubscribed: false,
        plan: "basic",
      });
    }

    user.credits += amount;
    await user.save();

    res.json({
      success: true,
      message: `Successfully added ${amount} credits`,
      data: {
        credits: user.credits,
        isSubscribed: user.isSubscribed,
        plan: user.plan,
      },
    });
  } catch (error) {
    console.error("Add test credits error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add credits",
      error: error.message,
    });
  }
};

// Mock subscribe or toggle subscription (Testing Utility)
exports.toggleSubscription = async (req, res) => {
  try {
    const clerkUserId = req.clerkUserId;
    const { plan, isSubscribed } = req.body;

    let user = await User.findOne({ clerkUserId });

    if (!user) {
      user = new User({
        clerkUserId,
        credits: 10,
        isSubscribed: false,
        plan: "basic",
      });
    }

    // Toggle or set subscription details
    if (isSubscribed !== undefined) {
      user.isSubscribed = isSubscribed;
    } else {
      user.isSubscribed = !user.isSubscribed;
    }

    if (plan) {
      user.plan = plan;
    } else {
      user.plan = user.isSubscribed ? "pro" : "basic";
    }

    // Give bonus credits when subscribing to Pro
    if (user.isSubscribed && user.plan === "pro") {
      user.credits += 50;
    }

    await user.save();

    res.json({
      success: true,
      message: `Subscription plan updated to: ${user.plan}`,
      data: {
        credits: user.credits,
        isSubscribed: user.isSubscribed,
        plan: user.plan,
      },
    });
  } catch (error) {
    console.error("Toggle subscription error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update subscription status",
      error: error.message,
    });
  }
};
