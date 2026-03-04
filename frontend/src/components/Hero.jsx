import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import {
  FiPlay,
  FiArrowRight,
  FiLayers,
  FiCpu,
  FiBox,
  FiPenTool,
  FiMenu,
  FiX,
} from "react-icons/fi";

const navLinks = [
  { label: "Pricing", href: "/pricing" },
  { label: "How to Use", href: "/how-to-use" },
];

// Animated feature lines data
const featureLines = [
  "Draw system architectures with drag & drop",
  "Analyze your designs with AI-powered insights",
  "Access 30+ tech icons — AWS, Docker, React & more",
  "Export polished diagrams in one click",
  "Build flowcharts, wireframes & ERDs effortlessly",
  "Collaborate and refine ideas in real time",
];

const Hero = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentLine, setCurrentLine] = useState(0);
  const { user } = useUser();

  // Rotate feature lines
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLine((prev) => (prev + 1) % featureLines.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <header className="sticky top-0 z-30 border-b border-white/5 bg-neutral-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          {/* Logo + Beta badge */}
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Sketch On Logo"
              className="h-9 w-9 rounded-lg"
            />
            <div className="flex items-center gap-2">
              <div>
                <p className="text-xl font-semibold">Sketch On</p>
                <p className="text-xs uppercase tracking-[0.3em] text-white/60">
                  by subhransu
                </p>
              </div>
              <span className="rounded-md border border-white/20 bg-white/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white/70">
                Beta
              </span>
            </div>
          </div>

          {/* Desktop nav */}
          <nav
            className="hidden items-center gap-8 text-sm text-white/80 lg:flex"
            aria-label="Primary"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="transition hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            <SignedOut>
              <SignInButton mode="modal">
                <button className="rounded-full border cursor-pointer border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/10">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <div className="flex items-center gap-4">
                <Link
                  to="/dashboard"
                  className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/20"
                >
                  Dashboard
                </Link>
                <div className="flex items-center gap-3">
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "h-9 w-9",
                      },
                    }}
                  />
                  <span className="text-sm font-medium text-white/80">
                    {user?.firstName ?? user?.username ?? ""}
                  </span>
                </div>
              </div>
            </SignedIn>
          </nav>

          {/* Mobile: Login button + Hamburger */}
          <div className="flex items-center gap-3 lg:hidden">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/10">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "h-8 w-8",
                  },
                }}
              />
            </SignedIn>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md border border-white/15 p-2 text-white/80 transition hover:bg-white/10"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen((open) => !open)}
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FiX className="h-5 w-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FiMenu className="h-5 w-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* Mobile menu - smooth animated */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="overflow-hidden lg:hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 pb-4 sm:px-6">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Link
                      to={link.href}
                      className="block rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white/80 transition hover:border-white/30 hover:bg-white/10"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                <SignedIn>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Link
                      to="/dashboard"
                      className="block rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/10 text-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  </motion.div>
                </SignedIn>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section className="mx-auto grid max-w-6xl gap-12 px-4 pb-20 pt-16 sm:px-6 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:pb-24 lg:pt-20">
        <motion.div
          className="space-y-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.p
            className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/60"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            AI-powered whiteboard canvas
          </motion.p>

          <motion.div
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <motion.h1
              className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <span className="block text-white/70">
                Sketch Here and Let AI Refine Your Ideas
              </span>
            </motion.h1>

            {/* Animated feature lines */}
            <div className="h-8 relative overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentLine}
                  className="absolute max-w-2xl text-lg text-white/50"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  {featureLines[currentLine]}
                </motion.p>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* CTA buttons */}
          <motion.div
            className="flex flex-wrap items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {/* Get Started - Sign in popup for unauthenticated, Dashboard for authenticated */}
            <SignedOut>
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                  <button className="inline-flex items-center justify-center gap-2 rounded-full bg-white text-neutral-950 px-8 py-4 text-sm font-semibold transition-all duration-300 hover:bg-white/90 hover:shadow-lg hover:shadow-white/10 focus:outline-none cursor-pointer">
                    Get Started
                    <FiArrowRight className="h-4 w-4" />
                  </button>
                </SignInButton>
              </motion.div>
            </SignedOut>
            <SignedIn>
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white text-neutral-950 px-8 py-4 text-sm font-semibold transition-all duration-300 hover:bg-white/90 hover:shadow-lg hover:shadow-white/10 focus:outline-none"
                >
                  Go to Dashboard
                  <FiArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            </SignedIn>

            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/how-to-use"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 text-white px-8 py-4 text-sm font-semibold transition-all duration-300 hover:border-white/40 hover:bg-white/10 focus:outline-none backdrop-blur-sm"
              >
                <FiPlay className="h-4 w-4" />
                See how it works
              </Link>
            </motion.div>
          </motion.div>

          {/* Feature cards (replacing stats) */}
          <motion.div
            className="grid gap-4 sm:grid-cols-3"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            {[
              {
                label: "Draw Systems",
                desc: "Drag & drop nodes to build architecture diagrams",
                icon: FiPenTool,
              },
              {
                label: "Analyze with AI",
                desc: "Get smart suggestions to refine your designs",
                icon: FiCpu,
              },
              {
                label: "Access Icons",
                desc: "30+ tech icons — AWS, Docker, React & more",
                icon: FiBox,
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.label}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 transition-all duration-300 hover:border-white/20"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="relative flex items-center gap-3 mb-3">
                  <feature.icon className="h-5 w-5 text-white/70" />
                </div>
                <p className="text-sm font-semibold text-white mb-1">
                  {feature.label}
                </p>
                <p className="text-xs text-white/50 leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right side - Canvas preview */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="absolute -inset-4 bg-white/5 rounded-3xl blur-xl opacity-50" />
          <div className="relative">
            <div className="rounded-3xl border border-white/10 bg-black/20 backdrop-blur-xl p-6 shadow-2xl">
              <div className="mb-4 flex items-center justify-between text-sm text-white/60">
                <span className="flex items-center gap-2">
                  <FiLayers className="h-4 w-4 text-white/50" />
                  Canvas preview
                </span>
                <span className="flex items-center gap-2">
                  <motion.div
                    className="h-2 w-2 rounded-full bg-white/60"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  AI analysis
                </span>
              </div>
              <div className="space-y-3 rounded-2xl border border-white/10 bg-neutral-900/50 p-4">
                {[
                  {
                    name: "User Flow Diagram",
                    type: "Wireframe",
                    status: "Analyzing",
                    progress: 85,
                  },
                  {
                    name: "Component Library",
                    type: "Design System",
                    status: "Optimized",
                    progress: 100,
                  },
                  {
                    name: "Dashboard Layout",
                    type: "Interface",
                    status: "Refining",
                    progress: 65,
                  },
                  {
                    name: "API Architecture",
                    type: "System Design",
                    status: "Complete",
                    progress: 100,
                  },
                ].map((item, index) => (
                  <motion.div
                    key={item.name}
                    className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3 transition-all duration-300 hover:border-white/20 hover:bg-white/10"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    viewport={{ once: true }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-sm font-semibold text-white/80">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {item.name}
                        </p>
                        <p className="text-xs text-white/60">{item.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-white/40 rounded-full"
                          initial={{ width: "0%" }}
                          whileInView={{ width: `${item.progress}%` }}
                          transition={{
                            duration: 1.5,
                            delay: 0.3 + 0.1 * index,
                          }}
                          viewport={{ once: true }}
                        />
                      </div>
                      <span className="text-xs font-medium text-white/70">
                        {item.status}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
              <motion.div
                className="mt-4 space-y-2 text-sm text-white/70"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-2">
                  <div className="h-1 w-1 rounded-full bg-white/40" />
                  Detects misalignment and inconsistent spacing automatically.
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1 w-1 rounded-full bg-white/40" />
                  Recommends hierarchy, labels, and smart grouping.
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1 w-1 rounded-full bg-white/40" />
                  Exports polished narratives without losing your intent.
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Hero;
