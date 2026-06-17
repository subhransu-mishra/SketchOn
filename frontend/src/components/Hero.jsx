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
  FiStar,
  FiCreditCard,
  FiShield,
  FiLayout,
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

// ─── MiniCanvasPreview ───────────────────────────────────────────────────────
const MiniCanvasPreview = () => {
  return (
    <div className="relative h-[420px] w-full overflow-hidden rounded-3xl border border-white/10 bg-neutral-950 shadow-2xl">
      {/* Grid background */}
      <div 
        className="absolute inset-0 opacity-[0.15]" 
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Project Name Top Left */}
      <div className="absolute left-4 top-4 z-10 flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 backdrop-blur-md shadow-lg">
        <FiLayers className="h-4 w-4 text-blue-400" />
        <span className="text-xs font-semibold text-white/80">Architecture_V2</span>
      </div>

      {/* Floating Nodes */}
      
      {/* Node 1: User / Frontend */}
      <motion.div 
        className="absolute left-8 top-28 z-10 flex flex-col items-center gap-2"
        initial={{ y: 0 }}
        animate={{ y: [-6, 6, -6] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-blue-500/30 bg-blue-500/10 shadow-[0_0_20px_rgba(59,130,246,0.3)] backdrop-blur-md">
          <FiBox className="h-6 w-6 text-blue-400" />
        </div>
        <span className="text-[10px] font-medium text-white/70 bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-sm">Frontend</span>
      </motion.div>

      {/* Node 2: API / Backend */}
      <motion.div 
        className="absolute left-[160px] top-[160px] z-10 flex flex-col items-center gap-2"
        initial={{ y: 0 }}
        animate={{ y: [6, -6, 6] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-purple-500/30 bg-purple-500/10 shadow-[0_0_20px_rgba(168,85,247,0.3)] backdrop-blur-md">
          <FiCpu className="h-7 w-7 text-purple-400" />
        </div>
        <span className="text-[10px] font-medium text-white/70 bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-sm">API Gateway</span>
      </motion.div>

      {/* Node 3: Database */}
      <motion.div 
        className="absolute right-12 top-[80px] z-10 flex flex-col items-center gap-2"
        initial={{ y: 0 }}
        animate={{ y: [-5, 5, -5] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.3)] backdrop-blur-md">
          <FiLayers className="h-6 w-6 text-emerald-400" />
        </div>
        <span className="text-[10px] font-medium text-white/70 bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-sm">Database</span>
      </motion.div>

      {/* Node 4: AI Service */}
      <motion.div 
        className="absolute bottom-16 right-28 z-10 flex flex-col items-center gap-2"
        initial={{ y: 0 }}
        animate={{ y: [4, -4, 4] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-pink-500/30 bg-pink-500/10 shadow-[0_0_20px_rgba(236,72,153,0.3)] backdrop-blur-md">
           <div className="flex h-full w-full items-center justify-center">
             <FiPenTool className="h-6 w-6 text-pink-400" />
           </div>
        </div>
        <span className="text-[10px] font-medium text-white/70 bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-sm">AI Analysis</span>
      </motion.div>


      {/* Flowing Lines (SVG) */}
      <svg className="absolute inset-0 h-full w-full pointer-events-none z-0">
        <defs>
          <linearGradient id="line-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id="line-grad-2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id="line-grad-3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ec4899" stopOpacity="0.8" />
          </linearGradient>
          
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Connection 1: Frontend -> API Gateway */}
        <path 
          d="M 64,136 C 100,136 120,188 160,188" 
          fill="none" 
          stroke="url(#line-grad-1)" 
          strokeWidth="2.5" 
          strokeDasharray="6 6" 
          className="opacity-70"
        />
        <circle r="4" fill="#60a5fa" filter="url(#glow)">
          <animateMotion dur="2.5s" repeatCount="indefinite" path="M 64,136 C 100,136 120,188 160,188" />
        </circle>

        {/* Connection 2: API Gateway -> Database */}
        <path 
          d="M 216,188 C 250,188 280,104 310,104" 
          fill="none" 
          stroke="url(#line-grad-2)" 
          strokeWidth="2.5" 
          strokeDasharray="6 6" 
          className="opacity-70"
        />
        <circle r="4" fill="#34d399" filter="url(#glow)">
          <animateMotion dur="3s" repeatCount="indefinite" path="M 216,188 C 250,188 280,104 310,104" />
        </circle>

        {/* Connection 3: API Gateway -> AI Service */}
        <path 
          d="M 188,216 C 188,260 250,290 280,310" 
          fill="none" 
          stroke="url(#line-grad-3)" 
          strokeWidth="2.5" 
          strokeDasharray="6 6" 
          className="opacity-70"
        />
        <circle r="4" fill="#f472b6" filter="url(#glow)">
          <animateMotion dur="3.5s" repeatCount="indefinite" path="M 188,216 C 188,260 250,290 280,310" />
        </circle>
      </svg>
      
      {/* Overlay UI to make it look like an editor */}
      <div className="absolute bottom-4 left-4 z-10 flex gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 backdrop-blur-md border border-white/20 shadow-lg hover:bg-white/20 transition-colors cursor-pointer">
           <div className="h-3 w-3 rounded-sm border-2 border-white/70" />
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 backdrop-blur-md border border-white/20 shadow-lg hover:bg-white/20 transition-colors cursor-pointer">
           <FiPenTool className="h-4 w-4 text-white/70" />
        </div>
      </div>
      
      {/* Zoom UI right bottom */}
      <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2 rounded-lg bg-white/10 px-2 py-1 backdrop-blur-md border border-white/20 shadow-lg">
         <span className="text-[10px] font-bold text-white/80">100%</span>
      </div>
    </div>
  );
};


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
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    // Check if the update modal has been shown
    const updateSeen = localStorage.getItem("sketchon_update_v2_seen");
    if (!updateSeen) {
      const timer = setTimeout(() => setShowUpdateModal(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const closeUpdateModal = () => {
    setShowUpdateModal(false);
    localStorage.setItem("sketchon_update_v2_seen", "true");
  };

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
            <>
              {/* Invisible backdrop to close on click outside */}
              <motion.div
                className="fixed inset-0 z-40 lg:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMenuOpen(false)}
              />
              
              <motion.div
                className="absolute right-4 top-20 z-50 flex w-[220px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-neutral-950/95 p-4 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl lg:hidden"
                initial={{ opacity: 0, y: -10, scale: 0.95, transformOrigin: "top right" }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <div className="flex flex-col gap-1">
                  {navLinks.map((link, i) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        to={link.href}
                        className="block rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-white"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Divider */}
                <div className="my-3 h-[1px] w-full bg-white/10" />

                <SignedIn>
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: 0.15 }}
                  >
                    <StarBorder
                      as={Link}
                      to="/dashboard"
                      color="#3b82f6"
                      speed="4s"
                      thickness={1.5}
                      className="w-full rounded-xl"
                      innerClassName="flex w-full items-center justify-center rounded-xl bg-neutral-950 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-neutral-900"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </StarBorder>
                  </motion.div>
                </SignedIn>
                
                <SignedOut>
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: 0.15 }}
                  >
                    <SignInButton mode="modal">
                      <div className="w-full" onClick={() => setIsMenuOpen(false)}>
                        <StarBorder
                          color="#ffffff"
                          speed="6s"
                          thickness={1.5}
                          className="w-full rounded-xl"
                          innerClassName="flex w-full items-center justify-center rounded-xl bg-neutral-950 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-neutral-900"
                        >
                          Sign In
                        </StarBorder>
                      </div>
                    </SignInButton>
                  </motion.div>
                </SignedOut>

              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>

      {/* ── Hero Section ── */}
      <div className="w-full overflow-hidden">
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
          <div className="absolute -inset-4 rounded-3xl bg-blue-500/10 opacity-50 blur-3xl" />
          <div className="relative">
             <MiniCanvasPreview />
          </div>
        </motion.div>
      </section>
      </div>

      {/* ── Update Modal ── */}
      <AnimatePresence>
        {showUpdateModal && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-neutral-950/60 p-4 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Background click */}
            <div className="absolute inset-0" onClick={closeUpdateModal} />
            
            <motion.div
              className="relative flex w-full max-w-lg flex-col gap-6 rounded-3xl border border-white/10 bg-neutral-900/90 p-8 shadow-2xl backdrop-blur-xl"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              {/* Close Button */}
              <button 
                onClick={closeUpdateModal}
                className="absolute right-6 top-6 rounded-full p-2 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
              >
                <FiX className="h-5 w-5" />
              </button>

              {/* Header */}
              <div>
                <motion.div
                  className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-blue-400"
                >
                  <FiStar className="h-3 w-3" />
                  What's New
                </motion.div>
                <h2 className="text-2xl font-bold text-white sm:text-3xl">Sketch On v2.0</h2>
                <p className="mt-2 text-sm text-white/60">
                  We've upgraded your whiteboard experience with powerful new features, smoother design, and better security.
                </p>
              </div>

              {/* Updates List */}
              <div className="flex flex-col gap-3">
                {[
                  { title: "Smart Shapes", desc: "New shapes integrated with AI-driven optimization options." },
                  { title: "50+ Tech Icons", desc: "A massive new library of technology icons for your architectures." },
                  { title: "Seamless Payments", desc: "Smooth and secure payment gateway integration for credits." },
                  { title: "Enhanced Security", desc: "Email verification added to keep your projects and account safe." },
                  { title: "Premium UI/UX", desc: "Enjoy a noticeably smoother, faster, and more premium interface." },
                ].map((item, i) => (
                  <motion.div 
                    key={item.title}
                    className="flex flex-col gap-1 border-l-2 border-white/20 pl-4 py-1 transition-colors hover:border-white/50"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.1 }}
                  >
                    <h3 className="text-sm font-semibold text-white/90">{item.title}</h3>
                    <p className="text-xs text-white/50">{item.desc}</p>
                  </motion.div>
                ))}
              </div>

              {/* CTA */}
              <div className="mt-4 flex justify-center">
                <StarBorder
                  onClick={closeUpdateModal}
                  color="#3b82f6"
                  speed="4s"
                  thickness={1.5}
                  className="rounded-full shadow-lg"
                  innerClassName="bg-white hover:bg-white/95 text-neutral-950 text-sm font-semibold px-10 py-3.5 rounded-full flex items-center gap-2 cursor-pointer transition-colors"
                >
                  Let's Go
                  <FiArrowRight className="h-4 w-4" />
                </StarBorder>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Hero;