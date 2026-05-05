"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const IMAGES = [
  "/images/rafaels-work/1532477175492536735.jpg",
  "/images/rafaels-work/963732951370043886.jpg",
  "/images/rafaels-work/1166030597421236457.jpg",
  "/images/rafaels-work/1178744785240443283.jpg",
  "/images/rafaels-work/IMG_9805.jpg",
  "/images/rafaels-work/5944414434102812831.jpg",
  "/images/rafaels-work/IMG_9806.jpg",
  "/images/rafaels-work/Screenshot-2026-03-15-at-10.35.52-AM.png",
  "/images/rafaels-work/Screenshot-2026-03-15-at-10.36.06-AM.png",
  "/images/rafaels-work/Screenshot-2026-03-15-at-10.36.19-AM.png",
  "/images/rafaels-work/Screenshot-2026-03-15-at-10.36.36-AM.png",
  "/images/rafaels-work/Screenshot-2026-03-15-at-10.36.44-AM.png",
];

export function RafaelGrid() {
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
