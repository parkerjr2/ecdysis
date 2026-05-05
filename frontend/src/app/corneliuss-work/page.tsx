import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { BackToTop } from "@/components/BackToTop";
import { CorneliusHero } from "@/components/gallery/CorneliusHero";
import { CorneliusGrid } from "@/components/gallery/CorneliusGrid";

export default function CorneliussWorkPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex flex-col">
        <CorneliusHero />
        <CorneliusGrid />
        <SiteFooter />
      </main>
      <BackToTop />
    </>
  );
}
