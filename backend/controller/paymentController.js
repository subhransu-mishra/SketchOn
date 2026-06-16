const Razorpay = require("razorpay");
const crypto = require("crypto");
const Transaction = require("../schema/transaction.js");
const User = require("../schema/user.js");

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = async (req, res) => {
  try {
    const clerkUserId = req.clerkUserId;
    const { planId, isAnnual } = req.body;

    if (!planId) {
      return res.status(400).json({ success: false, message: "Missing details" });
    }

    const user = await User.findOne({ clerkUserId });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const plans = {
      starter: { amount: 14900, credits: 200 }, // 149 INR = 14900 paise
      professional: { amount: 59900, credits: 10000 }, // 599 INR = 59900 paise
    };

    let amount = plans[planId]?.amount;
    if (!amount) {
      return res.status(400).json({ success: false, message: "Invalid plan" });
    }

    if (isAnnual) {
        amount = Math.round(amount * 0.8 * 12);
    }

    const options = {
      amount: amount,
      currency: process.env.CURRENCY || "INR",
      receipt: `rcpt_${user._id.toString().substring(0, 8)}_${Date.now()}`.substring(0, 40),
    };

    const order = await razorpayInstance.orders.create(options);

    if (!order) {
      return res.status(500).json({ success: false, message: "Failed to create Razorpay order" });
    }

    // Save transaction
    const transaction = new Transaction({
      userId: user._id,
      clerkUserId: clerkUserId,
      planId: planId,
      amount: amount,
      razorpayOrderId: order.id,
      status: "created",
    });

    await transaction.save();

    res.status(200).json({
      success: true,
      data: {
        order,
        plan: planId,
      },
    });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ success: false, message: "Error creating order", error: error.message });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planId } = req.body;
    const clerkUserId = req.clerkUserId;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: "Missing payment details" });
    }

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // Valid signature
      const transaction = await Transaction.findOne({ razorpayOrderId: razorpay_order_id });
      if (!transaction) {
         return res.status(404).json({ success: false, message: "Transaction not found" });
      }

      transaction.status = "success";
      transaction.razorpayPaymentId = razorpay_payment_id;
      transaction.razorpaySignature = razorpay_signature;
      await transaction.save();

      // Update user subscription
      const user = await User.findOne({ clerkUserId });
      if (user) {
        user.isSubscribed = true;
        user.plan = planId;
        
        // Update credits based on plan
        if (planId === "starter") {
          user.credits += 200;
        } else if (planId === "professional") {
          user.credits += 10000; 
        }
        await user.save();
      }

      return res.status(200).json({ success: true, message: "Payment verified successfully" });
    } else {
      // Invalid signature
      const transaction = await Transaction.findOne({ razorpayOrderId: razorpay_order_id });
      if (transaction) {
         transaction.status = "failed";
         await transaction.save();
      }
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }
  } catch (error) {
    console.error("Verify payment error:", error);
    res.status(500).json({ success: false, message: "Error verifying payment", error: error.message });
  }
};
