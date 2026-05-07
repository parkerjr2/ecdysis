"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const easeOut = [0.25, 0.46, 0.45, 0.94] as const;

export function AboutUs() {
  return (
    <motion.section
      id="about"
      initial={{ opacity: 0, y: 150 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 1.2, ease: easeOut }}
      className="relative grid w-full grid-cols-1 items-center bg-white text-black md:min-h-[700px] md:grid-cols-[705fr_735fr]"
    >
      <div className="relative h-[400px] w-full overflow-hidden md:h-full">
        <Image
          src="/images/IMG_9621-scaled.jpg"
          alt="Ecdysis Barbershop storefront in Broken Arrow, Oklahoma"
          fill
          sizes="(max-width: 768px) 100vw, 705px"
          className="object-cover"
          priority
        />
      </div>

      <div className="flex flex-col items-center justify-center gap-[20px] px-6 py-[51px] md:px-[92px]">
        <span className="eyebrow">ABOUT US</span>
        <h2 className="font-script text-[44px] leading-[1] tracking-[1.5px] text-black md:text-[60px] md:leading-[60px]">
          Our Story
        </h2>
        <p className="max-w-[536px] text-justify text-[18px] font-light leading-[30px] text-black">
          Founded in December 2023, Ecdysis Barbershop is a trusted destination for professional
          barbering in Broken Arrow, Oklahoma. We believe the craft of barbering is more than a
          profession; it&apos;s a calling built on trust, respect, and pride in our work. We strive
          to honor these values by creating a culture rooted in community and meaningful connection
          for both barbers and clients. Our skilled team offers premium haircuts, color services,
          straight razor shaves, beard treatments, basic skincare services, and chair massage. We
          use only the highest-quality, professional-grade products including Keune and our own
          in-house Perfecto Reserve beard oils. We proudly serve clients throughout Broken Arrow,
          Tulsa, Bixby, Jenks, and the surrounding communities.
        </p>
        <Link href="#booking" className="ec-button">
          LEARN MORE
        </Link>
      </div>
    </motion.section>
  );
}
