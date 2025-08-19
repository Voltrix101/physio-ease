
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
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 rounded-lg border bg-card dark:card-shadow">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
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
          <CardTitle className="text-xl font-headline text-primary">{treatment.name}</CardTitle>
          <CardDescription className="pt-2 text-base text-muted-foreground">{treatment.description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-6 pt-0">
        <div className="flex justify-between items-center text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-primary" />
                <span className="font-semibold text-primary/90 text-base">₹{treatment.price}</span>
            </div>
            <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span className="font-semibold text-primary/90 text-base">{treatment.duration} mins</span>
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
