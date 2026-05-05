import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { BackToTop } from "@/components/BackToTop";
import { RafaelHero } from "@/components/gallery/RafaelHero";
import { RafaelGrid } from "@/components/gallery/RafaelGrid";

export default function RafaelsWorkPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex flex-col">
        <RafaelHero />
        <RafaelGrid />
        <SiteFooter />
      </main>
      <BackToTop />
    </>
  );
}
