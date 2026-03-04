import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiAlertCircle } from "react-icons/fi";

const BetaPopup = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem("beta_popup_seen");
    if (!seen) {
      // Small delay so the page loads first
      const timer = setTimeout(() => setShow(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem("beta_popup_seen", "true");
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleDismiss}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Card */}
          <motion.div
            className="relative z-10 max-w-md w-full rounded-2xl border border-white/15 bg-neutral-900/90 backdrop-blur-xl p-8 text-center shadow-2xl"
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {/* Glow effect */}
            <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

            <div className="relative">
              <motion.div
                className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-white/15 bg-white/5"
                initial={{ rotate: -15 }}
                animate={{ rotate: 0 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <FiAlertCircle className="h-7 w-7 text-white/80" />
              </motion.div>

              <h2 className="text-2xl font-semibold mb-2">Beta Version</h2>
              <p className="text-white/60 leading-relaxed mb-6">
                Sketch On is currently in beta. Some features are still under
                development, and you may encounter occasional bugs. We
                appreciate your patience and feedback!
              </p>

              <motion.button
                onClick={handleDismiss}
                className="w-full rounded-xl cursor-pointer bg-white py-3 text-sm font-semibold text-neutral-950 transition-colors hover:bg-white/90"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Got it, let's go
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BetaPopup;
