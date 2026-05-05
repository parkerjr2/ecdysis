"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const IMAGES = [
  "/images/courtneys-work/image000000.jpg",
  "/images/courtneys-work/image000000-2.jpg",
  "/images/courtneys-work/DM6A4439.jpg",
  "/images/courtneys-work/DM6A4330.jpg",
  "/images/courtneys-work/246939830_310075253839288_2861713734780214995_n.jpg",
  "/images/courtneys-work/PXL_20230607_231020654.PORTRAIT2.jpg",
  "/images/courtneys-work/PXL_20230810_211339950.PORTRAIT-scaled.jpg",
  "/images/courtneys-work/PXL_20230817_180104990.PORTRAIT-scaled.jpg",
  "/images/courtneys-work/PXL_20220206_000906089.PORTRAIT-scaled.jpg",
  "/images/courtneys-work/PXL_20230805_173106668.PORTRAIT-scaled.jpg",
  "/images/courtneys-work/252463114_975389309677655_3004619512719712690_n.jpg",
  "/images/courtneys-work/00100lPORTRAIT_00100_BURST20190825153741061_COVER-scaled.jpg",
  "/images/courtneys-work/251614503_283284176998643_3122168435411646973_n.jpg",
  "/images/courtneys-work/242192982_225082056251175_5642465311099901894_n.jpg",
  "/images/courtneys-work/123144099_2772525123074634_3649250889499610443_n.jpg",
  "/images/courtneys-work/244497776_618853436191930_4973279620369427602_n.jpg",
  "/images/courtneys-work/241096751_4091044794297927_8751986309010530300_n.jpg",
  "/images/courtneys-work/240890972_1263138260813901_4891632052418636626_n.jpg",
  "/images/courtneys-work/123138457_985561388596362_5320152132686013673_n.jpg",
  "/images/courtneys-work/246742994_1037591833746701_4987980662335276318_n.jpg",
  "/images/courtneys-work/courtaction2.jpg",
  "/images/courtneys-work/240825837_354246539682100_2002277305664529393_n.jpg",
  "/images/courtneys-work/249466757_390163599251779_3183623809948046027_n.jpg",
  "/images/courtneys-work/00100lPORTRAIT_00100_BURST20190825154020787_COVER-scaled.jpg",
  "/images/courtneys-work/PXL_20220205_014305127.PORTRAIT-scaled.jpg",
  "/images/courtneys-work/PXL_20220202_221655291.PORTRAIT-scaled.jpg",
  "/images/courtneys-work/PXL_20220210_015720772.PORTRAIT-scaled.jpg",
  "/images/courtneys-work/Court1.jpg",
  "/images/courtneys-work/Court2.jpg",
  "/images/courtneys-work/Court3.jpg",
  "/images/courtneys-work/Court4.png",
  "/images/courtneys-work/Court5.jpg",
  "/images/courtneys-work/Court6.jpg",
  "/images/courtneys-work/Court7.jpg",
  "/images/courtneys-work/Court8.jpg",
  "/images/courtneys-work/Court9.jpg",
  "/images/courtneys-work/Court10.jpg",
  "/images/courtneys-work/PXL_20240222_212107355.PORTRAIT-scaled.jpg",
  "/images/courtneys-work/PXL_20240224_003114206.PORTRAIT-scaled.jpg",
  "/images/courtneys-work/PXL_20240704_211827347.PORTRAIT-1-scaled.jpg",
  "/images/courtneys-work/PXL_20240718_223401606-1-scaled.jpg",
];

export function CourtneyGrid() {
  const [openIndex, setOpenIndex] = useState(-1);

  return (
    <section className="w-full bg-ec-dark py-[60px]">
      <div className="mx-auto grid w-full max-w-[1320px] grid-cols-1 gap-[10px] px-[60px] sm:grid-cols-2 md:grid-cols-4 md:gap-[15px]">
        {IMAGES.map((src, i) => (
          <motion.button
            key={src}
            type="button"
            onClick={() => setOpenIndex(i)}
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.05 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="group relative aspect-square w-full overflow-hidden bg-black/20 outline-none focus:outline-none focus-visible:outline-none"
            aria-label={`Open image ${i + 1}`}
          >
            <Image
              src={src}
              alt=""
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
              className="object-cover"
            />
            <span
              aria-hidden
              className="absolute inset-0 bg-black/0 transition-colors duration-[800ms] ease-out group-hover:bg-black/50"
            />
          </motion.button>
        ))}
      </div>
      <Lightbox
        open={openIndex >= 0}
        index={openIndex < 0 ? 0 : openIndex}
        close={() => setOpenIndex(-1)}
        slides={IMAGES.map((src) => ({ src }))}
      />
    </section>
  );
}
