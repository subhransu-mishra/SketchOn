import React from "react";
import { motion } from "framer-motion";
import { FiMessageCircle, FiHeart, FiSend } from "react-icons/fi";

const Reviews = () => {
  return (
    <div>
      <section
        id="reviews"
        className="border-t border-white/5 bg-neutral-900/40"
      >
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <motion.div
            className="flex flex-col items-center text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <FiMessageCircle className="h-8 w-8 text-white/50" />
            </motion.div>

            <motion.h2
              className="text-3xl font-semibold sm:text-4xl mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              We'd Love Your Feedback
            </motion.h2>

            <motion.p
              className="max-w-xl text-lg text-white/60 mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Your feedback helps us reach more people and build a better
              product for everyone.
            </motion.p>

            <motion.div
              className="grid gap-6 sm:grid-cols-3 w-full max-w-3xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
            >
              {[
                {
                  icon: FiHeart,
                  title: "Share Your Experience",
                  desc: "Tell us what you love and what we can improve",
                },
                {
                  icon: FiSend,
                  title: "Spread the Word",
                  desc: "Help fellow developers discover Sketch On",
                },
                {
                  icon: FiMessageCircle,
                  title: "Shape the Future",
                  desc: "Your ideas drive our product roadmap",
                },
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-white/20"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <item.icon className="h-6 w-6 text-white/50 mb-3" />
                  <p className="text-sm font-semibold text-white mb-1">
                    {item.title}
                  </p>
                  <p className="text-xs text-white/50 leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            <motion.p
              className="mt-8 text-sm text-white/40"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              viewport={{ once: true }}
            >
              Have feedback? Drop us a ⭐
              <a
                href="https://github.com/subhransu-mishra/SketchOn"
                className="text-white/60 underline underline-offset-2 hover:text-white transition"
              >
                here
              </a>
            </motion.p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Reviews;
