"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { REVIEWS, TOTAL_REVIEW_COUNT, type Review } from "@/data/reviews";

const AUTOPLAY_MS = 6000;
const PAUSE_AFTER_CLICK_MS = 10000;

function StarFilled({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="#FBBC04"
      aria-hidden
    >
      <path d="M12 2.5l2.92 6.36 6.96.78-5.18 4.71 1.45 6.86L12 17.77 5.85 21.21l1.45-6.86L2.12 9.64l6.96-.78L12 2.5z" />
    </svg>
  );
}

function GoogleG({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden>
      <path
        fill="#4285F4"
        d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84a10.13 10.13 0 0 1-4.4 6.65v5.52h7.12c4.16-3.83 6.56-9.47 6.56-16.18z"
      />
      <path
        fill="#34A853"
        d="M24 46c5.94 0 10.92-1.97 14.56-5.32l-7.12-5.52c-1.97 1.32-4.5 2.1-7.44 2.1-5.72 0-10.56-3.86-12.3-9.05H4.34v5.7A22 22 0 0 0 24 46z"
      />
      <path
        fill="#FBBC04"
        d="M11.7 28.21c-.44-1.32-.7-2.73-.7-4.21s.26-2.89.7-4.21v-5.7H4.34a22 22 0 0 0 0 19.82l7.36-5.7z"
      />
      <path
        fill="#EA4335"
        d="M24 9.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 2.99 29.93 1 24 1A22 22 0 0 0 4.34 14.09l7.36 5.7C13.44 13.61 18.28 9.75 24 9.75z"
      />
    </svg>
  );
}

function GoogleLogoWordmark({ width = 110 }: { width?: number }) {
  return (
    <svg
      width={width}
      height={(width * 35) / 110}
      viewBox="0 0 272 92"
      aria-label="Google"
    >
      <path
        fill="#4285F4"
        d="M115.75 47.18a23.43 23.43 0 1 1-46.86 0 23.43 23.43 0 0 1 46.86 0zm-10.27 0c0-7.69-5.58-12.96-12.16-12.96-6.58 0-12.16 5.27-12.16 12.96 0 7.62 5.58 12.96 12.16 12.96 6.58 0 12.16-5.34 12.16-12.96z"
      />
      <path
        fill="#EA4335"
        d="M166.36 47.18a23.43 23.43 0 1 1-46.86 0 23.43 23.43 0 0 1 46.86 0zm-10.27 0c0-7.69-5.58-12.96-12.16-12.96-6.58 0-12.16 5.27-12.16 12.96 0 7.62 5.58 12.96 12.16 12.96 6.58 0 12.16-5.34 12.16-12.96z"
      />
      <path
        fill="#FBBC05"
        d="M214.84 25.16v41.81c0 17.21-10.16 24.24-22.18 24.24-11.31 0-18.12-7.55-20.69-13.72l8.95-3.72c1.6 3.81 5.5 8.31 11.74 8.31 7.69 0 12.46-4.74 12.46-13.67v-3.36h-.36c-2.29 2.83-6.71 5.31-12.29 5.31-11.66 0-22.34-10.16-22.34-23.23 0-13.16 10.69-23.41 22.34-23.41 5.57 0 9.99 2.48 12.29 5.22h.36v-3.79h9.72zm-9.05 22c0-8.21-5.48-14.21-12.45-14.21-7.07 0-13 6-13 14.21 0 8.12 5.93 14.04 13 14.04 6.97 0 12.45-5.93 12.45-14.04z"
      />
      <path fill="#34A853" d="M230.75 2v65h-9.99V2h9.99z" />
      <path
        fill="#EA4335"
        d="M269.69 56.16l7.96 5.31c-2.57 3.81-8.76 10.36-19.45 10.36-13.27 0-23.18-10.27-23.18-23.41 0-13.93 9.99-23.41 22.03-23.41 12.13 0 18.05 9.66 19.99 14.88l1.06 2.66-31.21 12.93c2.39 4.69 6.1 7.07 11.31 7.07 5.22 0 8.84-2.57 11.49-6.39zm-24.5-8.41l20.86-8.66c-1.15-2.92-4.6-4.95-8.66-4.95-5.21 0-12.46 4.6-12.2 13.61z"
      />
      <path
        fill="#4285F4"
        d="M35.29 41.41V31.49h33.43c.33 1.73.5 3.78.5 5.99 0 7.45-2.04 16.66-8.6 23.22-6.39 6.65-14.55 10.19-25.32 10.19C15.31 70.89.96 56.99.96 35.95.96 14.91 15.31 1 35.3 1c11.06 0 18.95 4.34 24.88 10l-7 7c-4.25-3.99-10.01-7.09-17.89-7.09-14.6 0-26.02 11.77-26.02 26.37 0 14.6 11.42 26.37 26.02 26.37 9.47 0 14.86-3.8 18.31-7.25 2.8-2.8 4.64-6.8 5.37-12.27l-23.68-.02z"
      />
    </svg>
  );
}

function VerifiedBadge({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <circle cx="12" cy="12" r="11" fill="#1A73E8" />
      <path
        d="M7.5 12.3l3 2.9 6-6.3"
        fill="none"
        stroke="#fff"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Avatar({ name, color, photoUrl }: { name: string; color: string; photoUrl?: string }) {
  if (photoUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={photoUrl}
        alt={name}
        className="h-10 w-10 shrink-0 rounded-full object-cover"
        referrerPolicy="no-referrer"
      />
    );
  }
  const initial = name.trim().charAt(0).toUpperCase();
  return (
    <div
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[16px] font-bold text-white"
      style={{ backgroundColor: color }}
      aria-hidden
    >
      {initial}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="flex h-full flex-col gap-3 rounded-[16px] bg-[#0E0E0E] p-[20px]">
      <div className="flex items-start gap-3">
        <Avatar name={review.name} color={review.avatarColor} photoUrl={review.avatarUrl} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-bold leading-tight text-white">
            {review.name}
          </p>
          <p className="mt-[2px] text-[12px] text-white/60">{review.timeAgo}</p>
        </div>
        <GoogleG size={18} />
      </div>
      <div className="flex items-center gap-1">
        {Array.from({ length: review.rating }).map((_, i) => (
          <StarFilled key={i} size={16} />
        ))}
        <span className="ml-1">
          <VerifiedBadge size={14} />
        </span>
      </div>
      <p className="line-clamp-4 text-[14px] leading-[1.55] text-white">
        {review.text}
      </p>
    </div>
  );
}

type Props = {
  reviews?: Review[];
  totalCount?: number;
};

export function GoogleReviewsCarousel({
  reviews = REVIEWS,
  totalCount = TOTAL_REVIEW_COUNT,
}: Props = {}) {
  const [index, setIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(2);
  const [autoplayPaused, setAutoplayPaused] = useState(false);
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Responsive visibleCount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setVisibleCount(mq.matches ? 2 : 1);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Autoplay
  useEffect(() => {
    if (autoplayPaused) return;
    const id = setInterval(() => {
      setIndex((i) => {
        const max = reviews.length - visibleCount;
        return i >= max ? 0 : i + 1;
      });
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [autoplayPaused, visibleCount, reviews.length]);

  // Cleanup pause timer on unmount
  useEffect(() => {
    return () => {
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    };
  }, []);

  const pauseAutoplay = () => {
    setAutoplayPaused(true);
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    pauseTimerRef.current = setTimeout(() => {
      setAutoplayPaused(false);
    }, PAUSE_AFTER_CLICK_MS);
  };

  const goNext = () => {
    setIndex((i) => {
      const max = REVIEWS.length - visibleCount;
      return i >= max ? 0 : i + 1;
    });
    pauseAutoplay();
  };

  const goPrev = () => {
    setIndex((i) => {
      const max = REVIEWS.length - visibleCount;
      return i <= 0 ? max : i - 1;
    });
    pauseAutoplay();
  };

  // Carousel math
  const trackWidthPct = (reviews.length / visibleCount) * 100;
  const slideWidthPct = 100 / reviews.length;
  const translateXPct = -index * slideWidthPct;

  return (
    <div className="mt-8 w-full rounded-[28px] bg-[#2D4F2D] p-[32px]">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-stretch lg:gap-8">
        {/* Left summary */}
        <div className="flex flex-col items-center justify-center gap-3 text-center text-white lg:w-[28%] lg:items-center lg:justify-start lg:pt-2">
          <strong className="font-display text-[24px] font-bold uppercase tracking-[2px]">
            EXCELLENT
          </strong>
          <div className="flex items-center gap-[2px]">
            {Array.from({ length: 5 }).map((_, i) => (
              <StarFilled key={i} size={20} />
            ))}
          </div>
          <p className="text-[14px] leading-[1.4]">
            Based on{" "}
            <strong className="font-bold">{totalCount} reviews</strong>
          </p>
          <GoogleLogoWordmark width={110} />
        </div>

        {/* Right carousel */}
        <div className="relative flex-1 lg:w-[72%]">
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous reviews"
            className="absolute -left-[8px] top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white outline-none transition-colors hover:bg-white/20 focus:outline-none focus-visible:outline-none"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-[400ms] ease-out"
              style={{
                width: `${trackWidthPct}%`,
                transform: `translateX(${translateXPct}%)`,
              }}
            >
              {reviews.map((r) => (
                <div
                  key={r.name}
                  className="shrink-0 px-2"
                  style={{ width: `${slideWidthPct}%` }}
                >
                  <ReviewCard review={r} />
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={goNext}
            aria-label="Next reviews"
            className="absolute -right-[8px] top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white outline-none transition-colors hover:bg-white/20 focus:outline-none focus-visible:outline-none"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
