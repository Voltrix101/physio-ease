
import Image from 'next/image';
import type { Treatment } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Clock, Tag } from 'lucide-react';

interface TreatmentCardProps {
  treatment: Treatment;
}

export function TreatmentCard({ treatment }: TreatmentCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden hover:-translate-y-1.5 rounded-lg bg-card card-shadow">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full transition-transform duration-300 group-hover:scale-105">
          <Image
            src={treatment.imageUrl}
            alt={treatment.name}
            fill
            style={{objectFit: 'cover'}}
            className="rounded-t-lg"
            data-ai-hint={treatment.dataAiHint}
          />
        </div>
        <div className="p-6">
          <CardTitle className="text-xl font-headline">{treatment.name}</CardTitle>
          <CardDescription className="pt-2 text-base text-muted-foreground">{treatment.description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-6 pt-0">
        <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-green-600" />
                <span className="font-semibold text-green-600 text-base">₹{treatment.price}</span>
            </div>
            <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-green-600" />
                <span className="font-semibold text-green-600 text-base">{treatment.duration} mins</span>
            </div>
        </div>
      </CardContent>
       <CardFooter className="p-6 pt-0 mt-auto">
        <Button asChild className="w-full" variant="accent">
          <Link href={`/book?treatment=${treatment.id}`}>Book Now</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
