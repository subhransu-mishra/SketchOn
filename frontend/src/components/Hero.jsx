import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
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
import StarBorder from "./StarBorder";

// ─── Data ────────────────────────────────────────────────────────────────────
const navLinks = [
  { label: "Pricing", href: "/pricing" },
  { label: "How to Use", href: "/how-to-use" },
];

const featureLines = [
  "Draw system architectures with drag & drop",
  "Analyze your designs with AI-powered insights",
  "Access 30+ tech icons — AWS, Docker, React & more",
  "Export polished diagrams in one click",
  "Build flowcharts, wireframes & ERDs effortlessly",
  "Collaborate and refine ideas in real time",
];

const canvasItems = [
  { name: "User Flow Diagram",  type: "Wireframe",     status: "Analyzing", progress: 85  },
  { name: "Component Library",  type: "Design System", status: "Optimized", progress: 100 },
  { name: "Dashboard Layout",   type: "Interface",     status: "Refining",  progress: 65  },
  { name: "API Architecture",   type: "System Design", status: "Complete",  progress: 100 },
];


// ─── FeatureCard ──────────────────────────────────────────────────────────────
const FeatureCard = ({ label, desc, icon: Icon, index }) => {
  const outerRef = useRef(null);
  const angleRef = useRef(0);
  const rafRef   = useRef(null);

  const startSpin = () => {
    const tick = () => {
      angleRef.current = (angleRef.current + 1.8) % 360;
      outerRef.current?.style.setProperty("--spin-angle", `${angleRef.current}deg`);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  const stopSpin = () => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
  };

  return (
    <motion.div
      ref={outerRef}
      className="feat-card-outer group"
      style={{
        "--spin-angle": "0deg",
        position: "relative",
        borderRadius: "18px",
        padding: "1.5px",
        animation: `feat-card-enter 0.55s ease both`,
        animationDelay: `${0.08 * index}s`,
      }}
      onMouseEnter={startSpin}
      onMouseLeave={stopSpin}
    >
      {/* ── Rotating conic shimmer border ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "18px",
          padding: "1.5px",
          background: `conic-gradient(
            from var(--spin-angle),
            transparent 0deg,
            rgba(59,130,246,0.65) 55deg,
            rgba(139,92,246,0.55) 85deg,
            rgba(255,255,255,0.18) 115deg,
            transparent 175deg
          )`,
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "destination-out",
          maskComposite: "exclude",
          pointerEvents: "none",
          opacity: 0,
          transition: "opacity 0.35s ease",
        }}
        className="feat-shimmer-border"
      />

      {/* ── Always-visible dim border ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "18px",
          border: "1px solid rgba(255,255,255,0.1)",
          pointerEvents: "none",
          transition: "border-color 0.3s ease",
        }}
        className="feat-dim-border"
      />

      {/* ── Card body ── */}
      <div
        style={{
          position: "relative",
          height: "100%",
          overflow: "hidden",
          borderRadius: "17px",
          background: "rgba(255,255,255,0.04)",
          padding: "18px 16px 16px",
          transition: "background 0.3s ease, transform 0.3s ease",
          boxSizing: "border-box",
        }}
        className="feat-card-body"
      >
        {/* spotlight glow */}
        <div
          style={{
            position: "absolute",
            top: "-48px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "88px",
            height: "88px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(99,102,241,0.38) 0%, transparent 70%)",
            opacity: 0,
            transition: "opacity 0.4s ease",
            pointerEvents: "none",
          }}
          className="feat-spotlight"
        />

        {/* Icon */}
        <div
          style={{
            marginBottom: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            border: "1px solid rgba(255,255,255,0.12)",
            background: "rgba(255,255,255,0.06)",
            transition:
              "background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
          }}
          className="feat-icon-box"
        >
          <Icon
            style={{
              width: "16px",
              height: "16px",
              color: "rgba(255,255,255,0.65)",
              transition: "color 0.3s ease",
            }}
            className="feat-icon"
          />
        </div>

        {/* Label */}
        <p
          style={{
            margin: "0 0 5px",
            fontSize: "13px",
            fontWeight: 600,
            color: "rgba(255,255,255,0.88)",
            transition: "color 0.3s ease",
          }}
          className="feat-label"
        >
          {label}
        </p>

        {/* Desc */}
        <p
          style={{
            margin: 0,
            fontSize: "11.5px",
            lineHeight: 1.55,
            color: "rgba(255,255,255,0.45)",
          }}
        >
          {desc}
        </p>
      </div>
    </motion.div>
  );
};

// ─── Hero ─────────────────────────────────────────────────────────────────────
const Hero = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentLine, setCurrentLine] = useState(0);
  const { user } = useUser();

  useEffect(() => {
    const id = setInterval(
      () => setCurrentLine((p) => (p + 1) % featureLines.length),
      3000
    );
    return () => clearInterval(id);
  }, []);

  return (
    <div>

      {/* ── Header ── */}
      <header className="sticky top-0 z-30 border-b border-white/5 bg-neutral-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Sketch On Logo" className="h-9 w-9 rounded-lg" />
            <div className="flex items-center gap-2">
              <p className="text-xl font-semibold">Sketch On</p>
              <span className="rounded-md border border-white/20 bg-white/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white/70">
                Beta
              </span>
            </div>
          </div>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-8 text-sm text-white/80 lg:flex" aria-label="Primary">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="relative py-1 text-white/70 transition-colors duration-300 hover:text-white group"
              >
                <span>{link.label}</span>
                <span className="absolute bottom-0 left-1/2 h-[1.5px] w-0 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}

            <SignedOut>
              <SignInButton mode="modal">
                <StarBorder
                  color="#ffffff"
                  speed="6s"
                  thickness={1}
                  className="rounded-full shadow-md hover:scale-[1.02] active:scale-[0.98]"
                  innerClassName="bg-neutral-950 hover:bg-neutral-900 text-white text-sm font-semibold px-4 py-2 rounded-full cursor-pointer flex items-center justify-center"
                >
                  Sign In
                </StarBorder>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <div className="flex items-center gap-4">
                <StarBorder
                  as={Link}
                  to="/dashboard"
                  color="#ffffff"
                  speed="6s"
                  thickness={1}
                  className="rounded-full shadow-md hover:scale-[1.02] active:scale-[0.98]"
                  innerClassName="bg-neutral-950 hover:bg-neutral-900 text-white text-sm font-semibold px-4 py-2 rounded-full cursor-pointer flex items-center justify-center"
                >
                  Dashboard
                </StarBorder>
                <div className="flex items-center gap-3">
                  <UserButton appearance={{ elements: { avatarBox: "h-9 w-9" } }} />
                  <span className="text-sm font-medium text-white/80">
                    {user?.firstName ?? user?.username ?? ""}
                  </span>
                </div>
              </div>
            </SignedIn>
          </nav>

          {/* Mobile: sign-in + hamburger */}
          <div className="flex items-center gap-3 lg:hidden">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/10">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton appearance={{ elements: { avatarBox: "h-8 w-8" } }} />
            </SignedIn>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md border border-white/15 p-2 text-white/80 transition hover:bg-white/10"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen((o) => !o)}
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <FiX className="h-5 w-5" />
                  </motion.div>
                ) : (
                  <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <FiMenu className="h-5 w-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
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
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                    <Link
                      to="/dashboard"
                      className="block rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-center text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/10"
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

      {/* ── Hero Section ── */}
      <section className="mx-auto grid max-w-6xl gap-12 px-4 pb-20 pt-16 sm:px-6 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:pb-24 lg:pt-20">

        {/* Left column */}
        <motion.div
          className="space-y-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Badge */}
          <motion.p
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/60"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "#3b82f6",
                boxShadow: "0 0 6px #3b82f6",
                display: "inline-block",
                flexShrink: 0,
              }}
            />
            Let's design your ideas
          </motion.p>

          {/* Headline + animated lines */}
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

            {/* Animated feature lines with shimmer underline */}
            <div style={{ position: "relative", paddingBottom: "10px" }}>
              {/* shimmer underline bar */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  height: "1px",
                  width: "100%",
                  background:
                    "linear-gradient(90deg, transparent 0%, rgba(99,102,241,0.6) 30%, rgba(59,130,246,0.5) 50%, rgba(99,102,241,0.6) 70%, transparent 100%)",
                  backgroundSize: "200% auto",
                  animation: "shimmer-underline 2.8s linear infinite",
                }}
              />
              <div className="relative h-8 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={currentLine}
                    className="absolute max-w-2xl text-lg text-white/50"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.45 }}
                  >
                    {featureLines[currentLine]}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* CTA buttons */}
          <motion.div
            className="flex flex-wrap items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <SignedOut>
              <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                <StarBorder
                  color="#3b82f6"
                  speed="4s"
                  thickness={1.5}
                  className="rounded-full shadow-lg"
                  innerClassName="bg-white hover:bg-white/95 text-neutral-950 text-sm font-semibold px-8 py-4 rounded-full flex items-center gap-2 cursor-pointer"
                >
                  Get Started
                  <FiArrowRight className="h-4 w-4" />
                </StarBorder>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <StarBorder
                as={Link}
                to="/dashboard"
                color="#3b82f6"
                speed="4s"
                thickness={1.5}
                className="rounded-full shadow-lg"
                innerClassName="bg-white hover:bg-white/95 text-neutral-950 text-sm font-semibold px-8 py-4 rounded-full flex items-center gap-2 cursor-pointer"
              >
                Go to Dashboard
                <FiArrowRight className="h-4 w-4" />
              </StarBorder>
            </SignedIn>

            <StarBorder
              as={Link}
              to="/how-to-use"
              color="#ffffff"
              speed="6s"
              thickness={1}
              className="rounded-full shadow-md"
              innerClassName="bg-neutral-950 hover:bg-neutral-900 text-white text-sm font-semibold px-8 py-4 rounded-full flex items-center gap-2 cursor-pointer border border-white/5"
            >
              <FiPlay className="h-4 w-4" />
              See how it works
            </StarBorder>
          </motion.div>

          {/* ── Feature cards ── */}
          <motion.div
            className="grid gap-3 sm:grid-cols-3"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            {[
              { label: "Draw Systems",   desc: "Drag & drop nodes to build architecture diagrams", icon: FiPenTool },
              { label: "Analyze with AI", desc: "Get smart suggestions to refine your designs",   icon: FiCpu     },
              { label: "Access Icons",   desc: "30+ tech icons — AWS, Docker, React & more",      icon: FiBox     },
            ].map((f, i) => (
              <FeatureCard key={f.label} {...f} index={i} />
            ))}
          </motion.div>
        </motion.div>

        {/* ── Right column — Canvas preview ── */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="absolute -inset-4 rounded-3xl bg-white/5 opacity-50 blur-xl" />
          <div className="relative">
            <div className="rounded-3xl border border-white/10 bg-black/20 p-6 shadow-2xl backdrop-blur-xl">
              {/* Panel header */}
              <div className="mb-4 flex items-center justify-between text-sm text-white/60">
                <span className="flex items-center gap-2">
                  <FiLayers className="h-4 w-4 text-white/50" />
                  Canvas preview
                </span>
                <span className="flex items-center gap-2">
                  <motion.div
                    className="h-2 w-2 rounded-full bg-white/60"
                    style={{ boxShadow: "0 0 5px rgba(255,255,255,0.4)" }}
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  AI analysis
                </span>
              </div>

              {/* Canvas items */}
              <div className="space-y-3 rounded-2xl border border-white/10 bg-neutral-900/50 p-4">
                {canvasItems.map((item, index) => (
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
                        <p className="text-sm font-semibold text-white">{item.name}</p>
                        <p className="text-xs text-white/60">{item.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-white/10">
                        <motion.div
                          className="h-full rounded-full bg-white/40"
                          initial={{ width: "0%" }}
                          whileInView={{ width: `${item.progress}%` }}
                          transition={{ duration: 1.5, delay: 0.3 + 0.1 * index }}
                          viewport={{ once: true }}
                        />
                      </div>
                      <span className="min-w-[52px] text-right text-xs font-medium text-white/70">
                        {item.status}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Bullets */}
              <motion.div
                className="mt-4 space-y-2"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                viewport={{ once: true }}
              >
                {[
                  "Detects misalignment and inconsistent spacing automatically.",
                  "Recommends hierarchy, labels, and smart grouping.",
                  "Exports polished narratives without losing your intent.",
                ].map((text) => (
                  <div key={text} className="flex items-center gap-2 text-sm text-white/70">
                    <div className="h-1 w-1 flex-shrink-0 rounded-full bg-white/40" />
                    {text}
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Hero;