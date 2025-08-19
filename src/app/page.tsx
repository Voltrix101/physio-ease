
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { TreatmentCarousel } from '@/components/patient/TreatmentCarousel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { db } from '@/lib/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import type { Treatment, Testimonial } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';


async function getTreatments(): Promise<Treatment[]> {
    const treatmentsCol = collection(db, 'treatments');
    const q = query(treatmentsCol, orderBy('name'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Treatment));
}

async function getTestimonials(): Promise<Testimonial[]> {
    const testimonialsCol = collection(db, 'testimonials');
    const q = query(testimonialsCol, orderBy('name'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Testimonial));
}


export default async function Home() {
  const treatments = await getTreatments();
  const testimonials = await getTestimonials();
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[70vh] flex items-center justify-center text-center text-white animate-fadeIn md:h-[80vh]">
          <Image
            src="https://plus.unsplash.com/premium_photo-1663012948067-0478e4f9d9c6?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Physiotherapy session"
            fill
            className="absolute w-full h-full object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/30"></div>
          <div className="relative z-10 max-w-2xl px-4 animate-riseUp">
            <h1 className="text-4xl font-headline mb-4 tracking-wide text-white sm:text-5xl md:text-6xl">Restore. Revive. Renew.</h1>
            <p className="text-lg mb-6 text-white/90 md:text-xl">Personalized physiotherapy care by Dr. Amiya Ballav Roy</p>
             <Button asChild size="lg" variant="accent" className="px-8 py-4 text-lg font-medium rounded-full bg-gradient-to-r from-[#ffb84d] to-[#ff9933] text-white hover:scale-105 transition-all">
                <Link href="/book">Book Appointment</Link>
            </Button>
          </div>
        </section>

        {/* Doctor Profile Section */}
        <section className="bg-background py-16 px-4 text-center animate-fadeUp md:px-6">
          <Image src="https://i.postimg.cc/CxpzR9S8/Whats-App-Image-2025-08-15-at-23-45-01.jpg" alt="Dr. Amiya Ballav Roy" width={160} height={160} className="w-32 h-32 md:w-40 md:h-40 rounded-full mx-auto object-cover shadow-lg mb-6 hover:scale-105 transition"/>
          <h2 className="text-3xl font-headline mb-2 text-foreground md:text-4xl">Dr. Amiya Ballav Roy</h2>
          <p className="text-primary font-medium mb-4">CDNT, CKTP, CCTS | Physiotherapist @ Pain Manage Clinic</p>
          <p className="max-w-3xl mx-auto mb-6 text-muted-foreground">
            Specialist in Dry Needling, Taping, and Dry Cupping techniques with a focus on holistic pain management and recovery.
          </p>
        </section>
        
        {/* Services Section */}
        <section id="services" className="w-full py-16 bg-secondary md:py-24">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-headline tracking-tight text-foreground md:text-4xl">Our Physiotherapy Services</h2>
                <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">We offer a comprehensive range of specialized treatments to address your specific needs and support your recovery.</p>
            </div>
            <TreatmentCarousel treatments={treatments} />
             <div className="mt-12 text-center">
                <Button asChild variant="outline">
                  <Link href="/services">View All Services</Link>
                </Button>
              </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="w-full py-16 bg-background md:py-24">
            <div className="container px-4 md:px-6">
                 <h2 className="text-3xl font-headline tracking-tight text-center mb-12 text-foreground md:text-4xl">Patient Testimonials</h2>
                 <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {testimonials.length === 0 ? (
                      Array.from({ length: 3 }).map((_, i) => (
                        <Card key={i} className="bg-card border-l-4 border-accent card-shadow">
                            <CardHeader>
                               <Skeleton className="h-6 w-1/2" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-4 w-full mb-2" />
                                <Skeleton className="h-4 w-5/6" />
                            </CardContent>
                        </Card>
                      ))
                    ) : (
                      testimonials.map((testimonial) => (
                          <Card key={testimonial.id} className="bg-card border-l-4 border-accent rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                              <CardHeader>
                                  <CardTitle className="font-body text-xl text-primary">{testimonial.name}</CardTitle>
                              </CardHeader>
                              <CardContent>
                                  <p className="text-muted-foreground italic">"{testimonial.quote}"</p>
                              </CardContent>
                          </Card>
                      ))
                    )}
                 </div>
            </div>
        </section>

      </main>
      <footer className="bg-deep-highlight dark:bg-card text-deep-highlight-foreground dark:text-primary-foreground py-6 border-t border-deep-highlight/50 dark:border-border">
        <div className="container text-center text-sm px-4 md:px-6">
          © {new Date().getFullYear()} PhysioEase Clinic. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
