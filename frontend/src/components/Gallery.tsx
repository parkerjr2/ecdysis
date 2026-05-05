"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const easeOut = [0.25, 0.46, 0.45, 0.94] as const;

type Photo = {
  thumb: string;
  full: string;
  alt: string;
  w: number;
  h: number;
};

const PHOTOS: Photo[] = [
  { thumb: "/images/DM6A4309-683x1024.jpg", full: "/images/gallery-full/DM6A4309.jpg", alt: "Coloring service in progress", w: 683, h: 1024 },
  { thumb: "/images/DM6A4621-683x1024.jpg", full: "/images/gallery-full/DM6A4621.jpg", alt: "Clipper cut work", w: 683, h: 1024 },
  { thumb: "/images/DM6A4514-1024x683.jpg", full: "/images/gallery-full/DM6A4514.jpg", alt: "Beard work", w: 1024, h: 683 },
  { thumb: "/images/IMG_9003-1-683x1024.jpg", full: "/images/gallery-full/IMG_9003.jpg", alt: "Detailed barbering", w: 683, h: 1024 },
  { thumb: "/images/DM6A4174-683x1024.jpg", full: "/images/gallery-full/DM6A4174.jpg", alt: "Wash and shampoo", w: 683, h: 1024 },
  { thumb: "/images/DM6A4315-2-683x1024.jpg", full: "/images/gallery-full/DM6A4315-2.jpg", alt: "Precision detail work", w: 683, h: 1024 },
  { thumb: "/images/DM6A4190-683x1024.jpg", full: "/images/gallery-full/DM6A4190.jpg", alt: "Razor service", w: 683, h: 1024 },
  { thumb: "/images/DM6A4643-1024x1024.jpg", full: "/images/gallery-full/DM6A4643.jpg", alt: "Straight razor finish", w: 1024, h: 1024 },
];

export function Gallery() {
  const [openIndex, setOpenIndex] = useState(-1);

  return (
    <section id="gallery" className="relative w-full bg-ec-dark py-20 md:py-24 lg:py-28">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1.0, ease: easeOut }}
        className="mx-auto mb-12 flex max-w-[800px] flex-col items-center gap-3 px-6 text-center md:mb-16"
      >
        <span className="eyebrow">GALLERY</span>
        <h2 className="font-script text-[44px] leading-[1.05] text-white md:text-[60px] lg:text-[72px]">
          Our Work
        </h2>
      </motion.div>

      <div className="mx-auto grid w-full max-w-[1200px] grid-cols-2 gap-[10px] px-6 md:grid-cols-4 md:gap-[8px]">
        {PHOTOS.map((p, i) => (
          <motion.button
            key={p.full}
            type="button"
            onClick={() => setOpenIndex(i)}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.35, ease: easeOut, delay: (i % 4) * 0.08 }}
            aria-label={`Open ${p.alt} in lightbox`}
            className="group relative block aspect-square overflow-hidden cursor-pointer outline-none focus:outline-none focus-visible:outline-none"
          >
            <Image
              src={p.thumb}
              alt={p.alt}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition-transform duration-[800ms] ease-out group-hover:scale-110"
            />
          </motion.button>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8, ease: easeOut }}
        className="mt-12 flex justify-center md:mt-16"
      >
        <Link href="#gallery" className="ec-button">
          VIEW ALL PHOTOS
        </Link>
      </motion.div>

      <Lightbox
        open={openIndex >= 0}
        index={openIndex < 0 ? 0 : openIndex}
        close={() => setOpenIndex(-1)}
        slides={PHOTOS.map((p) => ({ src: p.full, alt: p.alt, width: p.w * 3, height: p.h * 3 }))}
        animation={{ swipe: 250, fade: 250 }}
        controller={{ closeOnBackdropClick: true }}
        styles={{
          container: { backgroundColor: "rgba(0, 0, 0, 0.8)" },
        }}
      />
    </section>
  );
}
