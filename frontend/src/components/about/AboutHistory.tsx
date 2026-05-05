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

type HistoryCard = {
  src: string;
  alt: string;
  body: string;
};

const cards: HistoryCard[] = [
  {
    src: "/images/about/ChatGPT-Image-Mar-2-2026-03_41_04-PM.png",
    alt: "Historic depiction of barber-surgeons at work",
    body: "The craft of barbering is a centuries-old tradition that has evolved over time. In its early days, barbers were also surgeons, dentists, and pharmacists, performing medical procedures including bloodletting and tooth extraction. As medicine advanced, barbers began to focus more on haircutting and shaving.",
  },
  {
    src: "/images/about/ChatGPT-Image-Mar-2-2026-03_46_23-PM.png",
    alt: "Caduceus and barber pole symbolism",
    body: "At Ecdysis, we honor these barber roots. Our logo pays homage to this history, inspired by the barber pole's connection to the Staff of Hermes and the Rod of Asclepius—symbols with connections to healing, alchemy, trade, and wisdom.",
  },
  {
    src: "/images/about/Untitled-design-34.png",
    alt: "Vintage barbershop community gathering",
    body: "The barbershop has always been more than just a place for haircuts—it's a community sanctuary. We take pride in our work and our roles as confidants and friends, and we strive to honor and recreate the traditional barbershop culture here in Broken Arrow.",
  },
];

export function AboutHistory() {
  return (
    <section
      className="relative w-full"
      style={{
        backgroundImage: "url('/images/GrayAbstractSnakeskin.jpg')",
        backgroundSize: "contain",
        backgroundPosition: "0 0",
        backgroundRepeat: "repeat",
      }}
    >
      <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center px-6 pb-[50px] pt-[30px] md:px-0">
        <motion.div
          {...fadeUp}
          className="flex w-full flex-col items-center gap-5 bg-ec-dark px-6 pb-[30px] pt-[40px] md:px-0"
        >
          <span
            className="eyebrow"
            style={{ color: "var(--color-ec-tan-soft)" }}
          >
            BARBERING
          </span>
          <h2 className="text-center font-script text-[44px] leading-[60px] tracking-[1.5px] text-white md:text-[60px]">
            History of the Trade
          </h2>
        </motion.div>

        <div className="grid w-full grid-cols-1 gap-5 bg-ec-dark px-5 pb-[30px] pt-[40px] md:grid-cols-3">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.9, ease: easeOut, delay: i * 0.1 }}
              className="flex flex-col"
            >
              <div className="relative aspect-[3/2] w-full overflow-hidden">
                <Image
                  src={card.src}
                  alt={card.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 373px"
                  className="object-cover"
                />
              </div>
              <p className="mt-5 font-sans text-[15px] font-light leading-[26px] text-white">
                {card.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
