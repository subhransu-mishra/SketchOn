import React from "react";
import { motion } from "framer-motion";
import { FiMessageCircle, FiStar, FiHeart } from "react-icons/fi";

const Reviews = () => {
  const reviewsRow1 = [
    {
      name: "Aravind Nair",
      role: "Senior Frontend Architect at Swiggy",
      review: "The AI design critique is unbelievably accurate. It found redundant container boxes in my wireframes instantly.",
      rating: 5,
      initial: "AN",
      color: "from-blue-500 to-indigo-500"
    },
    {
      name: "Sarah Jenkins",
      role: "Systems Designer at Netflix",
      review: "Sketch On has completely streamlined how our engineering team brainstorms system design diagrams.",
      rating: 5,
      initial: "SJ",
      color: "from-purple-500 to-pink-500"
    },
    {
      name: "Rohan Gupta",
      role: "Software Engineer II at Microsoft",
      review: "Using the tech icons list with AI reviews makes preparing for System Design interviews incredibly easy.",
      rating: 5,
      initial: "RG",
      color: "from-emerald-400 to-cyan-500"
    },
    {
      name: "Elena Rostova",
      role: "Tech Lead at Telegram",
      review: "I love the clean dark aesthetic and micro-animations. It feels premium and behaves beautifully.",
      rating: 5,
      initial: "ER",
      color: "from-fuchsia-500 to-rose-500"
    }
  ];

  const reviewsRow2 = [
    {
      name: "Deepak Rao",
      role: "Solutions Architect at AWS",
      review: "A gorgeous, super responsive canvas interface. The AI feedback on latency points was a massive help.",
      rating: 5,
      initial: "DR",
      color: "from-orange-400 to-red-500"
    },
    {
      name: "Vikram Malhotra",
      role: "Security Analyst at Palo Alto",
      review: "The automated architecture reviews identified a security exposure in my database layout. Brilliant tool!",
      rating: 5,
      initial: "VM",
      color: "from-amber-400 to-orange-600"
    },
    {
      name: "Marcus Aurelius",
      role: "Principal Engineer at Stripe",
      review: "The system design templates saved me hours of drafting for a major architecture review proposal.",
      rating: 5,
      initial: "MA",
      color: "from-teal-400 to-emerald-600"
    },
    {
      name: "Sophia Zhang",
      role: "Tech Lead at Uber",
      review: "The PDF export and link sharing are seamless. We use it weekly for system architecture syncs.",
      rating: 5,
      initial: "SZ",
      color: "from-pink-500 to-rose-600"
    }
  ];

  // Duplicate the reviews to achieve seamless loop
  const doubleRow1 = [...reviewsRow1, ...reviewsRow1, ...reviewsRow1];
  const doubleRow2 = [...reviewsRow2, ...reviewsRow2, ...reviewsRow2];

  return (
    <section id="reviews" className="relative border-t border-white/5 bg-neutral-950 py-24 overflow-hidden">
      
      {/* Inline styles for infinite marquee */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-33.33%); }
        }
        @keyframes marquee-reverse {
          0% { transform: translateX(-33.33%); }
          100% { transform: translateX(0%); }
        }
        .animate-marquee {
          animation: marquee 35s linear infinite;
        }
        .animate-marquee-reverse {
          animation: marquee-reverse 35s linear infinite;
        }
        .animate-marquee:hover, .animate-marquee-reverse:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Futuristic Background Gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 relative z-10">
        
        {/* Section Header */}
        <motion.div
          className="flex flex-col items-center text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div
            className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white/70"
            whileHover={{ scale: 1.05, rotate: 5 }}
          >
            <FiMessageCircle className="h-6 w-6" />
          </motion.div>
          
          <h2 className="text-3xl font-extrabold sm:text-4xl lg:text-5xl tracking-tight mb-4">
            Trusted by Builders &amp; Engineers
          </h2>
          <p className="max-w-2xl text-lg text-white/60">
            See how software engineers, tech leads, and solutions architects use Sketch On to design their systems.
          </p>
        </motion.div>

        {/* Marquee Wrapper Container: Restricted width with fade edge masking */}
        <div className="max-w-5xl mx-auto relative rounded-3xl border border-white/5 bg-neutral-900/10 p-6 overflow-hidden">
          {/* Left/Right Edge Fades */}
          <div className="absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent z-20 pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l from-neutral-950 via-neutral-950/80 to-transparent z-20 pointer-events-none" />

          {/* Marquee Row 1 (Moving Left) */}
          <div className="flex gap-6 mb-6 overflow-hidden select-none py-2 pointer-events-auto">
            <div className="flex gap-6 animate-marquee shrink-0">
              {doubleRow1.map((rev, index) => (
                <div
                  key={index}
                  className="w-[340px] shrink-0 rounded-2xl border border-white/5 bg-neutral-900/40 backdrop-blur-md p-6 flex flex-col justify-between shadow-xl transition-all duration-300 hover:border-white/15 hover:bg-neutral-900/60 hover:scale-[1.01] hover:shadow-indigo-500/5"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${rev.color} flex items-center justify-center font-bold text-xs text-white`}>
                        {rev.initial}
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-white">{rev.name}</h4>
                        <p className="text-[10px] text-white/50">{rev.role}</p>
                      </div>
                    </div>
                    <p className="text-xs text-white/70 leading-relaxed italic mb-4">
                      "{rev.review}"
                    </p>
                  </div>
                  <div className="flex gap-0.5 text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <FiStar key={i} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Marquee Row 2 (Moving Right) */}
          <div className="flex gap-6 overflow-hidden select-none py-2 pointer-events-auto">
            <div className="flex gap-6 animate-marquee-reverse shrink-0">
              {doubleRow2.map((rev, index) => (
                <div
                  key={index}
                  className="w-[340px] shrink-0 rounded-2xl border border-white/5 bg-neutral-900/40 backdrop-blur-md p-6 flex flex-col justify-between shadow-xl transition-all duration-300 hover:border-white/15 hover:bg-neutral-900/60 hover:scale-[1.01] hover:shadow-purple-500/5"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${rev.color} flex items-center justify-center font-bold text-xs text-white`}>
                        {rev.initial}
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-white">{rev.name}</h4>
                        <p className="text-[10px] text-white/50">{rev.role}</p>
                      </div>
                    </div>
                    <p className="text-xs text-white/70 leading-relaxed italic mb-4">
                      "{rev.review}"
                    </p>
                  </div>
                  <div className="flex gap-0.5 text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <FiStar key={i} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Github Star CTA */}
        <motion.div
          className="mt-16 text-center text-sm text-white/40 flex items-center justify-center gap-2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          Have feedback or want to request features? Connect with us on
          <a
            href="https://github.com/subhransu-mishra/SketchOn"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition hover:underline underline-offset-2"
          >
            <FiHeart className="h-3 w-3 text-rose-500 fill-current" /> GitHub
          </a>
        </motion.div>

      </div>
    </section>
  );
};

export default Reviews;
