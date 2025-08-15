
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { TreatmentCarousel } from '@/components/patient/TreatmentCarousel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { db } from '@/lib/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import type { Treatment } from '@/lib/types';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';


async function getTreatments(): Promise<Treatment[]> {
    const treatmentsCol = collection(db, 'treatments');
    const q = query(treatmentsCol, orderBy('name'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Treatment));
}


export default function Home() {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    async function fetchTreatments() {
        const fetchedTreatments = await getTreatments();
        setTreatments(fetchedTreatments);
    }
    fetchTreatments();
  }, []);
  
  const handleBookAppointmentClick = () => {
    if (user) {
      router.push('/book');
    } else {
      router.push('/login');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#faf8f3]">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[80vh] flex items-center justify-center text-center text-white animate-fadeIn">
          <video
            autoPlay
            muted
            loop
            className="absolute w-full h-full object-cover"
            src="https://videos.pexels.com/video-files/8099895/8099895-hd_1920_1080_25fps.mp4"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/30"></div>
          <div className="relative z-10 max-w-2xl animate-riseUp">
            <h1 className="text-5xl md:text-6xl font-headline mb-4 tracking-wide text-white">Restore. Revive. Renew.</h1>
            <p className="text-lg md:text-xl mb-6 text-white/90">Personalized physiotherapy care by Dr. Amiya Ballav Roy</p>
            <Button onClick={handleBookAppointmentClick} size="lg" className="bg-[#e0a96d] text-black px-6 py-3 rounded-lg text-lg font-medium hover:bg-[#d18f50] hover:scale-105 transform transition">
              Book Appointment
            </Button>
          </div>
        </section>

        {/* Doctor Profile Section */}
        <section className="bg-[#faf8f3] py-16 px-6 md:px-20 text-center animate-fadeUp">
          <Image src="https://placehold.co/600x600.png" alt="Dr. Amiya Ballav Roy" width={160} height={160} className="w-40 h-40 rounded-full mx-auto shadow-lg mb-6 hover:scale-105 transition" data-ai-hint="male doctor friendly"/>
          <h2 className="text-3xl font-headline mb-2 text-[#2e4a3f]">Dr. Amiya Ballav Roy</h2>
          <p className="text-[#70a8a3] font-medium mb-4">CDNT, CKTP, CCTS | Physiotherapist @ Pain Manage Clinic</p>
          <p className="max-w-2xl mx-auto mb-6 text-muted-foreground">
            Specialist in Dry Needling, Taping, and Dry Cupping techniques with a focus on holistic pain management and recovery.
          </p>
           <Button onClick={handleBookAppointmentClick} size="lg" className="bg-[#e0a96d] text-black px-6 py-3 rounded-lg hover:bg-[#d18f50] hover:scale-105 transform transition">
              Book Appointment
            </Button>
        </section>
        
        {/* Services Section */}
        <section id="services" className="w-full py-16 md:py-24 bg-background">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl md:text-4xl font-headline tracking-tight text-center mb-12 text-[#2e4a3f]">Our Services</h2>
            <TreatmentCarousel treatments={treatments} />
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="w-full py-16 md:py-24 bg-secondary">
            <div className="container px-4 md:px-6">
                 <h2 className="text-3xl md:text-4xl font-headline tracking-tighter text-center mb-12 text-[#2e4a3f]">Patient Testimonials</h2>
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

      </main>
      <footer className="bg-deep-highlight text-deep-highlight-foreground py-6 border-t border-deep-highlight/50">
        <div className="container text-center text-sm">
          © {new Date().getFullYear()} PhysioEase Clinic. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
