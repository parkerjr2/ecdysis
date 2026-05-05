"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const IMAGES = [
  "/images/korys-work/Screenshot-2026-03-15-at-9.46.31-AM.png",
  "/images/korys-work/Screenshot-2026-03-15-at-9.45.43-AM.png",
  "/images/korys-work/491406732_1244122577716507_4871331676960842279_n.jpg",
  "/images/korys-work/IMG_1528.jpg",
  "/images/korys-work/pic1.jpg",
  "/images/korys-work/116045386_148487156904485_7434066771379115230_n.jpg",
  "/images/korys-work/117303862_154634529623081_8048384495401028457_n.jpg",
  "/images/korys-work/469095093_1118644053222119_9058236532141719061_n.jpg",
  "/images/korys-work/481235111_1206183981510367_3007545918235819517_n.jpg",
  "/images/korys-work/481335053_1206183971510368_831903113899760699_n.jpg",
  "/images/korys-work/IMG_1530-2.jpg",
  "/images/korys-work/IMG_1531.jpg",
  "/images/korys-work/IMG_1532.jpg",
  "/images/korys-work/PXL_20260225_233222679_Original-scaled.jpg",
  "/images/korys-work/Screenshot-2026-03-15-at-9.46.45-AM.png",
];

export function KoryGrid() {
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
