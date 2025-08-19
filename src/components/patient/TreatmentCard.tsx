
import Image from 'next/image';
import type { Treatment } from '@/lib/types';
import Link from 'next/link';
import { Clock, Tag } from 'lucide-react';

interface TreatmentCardProps {
  treatment: Treatment;
}

export function TreatmentCard({ treatment }: TreatmentCardProps) {
  return (
    <Link href={`/book?treatment=${treatment.id}`} className="flex flex-col h-full">
        <div className="bg-card rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full overflow-hidden">
        <div className="relative h-48 w-full overflow-hidden group">
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
            <div className="flex justify-between items-center mt-4 text-base text-green-600 dark:text-green-400">
                <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    <span className="font-semibold">₹{treatment.price}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span className="font-semibold">{treatment.duration} mins</span>
                </div>
            </div>
        </div>
        </div>
    </Link>
  );
}
