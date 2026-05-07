"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const easeOut = [0.25, 0.46, 0.45, 0.94] as const;
const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 1.0, ease: easeOut },
};

export function OurPeople() {
  return (
    <motion.section
      id="team"
      initial={{ opacity: 0, y: 300 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 1.2, ease: easeOut }}
      className="relative grid w-full grid-cols-1 items-center bg-white text-black md:min-h-[600px] md:grid-cols-[590fr_850fr]"
    >
      <motion.div
        {...fadeUp}
        className="flex flex-col items-start justify-center gap-[20px] px-6 py-[51px] md:items-center md:px-[40px] md:text-center"
      >
        <span className="eyebrow">OUR PEOPLE</span>
        <h2 className="font-script text-[44px] leading-[1] tracking-[1.5px] text-black md:text-[60px] md:leading-[60px]">
          The Crew
        </h2>
        <p className="max-w-[470px] text-justify text-[18px] font-light leading-[30px] text-black">
          Our team at Ecdysis Barbershop blends skilled barbering with an approachable,
          client-first mindset. We take pride in our craft, building real connections with clients
          through honest conversation and a laid-back, welcoming vibe. With the added support of
          our in-house chair massage therapist, every visit is designed to help our clients relax,
          reset, and leave feeling your best.
        </p>
        <Link href="#booking" className="ec-button">
          MEET OUR TEAM
        </Link>
      </motion.div>

      <motion.div
        {...fadeUp}
        className="relative h-[400px] w-full overflow-hidden md:h-full"
      >
        <Image
          src="/images/16X24-Print-29.png"
          alt="The Ecdysis Barbershop team laughing together"
          fill
          sizes="(max-width: 768px) 100vw, 850px"
          className="object-cover"
        />
      </motion.div>
    </motion.section>
  );
}
