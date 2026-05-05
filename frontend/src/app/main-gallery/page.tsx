import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { BackToTop } from "@/components/BackToTop";
import { GalleryHero } from "@/components/gallery/GalleryHero";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";

export default function MainGalleryPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex flex-col">
        <GalleryHero />
        <GalleryGrid />
        <SiteFooter />
      </main>
      <BackToTop />
    </>
  );
}
