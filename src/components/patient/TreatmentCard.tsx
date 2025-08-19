
import Image from 'next/image';
import type { Treatment } from '@/lib/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Clock, Tag } from 'lucide-react';

interface TreatmentCardProps {
  treatment: Treatment;
}

export function TreatmentCard({ treatment }: TreatmentCardProps) {
  return (
    <div className="bg-card rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full overflow-hidden">
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={treatment.imageUrl}
          alt={treatment.name}
          fill
          style={{objectFit: 'cover'}}
          className="group-hover:scale-105 transition-transform duration-300"
          data-ai-hint={treatment.dataAiHint}
        />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-headline font-semibold text-foreground">{treatment.name}</h3>
        <p className="text-base text-muted-foreground mt-2 flex-grow">{treatment.description}</p>
        <div className="flex justify-between items-center mt-4 text-base" style={{color: '#198754'}}>
            <div className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                <span className="font-semibold">₹{treatment.price}</span>
            </div>
            <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span className="font-semibold">{treatment.duration} mins</span>
            </div>
        </div>
        <Button asChild className="mt-6 w-full rounded-full bg-gradient-to-r from-[#ffb84d] to-[#ff9933] text-white py-2 font-medium hover:opacity-90 hover:scale-[1.02] transition-all duration-300">
          <Link href={`/book?treatment=${treatment.id}`}>Book Now</Link>
        </Button>
      </div>
    </div>
  );
}
