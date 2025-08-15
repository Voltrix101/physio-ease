'use client';

import type { Treatment } from '@/lib/types';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { TreatmentCard } from './TreatmentCard';

interface TreatmentCarouselProps {
  treatments: Treatment[];
}

export function TreatmentCarousel({ treatments }: TreatmentCarouselProps) {
  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full max-w-6xl mx-auto"
    >
      <CarouselContent>
        {treatments.map((treatment) => (
          <CarouselItem key={treatment.id} className="md:basis-1/2 lg:basis-1/3">
            <div className="p-2">
              <TreatmentCard treatment={treatment} />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden sm:flex" />
      <CarouselNext className="hidden sm:flex" />
    </Carousel>
  );
}
