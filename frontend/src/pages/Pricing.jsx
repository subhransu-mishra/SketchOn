import React, { useState } from "react";
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

const Pricing = () => {
  const navigate = useNavigate();
  const { diagramService, isReady, isSignedIn } = useDiagramService();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isAnnual, setIsAnnual] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card"); // "card" or "upi"
  const [paymentStep, setPaymentStep] = useState("pricing"); // "pricing", "checkout", "processing", "success"
  const [sandboxLoading, setSandboxLoading] = useState(false);
  
  // Card form state
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardFocused, setCardFocused] = useState(false);

  // UPI state
  const [upiId, setUpiId] = useState("");

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

  const handleSelectPlan = (plan) => {
    if (plan.id === "free") {
      navigate("/dashboard");
    } else {
      setSelectedPlan(plan);
      setPaymentStep("checkout");
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.length <= 19) {
      setCardNumber(formatted);
    }
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, "");
    if (value.length > 2) {
      value = value.slice(0, 2) + "/" + value.slice(2, 4);
    }
    if (value.length <= 5) {
      setExpiry(value);
    }
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setPaymentStep("processing");
    
    // Simulate payment process
    setTimeout(async () => {
      try {
        if (isSignedIn && isReady) {
          const planCode = selectedPlan.id === "professional" ? "pro" : "starter";
          await diagramService.toggleSubscription(true, planCode);
          toast.success(`Upgraded to ${selectedPlan.name}!`);
        }
      } catch (err) {
        console.error("Failed to upgrade subscription in database:", err);
        toast.error("Billing simulation saved locally but DB sync failed.");
      }
      setPaymentStep("success");
    }, 2500);
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
                        <button
                          onClick={() => handleSelectPlan(plan)}
                          className={`w-full py-3.5 px-4 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer ${
                            plan.popular
                              ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:brightness-110 shadow-lg shadow-indigo-500/20"
                              : plan.id === "free"
                              ? "bg-white/5 border border-white/10 text-white hover:bg-white/10"
                              : "bg-white text-neutral-950 hover:bg-white/90"
                          }`}
                        >
                          {plan.actionLabel}
                          <FiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {paymentStep === "checkout" && selectedPlan && (
            <motion.div
              key="checkout-step"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-4xl bg-neutral-900 border border-white/5 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden"
            >
              {/* Back to pricing */}
              <button
                onClick={() => setPaymentStep("pricing")}
                className="absolute top-6 left-6 text-sm text-white/60 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <FiArrowLeft /> Back to Plans
              </button>

              <div className="grid md:grid-cols-12 gap-8 mt-6">
                
                {/* Left Side: Summary & Options */}
                <div className="md:col-span-5 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/5 pb-8 md:pb-0 md:pr-8">
                  <div>
                    <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                    
                    <div className="bg-white/5 border border-white/5 rounded-2xl p-4 mb-6">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-bold text-white">{selectedPlan.name} Plan</p>
                          <p className="text-xs text-white/50">{isAnnual ? "Yearly billing" : "Monthly billing"}</p>
                        </div>
                        <span className="font-semibold text-indigo-400">
                          ₹{isAnnual ? Math.round(selectedPlan.price * 0.8 * 12) : selectedPlan.price}
                        </span>
                      </div>
                      <div className="w-full h-px bg-white/5 my-3" />
                      <div className="flex justify-between text-sm">
                        <span className="text-white/60">Subtotal</span>
                        <span>₹{isAnnual ? Math.round(selectedPlan.price * 0.8 * 12) : selectedPlan.price}</span>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-white/60">GST (Included)</span>
                        <span>₹0</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Method Selector */}
                  <div>
                    <p className="text-sm font-semibold text-white/60 mb-3">Select Payment Method</p>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("card")}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl border text-sm gap-2 transition-all cursor-pointer ${
                          paymentMethod === "card"
                            ? "bg-indigo-600/15 border-indigo-500/80 text-white"
                            : "bg-white/5 border-white/5 text-white/60 hover:border-white/10"
                        }`}
                      >
                        <FiCreditCard className="h-5 w-5" />
                        <span>Credit / Debit Card</span>
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("upi")}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl border text-sm gap-2 transition-all cursor-pointer ${
                          paymentMethod === "upi"
                            ? "bg-indigo-600/15 border-indigo-500/80 text-white"
                            : "bg-white/5 border-white/5 text-white/60 hover:border-white/10"
                        }`}
                      >
                        <FiSmartphone className="h-5 w-5" />
                        <span>UPI Payment</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-white/40 mt-6 justify-center">
                      <FiLock className="h-3.5 w-3.5" /> Secure 256-bit SSL encrypted checkout
                    </div>
                  </div>
                </div>

                {/* Right Side: Payment Forms */}
                <div className="md:col-span-7 flex flex-col justify-center">
                  {paymentMethod === "card" ? (
                    <form onSubmit={handlePaymentSubmit} className="space-y-5">
                      
                      {/* Premium 3D-Like Glassmorphic Credit Card Preview */}
                      <div className="relative w-full h-44 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 p-6 shadow-xl border border-white/10 overflow-hidden flex flex-col justify-between group">
                        
                        {/* Shimmer overlay effect */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />
                        
                        {/* Micro Chip & Contactless */}
                        <div className="flex justify-between items-start relative z-10">
                          <div className="w-10 h-7 rounded bg-amber-400/80 backdrop-blur-sm shadow border border-amber-300/30 flex items-center justify-center overflow-hidden">
                            <div className="grid grid-cols-3 w-8 h-5 gap-0.5 opacity-40">
                              {[...Array(6)].map((_, i) => (
                                <div key={i} className="border border-neutral-900/20" />
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center gap-1 opacity-80">
                            <div className="w-3 h-3 rounded-full bg-white/20" />
                            <div className="w-6 h-4 rounded-full bg-white/80 mix-blend-screen" />
                          </div>
                        </div>

                        {/* Card Number */}
                        <div className="my-2 relative z-10">
                          <p className="text-xl font-bold tracking-widest font-mono text-white/95">
                            {cardNumber || "•••• •••• •••• ••••"}
                          </p>
                        </div>

                        {/* Holder and Expiry */}
                        <div className="flex justify-between items-end relative z-10">
                          <div>
                            <p className="text-[9px] uppercase tracking-wider text-white/60">Card Holder</p>
                            <p className="text-xs font-semibold uppercase tracking-wide truncate max-w-[180px]">
                              {cardName || "Your Name"}
                            </p>
                          </div>
                          <div>
                            <p className="text-[9px] uppercase tracking-wider text-white/60">Expires</p>
                            <p className="text-xs font-semibold tracking-wide font-mono">
                              {expiry || "MM/YY"}
                            </p>
                          </div>
                          <div>
                            <p className="text-[9px] uppercase tracking-wider text-white/60">CVV</p>
                            <p className="text-xs font-semibold tracking-wide font-mono">
                              {cvv ? "•••" : "•••"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Inputs */}
                      <div className="space-y-3.5">
                        <div>
                          <label className="block text-xs font-medium text-white/60 mb-1.5 uppercase tracking-wider">Cardholder Name</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Subhransu Mishra"
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500/80 transition-colors placeholder:text-white/30"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-white/60 mb-1.5 uppercase tracking-wider">Card Number</label>
                          <input
                            type="text"
                            required
                            placeholder="0000 0000 0000 0000"
                            value={cardNumber}
                            onChange={handleCardNumberChange}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500/80 transition-colors placeholder:text-white/30 font-mono"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-white/60 mb-1.5 uppercase tracking-wider">Expiration Date</label>
                            <input
                              type="text"
                              required
                              placeholder="MM/YY"
                              value={expiry}
                              onChange={handleExpiryChange}
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500/80 transition-colors placeholder:text-white/30 text-center font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-white/60 mb-1.5 uppercase tracking-wider">CVV</label>
                            <input
                              type="password"
                              required
                              maxLength="3"
                              placeholder="•••"
                              value={cvv}
                              onChange={(e) => setCvv(e.target.value.replace(/[^0-9]/g, ""))}
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500/80 transition-colors placeholder:text-white/30 text-center font-mono"
                            />
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-sm font-semibold hover:brightness-110 transition-all duration-300 shadow-lg shadow-indigo-500/20 cursor-pointer"
                      >
                        Authorize & Pay ₹{isAnnual ? Math.round(selectedPlan.price * 0.8 * 12) : selectedPlan.price}
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handlePaymentSubmit} className="space-y-6 flex flex-col items-center">
                      
                      {/* UPI/QR Simulation */}
                      <div className="p-4 bg-white rounded-2xl shadow-xl flex items-center justify-center border border-white/10 w-48 h-48 relative overflow-hidden group">
                        <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=upi://pay?pa=sketchon@paytm%26pn=SketchOn%26am=${isAnnual ? Math.round(selectedPlan.price * 0.8 * 12) : selectedPlan.price}%26cu=INR`} 
                          alt="Payment QR Code" 
                          className="w-40 h-40"
                        />
                        <div className="absolute inset-0 bg-neutral-900/80 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all p-3 text-center pointer-events-none">
                          <p className="text-xs font-semibold text-white">Scan with GPay, PhonePe, Paytm, or BHIM</p>
                        </div>
                      </div>
                      <p className="text-xs text-white/50 text-center -mt-2">Scan QR code to pay using any UPI app</p>

                      <div className="w-full h-px bg-white/5" />

                      <div className="w-full">
                        <label className="block text-xs font-medium text-white/60 mb-1.5 uppercase tracking-wider text-left">Or enter UPI ID</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. subhransu@paytm"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500/80 transition-colors placeholder:text-white/30 text-center"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-sm font-semibold hover:brightness-110 transition-all duration-300 shadow-lg shadow-indigo-500/20 cursor-pointer"
                      >
                        Verify & Pay ₹{isAnnual ? Math.round(selectedPlan.price * 0.8 * 12) : selectedPlan.price}
                      </button>
                    </form>
                  )}
                </div>
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
                  <span>{cardName || upiId || "Valued Customer"}</span>
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
