import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { TreatmentCarousel } from '@/components/patient/TreatmentCarousel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { db } from '@/lib/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import type { Treatment } from '@/lib/types';


async function getTreatments(): Promise<Treatment[]> {
    const treatmentsCol = collection(db, 'treatments');
    const q = query(treatmentsCol, orderBy('name'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Treatment));
}


export default async function Home() {
  const treatments = await getTreatments();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full h-[60vh] md:h-[80vh] flex items-center justify-center text-center overflow-hidden">
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute top-0 left-0 w-full h-full object-cover -z-10"
                src="https://videos.pexels.com/video-files/8099895/8099895-hd_1920_1080_25fps.mp4"
            />
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-deep-highlight/70 to-black/30 -z-10" />
            <div className="container px-4 md:px-6 text-white animate-fade-in-up">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-headline tracking-wider text-shadow-lg">
                    Restore. Revive. Renew.
                </h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-white/90">
                    Personalized physiotherapy care by Dr. Amiya Ballav Roy
                </p>
                <Button asChild size="lg" className="mt-8 bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg transition-transform hover:scale-105 hover:shadow-accent/50 focus:ring-accent">
                    <Link href="/book">Book an Appointment</Link>
                </Button>
            </div>
        </section>
        
        {/* Services Section */}
        <section id="services" className="w-full py-16 md:py-24 bg-background">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl md:text-4xl font-headline tracking-tight text-center mb-12">Our Services</h2>
            <TreatmentCarousel treatments={treatments} />
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="w-full py-16 md:py-24 bg-secondary">
            <div className="container px-4 md:px-6">
                 <h2 className="text-3xl md:text-4xl font-headline tracking-tighter text-center mb-12">Patient Testimonials</h2>
                 <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                      {name: "Rohan S.", quote: "A wonderful experience. Dr. Amiya is very knowledgeable and caring. My back pain is completely gone!"},
                      {name: "Priya K.", quote: "The dry needling therapy worked wonders for my shoulder. Highly recommended clinic."},
                      {name: "Amit G.", quote: "Professional, clean, and effective. The best physiotherapy I've had in Kolkata."}
                    ].map((testimonial, i) => (
                        <Card key={i} className="bg-card border-l-4 border-accent shadow-md transition-all hover:shadow-xl hover:-translate-y-1">
                            <CardHeader>
                                <CardTitle className="font-body text-xl text-primary">{testimonial.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground italic">"{testimonial.quote}"</p>
                            </CardContent>
                        </Card>
                    ))}
                 </div>
            </div>
        </section>

        {/* Clinic Details Section */}
        <section id="clinic-details" className="w-full py-16 md:py-24 bg-background">
            <div className="container text-center">
                 <h2 className="text-3xl font-headline tracking-tighter mb-4">Visit Us</h2>
                 <p className="text-muted-foreground max-w-md mx-auto">
                    Pain Manage Clinic
                    <br />
                    123 Wellness Street, Kolkata, India
                    <br />
                    Phone: +91 12345 67890
                 </p>
            </div>
        </section>

      </main>
      <footer className="bg-deep-highlight text-deep-highlight-foreground py-6 border-t border-deep-highlight/50">
        <div className="container text-center text-sm">
          © {new Date().getFullYear()} PhysioEase Clinic. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
