"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  FacebookIcon,
  InstagramIcon,
  PhoneIcon,
  MailIcon,
  ClockIcon,
  MapPinIcon,
} from "@/components/icons";

const easeOut = [0.25, 0.46, 0.45, 0.94] as const;
const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.9, ease: easeOut },
};

export function SiteFooter() {
  return (
    <footer className="relative w-full bg-ec-dark text-white">
      <motion.div
        {...fadeUp}
        className="mx-auto flex w-full max-w-[1200px] flex-col items-center gap-y-[30px] px-4 pb-[30px] pt-[40px] md:flex-row md:flex-nowrap md:items-start md:justify-between md:gap-x-0 md:gap-y-0"
      >
        <Link
          href="/"
          aria-label="Ecdysis Barbershop home"
          className="block flex-shrink-0"
        >
          <Image
            src="/images/ecdysislogo_white-300x189.png"
            alt="Ecdysis Barbershop"
            width={300}
            height={189}
            style={{ height: "auto" }}
            className="w-[231px]"
          />
        </Link>

        <FooterColumn title="Contact Us">
          <FooterRow icon={<PhoneIcon className="h-[22px] w-[22px]" />}>
            <a href="tel:+1-918-720-1249" className="hover:text-ec-tan">
              (918) 720-1249
            </a>
          </FooterRow>
          <FooterRow icon={<MailIcon className="h-[22px] w-[22px]" />}>
            <a href="mailto:ecdysisbs@gmail.com" className="hover:text-ec-tan">
              ecdysisbs@gmail.com
            </a>
          </FooterRow>
        </FooterColumn>

        <FooterColumn title="Hours">
          <FooterRow icon={<ClockIcon className="h-[22px] w-[22px]" />}>
            <p>
              <strong className="font-semibold">Tues - Sat:</strong> 10AM - 6PM
            </p>
            <p>
              <strong className="font-semibold">Sun - Mon:</strong> CLOSED
            </p>
          </FooterRow>
        </FooterColumn>

        <FooterColumn title="Location">
          <FooterRow icon={<MapPinIcon className="h-[22px] w-[22px]" />}>
            <a
              href="https://maps.app.goo.gl/faDxKS9jdsG71xun9"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-ec-tan"
            >
              <p>4654 W Houston St</p>
              <p>Broken Arrow, OK 74012</p>
            </a>
          </FooterRow>
        </FooterColumn>

        <FooterColumn title="Follow Us">
          <div className="mt-1 flex items-center gap-2">
            <SocialButton
              href="https://www.facebook.com/profile.php?id=61550778950809"
              label="Facebook"
            >
              <FacebookIcon className="h-[16px] w-[16px]" />
            </SocialButton>
            <SocialButton
              href="https://www.instagram.com/ecdysis.barbershop/?hl=en"
              label="Instagram"
            >
              <InstagramIcon className="h-[16px] w-[16px]" />
            </SocialButton>
          </div>
        </FooterColumn>
      </motion.div>

      <div className="w-full bg-ec-dark py-4 text-center">
        <p className="text-[13px] text-white/70">
          © 2026 Ecdysis Barbershop. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full flex-col gap-4 md:mt-[15px] md:w-auto">
      <h2 className="font-script text-[35px] font-medium leading-[35px] text-white">
        {title}
      </h2>
      <div className="flex flex-col gap-3 font-sans text-[16px] font-light leading-[24px] text-white">
        {children}
      </div>
    </div>
  );
}

function FooterRow({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 whitespace-nowrap text-white">
      <span className="mt-[3px] flex-shrink-0 text-[#3C6C4C]">{icon}</span>
      <div className="flex flex-col">{children}</div>
    </div>
  );
}

function SocialButton({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-ec-green text-white transition-colors duration-300 hover:bg-ec-green-light"
    >
      {children}
    </Link>
  );
}
