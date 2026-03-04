import React from "react";
import { motion } from "framer-motion";
import {
  FiPenTool,
  FiCpu,
  FiBox,
  FiArrowRight,
  FiCheckCircle,
} from "react-icons/fi";

const HowToUse = () => {
  const steps = [
    {
      icon: FiPenTool,
      title: "Draw your system",
      body: "Drag and drop shapes, connect nodes, and lay out your architecture using an intuitive whiteboard canvas.",
    },
    {
      icon: FiCpu,
      title: "Analyze with AI",
      body: "Get instant AI-powered feedback on structure, clarity, and design patterns. Surface improvements without bias.",
    },
    {
      icon: FiBox,
      title: "Use tech icons",
      body: "Access 30+ icons — AWS, Docker, React, Kubernetes and more — to make your diagrams professional and clear.",
    },
  ];

  return (
    <div>
      <section
        id="how-to-use"
        className="border-t border-white/5 bg-neutral-900/40"
      >
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <motion.div
            className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="max-w-2xl space-y-3">
              <motion.p
                className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                How to use
              </motion.p>
              <motion.h2
                className="text-3xl font-semibold sm:text-4xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                From clutter to clarity in three steps.
              </motion.h2>
              <motion.p
                className="text-white/70"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                Sketch On keeps things simple — draw, analyze, and share with
                confidence.
              </motion.p>
            </div>
            <motion.a
              href="/pricing"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-white/70 transition hover:text-white"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ x: 5 }}
            >
              View pricing
              <FiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </motion.a>
          </motion.div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {steps.map((step, idx) => (
              <motion.article
                key={step.title}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:border-white/30"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.2 + idx * 0.1,
                  ease: "easeOut",
                }}
                viewport={{ once: true }}
                whileHover={{
                  y: -8,
                  transition: { type: "spring", stiffness: 300 },
                }}
              >
                {/* Subtle overlay on hover */}
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-5 transition-opacity duration-500" />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <motion.div
                      className="p-3 rounded-2xl bg-white/10 border border-white/10"
                      whileHover={{ rotate: 10, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <step.icon className="h-6 w-6 text-white/80" />
                    </motion.div>

                    <motion.div
                      className="flex items-center gap-2"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 0.5 + idx * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <span className="text-xs uppercase tracking-[0.2em] text-white/50">
                        Step
                      </span>
                      <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10 text-sm font-semibold">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                    </motion.div>
                  </div>

                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-white/70 mb-4">
                    {step.body}
                  </p>

                  {/* Progress indicator */}
                  <div className="flex items-center gap-2">
                    <motion.div
                      className="h-1 bg-white/10 rounded-full flex-1 overflow-hidden"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 0.8 + idx * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <motion.div
                        className="h-full bg-white/40 rounded-full"
                        initial={{ width: "0%" }}
                        whileInView={{ width: "100%" }}
                        transition={{
                          duration: 1,
                          delay: 1 + idx * 0.1,
                          ease: "easeOut",
                        }}
                        viewport={{ once: true }}
                      />
                    </motion.div>
                    <FiCheckCircle className="h-4 w-4 text-white/50" />
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowToUse;
