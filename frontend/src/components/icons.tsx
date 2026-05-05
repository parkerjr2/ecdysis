import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const FrameWrap = ({ children, ...props }: IconProps & { children: React.ReactNode }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {children}
  </svg>
);

export const ScissorsIcon = (props: IconProps) => (
  <FrameWrap {...props}>
    <circle cx="20" cy="44" r="6" />
    <circle cx="44" cy="44" r="6" />
    <path d="M24 40L48 16M40 40L16 16" />
  </FrameWrap>
);

export const BeardIcon = (props: IconProps) => (
  <FrameWrap {...props}>
    <path d="M20 26c0-7 5-12 12-12s12 5 12 12v6c0 10-5 18-12 18s-12-8-12-18z" />
    <path d="M24 30c2 6 4 10 8 10s6-4 8-10" />
    <path d="M28 22c1 1 2 1 4 1s3 0 4-1" />
  </FrameWrap>
);

export const HairColorIcon = (props: IconProps) => (
  <FrameWrap {...props}>
    <path d="M24 18l-6 14h28l-6-14z" />
    <path d="M22 32v18a4 4 0 004 4h12a4 4 0 004-4V32" />
    <path d="M28 24l8 0" />
  </FrameWrap>
);

export const FacialIcon = (props: IconProps) => (
  <FrameWrap {...props}>
    <circle cx="32" cy="32" r="16" />
    <path d="M24 30c0 1 .5 2 1.5 2s1.5-1 1.5-2M37 30c0 1 .5 2 1.5 2s1.5-1 1.5-2" />
    <path d="M26 38c2 2 4 3 6 3s4-1 6-3" />
  </FrameWrap>
);

export const RazorIcon = (props: IconProps) => (
  <FrameWrap {...props}>
    <rect x="14" y="36" width="36" height="6" rx="1" />
    <path d="M14 36L8 42M50 42L42 50l-2-2 8-8" />
    <path d="M16 36V30h32v6" />
  </FrameWrap>
);

export const ScalpIcon = (props: IconProps) => (
  <FrameWrap {...props}>
    <path d="M16 36c0-9 7-16 16-16s16 7 16 16" />
    <path d="M16 36v6h32v-6" />
    <path d="M22 28c2-1 3-2 4-3M28 24c1-1 3-2 4-2M36 22c2 0 4 1 6 2" />
  </FrameWrap>
);

export const WaxingIcon = (props: IconProps) => (
  <FrameWrap {...props}>
    <path d="M22 14v18c0 6 4 10 10 10s10-4 10-10V14z" />
    <path d="M22 18h20M22 24h20" />
    <circle cx="32" cy="48" r="4" />
  </FrameWrap>
);

export const MassageIcon = (props: IconProps) => (
  <FrameWrap {...props}>
    <path d="M14 40c4-4 10-6 18-6s14 2 18 6" />
    <circle cx="32" cy="22" r="6" />
    <path d="M28 30c-2 2-3 4-4 7M36 30c2 2 3 4 4 7" />
  </FrameWrap>
);

export const FacebookIcon = (props: IconProps) => (
  <svg viewBox="0 0 320 512" fill="currentColor" aria-hidden {...props}>
    <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" />
  </svg>
);

export const InstagramIcon = (props: IconProps) => (
  <svg viewBox="0 0 448 512" fill="currentColor" aria-hidden {...props}>
    <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
  </svg>
);

export const PhoneIcon = (props: IconProps) => (
  <svg viewBox="0 0 512 512" fill="currentColor" aria-hidden {...props}>
    <path d="M493.4 24.6l-104-24c-11.3-2.6-22.9 3.3-27.5 13.9l-48 112c-4.2 9.8-1.4 21.3 6.9 28l60.6 49.6c-36 76.7-98.9 140.5-177.2 177.2l-49.6-60.6c-6.8-8.3-18.2-11.1-28-6.9l-112 48C3.9 366.5-2 378.1.6 389.4l24 104C27.1 504.2 36.7 512 48 512c256.1 0 464-207.5 464-464 0-11.2-7.7-20.9-18.6-23.4z" />
  </svg>
);

export const MailIcon = (props: IconProps) => (
  <svg viewBox="0 0 512 512" fill="currentColor" aria-hidden {...props}>
    <path d="M494.586 164.516c-4.697-3.883-111.723-89.95-135.251-108.657C337.231 38.191 299.437 0 256 0c-43.205 0-80.636 37.717-103.335 55.859-24.463 19.45-131.07 105.195-135.15 108.549A48.004 48.004 0 0 0 0 201.485V464c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V201.509a48 48 0 0 0-17.414-36.993zM464 458a6 6 0 0 1-6 6H54a6 6 0 0 1-6-6V204.347c0-1.813.816-3.526 2.226-4.665 15.87-12.814 108.793-87.554 132.364-106.293C200.755 78.88 232.398 48 256 48c23.693 0 55.857 31.369 73.41 45.389 23.573 18.741 116.503 93.493 132.366 106.316a5.99 5.99 0 0 1 2.224 4.663V458zm-31.991-187.704c4.249 5.159 3.465 12.795-1.745 16.981-28.975 23.283-59.274 47.597-70.929 56.863C336.636 362.283 299.205 400 256 400c-43.452 0-81.287-38.237-103.335-55.86-11.279-8.967-41.744-33.413-70.927-56.865-5.21-4.187-5.993-11.822-1.745-16.981l15.258-18.528c4.178-5.073 11.657-5.843 16.779-1.726 28.618 23.001 58.566 47.035 70.56 56.571C200.143 320.631 232.307 352 256 352c23.602 0 55.246-30.88 73.41-45.389 11.994-9.535 41.944-33.57 70.563-56.568 5.122-4.116 12.601-3.346 16.778 1.727l15.258 18.526z" />
  </svg>
);

export const ClockIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
);

export const MapPinIcon = (props: IconProps) => (
  <svg viewBox="0 0 384 512" fill="currentColor" aria-hidden {...props}>
    <path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z" />
  </svg>
);

export const ArrowUpIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M6 15l6-6 6 6" />
  </svg>
);

export const StarIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77 5.82 21l1.18-6.88-5-4.87 6.91-1.01L12 2z" />
  </svg>
);

export const OrnamentDivider = (props: IconProps) => (
  <svg viewBox="0 0 80 16" fill="currentColor" {...props}>
    <path d="M0 8h28M52 8h28" stroke="currentColor" strokeWidth="1" />
    <path d="M40 2 L44 8 L40 14 L36 8 Z" />
    <circle cx="32" cy="8" r="1.5" />
    <circle cx="48" cy="8" r="1.5" />
  </svg>
);

