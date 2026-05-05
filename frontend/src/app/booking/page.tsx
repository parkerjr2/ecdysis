import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { BackToTop } from "@/components/BackToTop";
import { BookingShell } from "@/components/booking/BookingShell";
import { BookingProvider } from "@/components/booking/BookingProvider";

export default function BookingPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex flex-col">
        <BookingProvider>
          <BookingShell />
        </BookingProvider>
        <SiteFooter />
      </main>
      <BackToTop />
    </>
  );
}
