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
        <section className="w-full bg-primary/5">
          <div className="container grid md:grid-cols-2 gap-8 items-center py-12 md:py-24">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary tracking-tight">
                Dr. Amiya Ballav Roy
              </h1>
              <p className="font-semibold text-lg text-primary/90">
                CDNT (Dry Needling), CKTP (Taping), CCTS (Dry Cupping) – PHYSIOTHERAPIST
              </p>
              <p className="text-muted-foreground">
                Welcome to the Pain Manage Clinic, where we are dedicated to providing expert physiotherapy and rehabilitation services. Dr. Amiya specializes in advanced techniques to help you recover from injuries, manage pain, and restore your quality of life.
              </p>
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg transition-transform hover:scale-105">
                <Link href="/book">Book an Appointment</Link>
              </Button>
            </div>
            <div className="relative h-80 md:h-96 rounded-lg overflow-hidden shadow-2xl">
                <Image
                    src="https://placehold.co/600x600.png"
                    alt="Dr. Amiya Ballav Roy"
                    layout="fill"
                    objectFit="cover"
                    className="object-top"
                    data-ai-hint="male doctor portrait"
                />
            </div>
          </div>
        </section>
        
        <section id="services" className="w-full py-12 md:py-24 bg-secondary">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter text-center mb-12">Our Services</h2>
            <TreatmentCarousel treatments={treatments} />
          </div>
        </section>

        <section id="testimonials" className="w-full py-12 md:py-24">
            <div className="container px-4 md:px-6">
                 <h2 className="text-3xl font-bold tracking-tighter text-center mb-12">Patient Testimonials</h2>
                 <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Placeholder for testimonials */}
                    {[1,2,3].map(i => (
                        <Card key={i}>
                            <CardHeader>
                                <CardTitle>Patient {i}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">"A wonderful experience. Dr. Amiya is very knowledgeable and caring."</p>
                            </CardContent>
                        </Card>
                    ))}
                 </div>
            </div>
        </section>

        <section id="clinic-details" className="w-full py-12 md:py-24 bg-secondary">
            <div className="container text-center">
                 <h2 className="text-3xl font-bold tracking-tighter mb-4">Visit Us</h2>
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
      <footer className="bg-primary text-primary-foreground py-6 border-t">
        <div className="container text-center text-sm">
          © {new Date().getFullYear()} Pain Manage Clinic. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
