import { Header } from "@/components/Header";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-12 bg-secondary/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-3 gap-8 items-start">
            <div className="md:col-span-1">
               <div className="relative h-96 rounded-lg overflow-hidden shadow-lg">
                    <Image
                        src="https://placehold.co/400x600.png"
                        alt="Dr. Amiya Ballav Roy"
                        layout="fill"
                        objectFit="cover"
                        data-ai-hint="male doctor professional"
                    />
                </div>
            </div>
            <div className="md:col-span-2 space-y-6">
                <h1 className="text-3xl font-bold text-primary">About Dr. Amiya Ballav Roy</h1>
                <p className="text-muted-foreground">
                    Dr. Amiya Ballav Roy is a highly qualified and experienced physiotherapist dedicated to helping patients achieve optimal health and wellness. He holds multiple certifications in advanced physiotherapy techniques, ensuring that his patients receive the most effective and up-to-date treatments available.
                </p>
                <h2 className="text-2xl font-bold text-primary">Certifications</h2>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li><strong>CDNT (Certified in Dry Needling):</strong> An expert in using fine needles to target trigger points and relieve muscle pain and stiffness.</li>
                    <li><strong>CKTP (Certified Kinesio Taping Practitioner):</strong> Skilled in applying Kinesio tape to support muscles, reduce pain and inflammation, and enhance performance.</li>
                    <li><strong>CCTS (Certified in Dry Cupping Therapy):</strong> Proficient in using suction cups to promote healing, reduce pain, and improve blood flow.</li>
                </ul>
                <h2 className="text-2xl font-bold text-primary">Our Philosophy</h2>
                <p className="text-muted-foreground">
                    At the Pain Manage Clinic, we believe in a holistic approach to patient care. We don't just treat the symptoms; we work to identify and address the root cause of your condition. Our goal is to empower you with the knowledge and tools you need to live a pain-free, active life.
                </p>
            </div>
          </div>
        </div>
      </main>
      <footer className="bg-primary text-primary-foreground py-6 border-t">
        <div className="container text-center text-sm">
          © {new Date().getFullYear()} Pain Manage Clinic. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
