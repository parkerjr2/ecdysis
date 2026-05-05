import { SiteHeader } from "@/components/SiteHeader";
import { Hero } from "@/components/Hero";
import { AboutUs } from "@/components/AboutUs";
import { ServicesTitle } from "@/components/ServicesTitle";
import { ServicesGrid } from "@/components/ServicesGrid";
import { OurPeople } from "@/components/OurPeople";
import { Gallery } from "@/components/Gallery";
import { Testimonials } from "@/components/Testimonials";
import { SignatureService } from "@/components/SignatureService";
import { VisitUs } from "@/components/VisitUs";
import { SiteFooter } from "@/components/SiteFooter";
import { BackToTop } from "@/components/BackToTop";
import { fetchGoogleReviews } from "@/lib/google-reviews";

export default async function Home() {
  const { reviews, totalCount } = await fetchGoogleReviews();
  return (
    <>
      <SiteHeader />
      <main className="flex flex-col">
        <Hero />
        <AboutUs />
        <ServicesTitle />
        <ServicesGrid />
        <OurPeople />
        <Gallery />
        <Testimonials reviews={reviews} totalCount={totalCount} />
        <SignatureService
          title="Haircuts"
          imageSide="left"
          imageSrc="/images/IMG_9003.jpg"
          imageAlt="Barber giving a precision haircut"
          imageWidth={540}
          ornamentSrc="/images/haircut-ornament.svg"
          imageObjectPosition="50% 0%"
          paragraphs={[
            "At Ecdysis Barbershop, we specialize in precision haircuts for Broken Arrow's busy professionals and families. Conveniently located right off Highway 169, we are easily accessible whether you work downtown or live near Union/Broken Arrow school districts.",
            "Our men's haircuts blend classic barbering with modern trends, tailored to your hair type, face shape, and lifestyle - from outdoor activities at Redbud Valley Nature Preserve to business meetings downtown.",
            "We provide kids' haircuts with a patient, efficient approach that parents trust.",
            "Every haircut includes consultation, precision cutting, and detailed finishing to ensure you leave looking exactly as envisioned.",
          ]}
        />
        <SignatureService
          title="Straight Razor Shaves"
          imageSide="right"
          imageSrc="/images/IMG_8997.jpg"
          imageAlt="Straight razor shave detail work"
          paragraphs={[
            "What sets Ecdysis apart in Broken Arrow is our authentic straight razor services - true barbering experiences you can't achieve at home.",
            "Our straight razor edge-ups deliver ultimate precision for hairline and beard definition. Choose full perimeter edge-ups or partial service targeting specific areas for professionally finished results.",
            "The crown jewel is our traditional full face straight razor shave. This premium service includes hot towel preparation, quality shaving cream, and expert technique only experienced barbers provide. Perfect for special occasions, job interviews, or treating yourself to Broken Arrow's finest grooming experience.",
          ]}
        />
        <VisitUs />
        <SiteFooter />
      </main>
      <BackToTop />
    </>
  );
}
