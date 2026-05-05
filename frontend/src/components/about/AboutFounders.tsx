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

export function AboutFounders() {
  return (
    <section className="relative w-full bg-ec-dark">
      <div className="mx-auto flex w-full max-w-[1500px] flex-col items-stretch md:flex-row">
        <motion.div
          {...fadeUp}
          className="flex w-full flex-col justify-center px-6 py-10 md:w-1/2 md:flex-shrink-0 md:items-center md:px-12 md:py-[30px]"
        >
          <div className="flex w-full max-w-[491px] flex-col items-center">
            <span
              className="eyebrow"
              style={{ color: "var(--color-ec-tan-soft)" }}
            >
              COURTNEY &amp; RAFAEL
            </span>
            <h2 className="mt-[10px] text-center font-script text-[44px] leading-[60px] tracking-[1.5px] text-white md:text-[60px]">
              Meet Our Founders
            </h2>
            <div className="mt-5 flex w-full flex-col gap-5 text-justify font-sans text-[18px] font-light leading-[30px] text-white">
              <p>
                The partnership between Courtney and Rafael is rooted in a
                decade of mutual respect and a shared passion for the craft.
                They first crossed paths in 2013 at a crossroads in their
                careers—Courtney was joining the ranks as an instructor just as
                Rafael was graduating and preparing to make his mark. After
                spending five years working side by side in the same shop
                starting in 2018, they realized their professional values were
                perfectly aligned.
              </p>
              <p>
                With a joint focus on community and continuous education, they
                decided to build something of their own. They proudly opened
                the doors of Ecdysis Barbershop in December 2023, bringing over
                a decade of collective history to every chair.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          {...fadeUp}
          className="flex w-full flex-col items-center px-6 py-10 md:w-1/2 md:flex-shrink-0 md:items-start md:justify-start md:px-0 md:py-[85px] md:pr-[60px]"
        >
          <div className="relative h-[600px] w-full max-w-[469px]">
            <Image
              src="/images/about/IMG_8984-768x1151.jpg"
              alt="Courtney and Rafael, founders of Ecdysis Barbershop"
              fill
              sizes="(max-width: 768px) 100vw, 469px"
              className="object-cover shadow-[0_0_10px_rgba(0,0,0,0.5)]"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute z-10 border-2 border-ec-tan-active"
              style={{ top: -20, left: 15, width: 474, height: 605 }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
