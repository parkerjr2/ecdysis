import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { BackToTop } from "@/components/BackToTop";
import { KoryHero } from "@/components/gallery/KoryHero";
import { KoryGrid } from "@/components/gallery/KoryGrid";

export default function KorysWorkPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex flex-col">
        <KoryHero />
        <KoryGrid />
        <SiteFooter />
      </main>
      <BackToTop />
    </>
  );
}
