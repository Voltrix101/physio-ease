import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { TreatmentCarousel } from '@/components/patient/TreatmentCarousel';
import { mockTreatments } from '@/lib/data';

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary/50">
          <div className="container px-4 md:px-6 text-center">
            <div className="flex flex-col items-center space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none font-headline">
                Revitalize Your Body, Restore Your Life
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Expert physiotherapy at your fingertips. Book your appointment today and take the first step towards a pain-free life.
              </p>
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-md transition-transform hover:scale-105">
                <Link href="/book">Book an Appointment</Link>
              </Button>
            </div>
          </div>
        </section>
        
        <section id="treatments" className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter text-center font-headline mb-12">Our Treatments</h2>
            <TreatmentCarousel treatments={mockTreatments} />
          </div>
        </section>
      </main>
      <footer className="bg-card py-6 border-t">
        <div className="container text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} PhysioEase. All rights reserved.
        </div>
      </footer>
    </>
  );
}
