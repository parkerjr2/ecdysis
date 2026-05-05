"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const easeOut = [0.25, 0.46, 0.45, 0.94] as const;

export function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[600px] w-full items-end overflow-hidden bg-cover bg-fixed bg-[center_top] md:min-h-[700px] lg:min-h-[900px]"
      style={{ backgroundImage: "url('/images/16X24-Print-8-2.png')" }}
    >
      <div aria-hidden className="absolute inset-0 bg-black/15" />

      <motion.div
        initial={{ opacity: 0, scale: 0.85, rotate: -6 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.8, ease: easeOut, delay: 0.3 }}
        aria-label="Best in BA 2025 Winner"
        className="absolute right-4 top-28 z-20 hidden md:block md:right-10 md:top-36 lg:right-16 lg:top-44"
      >
        <Image
          src="/images/best-in-ba-badge.png"
          alt="Best in BA 2025 Winner — Broken Arrow, Oklahoma"
          width={1200}
          height={1200}
          priority
          className="h-[170px] w-auto drop-shadow-[0_8px_20px_rgba(0,0,0,0.35)] md:h-[195px] lg:h-[215px]"
        />
      </motion.div>

      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] items-end px-6 pb-16 md:px-[60px] md:pb-[65px]">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, ease: easeOut, delay: 0.4 }}
          className="flex flex-col items-start gap-[28px]"
        >
          <h1 className="font-sans text-[28px] font-bold leading-[1] tracking-[1px] text-[#ECECEC] md:text-[32px] md:leading-[32px] lg:text-[35px] lg:leading-[35px]">
            ECDYSIS BARBERSHOP
            <br />
            BROKEN ARROW
          </h1>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, ease: easeOut, delay: 0.7 }}
          >
            <Link
              href="#booking"
              className="inline-block bg-ec-green px-[45px] py-[14px] font-script text-[30px] leading-none tracking-[1px] text-white transition-colors duration-300 hover:bg-ec-green-light"
            >
              BOOK NOW!
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
