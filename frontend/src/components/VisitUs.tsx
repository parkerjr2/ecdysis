"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const easeOut = [0.25, 0.46, 0.45, 0.94] as const;
const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 1.0, ease: easeOut },
};

const MAP_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3225.906989702627!2d-95.85016522419588!3d36.04697577247141!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87b68d178290699b%3A0x8c642f0ea515c4e1!2sEcdysis%20Barbershop!5e1!3m2!1sen!2sus!4v1754704805074!5m2!1sen!2sus";

type Props = { mapSide?: "left" | "right" };

export function VisitUs({ mapSide = "left" }: Props = {}) {
  const mapFirst = mapSide === "left";
  const gridCols = mapFirst
    ? "md:grid-cols-[648fr_792fr]"
    : "md:grid-cols-2";
  return (
    <motion.section
      id="booking"
      initial={{ opacity: 0, y: 300 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 1.2, ease: easeOut }}
      className="relative w-full bg-white py-[40px] text-black"
    >
      <div className={`mx-auto grid w-full grid-cols-1 ${gridCols}`}>
        <motion.div
          {...fadeUp}
          className={`flex w-full items-center justify-center px-6 ${
            mapFirst ? "md:pl-[45px] md:pr-0 md:order-1" : "md:pl-[40px] md:pr-[40px] md:order-2"
          }`}
        >
          <iframe
            src={MAP_EMBED_URL}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Ecdysis Barbershop location"
            className="block w-full max-w-[640px] border-0 shadow-[0_10px_30px_rgba(0,0,0,0.12)]"
            style={{ height: 450 }}
          />
        </motion.div>

        <motion.div
          {...fadeUp}
          className={`flex w-full flex-col items-stretch px-6 ${
            mapFirst ? "md:pl-[80px] md:pr-[80px] md:order-2" : "md:pl-[80px] md:pr-[80px] md:order-1"
          }`}
        >
          <span
            className="eyebrow"
            style={{ color: "var(--color-ec-tan-soft)" }}
          >
            VISIT US
          </span>
          <h2 className="mt-[10px] text-center font-script text-[60px] font-normal leading-[60px] tracking-[1.5px] text-black">
            Hours &amp; Location
          </h2>

          <div className="mt-5 space-y-2.5 font-sans text-lg font-light leading-[24px] text-black">
            <div>
              <p>
                <strong className="font-bold">Hours:</strong>
              </p>
              <ul className="list-disc space-y-2 pl-12">
                <li>Tuesday – Saturday: 10:00 AM – 6:00 PM</li>
                <li>Sunday &amp; Monday: Closed</li>
              </ul>
            </div>
            <p>
              <strong className="font-bold">Location:</strong> 4654 West
              Houston Street, Broken Arrow, OK 74012
            </p>
            <p>
              <strong className="font-bold">Phone:</strong>{" "}
              <a href="tel:918-720-1249">(918) 720-1249</a>
            </p>
            <p>
              <strong className="font-bold">E-mail: </strong>
              <a
                href="mailto:ecdysisbs@gmail.com"
                className="underline"
              >
                ecdysisbs@gmail.com
              </a>
            </p>
            <p>
              <strong className="font-bold">Parking: </strong>free on-site
              parking available
            </p>
            <p>
              <strong className="font-bold">Locations Served: </strong>
              Broken Arrow, Tulsa, Bixby, Jenks, Coweta, and surrounding areas
            </p>
          </div>

          <p className="mt-6 font-sans text-lg font-light leading-relaxed text-justify text-black">
            Experience the difference that comes from true craftsmanship,
            community, and care. At Ecdysis, we&apos;re not just cutting hair—we&apos;re
            helping you shed the old and embrace the new. Join our community of
            satisfied clients and discover why Ecdysis was voted &ldquo;Best
            Barbershop in Broken Arrow.&rdquo;
          </p>

          <div className="mt-6 text-center">
            <Link
              href="https://ecdysisbarbershop.com/booking/"
              className="ec-button"
              target="_blank"
            >
              BOOK NOW
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
