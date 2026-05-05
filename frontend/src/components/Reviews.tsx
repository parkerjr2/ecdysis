"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useState } from "react";

type Review = {
  name: string;
  date: string;
  text: string;
  avatar: string;
};

const STAR = "/images/f.svg";
const GOOGLE_LOGO = "/images/logo.svg";
const GOOGLE_ICON = "/images/icon.svg";

const REVIEWS: Review[] = [
  {
    name: "Jonathan Bouldin",
    date: "9 months ago",
    text: "Awesome place. Great people.",
    avatar: "/images/ALV-UjXbnGPHEK0C39OUTIMcfKeK2pi8-yycz1dS4u_-WImR3HkyJk0_w40-h40-c-rp-mo-br100",
  },
  {
    name: "Josh Brown",
    date: "9 months ago",
    text: "Awesome atmosphere!!",
    avatar: "/images/ACg8ocK4O4YsewpXfTTf7tDiWfl3l-JW9hWPNChBxQt7ZBs2dU23Kg_w40-h40-c-rp-mo-br100",
  },
  {
    name: "Matthew Jones",
    date: "10 months ago",
    text: "Really am impressed with this shop. For some time I’ve been looking around for a regular barber and I think I’ve found the one. Courtney and Corey’s attention to detail, not rushing through haircuts, getting the full barbered haircut treatment. And quite friendly on top of it all. What’s not to like!",
    avatar: "/images/ACg8ocJ5NbBVEAGqo2bUxGBlU8Yxn07O4cSEPzn7sdC-IGPfBjCd-A_w40-h40-c-rp-mo-ba4-br100",
  },
  {
    name: "Gregory Bay",
    date: "11 months ago",
    text: "I am really particular about my haircuts and have been to multiple places. Ecdysis is by far the best experience I have had. Great shop with good people. They really take the time to make sure you get the perfect cut.",
    avatar: "/images/ACg8ocL_nUURf0lWk7hzsNksGwMbo2PYAEv-zo5ms0cpeJ7HLghQBQ_w40-h40-c-rp-mo-br100",
  },
  {
    name: "Joseph Baker",
    date: "1 year ago",
    text: "Really awesome environment! First time coming here. I booked a haircut with Rafael Perfecto. I wanted to try something new and to come out of my comfort zone. He took his time and payed real attention to details. Came out looking & feeling amazing. Definitely wanting to come back and see what else they have to offer!",
    avatar: "/images/ACg8ocJguTF343sMwIOuvpOl6xTY3Ao6ylBC4GNfcSvN0bYAVbpctA_w40-h40-c-rp-mo-br100",
  },
  {
    name: "Eric Britton",
    date: "1 year ago",
    text: "Rafael did a great job! I wasn't too sure what I wanted to do with my hair. He had several good ideas, and I'm very happy with the haircut. He took his time and is very talented with his craft. Will definitely come back.",
    avatar: "/images/ACg8ocII0NVGWo9S1I0Sh5ZxVh3GFQk28nIR9h-IG1lflzp9sfL06Q_w40-h40-c-rp-mo-br100",
  },
  {
    name: "Mackenzie Rice",
    date: "1 year ago",
    text: "RAF, Shelby and Courtney are absolutely wonderful! They all have cut my hair, my daughters hair and my sons! Every single time… it’s better than the last! Love the environment, love that they are so accepting of everyone! It’s fun and relaxed, they hear what you want and apply it to everything they do.. they suggest things that will compliment you personally and they are always right ♥️ if I could give 10 stars I would!",
    avatar: "/images/ALV-UjWqjMNyCkJXpRh9hOGBTSc_2d-Xzusn3qkzqu3RitDTyKkTfeQ9_w40-h40-c-rp-mo-br100",
  },
];

function Stars({ size = 17 }: { size?: number }) {
  return (
    <span className="inline-flex gap-[1px]">
      {Array.from({ length: 5 }, (_, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={i} src={STAR} width={size} height={size} alt="" />
      ))}
    </span>
  );
}

function ReviewCard({ r }: { r: Review }) {
  return (
    <div className="mx-[8px] flex h-full min-h-[200px] flex-col gap-[14px] rounded-[10px] bg-[#1a1a1a] p-5">
      <div className="flex items-start gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={r.avatar} alt={r.name} className="h-10 w-10 shrink-0 rounded-full" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-semibold leading-tight text-white">
            {r.name}
          </p>
          <p className="mt-[2px] text-[12px] text-white/60">{r.date}</p>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={GOOGLE_ICON} alt="Google" className="h-[18px] w-[18px] shrink-0" />
      </div>
      <div className="flex items-center gap-1">
        <Stars size={17} />
        <span className="ml-1 inline-flex h-[14px] w-[14px] items-center justify-center rounded-full bg-[#1a73e8] text-[9px] font-bold text-white">
          ✓
        </span>
      </div>
      <p className="line-clamp-4 text-[14px] leading-[1.55] text-white/85">{r.text}</p>
    </div>
  );
}

export function Reviews() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", slidesToScroll: 1 },
    [Autoplay({ delay: 6000, stopOnMouseEnter: true, stopOnInteraction: false })],
  );
  const [, setTick] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setTick((t) => t + 1);
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return (
    <div className="relative mt-8 w-full rounded-[8px] bg-[#3c6c4c] p-[20px]">
      <div className="flex items-stretch gap-2">
        {/* Left summary rail */}
        <div className="flex w-[220px] shrink-0 flex-col items-center justify-start gap-2 px-3 pt-[39px] text-center text-white">
          <strong className="font-display text-[26px] font-bold tracking-[2px]">EXCELLENT</strong>
          <Stars size={18} />
          <p className="text-[14px] leading-[1.4]">
            Based on <strong className="font-bold">65 reviews</strong>
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={GOOGLE_LOGO} alt="Google" className="mt-2 h-auto w-[110px]" />
        </div>

        {/* Right carousel */}
        <div className="relative min-w-0 flex-1">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {REVIEWS.map((r) => (
                <div key={r.name} className="min-w-0 flex-[0_0_50%]">
                  <ReviewCard r={r} />
                </div>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={scrollPrev}
            aria-label="Previous review"
            className="absolute left-[-4px] top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-[18px] text-white transition-colors hover:bg-white/20"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={scrollNext}
            aria-label="Next review"
            className="absolute right-[-4px] top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-[18px] text-white transition-colors hover:bg-white/20"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}
