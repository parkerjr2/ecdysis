"use client";

import { motion } from "framer-motion";

const easeOut = [0.25, 0.46, 0.45, 0.94] as const;

export function ServicesTitle() {
  return (
    <motion.section
      id="services"
      initial={{ opacity: 0, y: 300 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 1.2, ease: easeOut }}
      className="relative w-full bg-ec-dark pt-[55px] pb-[30px] text-center"
    >
      <div className="mx-auto flex max-w-[800px] flex-col items-center gap-[20px] px-6">
        <span className="eyebrow">OUR SERVICES</span>
        <h2 className="font-script text-[44px] leading-[44px] tracking-[1.5px] text-white md:text-[60px] md:leading-[60px]">
          What We Do
        </h2>
      </div>
    </motion.section>
  );
}
