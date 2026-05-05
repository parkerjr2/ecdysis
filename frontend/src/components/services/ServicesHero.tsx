"use client";

import { motion } from "framer-motion";

const easeOut = [0.25, 0.46, 0.45, 0.94] as const;
const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.9, ease: easeOut },
};

export function ServicesHero() {
  return (
    <section className="relative w-full bg-ec-dark">
      <div aria-hidden className="h-[150px] w-full bg-ec-dark" />
      <div
        className="relative min-h-[80vh] w-full bg-ec-dark py-[15px]"
        style={{
          backgroundImage: "url('/images/services/DM6A4439-1.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
      >
        <motion.div
          {...fadeUp}
          className="absolute bottom-[55px] right-[35px] flex h-[126px] w-auto items-center justify-center bg-black/[0.63] px-[40px] py-[35px]"
        >
          <h2 className="whitespace-nowrap font-script text-[44px] leading-[1] tracking-[1.5px] text-white md:text-[56px]">
            Our Services
          </h2>
        </motion.div>
      </div>
    </section>
  );
}
