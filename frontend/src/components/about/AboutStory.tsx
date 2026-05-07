"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const easeOut = [0.25, 0.46, 0.45, 0.94] as const;
const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 1.0, ease: easeOut },
};

export function AboutStory() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 300 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 1.2, ease: easeOut }}
      className="relative w-full bg-white"
    >
      <div className="flex w-full flex-col items-stretch md:flex-row md:items-center">
        <motion.div
          {...fadeUp}
          className="flex w-full flex-col items-center px-6 py-10 md:w-[593px] md:flex-shrink-0 md:px-0 md:py-[85px]"
          style={{
            backgroundImage: "url('/images/GrayAbstractSnakeskin.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "0% 50%",
            backgroundRepeat: "no-repeat",
          }}
        >
          <Image
            src="/images/about/Screenshot-2025-08-04-at-9.26.36-PM-1024x715.png"
            alt="Ecdysis dictionary definition card"
            width={1024}
            height={715}
            sizes="(max-width: 768px) 100vw, 504px"
            className="h-auto w-full max-w-[504px] shadow-[0_15px_40px_rgba(0,0,0,0.35)]"
          />
        </motion.div>

        <motion.div
          {...fadeUp}
          className="flex w-full flex-col items-center gap-5 px-6 py-10 md:flex-1 md:px-0 md:py-0 md:pl-[40px]"
        >
          <span
            className="eyebrow"
            style={{ color: "var(--color-ec-tan-soft)" }}
          >
            ECDYSIS
          </span>
          <h2 className="text-center font-script text-[44px] leading-[60px] tracking-[1.5px] text-black md:text-[60px]">
            The Story Behind Our Name
          </h2>
          <div className="flex w-full max-w-[820px] flex-col gap-5 font-sans text-[18px] font-light leading-[30px] text-black">
            <p>
              Ecdysis is more than just a name—it&apos;s a symbol of
              transformation and personal growth. The term comes from biology
              and describes the moment when an organism sheds its outer layer,
              like a snake shedding its skin, to make room for what&apos;s next.
              What&apos;s revealed underneath is renewed, stronger, and ready
              to move forward.
            </p>
            <p>
              This idea resonates deeply with us. Growth isn&apos;t always
              comfortable, but it&apos;s necessary. Ecdysis represents the
              struggle, patience, and intention required to evolve—physically,
              mentally, and personally. It&apos;s about shedding the old and
              stepping into something better.
            </p>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
