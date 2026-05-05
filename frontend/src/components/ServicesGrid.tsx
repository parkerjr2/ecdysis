"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

const easeOut = [0.25, 0.46, 0.45, 0.94] as const;

type ServiceItem = {
  label: string;
  icon: string; // path to SVG file in /public
};

const LEFT: ServiceItem[] = [
  { label: "HAIRCUTS", icon: "/icons/services/haircuts.svg" },
  { label: "BEARD CARE", icon: "/icons/services/beard-care.svg" },
  { label: "HAIR COLOR", icon: "/icons/services/hair-color.svg" },
  { label: "FACIALS", icon: "/icons/services/facials.svg" },
];

const RIGHT: ServiceItem[] = [
  { label: "STRAIGHT RAZOR SHAVES", icon: "/icons/services/straight-razor.svg" },
  { label: "SCALP & HAIR REPAIR", icon: "/icons/services/scalp-repair.svg" },
  { label: "WAXING", icon: "/icons/services/waxing.svg" },
  { label: "CHAIR MASSAGE THERAPY", icon: "/icons/services/massage.svg" },
];

export function ServicesGrid() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  // Left items start translated +X (visually pushed RIGHT, hidden behind center photo),
  // animate to 0 (their natural left-column positions) as user scrolls.
  // Range 0 → 0.56 matches Elementor's motion_fx_translateX_affectedRange on live site.
  const leftX = useTransform(scrollYProgress, [0, 0.56], [220, 0]);
  // Right items mirror: start translated -X (toward center, behind photo), animate to 0.
  const rightX = useTransform(scrollYProgress, [0, 0.56], [-220, 0]);

  return (
    <section ref={sectionRef} className="relative w-full bg-ec-dark pb-24 lg:pb-32">
      <div className="mx-auto grid w-full max-w-[1320px] grid-cols-1 items-center gap-x-8 gap-y-12 px-6 md:grid-cols-[1fr_minmax(0,420px)_1fr] md:gap-x-12 lg:gap-x-16">
        <ServiceColumn items={LEFT} align="right" x={leftX} />

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.0, ease: easeOut }}
          className="relative z-10 mx-auto aspect-square w-full max-w-[415px] overflow-hidden"
        >
          <Image
            src="/images/DM6A2922.jpg"
            alt="Barber holding scissors mid-work"
            fill
            sizes="(max-width: 768px) 100vw, 420px"
            className="object-cover"
          />
        </motion.div>

        <ServiceColumn items={RIGHT} align="left" x={rightX} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8, ease: easeOut, delay: 0.4 }}
        className="mt-12 flex justify-center md:mt-14 lg:mt-16"
      >
        <Link href="#booking" className="ec-button">
          FULL SERVICES MENU
        </Link>
      </motion.div>
    </section>
  );
}

function ServiceColumn({
  items,
  align,
  x,
}: {
  items: ServiceItem[];
  align: "left" | "right";
  x: MotionValue<number>;
}) {
  return (
    <motion.div
      style={{ x }}
      className={`relative z-0 flex flex-col gap-8 md:gap-10 ${
        align === "right" ? "md:items-end md:text-right" : "md:items-start md:text-left"
      }`}
    >
      {items.map((s) => (
        <div
          key={s.label}
          className={`flex items-center gap-4 ${
            align === "right" ? "md:flex-row-reverse" : "md:flex-row"
          }`}
        >
          <div className="service-icon-box flex-shrink-0">
            <span
              aria-hidden
              className="service-icon-mask"
              style={{
                maskImage: `url(${s.icon})`,
                WebkitMaskImage: `url(${s.icon})`,
              }}
            />
          </div>
          <h3 className="font-script text-[28px] font-semibold uppercase tracking-[1.5px] leading-[28px] text-white md:text-[32px] md:leading-[32px]">
            {s.label}
          </h3>
        </div>
      ))}
    </motion.div>
  );
}
