import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { BackToTop } from "@/components/BackToTop";
import { CourtneyHero } from "@/components/gallery/CourtneyHero";
import { CourtneyGrid } from "@/components/gallery/CourtneyGrid";

export default function CourtneysWorkPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex flex-col">
        <CourtneyHero />
        <CourtneyGrid />
        <SiteFooter />
      </main>
      <BackToTop />
    </>
  );
}
