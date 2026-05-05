import type { Variants, Transition } from "framer-motion";

const easeOut: Transition["ease"] = [0.25, 0.46, 0.45, 0.94];

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const slideInUp: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0 },
};

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0 },
};

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0 },
};

export const defaultViewport = { once: true, amount: 0.3 } as const;

export const defaultTransition: Transition = {
  duration: 1.0,
  ease: easeOut,
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

export function withDelay(delayMs: number): Transition {
  return { ...defaultTransition, delay: delayMs / 1000 };
}
