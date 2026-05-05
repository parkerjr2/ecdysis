"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const IMAGES = [
  "/images/corneliuss-work/DM6A4297.jpg",
  "/images/corneliuss-work/DM6A4223-1.jpg",
  "/images/corneliuss-work/DM6A4221-1.jpg",
  "/images/corneliuss-work/DM6A4315-1.jpg",
  "/images/corneliuss-work/DM6A4265-1.jpg",
  "/images/corneliuss-work/DM6A4368.jpg",
  "/images/corneliuss-work/DM6A4313.jpg",
  "/images/corneliuss-work/DM6A4232.jpg",
  "/images/corneliuss-work/DM6A4375.jpg",
];

export function CorneliusGrid() {
  const [openIndex, setOpenIndex] = useState(-1);

  return (
    <section className="w-full bg-ec-dark py-[60px]">
      <div className="mx-auto grid w-full max-w-[1320px] grid-cols-1 gap-[10px] px-[60px] sm:grid-cols-2 md:grid-cols-4 md:gap-[15px]">
        {IMAGES.map((src, i) => (
          <motion.button
            key={src}
            type="button"
            onClick={() => setOpenIndex(i)}
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.05 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="group relative aspect-square w-full overflow-hidden bg-black/20 outline-none focus:outline-none focus-visible:outline-none"
            aria-label={`Open image ${i + 1}`}
          >
            <Image
              src={src}
              alt=""
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
              className="object-cover"
            />
            <span
              aria-hidden
              className="absolute inset-0 bg-black/0 transition-colors duration-[800ms] ease-out group-hover:bg-black/50"
            />
          </motion.button>
        ))}
      </div>
      <Lightbox
        open={openIndex >= 0}
        index={openIndex < 0 ? 0 : openIndex}
        close={() => setOpenIndex(-1)}
        slides={IMAGES.map((src) => ({ src }))}
      />
    </section>
  );
}
