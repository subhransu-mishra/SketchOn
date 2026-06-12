import React from "react";
import { motion } from "framer-motion";
import {
  FiCpu,
  FiShield,
  FiZap,
  FiShare2,
  FiCheckCircle,
  FiTerminal,
  FiCode,
} from "react-icons/fi";

const ShowcaseFeatures = () => {
  const features = [
    {
      icon: FiCpu,
      title: "AI Architectural Review",
      desc: "Instant assessment of system architectures. Identifies potential bottlenecks, design pattern violations, and data flow optimizations.",
      color: "from-blue-500/10 to-indigo-500/10",
      iconColor: "text-blue-400",
      borderColor: "group-hover:border-blue-500/35",
      badge: "Gemini Pro Powered",
    },
    {
      icon: FiShield,
      title: "Security Threat Assessment",
      desc: "Scans system diagrams for exposures. Automatically highlights unencrypted data stores, public subnets risks, and API gateway vulnerabilities.",
      color: "from-red-500/10 to-rose-500/10",
      iconColor: "text-red-400",
      borderColor: "group-hover:border-red-500/35",
      badge: "Real-time Audits",
    },
    {
      icon: FiZap,
      title: "Latency & Scalability Insights",
      desc: "Simulates network request pathways. Detects performance limits, database contention hotspots, and cache starvation bottlenecks.",
      color: "from-amber-500/10 to-orange-500/10",
      iconColor: "text-amber-400",
      borderColor: "group-hover:border-amber-500/35",
      badge: "Auto-Calculated",
    },
    {
      icon: FiShare2,
      title: "Seamless Team Collaboration",
      desc: "Generate production-ready share links. Copy public links in a click to sync diagram structures during engineering standups and reviews.",
      color: "from-emerald-500/10 to-teal-500/10",
      iconColor: "text-emerald-400",
      borderColor: "group-hover:border-emerald-500/35",
      badge: "Instant Links",
    },
  ];

  return (
    <section className="relative bg-neutral-950 py-24 border-t border-white/5 overflow-hidden">
      
      {/* Background radial highlight */}
      <div className="absolute top-1/2 right-1/4 w-[600px] h-[600px] rounded-full bg-blue-500/5 blur-[150px] pointer-events-none" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 relative z-10">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1 text-xs font-semibold text-blue-300 mb-6"
          >
            <FiCode className="h-3.5 w-3.5" /> High-Performance Capabilities
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl font-extrabold sm:text-4xl lg:text-5xl tracking-tight mb-6"
          >
            Engineered For Modern Systems
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-white/60 leading-relaxed"
          >
            Unlike standard sketching boards, Sketch On evaluates your nodes, edges, and annotations dynamically to produce actionable architectural reports.
          </motion.p>
        </div>

        {/* Feature Grid */}
        <div className="grid gap-8 md:grid-cols-2">
          {features.map((feat, idx) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: idx * 0.1, ease: "easeOut" }}
              whileHover={{ y: -6 }}
              className="group relative rounded-3xl border border-white/5 bg-neutral-900/30 backdrop-blur-md p-8 flex flex-col justify-between overflow-hidden transition-all duration-300 hover:border-white/10"
            >
              
              {/* Internal card background glow */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <div className="relative z-10">
                
                {/* Header elements */}
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-4 rounded-2xl bg-white/5 border border-white/10 ${feat.iconColor}`}>
                    <feat.icon className="h-6 w-6" />
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-widest bg-white/5 px-3 py-1 rounded-full border border-white/5 text-white/60">
                    {feat.badge}
                  </span>
                </div>

                <h3 className="text-xl font-bold mb-3 group-hover:text-white transition-colors">{feat.title}</h3>
                <p className="text-sm text-white/60 leading-relaxed mb-6 group-hover:text-white/80 transition-colors">
                  {feat.desc}
                </p>
              </div>

              {/* Animated Interactive Mock Panel */}
              <div className="relative z-10 rounded-xl bg-black/40 border border-white/5 p-4 font-mono text-xs text-white/70 overflow-hidden select-none">
                <div className="flex items-center gap-1.5 border-b border-white/5 pb-2 mb-2 text-white/40">
                  <FiTerminal className="h-3.5 w-3.5" />
                  <span>system_analysis_log.json</span>
                </div>
                {idx === 0 && (
                  <div className="space-y-1">
                    <p className="text-blue-400">✓ Detected 4 nodes (API, DB, Cache, CDN)</p>
                    <p className="text-emerald-400">&gt; AI suggestions: "Move Cache node behind API."</p>
                    <p className="text-white/30">&gt; Estimated latency savings: ~45ms</p>
                  </div>
                )}
                {idx === 1 && (
                  <div className="space-y-1">
                    <p className="text-rose-400">⚠ Vulnerability detected: Public SQL Database</p>
                    <p className="text-amber-400">&gt; Action: "Encrypt connection &amp; assign to private subnet."</p>
                    <p className="text-white/30">&gt; Risk profile: High exposure</p>
                  </div>
                )}
                {idx === 2 && (
                  <div className="space-y-1">
                    <p className="text-amber-400">★ Estimating read paths for Node: SQL Cluster</p>
                    <p className="text-blue-400">&gt; Throughput limit: 1200 req/sec</p>
                    <p className="text-white/30">&gt; Load profile: Peak usage simulated safely</p>
                  </div>
                )}
                {idx === 3 && (
                  <div className="space-y-1">
                    <p className="text-emerald-400">✓ Shared link generated securely</p>
                    <p className="text-blue-400">&gt; URL: sketchon.app/share/dndnode_f82a93</p>
                    <p className="text-white/30">&gt; Status: Public access enabled</p>
                  </div>
                )}
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ShowcaseFeatures;
