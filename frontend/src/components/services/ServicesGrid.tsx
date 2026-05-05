"use client";

import { motion } from "framer-motion";

const easeOut = [0.25, 0.46, 0.45, 0.94] as const;
const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.8, ease: easeOut },
};

type Item = { title: string; price: string; description: string };
type Category = {
  title: string;
  intro?: string;
  items: Item[];
};

const LEFT_COLUMN: Category[] = [
  {
    title: "Haircuts",
    items: [
      { title: "Standard Cut", price: "$40", description: "The Standard Cut service includes a precision haircut tailored to your style, complete with a relaxing hot towel and a straight razor neck shave for a clean, refined finish.\n1 Hour" },
      { title: "Buzz Cut", price: "$30", description: "The Buzz Cut service offers a clean, uniform haircut with one length all over using clippers with no blending, ensuring precision and simplicity. Comes with a hot towel and straight razor neck shave.\n30 minutes" },
      { title: "Kids' Cut", price: "$30", description: "The Kids' Cut service is tailored for children 12 and under, offering a comfortable and professional haircut experience.\n45 minutes" },
      { title: "Transformation Cut", price: "$55", description: "The Transformation Cut service is designed for those seeking a significant style change, offering personalized attention to achieve your desired look. Please note that extra time is allocated to ensure precision and satisfaction during your appointment.\n1 Hour 30 Minutes" },
      { title: "Long Technical Cut", price: "$50", description: "The Long Technical Cut service is designed to enhance long hair with expertly crafted layers tailored to your preferences.\n1 Hour 30 Minutes" },
      { title: "Designs", price: "Barber's Discretion", description: "Designs are a case-by-case basis and will be decided\n30 Minutes" },
    ],
  },
  {
    title: "Scalp & Hair Care",
    items: [
      { title: "Relaxing Shampoo", price: "$10", description: "Enjoy a relaxing shampoo and condition, complemented by a soothing scalp massage for a refreshing experience.\n15 minutes" },
      { title: "Deep Condition", price: "$20", description: "The Deep Condition service provides intense hydration and nourishment to restore vitality and shine to your hair.\n15 minutes" },
      { title: "Scalp Scrub", price: "$10–$20", description: "Experience a revitalizing scalp scrub service designed to exfoliate, refresh, and rejuvenate your scalp.\n15 minutes" },
      { title: "Bond Fusion Blowout", price: "$120", description: "The Bond Fusion Blowout is a professional chemical service designed to repair and reinforce hair bonds while delivering a smooth, voluminous finish.\n2 Hours" },
    ],
  },
  {
    title: "Color Services",
    items: [
      { title: "Base Color", price: "Starting at $105", description: "The Base Color service is perfect for root touch-ups or achieving a full-color application with no highlights, providing a polished and uniform look.\n2 Hours" },
      { title: "Base Highlights", price: "Starting at $135", description: "Our Base Highlights service provides expertly applied highlights and lowlights designed to enhance your natural color with depth and dimension.\n2 Hours 30 Minutes" },
      { title: "Base Highlights & Color", price: "Starting at $165", description: "Our Base Highlights & Color service combines expert root touch up with beautifully blended highlights and lowlights for a refreshed, dimensional look.\n3 Hours" },
      { title: "Base Vivid Color", price: "Starting at $185", description: "Our Base Vivid Color service is a two-step process designed to achieve vibrant, long-lasting color. Pre-lightening is required for unnatural shades, with charges based on time and product use.\n3 Hours" },
      { title: "Color Correction", price: "$70", description: "Our professional color correction service is designed to address significant color changes, requiring a complimentary consultation to assess your needs and provide an accurate estimate.\nPer Hour" },
    ],
  },
  {
    title: "Facial services",
    items: [
      { title: "Facial Steamer", price: "$10", description: "Enhance your skincare routine with our professional facial steaming service, featuring a soothing scalp massage for a deeply relaxing experience.\n15 Minutes" },
      { title: "Black Mask", price: "$30", description: "Experience our Black Mask treatment, designed to deeply cleanse pores, minimize blackheads, and refresh your skin for a smoother, healthier appearance.\n30 minutes" },
      { title: "Mini Facial", price: "$45", description: "The Mini Facial service includes light cleansing, gentle exfoliation, and a soothing mask, providing a quick yet effective skincare experience.\n45 Minutes" },
    ],
  },
];

const RIGHT_COLUMN: Category[] = [
  {
    title: "Straight Razor Services",
    items: [
      { title: "Straight Razor Fade", price: "$50", description: "Experience a clean and precise bald fade achieved with expert straight razor techniques, complemented by a relaxing hot towel.\n1 Hour" },
      { title: "Straight Razor Full Face Shave", price: "$45", description: "Experience a professional full-face straight razor shave, complete with precision shaping, a soothing hot towel, and refreshing aftercare for a polished finish.\n45 minutes" },
      { title: "Straight Razor Partial Edge-Up", price: "$10", description: "The Partial Straight Razor Edge-up service provides precise, clean lines focused on a specific area of the hairline or beard for a polished finish.\n15 minutes" },
      { title: "Straight Razor Hairline Edge-Up", price: "$10", description: "The Straight Razor Hairline Edge-Up service includes a precise hairline touch-up, complemented by a relaxing hot towel for a refined finish.\n15 minutes" },
      { title: "Straight Razor Head Shave", price: "$40", description: "Experience a professional straight razor head shave, complete with a relaxing hot towel and precision aftercare for a smooth, polished finish.\n45 minutes" },
      { title: "Straight Razor Beard Edge-Up", price: "$25", description: "Experience precision with our Straight Razor Beard Edge-Up service, featuring a clean, sharp finish to enhance your beard's shape and definition.\n30 minutes" },
    ],
  },
  {
    title: "Beard care",
    items: [
      { title: "Beard Clean-Up", price: "$25", description: "Maintain a well-groomed appearance with our Beard Clean Up service, designed to refine and shape your beard for a polished look.\n30 minutes" },
      { title: "Beard Sculpting", price: "$35", description: "Our Beard Sculpting service goes beyond a standard trim, offering precise detailing and shaping to enhance your natural beard structure.\n45 minutes" },
      { title: "Beard Mask", price: "$10", description: "Rough beard? Soften it with our conditioning service for your beard. This pairs well with our beard clean up or sculpting services.\n15 minutes" },
    ],
  },
  {
    title: "Styling",
    items: [
      { title: "Relaxing Shampoo & Blow Out", price: "$50", description: "Achieve a smooth, polished look with our professional shampoo and blowout service, designed to leave your hair refreshed and styled to perfection.\n45 minutes" },
      { title: "Thermal", price: "$30", description: "Thermal styling is a professional service that uses hot tools to create smooth, polished, or curled hairstyles tailored to your preferences.\n30 minutes" },
      { title: "Partial Updo", price: "$65", description: "Our partial updo service offers expert styling for a polished half up, half down look. Pricing varies based on hair length and style complexity.\n1 Hour" },
      { title: "Full Updo", price: "$85", description: "Our full updo service offers expert event styling tailored to your preferences, with pricing based on hair length and style complexity.\n1 Hour 30 Minutes" },
      { title: "Braiding", price: "Barber's Discretion", description: "Our braiding service is priced at your barber's discretion. Book a free 15 minute consultation to discuss your style and pricing." },
    ],
  },
  {
    title: "Waxing",
    items: [
      { title: "Unibrow", price: "$5", description: "Our professional unibrow waxing service provides precise grooming to help you achieve a clean and well-defined look.\n5 minutes" },
      { title: "Ears", price: "$12", description: "Our professional ear waxing service effectively removes unwanted hair while helping to keep your ears clean and groomed.\n10 minutes" },
    ],
  },
  {
    title: "Chair Massage",
    intro:
      "Experience the benefits of a professional chair massage, designed to target tension and promote relaxation in a convenient, seated session. Ideal for stress relief, this service is tailored to fit your needs.",
    items: [
      { title: "15 Minutes", price: "$20", description: "" },
      { title: "25 Minutes", price: "$30", description: "" },
    ],
  },
  {
    title: "consultations",
    intro:
      "We offer free 15-minute consultations to discuss your goals for cut, color, and styling. If you're considering taking your look in a new direction, we recommend adding one alongside your service. You're welcome to book a stand-alone consultation if you'd like to plan ahead, or contact our team if you need additional time to talk through your service.",
    items: [],
  },
];

function ServiceItem({ item }: { item: Item }) {
  return (
    <li className="mb-[22px] last:mb-0">
      <div className="flex items-baseline">
        <span className="font-script text-[29px] font-medium capitalize leading-[34.8px] tracking-[0.5px] text-black">
          {item.title}
        </span>
        <span className="mx-[3px] flex-1 self-end border-b-2 border-dotted border-black pb-[6px]" />
        <span className="font-sans text-[21px] font-medium capitalize leading-[25.2px] text-black">
          {item.price}
        </span>
      </div>
      {item.description && (
        <p className="whitespace-pre-line font-sans text-[16px] font-normal leading-[24px] text-black">
          {item.description}
        </p>
      )}
    </li>
  );
}

function ServiceCategory({ category }: { category: Category }) {
  return (
    <motion.div {...fadeUp} className="flex flex-col">
      <h2 className="text-center font-sans text-[28px] font-bold uppercase leading-[28px] tracking-[0.7px] text-black">
        {category.title}
      </h2>
      {category.intro && (
        <p className="mt-4 text-center font-sans text-[15px] font-light leading-[1.6] text-black/70">
          {category.intro}
        </p>
      )}
      {category.items.length > 0 && (
        <ul className="mt-6">
          {category.items.map((item, i) => (
            <ServiceItem key={i} item={item} />
          ))}
        </ul>
      )}
    </motion.div>
  );
}

export function ServicesGrid() {
  return (
    <section className="w-full bg-ec-dark pb-[15px]">
      <div className="mx-auto grid w-full max-w-[1200px] grid-cols-1 gap-x-0 gap-y-12 px-[60px] pt-[50px] md:grid-cols-2">
        <div className="flex flex-col gap-12 bg-[#E6DAC6] px-[25px] pb-0 pt-[30px]">
          {LEFT_COLUMN.map((cat) => (
            <ServiceCategory key={cat.title} category={cat} />
          ))}
        </div>
        <div className="flex flex-col gap-12 bg-white px-[25px] pb-0 pt-[30px]">
          {RIGHT_COLUMN.map((cat) => (
            <ServiceCategory key={cat.title} category={cat} />
          ))}
        </div>
      </div>
    </section>
  );
}
