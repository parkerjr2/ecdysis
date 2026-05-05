import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { BackToTop } from "@/components/BackToTop";
import { ServicesHero } from "@/components/services/ServicesHero";
import { ServicesGrid } from "@/components/services/ServicesGrid";

export default function ServicesPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex flex-col">
        <ServicesHero />
        <ServicesGrid />
        <SiteFooter />
      </main>
      <BackToTop />
    </>
  );
}
