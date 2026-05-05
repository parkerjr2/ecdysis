import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { BackToTop } from "@/components/BackToTop";
import { TeamHero } from "@/components/team/TeamHero";
import { TeamGrid } from "@/components/team/TeamGrid";

export default function OurTeamPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex flex-col">
        <TeamHero />
        <TeamGrid />
        <SiteFooter />
      </main>
      <BackToTop />
    </>
  );
}
