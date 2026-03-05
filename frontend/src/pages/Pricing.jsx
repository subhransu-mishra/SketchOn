import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCheck,
  FiStar,
  FiZap,
  FiUsers,
  FiShield,
  FiTrendingUp,
  FiArrowRight,
  FiGift,
} from "react-icons/fi";
import { TfiCrown } from "react-icons/tfi";

const Pricing = () => {
  const [isYearly, setIsYearly] = useState(false);
  const [showDevPopup, setShowDevPopup] = useState(true);

  useEffect(() => {
    setShowDevPopup(true);
  }, []);

  const plans = [
    {
      name: "Starter",
      description: "Perfect for individuals and small projects",
      icon: FiStar,
      price: { monthly: 0, yearly: 0 },
      popular: false,
      color: "bg-blue-500",
      features: [
        "3 Projects",
        "Basic AI Suggestions",
        "Standard Templates",
        "Export to PNG/PDF",
        "Community Support",
        "5GB Storage",
      ],
      limitations: ["Limited AI analysis", "Basic export options"],
    },
    {
      name: "Professional",
      description: "Recommended for professionals and teams",
      icon: FiZap,
      price: { monthly: 19, yearly: 15 },
      popular: true,
      color: "bg-purple-500",
      features: [
        "Unlimited Projects",
        "Advanced AI Analysis",
        "Premium Templates",
        "All Export Formats",
        "Priority Support",
        "100GB Storage",
        "Real-time Collaboration",
        "Advanced Components",
        "Custom Branding",
      ],
      limitations: [],
    },
    {
      name: "Enterprise",
      description: "For large teams and organizations",
      icon: TfiCrown,
      price: { monthly: 49, yearly: 39 },
      popular: false,
      color: "bg-orange-500",
      features: [
        "Everything in Professional",
        "Custom AI Training",
        "API Access",
        "SSO Integration",
        "Advanced Analytics",
        "Unlimited Storage",
        "24/7 Phone Support",
        "Custom Integrations",
        "Dedicated Account Manager",
        "SLA Guarantee",
      ],
      limitations: [],
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white antialiased">
      {/* Under Development Popup */}
      <AnimatePresence>
        {showDevPopup && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowDevPopup(false)}
            />
            {/* Modal */}
            <motion.div
              className="relative max-w-md w-full bg-neutral-900 border border-white/10 rounded-2xl p-8 shadow-2xl text-center"
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              {/* Icon */}
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-5 rounded-2xl bg-yellow-500/10 border border-yellow-500/20">
                <svg
                  className="h-8 w-8 text-yellow-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">
                Under Development
              </h2>
              <p className="text-white/60 text-sm leading-relaxed mb-6">
                The Pricing page is currently under development. Plans and
                payment options will be available soon. Stay tuned!
              </p>
              <motion.button
                onClick={() => setShowDevPopup(false)}
                className="w-full px-6 py-3 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 font-semibold hover:bg-yellow-500/30 transition-colors"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Got it, continue browsing
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Header */}
      <header className="border-b border-white/5 bg-neutral-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Sketch On Logo"
              className="h-9 w-9 rounded-lg"
            />
            <div>
              <p className="text-xl font-semibold">Sketch On</p>
              <p className="text-xs uppercase tracking-[0.3em] text-white/60">
                Pricing
              </p>
            </div>
          </div>
          <Link
            to="/"
            className="text-sm text-white/60 hover:text-white transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        {/* Hero Section */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/60 mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <FiGift className="h-4 w-4" />
            Special Launch Pricing
          </motion.div>

          <h1 className="text-4xl font-bold mb-4 sm:text-5xl lg:text-6xl">
            Choose Your
            <span className="block text-blue-400">Perfect Plan</span>
          </h1>

          <p className="text-xl text-white/70 max-w-3xl mx-auto mb-8">
            From solo creators to enterprise teams, we have the perfect plan to
            help you create amazing designs with AI assistance.
          </p>

          {/* Billing Toggle */}
          <motion.div
            className="inline-flex items-center gap-4 p-1 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <span
              className={`text-sm font-medium px-4 py-2 ${!isYearly ? "text-white" : "text-white/60"}`}
            >
              Monthly
            </span>
            <motion.button
              onClick={() => setIsYearly(!isYearly)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                isYearly ? "bg-blue-600" : "bg-white/20"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.span
                className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                animate={{ x: isYearly ? 28 : 4 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            </motion.button>
            <span
              className={`text-sm font-medium px-4 py-2 flex items-center gap-2 ${isYearly ? "text-white" : "text-white/60"}`}
            >
              Yearly
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                Save 20%
              </span>
            </span>
          </motion.div>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          className="grid gap-8 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              variants={cardVariants}
              className={`group relative ${plan.popular ? "lg:scale-105" : ""}`}
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {/* Recommendation Badge */}
              {plan.popular && (
                <motion.div
                  className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                >
                  <div className="bg-purple-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-1">
                    <FiTrendingUp className="h-4 w-4" />
                    Most Popular
                  </div>
                </motion.div>
              )}

              {/* Glow Effect */}
              <div
                className={`absolute -inset-4 bg-blue-500/20 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500`}
              />

              <div
                className={`relative h-full rounded-2xl border backdrop-blur-sm p-8 ${
                  plan.popular
                    ? "border-purple-500/50 bg-purple-500/10"
                    : "border-white/10 bg-white/5"
                }`}
              >
                {/* Plan Header */}
                <div className="text-center mb-8">
                  <motion.div
                    className={`w-16 h-16 rounded-2xl ${plan.color} p-0.5 mx-auto mb-4`}
                    whileHover={{ rotate: 5, scale: 1.1 }}
                  >
                    <div className="w-full h-full rounded-2xl bg-neutral-900 flex items-center justify-center">
                      <plan.icon className="h-8 w-8 text-white" />
                    </div>
                  </motion.div>

                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-white/60 text-sm mb-4">
                    {plan.description}
                  </p>

                  {/* Price */}
                  <div className="mb-6">
                    <motion.div
                      className="text-4xl font-bold flex items-baseline justify-center gap-1"
                      key={isYearly ? "yearly" : "monthly"}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <span className="text-2xl text-white/60">$</span>
                      <span>
                        {isYearly ? plan.price.yearly : plan.price.monthly}
                      </span>
                      <span className="text-lg text-white/60 font-normal">
                        /{isYearly ? "year" : "month"}
                      </span>
                    </motion.div>
                    {isYearly && plan.price.monthly > 0 && (
                      <motion.div
                        className="text-sm text-green-400 mt-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        Save ${plan.price.monthly * 12 - plan.price.yearly * 12}{" "}
                        annually
                      </motion.div>
                    )}
                  </div>

                  {/* CTA Button */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to={
                        plan.price.monthly === 0 ? "/dashboard" : "/dashboard"
                      }
                      className={`w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                        plan.popular
                          ? "bg-purple-500 text-white hover:shadow-xl hover:shadow-purple-500/25"
                          : "border border-white/20 bg-white/10 backdrop-blur-sm text-white hover:border-white/40"
                      }`}
                    >
                      {plan.price.monthly === 0
                        ? "Get Started Free"
                        : "Start Trial"}
                      <FiArrowRight className="h-4 w-4" />
                    </Link>
                  </motion.div>
                </div>

                {/* Features */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-white/90 mb-4">
                    Everything included:
                  </h4>
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <motion.li
                        key={feature}
                        className="flex items-center gap-3 text-sm text-white/70"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * featureIndex }}
                      >
                        <div className={`p-1 rounded-full ${plan.color}`}>
                          <FiCheck className="h-3 w-3 text-white" />
                        </div>
                        {feature}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-4">Have Questions?</h2>
          <p className="text-white/70 mb-8 max-w-2xl mx-auto">
            Our team is here to help you choose the perfect plan for your needs.
            Contact us for personalized recommendations.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <motion.button
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm text-white hover:border-white/40 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiUsers className="h-4 w-4" />
              Contact Sales
            </motion.button>

            <motion.button
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm text-white hover:border-white/40 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiShield className="h-4 w-4" />
              View FAQ
            </motion.button>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Pricing;
