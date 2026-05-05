import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { BackToTop } from "@/components/BackToTop";
import { VisitUs } from "@/components/VisitUs";
import { AboutHero } from "@/components/about/AboutHero";
import { AboutStory } from "@/components/about/AboutStory";
import { AboutFounders } from "@/components/about/AboutFounders";
import { AboutVision } from "@/components/about/AboutVision";
import { AboutHistory } from "@/components/about/AboutHistory";

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex flex-col">
        <AboutHero />
        <AboutStory />
        <AboutFounders />
        <AboutVision />
        <AboutHistory />
        <VisitUs mapSide="right" />
        <SiteFooter />
      </main>
      <BackToTop />
    </>
  );
}
