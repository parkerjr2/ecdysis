"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const easeOut = [0.25, 0.46, 0.45, 0.94] as const;
const sectionFadeUp = {
  initial: { opacity: 0, y: 300 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 1.2, ease: easeOut },
};

export function AboutHero() {
  return (
    <>
      {/* Hero image panel with "Our Shop" tag */}
      <motion.section
        {...sectionFadeUp}
        className="relative w-full bg-ec-dark"
      >
        <div aria-hidden className="h-[150px] w-full bg-ec-dark" />
        <div
          className="relative min-h-[720px] w-full bg-ec-dark bg-cover bg-center bg-no-repeat py-[15px]"
          style={{ backgroundImage: "url('/images/about/DM6A4203.jpg')" }}
        >
          <div className="absolute bottom-[55px] left-[35px] flex h-[126px] w-[205px] items-center justify-center bg-black/[0.63]">
            <h2 className="font-script text-[44px] leading-[1] tracking-[1.5px] text-white md:text-[56px]">
              Our Shop
            </h2>
          </div>
        </div>
      </motion.section>

      {/* "Thank You, Broken Arrow" block — independent fade-up trigger */}
      <motion.section
        {...sectionFadeUp}
        className="w-full bg-ec-dark py-[75px]"
      >
        <div className="mx-auto flex w-full max-w-[1200px] flex-col bg-white">
          <div className="flex flex-col items-center px-6 pb-[40px] pt-[45px] md:px-[30px]">
            <h2 className="text-center font-script text-[44px] leading-[1] tracking-[1.5px] text-black md:text-[60px]">
              Thank You, Broken Arrow!
            </h2>
            <p className="mt-6 max-w-[820px] text-center font-sans text-[18px] font-light leading-[28px] text-black md:text-[20px] md:leading-[30px]">
              In 2025, Ecdysis Barbershop was voted{" "}
              <strong className="font-bold">
                Best Barbershop in Broken Arrow
              </strong>
              . We&apos;re grateful for the support of our community, family,
              and friends, and we look forward to providing exceptional
              haircuts and an outstanding barbershop experience to Broken Arrow
              and surrounding areas in the future.
            </p>
          </div>

          <div className="grid w-full grid-cols-1 gap-0 md:grid-cols-3">
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <Image
                src="/images/about/DM6A4528-683x1024.jpg"
                alt="Barber giving a precision haircut"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
              />
            </div>
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <Image
                src="/images/about/Untitled-1200-x-1200-px-3-1024x1024.png"
                alt="Best in BA 2025 Winner badge"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
              />
            </div>
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <Image
                src="/images/about/DM6A4638-1-683x1024.jpg"
                alt="Beard work detail"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </motion.section>
    </>
  );
}
