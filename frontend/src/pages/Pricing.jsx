import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCheck,
  FiArrowRight,
  FiCreditCard,
  FiSmartphone,
  FiLock,
  FiArrowLeft,
  FiZap,
  FiStar,
  FiCpu,
  FiActivity,
  FiCheckCircle,
} from "react-icons/fi";
import { useDiagramService } from "../services/diagramService";
import { toast } from "react-toastify";
import StarBorder from "../components/StarBorder";

const Pricing = () => {
  const navigate = useNavigate();
  const { diagramService, isReady, isSignedIn, user } = useDiagramService();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isAnnual, setIsAnnual] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card"); // "card" or "upi"
  const [paymentStep, setPaymentStep] = useState("pricing"); // "pricing", "checkout", "processing", "success"
  const [sandboxLoading, setSandboxLoading] = useState(false);
  const [dbUser, setDbUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (isSignedIn && isReady) {
        try {
          const profile = await diagramService.getUserProfile();
          setDbUser(profile.data);
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
        }
      }
    };
    fetchProfile();
  }, [isSignedIn, isReady, diagramService]);
  
  // Load Razorpay script
  useEffect(() => {
    const loadRazorpay = () => {
      if (document.getElementById('razorpay-checkout-script')) {
        return;
      }
      const script = document.createElement('script');
      script.id = 'razorpay-checkout-script';
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
    };
    loadRazorpay();
  }, []);

  const plans = [
    {
      id: "free",
      name: "Free",
      price: 0,
      priceLabel: "₹0",
      subtext: "Start sketching your ideas",
      icon: FiStar,
      color: "from-blue-500/20 to-cyan-500/20",
      borderColor: "border-white/10 hover:border-blue-500/30",
      glowColor: "rgba(59, 130, 246, 0.15)",
      features: [
        "3 Projects",
        "Basic Canvas",
        "Limited Icons",
        "10 AI Credits/month",
        "Gemini Flash only",
        "Community Support"
      ],
      actionLabel: "Get Started",
      isPremium: false,
    },
    {
      id: "starter",
      name: "Starter",
      price: 149,
      priceLabel: "₹149",
      subtext: "For Interview Preparation",
      icon: FiZap,
      color: "from-blue-600/20 to-indigo-600/20",
      borderColor: "border-blue-500/40 hover:border-indigo-400",
      glowColor: "rgba(59, 130, 246, 0.05)",
      popular: true,
      features: [
        "20 Projects",
        "All Icons",
        "200 AI Credits/month",
        "AI Architecture Review",
        "Security Suggestions",
        "Scalability Suggestions",
        "Export PNG",
        "Share Project Link",
        "System Design Templates"
      ],
      actionLabel: "Upgrade to Starter",
      isPremium: true,
    },
    {
      id: "professional",
      name: "Professional",
      price: 599,
      priceLabel: "₹599",
      subtext: "For Serious Engineers",
      icon: FiCpu,
      color: "from-amber-500/20 to-rose-500/20",
      borderColor: "border-amber-500/30 hover:border-amber-400",
      glowColor: "rgba(245, 158, 11, 0.25)",
      features: [
        "Unlimited Projects",
        "Unlimited Icons",
        "Unlimited AI Credits",
        "Multiple Models",
        "Deep Architecture Review",
        "AI Documentation Generation",
        "PDF Export",
        "Version History",
        "Priority Processing",
        "Early Access Features"
      ],
      actionLabel: "Get Professional",
      isPremium: true,
    }
  ];

  const handleSelectPlan = async (plan) => {
    if (plan.id === "free") {
      navigate("/dashboard");
      return;
    }
    
    if (!isSignedIn || !isReady) {
      toast.error("Please sign in to upgrade");
      return;
    }

    setSelectedPlan(plan);
    setPaymentStep("processing");

    try {
      // Create order via backend
      const response = await diagramService.createRazorpayOrder(plan.id, isAnnual);
      if (!response.success) {
        throw new Error(response.message || "Failed to create order");
      }

      const { order } = response.data;

      // Initialize Razorpay
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "SketchOn",
        description: `Upgrade to ${plan.name} Plan`,
        image: "/logo.png",
        order_id: order.id,
        handler: async function (paymentResponse) {
          try {
            setPaymentStep("processing");
            const verifyRes = await diagramService.verifyRazorpayPayment({
              razorpay_order_id: paymentResponse.razorpay_order_id,
              razorpay_payment_id: paymentResponse.razorpay_payment_id,
              razorpay_signature: paymentResponse.razorpay_signature,
              planId: plan.id
            });

            if (verifyRes.success) {
              toast.success(`Successfully upgraded to ${plan.name}!`);
              setPaymentStep("success");
            } else {
              throw new Error("Payment verification failed");
            }
          } catch (error) {
            console.error("Verification error:", error);
            toast.error("Payment verification failed. Contact support if amount was deducted.");
            setPaymentStep("pricing");
          }
        },
        prefill: {
          name: "",
          email: "",
          contact: ""
        },
        theme: {
          color: "#4f46e5"
        },
        modal: {
          ondismiss: function() {
            setPaymentStep("pricing");
            toast.info("Payment cancelled");
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response){
        toast.error(`Payment failed: ${response.error.description}`);
        setPaymentStep("pricing");
      });
      rzp.open();
    } catch (error) {
      console.error("Order creation error:", error);
      toast.error(error.message || "Failed to initialize payment");
      setPaymentStep("pricing");
    }
  };

  // Inline Confetti implementation using pure CSS/SVG inside Framer Motion
  const Confetti = () => {
    const colors = ["#818CF8", "#F59E0B", "#10B981", "#EF4444", "#EC4899", "#3B82F6"];
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-50">
        {[...Array(50)].map((_, i) => {
          const size = Math.random() * 8 + 4;
          const left = Math.random() * 100;
          const delay = Math.random() * 2;
          const duration = Math.random() * 3 + 2;
          const color = colors[Math.floor(Math.random() * colors.length)];
          
          return (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: size,
                height: size,
                backgroundColor: color,
                left: `${left}%`,
                top: `-5%`,
              }}
              animate={{
                y: ["0vh", "105vh"],
                x: ["0px", `${Math.random() * 80 - 40}px`],
                rotate: [0, Math.random() * 360],
              }}
              transition={{
                duration,
                repeat: Infinity,
                delay,
                ease: "linear",
              }}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white antialiased relative overflow-x-hidden selection:bg-indigo-500/30">
      
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] rounded-full bg-purple-500/5 blur-[150px] pointer-events-none" />

      {/* Header */}
      <header className="border-b border-white/5 bg-neutral-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Sketch On Logo"
              className="h-9 w-9 rounded-lg"
            />
            <div>
              <p className="text-xl font-semibold bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
                Sketch On
              </p>
              <p className="text-[10px] uppercase tracking-[0.35em] text-white/50">
                Premium Plans
              </p>
            </div>
          </div>
          <Link
            to="/"
            className="text-sm text-white/60 hover:text-white transition-colors flex items-center gap-1.5"
          >
            <FiArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-73px)]">
        <AnimatePresence mode="wait">
          {paymentStep === "pricing" && (
            <motion.div
              key="pricing-step"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              {/* Hero header */}
              <div className="text-center max-w-3xl mx-auto mb-16">
                <motion.div 
                  className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-1 text-xs font-semibold text-indigo-300 mb-6"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <FiZap className="h-3 w-3 animate-pulse" /> Let's design your idea
                </motion.div>
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl mb-6 bg-gradient-to-b from-white via-white to-white/60 bg-clip-text text-transparent">
                  Supercharge Your <br/>System Designs
                </h1>
                <p className="text-lg text-white/60 leading-relaxed">
                  Choose the perfect tier to level up your interview prep, architectural sketches, and AI-driven documentation.
                </p>

                {/* Annual/Monthly Switcher */}
                <div className="mt-8 flex items-center justify-center gap-4">
                  <span className={`text-sm ${!isAnnual ? "text-white font-medium" : "text-white/40"}`}>Monthly</span>
                  <button
                    onClick={() => setIsAnnual(!isAnnual)}
                    className="w-12 h-6 rounded-full bg-white/10 hover:bg-white/20 p-1 flex items-center transition-all duration-300 relative border border-white/5"
                  >
                    <motion.div
                      layout
                      className="w-4 h-4 rounded-full bg-indigo-500 shadow-md"
                      animate={{ x: isAnnual ? 22 : 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  </button>
                  <span className={`text-sm flex items-center gap-1.5 ${isAnnual ? "text-white font-medium" : "text-white/40"}`}>
                    Yearly (Save 20%)
                    <span className="text-[10px] bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">
                      Best Value
                    </span>
                  </span>
                </div>
              </div>

              {/* Grid cards */}
              <div className="grid gap-8 lg:grid-cols-3 max-w-6xl mx-auto items-stretch">
                {plans.map((plan) => {
                  const finalPrice = isAnnual 
                    ? Math.round(plan.price * 0.8 * 12) 
                    : plan.price;
                  
                  return (
                    <motion.div
                      key={plan.id}
                      className="relative flex flex-col"
                      whileHover={{ y: -6 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      {/* Highlight Border/Glow for Popular Plan */}
                      {plan.popular && (
                        <div className="absolute -inset-[1.5px] rounded-2xl overflow-hidden pointer-events-none">
                          <motion.div
                            className="absolute w-[200%] h-[200%] top-[-50%] left-[-50%] bg-[conic-gradient(from_0deg,transparent_30%,#3b82f6_45%,#ffffff_50%,#3b82f6_55%,transparent_70%)] opacity-85"
                            animate={{
                              rotate: [0, 360],
                            }}
                            transition={{
                              duration: 5,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                          />
                        </div>
                      )}

                      <div
                        className={`relative h-full flex flex-col justify-between rounded-2xl border p-8 transition-all ${
                          plan.popular
                            ? "border-transparent bg-neutral-900"
                            : "border-white/5 bg-neutral-900/60 backdrop-blur-md hover:border-white/10"
                        } overflow-hidden`}
                      >
                        {/* Glow circle overlay inside card */}
                        <div
                          className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-2xl pointer-events-none"
                          style={{ backgroundColor: plan.glowColor }}
                        />

                        {/* Popular Badge */}
                        {plan.popular && (
                          <div className="absolute top-4 right-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-lg border border-indigo-400/20">
                            Recommended
                          </div>
                        )}

                        <div>
                          {/* Plan details */}
                          <div className="flex items-center gap-3.5 mb-4">
                            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-white">
                              <plan.icon className="h-5 w-5" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold">{plan.name}</h3>
                              <p className="text-xs text-white/50">{plan.subtext}</p>
                            </div>
                          </div>

                          {/* Price */}
                          <div className="my-6 flex items-baseline">
                            <span className="text-4xl font-extrabold tracking-tight">
                              ₹{finalPrice}
                            </span>
                            <span className="ml-1 text-sm text-white/50">
                              /{isAnnual ? "year" : "month"}
                            </span>
                          </div>

                          <div className="w-full h-px bg-white/5 my-6" />

                          {/* Features */}
                          <ul className="space-y-3.5 mb-8">
                            {plan.features.map((feature, idx) => (
                              <li key={idx} className="flex items-start gap-2.5 text-sm text-white/70">
                                <span className="p-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 mt-0.5 shrink-0">
                                  <FiCheck className="h-3.5 w-3.5" />
                                </span>
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* CTA button */}
                        {plan.id === "free" ? (
                          <StarBorder
                            as="button"
                            onClick={() => handleSelectPlan(plan)}
                            color="#ffffff"
                            speed="4s"
                            thickness={1.5}
                            className="w-full rounded-xl shadow-lg"
                            innerClassName="w-full bg-white/5 hover:bg-white/10 text-white text-sm font-semibold px-4 py-3.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors border border-white/10"
                          >
                            {plan.actionLabel}
                            <FiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </StarBorder>
                        ) : (
                          <StarBorder
                            as="button"
                            onClick={() => {
                              const isCurrentOrHigher = dbUser && (dbUser.plan === plan.id || (dbUser.plan === "professional" && plan.id === "starter") || (dbUser.plan === "pro" && plan.id === "starter"));
                              if (!isCurrentOrHigher) handleSelectPlan(plan);
                            }}
                            disabled={dbUser && (dbUser.plan === plan.id || (dbUser.plan === "professional" && plan.id === "starter") || (dbUser.plan === "pro" && plan.id === "starter"))}
                            color={plan.popular ? "#3b82f6" : "#ffffff"}
                            speed="4s"
                            thickness={1.5}
                            className={`w-full rounded-xl ${(dbUser && (dbUser.plan === plan.id || (dbUser.plan === "professional" && plan.id === "starter") || (dbUser.plan === "pro" && plan.id === "starter"))) ? "opacity-50 cursor-not-allowed" : "shadow-lg"}`}
                            innerClassName={`w-full ${plan.popular ? "bg-indigo-600 hover:bg-indigo-700 text-white" : "bg-white hover:bg-white/95 text-neutral-950"} text-sm font-semibold px-4 py-3.5 rounded-xl flex items-center justify-center gap-2 ${(dbUser && (dbUser.plan === plan.id || (dbUser.plan === "professional" && plan.id === "starter") || (dbUser.plan === "pro" && plan.id === "starter"))) ? "" : "cursor-pointer"} transition-colors`}
                          >
                            {(dbUser && (dbUser.plan === plan.id || (dbUser.plan === "professional" && plan.id === "starter") || (dbUser.plan === "pro" && plan.id === "starter"))) ? "Upgraded" : plan.actionLabel}
                            {!(dbUser && (dbUser.plan === plan.id || (dbUser.plan === "professional" && plan.id === "starter") || (dbUser.plan === "pro" && plan.id === "starter"))) && <FiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
                          </StarBorder>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {paymentStep === "processing" && (
            <motion.div
              key="processing-step"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-neutral-900 border border-white/5 rounded-3xl p-8 shadow-2xl flex flex-col items-center justify-center text-center"
            >
              <div className="w-16 h-16 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin mb-6" />
              <h3 className="text-xl font-bold mb-2">Processing Payment</h3>
              <p className="text-sm text-white/50 max-w-xs leading-relaxed">
                We are securely authorizing your payment with the gateway. Please do not refresh the page.
              </p>
            </motion.div>
          )}

          {paymentStep === "success" && selectedPlan && (
            <motion.div
              key="success-step"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-neutral-900 border border-white/5 rounded-3xl p-8 shadow-2xl flex flex-col items-center justify-center text-center relative overflow-hidden"
            >
              <Confetti />
              
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/5">
                <FiCheckCircle className="h-8 w-8" />
              </div>
              
              <h3 className="text-2xl font-bold mb-2 text-white">Payment Successful!</h3>
              <p className="text-sm text-white/60 max-w-xs leading-relaxed mb-6">
                Welcome to <strong>Sketch On {selectedPlan.name}</strong>! Your account has been upgraded successfully.
              </p>

              <div className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 mb-6 text-left text-sm space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-white/50">Receipt To:</span>
                  <span>{user?.firstName || "Valued Customer"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Plan Upgraded:</span>
                  <span>{selectedPlan.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Amount Paid:</span>
                  <span className="font-semibold text-emerald-400">
                    ₹{isAnnual ? Math.round(selectedPlan.price * 0.8 * 12) : selectedPlan.price}
                  </span>
                </div>
              </div>

              <button
                onClick={() => navigate("/dashboard")}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl text-sm font-semibold hover:brightness-110 transition-all duration-300 shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                Go to Dashboard
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Developer Testing Sandbox */}
        {isSignedIn && isReady && (
          <div className="mt-20 w-full max-w-4xl bg-neutral-900/60 border border-dashed border-white/20 rounded-2xl p-6 backdrop-blur-md">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
              🛠️ Developer Testing Sandbox
            </h3>
            <p className="text-sm text-white/60 mb-6">
              Simulate actions to test credit limitations, UI badges, and payment deduction behaviors instantly.
            </p>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <button
                onClick={async () => {
                  try {
                    setSandboxLoading(true);
                    const res = await diagramService.addTestCredits(10);
                    toast.success(`Added 10 credits! Total: ${res.data?.credits}`);
                  } catch (err) {
                    toast.error(err.message);
                  } finally {
                    setSandboxLoading(false);
                  }
                }}
                disabled={sandboxLoading}
                className="py-3 px-4 bg-white/5 border border-white/10 rounded-xl text-xs font-semibold hover:bg-white/10 active:scale-95 transition-all text-white cursor-pointer disabled:opacity-50"
              >
                +10 Credits
              </button>

              <button
                onClick={async () => {
                  try {
                    setSandboxLoading(true);
                    const res = await diagramService.addTestCredits(50);
                    toast.success(`Added 50 credits! Total: ${res.data?.credits}`);
                  } catch (err) {
                    toast.error(err.message);
                  } finally {
                    setSandboxLoading(false);
                  }
                }}
                disabled={sandboxLoading}
                className="py-3 px-4 bg-white/5 border border-white/10 rounded-xl text-xs font-semibold hover:bg-white/10 active:scale-95 transition-all text-white cursor-pointer disabled:opacity-50"
              >
                +50 Credits
              </button>

              <button
                onClick={async () => {
                  try {
                    setSandboxLoading(true);
                    // Fetch profile, see current credits, and subtract to make it 0
                    const profile = await diagramService.getUserProfile();
                    const currentCredits = profile.data?.credits ?? 0;
                    const res = await diagramService.addTestCredits(-currentCredits);
                    toast.warn(`Drained credits to 0! Total: ${res.data?.credits}`);
                  } catch (err) {
                    toast.error(err.message);
                  } finally {
                    setSandboxLoading(false);
                  }
                }}
                disabled={sandboxLoading}
                className="py-3 px-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs font-semibold hover:bg-red-500/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
              >
                Set Credits to 0
              </button>

              <button
                onClick={async () => {
                  try {
                    setSandboxLoading(true);
                    const res = await diagramService.toggleSubscription();
                    toast.success(`Plan toggled! Plan: ${res.data?.plan}, Subscribed: ${res.data?.isSubscribed}`);
                  } catch (err) {
                    toast.error(err.message);
                  } finally {
                    setSandboxLoading(false);
                  }
                }}
                disabled={sandboxLoading}
                className="py-3 px-4 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-xl text-xs font-semibold hover:bg-indigo-500/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
              >
                Toggle Pro Subscription
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Pricing;
