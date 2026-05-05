"use client";

import { motion } from "framer-motion";

const easeOut = [0.25, 0.46, 0.45, 0.94] as const;
const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 1.0, ease: easeOut },
};

export function AboutVision() {
  return (
    <section className="relative w-full bg-white">
      <div className="flex w-full flex-col items-stretch md:flex-row md:items-start">
        <motion.div
          {...fadeUp}
          className="relative hidden overflow-hidden md:block md:h-[728px] md:w-[728px] md:flex-shrink-0"
        >
          <video
            src="/videos/about/IMG_8285.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="h-full w-full object-cover"
            aria-hidden
          />
        </motion.div>

        <motion.div
          {...fadeUp}
          className="flex w-full flex-col items-center gap-5 px-6 py-10 md:flex-1 md:px-12 md:py-[15px]"
        >
          <span
            className="eyebrow"
            style={{ color: "var(--color-ec-tan-soft)" }}
          >
            WHAT DRIVES US
          </span>
          <h2 className="text-center font-script text-[44px] leading-[60px] tracking-[1.5px] text-black md:text-[60px]">
            Our Vision &amp; Commitment
          </h2>
          <div className="flex w-full max-w-[820px] flex-col gap-5 font-sans text-[18px] font-light leading-[30px] text-black">
            <p>
              At Ecdysis, barbering carries a deeper purpose than simply
              providing a service. It&apos;s a commitment to our craft, to the
              people who sit in our chairs, and to the community we&apos;re
              proud to be part of. Our vision is to build a shop culture that
              honors tradition while investing in the future of barbering.
              Through collaboration, education, and community involvement, we
              aim to elevate both the experience for our clients and the
              profession as a whole.
            </p>
            <p>We strive to:</p>
            <ul className="list-disc space-y-2 pl-7">
              <li>
                Be a pillar in the Broken Arrow and greater Tulsa community
              </li>
              <li>
                Provide a sanctuary where clients can truly unwind and be
                refreshed
              </li>
              <li>Ensure ongoing education for our barbers</li>
              <li>Unite barbers on a stronger, more collaborative front</li>
              <li>Train new barbers for a healthier industry culture</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
