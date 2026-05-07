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

type Props = {
  eyebrow?: string;
  title: string;
  paragraphs: string[];
  imageSrc: string;
  imageAlt: string;
  imageSide?: "left" | "right";
  imageWidth?: number;
  ornamentSrc?: string;
  imageObjectPosition?: string;
};

export function SignatureService({
  eyebrow = "SIGNATURE SERVICE",
  title,
  paragraphs,
  imageSrc,
  imageAlt,
  imageSide = "left",
  imageWidth = 576,
  ornamentSrc = "/images/razor-ornament.svg",
  imageObjectPosition = "50% 50%",
}: Props) {
  const orderImageFirst = imageSide === "left";
  const frameStyle: React.CSSProperties = orderImageFirst
    ? { top: -20, left: -20, width: imageWidth + 5, height: 705 }
    : { top: -20, left: 15, width: imageWidth + 5, height: 705 };
  // Bias image toward page center to mirror the live layout: 50/50 cols of 720px each.
  // Outer side gets ~110-125px padding so the decorative frame has room to peek out;
  // inner side hugs the text column.
  const imageColPadding = orderImageFirst
    ? "md:pr-[70px] md:pl-[110px]"
    : "md:pl-[19px] md:pr-[125px]";

  return (
    <motion.section
      initial={{ opacity: 0, y: 300 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 1.2, ease: easeOut }}
      className="relative w-full bg-ec-dark py-[85px]"
    >
      <div className="grid w-full grid-cols-1 md:grid-cols-2">
        <motion.div
          {...fadeUp}
          className={`relative flex w-full justify-center px-6 ${imageColPadding} ${
            orderImageFirst ? "md:order-1" : "md:order-2"
          }`}
        >
          <div
            className="relative h-[700px] w-full"
            style={{ maxWidth: imageWidth }}
          >
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              sizes="(max-width: 768px) 100vw, 576px"
              className="object-cover"
              style={{ objectPosition: imageObjectPosition }}
            />
            <span
              aria-hidden
              className="pointer-events-none absolute z-10 border-2 border-ec-tan-active"
              style={frameStyle}
            />
          </div>
        </motion.div>

        <motion.div
          {...fadeUp}
          className={`flex w-full flex-col px-6 md:px-[72px] ${
            orderImageFirst ? "md:order-2" : "md:order-1"
          }`}
        >
          <div className="mx-auto flex w-full max-w-[556px] flex-col">
            <span
              className="eyebrow"
              style={{ color: "var(--color-ec-tan-soft)" }}
            >
              {eyebrow}
            </span>
            <Image
              src={ornamentSrc}
              alt=""
              width={50}
              height={50}
              aria-hidden
              className="mx-auto mt-5"
            />
            <h2 className="mt-[10px] text-center font-script text-[60px] font-normal leading-[60px] tracking-[1.5px] text-white">
              {title}
            </h2>
            <div className="mt-5 flex flex-col gap-[30px] text-justify font-sans text-[16px] font-light leading-[30px] text-white">
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
