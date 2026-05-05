"use client";

import { motion } from "framer-motion";
import { GoogleReviewsCarousel } from "@/components/GoogleReviewsCarousel";
import type { Review } from "@/data/reviews";

const easeOut = [0.25, 0.46, 0.45, 0.94] as const;

type Props = {
  reviews?: Review[];
  totalCount?: number;
};

export function Testimonials({ reviews, totalCount }: Props = {}) {
  return (
    <section
      className="relative w-full bg-ec-cream py-[45px]"
      style={{
        backgroundImage: "url('/images/GrayAbstractSnakeskin.jpg')",
        backgroundSize: "contain",
        backgroundPosition: "0 0",
        backgroundRepeat: "repeat",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1.0, ease: easeOut }}
        className="mx-auto flex w-full max-w-[1200px] flex-col items-center rounded-none bg-white px-8 py-12 shadow-[0_4px_24px_rgba(0,0,0,0.08)]"
      >
        <span
          className="eyebrow block w-full"
          style={{ color: "var(--color-ec-tan-soft)" }}
        >
          TESTIMONIALS
        </span>
        <h2 className="mt-[20px] text-center font-script text-[44px] leading-[44px] tracking-[1.5px] text-black md:text-[60px] md:leading-[60px]">
          What Our Clients Say
        </h2>
        <GoogleReviewsCarousel reviews={reviews} totalCount={totalCount} />
      </motion.div>
    </section>
  );
}
