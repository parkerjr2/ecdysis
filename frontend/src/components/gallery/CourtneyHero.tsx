"use client";

import { motion } from "framer-motion";

const easeOut = [0.25, 0.46, 0.45, 0.94] as const;
const fadeInRight = {
  initial: { opacity: 0, x: 60 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.9, ease: easeOut },
};

export function CourtneyHero() {
  return (
    <section className="relative w-full bg-ec-dark">
      <div aria-hidden className="h-[150px] w-full bg-ec-dark" />
      <div
        className="relative min-h-[80vh] w-full bg-ec-dark py-[15px]"
        style={{
          backgroundImage: "url('/images/courtneys-work/DM6A4426.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
      >
        <motion.div
          {...fadeInRight}
          className="absolute bottom-[55px] right-[35px] flex w-auto max-w-[483px] items-center bg-black/[0.63] px-[40px] py-[35px]"
        >
          <h2 className="font-script text-[44px] leading-[1.1] tracking-[1.5px] text-white md:text-[56px]">
            Courtney&rsquo;s Work
          </h2>
        </motion.div>
      </div>
    </section>
  );
}
