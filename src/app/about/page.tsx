import { Header } from "@/components/Header";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
                <h1 className="text-4xl lg:text-5xl font-headline text-primary leading-tight">
                    About Dr. Amiya Ballav Roy
                </h1>
                <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="bg-primary/10 text-primary border border-primary/20">CDNT (Dry Needling)</Badge>
                    <Badge variant="secondary" className="bg-primary/10 text-primary border border-primary/20">CKTP (Taping)</Badge>
                    <Badge variant="secondary" className="bg-primary/10 text-primary border border-primary/20">CCTS (Dry Cupping)</Badge>
                </div>
                <p className="text-muted-foreground text-lg">
                    Dr. Amiya Ballav Roy is a highly qualified and experienced physiotherapist dedicated to helping patients achieve optimal health and wellness. He holds multiple certifications in advanced physiotherapy techniques, ensuring that his patients receive the most effective and up-to-date treatments available.
                </p>
                <h2 className="text-3xl font-headline text-primary pt-4">Our Philosophy</h2>
                <p className="text-muted-foreground">
                    At PhysioEase Clinic, we believe in a holistic approach to patient care. We don't just treat the symptoms; we work to identify and address the root cause of your condition. Our goal is to empower you with the knowledge and tools you need to live a pain-free, active life.
                </p>
                 <h2 className="text-3xl font-headline text-primary pt-4">Certifications</h2>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li><strong>CDNT (Certified in Dry Needling):</strong> An expert in using fine needles to target trigger points and relieve muscle pain and stiffness.</li>
                    <li><strong>CKTP (Certified Kinesio Taping Practitioner):</strong> Skilled in applying Kinesio tape to support muscles, reduce pain and inflammation, and enhance performance.</li>
                    <li><strong>CCTS (Certified in Dry Cupping Therapy):</strong> Proficient in using suction cups to promote healing, reduce pain, and improve blood flow.</li>
                </ul>
            </div>
            <div className="relative h-[500px] rounded-lg overflow-hidden shadow-2xl transition-transform hover:scale-105 duration-500">
                <Image
                    src="/doctor-photo.jpeg"
                    alt="Dr. Amiya Ballav Roy"
                    fill
                    className="object-cover object-center"
                />
            </div>
          </div>
        </div>
      </main>
      <footer className="bg-deep-highlight text-deep-highlight-foreground py-6 border-t border-deep-highlight/50">
        <div className="container text-center text-sm">
          © {new Date().getFullYear()} PhysioEase Clinic. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
