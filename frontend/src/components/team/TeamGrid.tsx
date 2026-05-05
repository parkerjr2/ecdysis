"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { InstagramIcon, FacebookIcon, MailIcon } from "@/components/icons";

const easeOut = [0.25, 0.46, 0.45, 0.94] as const;
const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.9, ease: easeOut },
};

type Member = {
  name: string;
  role: string;
  image: string;
  description: string;
  workLink?: string;
  workLinkLabel?: string;
  instagram?: string;
  facebook?: string;
  email?: string;
};

const TOP_ROW: Member[] = [
  {
    name: "Courtney Layne",
    role: "Co-Owner/Master Barber",
    image: "/images/team/Untitled-design-20.png",
    description:
      "What started as a chance introduction to barbering in 2003 turned into a lifelong craft for Courtney Layne. With more than two decades of experience—as a barber, instructor, and co-founder of Ecdysis Barbershop—she's passionate about classic barbering, strong community, and helping people leave the chair feeling renewed.",
    workLink: "#gallery-courtney",
    workLinkLabel: "See Courtney's Work",
    instagram: "https://instagram.com/madamn_barber",
    email: "courtneylayne@ecdysis.info",
  },
  {
    name: "Rafael Perfecto",
    role: "Co-Owner/Master Barber",
    image: "/images/team/Untitled-design-18.png",
    description:
      "Barber. Co-founder. Developer. Rafael Hector Perfecto is the co-architect behind Ecdysis Barbershop and the creator of Perfecto Reserve grooming products. Rooted in Puerto Rican heritage and based in Tulsa, Rafael blends old-school discipline with modern style. He believes that a great cut is just the beginning—it's the conversation, the connection, and the confidence that follow that matter most.",
    workLink: "#gallery-rafael",
    workLinkLabel: "See Rafael's Work",
    instagram: "https://www.instagram.com/perfecto_ecdysis/",
    facebook: "https://www.facebook.com/Perfecto918",
    email: "perfecto@ecdysis.info",
  },
  {
    name: "Kory Marsden",
    role: "Barber",
    image: "/images/team/3.png",
    description:
      "I cut hair. Hair I cut. You want cut? Need hair. Want hair? Can't help. Can't uncut. Could cut now. Probably cut later. No buts. Just cuts. On hair. Haircuts. What? ...beard too",
    workLink: "#gallery-kory",
    workLinkLabel: "See Kory's Work",
    instagram: "https://www.instagram.com/oddflexbarbering",
    facebook: "https://www.facebook.com/oddflexbarbering",
    email: "kory@ecdysis.info",
  },
];

const BOTTOM_ROW: Member[] = [
  {
    name: "Joe Figueroa",
    role: "Barber",
    image: "/images/team/Screenshot-2025-11-14-at-10.42.22-PM.png",
    description:
      "Joseph is a barber committed to precision and continuous growth in the craft. Currently completing his barber training, he focuses on clean fades, detailed tapers, and classic cuts while delivering a professional and comfortable experience for every client.",
    workLink: "#gallery-joe",
    workLinkLabel: "See Joe's Work",
    instagram: "https://www.instagram.com/choppedbyfig/",
    facebook: "https://www.facebook.com/profile.php?id=61579994894319",
    email: "jfigueroa@ecdysis.info",
  },
  {
    name: "Cornelius Johnson",
    role: "Chair Massage Therapist",
    image: "/images/team/6.png",
    description:
      "Cornelius Johnson is a massage therapist, actor, musician, and photographer. He believes that making people feel better, in any way, is a revolutionary art itself. Using a marriage of massage and physical therapy, he's learned to approach tension in the body from a unique perspective.",
    workLink: "#gallery-cornelius",
    workLinkLabel: "See Cornelius's Work",
    instagram: "https://www.instagram.com/bigheartmassageco",
  },
  {
    name: "Erica Parker",
    role: "Social Media/Videography",
    image: "/images/team/IMG_1495-4.jpg",
    description:
      "As the social media manager and videographer for Ecdysis Barbershop, Erica uses film and visual storytelling to reveal the moments behind the chair. Her work focuses on capturing the craft, the personalities, and the perspectives that shape the culture of the shop and connect people to each other.",
  },
];

function SocialIcon({
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
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-[35px] w-[35px] items-center justify-center rounded-full bg-ec-green text-white transition-colors duration-300 hover:bg-ec-green-light"
    >
      {children}
    </Link>
  );
}

function TeamCard({ member, dark }: { member: Member; dark: boolean }) {
  const textColor = dark ? "text-white" : "text-black";
  const hasSocial = member.instagram || member.facebook || member.email;
  return (
    <motion.div
      {...fadeUp}
      className="flex flex-col items-center px-[25px] py-[42px]"
    >
      <div className="group relative aspect-[430/400] w-full max-w-[430px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
          style={{ backgroundImage: `url('${member.image}')` }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-black/60 px-6 text-center text-white opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100">
          <p className="translate-y-[300px] text-[14px] font-light leading-[1.5] opacity-0 transition-all duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-hover:opacity-100">
            {member.description}
          </p>
          {member.workLink && (
            <div className="translate-y-[400px] opacity-0 transition-all delay-200 duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-hover:opacity-100">
              <Link href={member.workLink} className="ec-button">
                {member.workLinkLabel}
              </Link>
            </div>
          )}
        </div>
      </div>
      <h2
        className={`mt-7 text-center font-script text-[30px] leading-[1] tracking-[1.5px] ${textColor}`}
      >
        {member.name}
      </h2>
      <h3
        className={`mt-2 text-center font-sans text-[18px] font-light leading-[24px] ${textColor}`}
      >
        {member.role}
      </h3>
      {hasSocial && (
        <ul className="mt-3 flex items-center gap-[10px]">
          {member.instagram && (
            <li>
              <SocialIcon
                href={member.instagram}
                label={`${member.name} on Instagram`}
              >
                <InstagramIcon className="h-[16px] w-[16px]" />
              </SocialIcon>
            </li>
          )}
          {member.facebook && (
            <li>
              <SocialIcon
                href={member.facebook}
                label={`${member.name} on Facebook`}
              >
                <FacebookIcon className="h-[16px] w-[16px]" />
              </SocialIcon>
            </li>
          )}
          {member.email && (
            <li>
              <SocialIcon
                href={`mailto:${member.email}`}
                label={`Email ${member.name}`}
              >
                <MailIcon className="h-[16px] w-[16px]" />
              </SocialIcon>
            </li>
          )}
        </ul>
      )}
    </motion.div>
  );
}

export function TeamGrid() {
  return (
    <>
      <div aria-hidden className="h-[70px] w-full bg-ec-dark" />
      <section className="w-full bg-ec-dark py-[15px]">
        <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-y-12 md:grid-cols-3 md:gap-x-0 md:gap-y-0">
          {TOP_ROW.map((m) => (
            <TeamCard key={m.name} member={m} dark />
          ))}
        </div>
      </section>
      <section className="w-full bg-white py-[15px]">
        <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-y-12 md:grid-cols-3 md:gap-x-0 md:gap-y-0">
          {BOTTOM_ROW.map((m) => (
            <TeamCard key={m.name} member={m} dark={false} />
          ))}
        </div>
      </section>
    </>
  );
}
