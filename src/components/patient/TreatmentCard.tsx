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
    <Card className="flex flex-col h-full overflow-hidden transition-shadow duration-300 hover:shadow-lg">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          <Image
            src={treatment.imageUrl}
            alt={treatment.name}
            layout="fill"
            objectFit="cover"
            data-ai-hint={treatment.dataAiHint}
          />
        </div>
        <div className="p-6">
          <CardTitle className="font-headline text-xl">{treatment.name}</CardTitle>
          <CardDescription className="pt-2">{treatment.description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-6 pt-0 flex flex-col justify-between">
        <div className="flex justify-between text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                <span>${treatment.price}</span>
            </div>
            <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{treatment.duration} mins</span>
            </div>
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
          <Link href={`/book?treatment=${treatment.id}`}>Book Now</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
