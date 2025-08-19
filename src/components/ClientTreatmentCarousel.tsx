'use client';

import dynamic from 'next/dynamic';

// Client-side dynamic import for treatment carousel
const TreatmentCarousel = dynamic(() => 
  import('./patient/TreatmentCarousel').then(mod => ({ default: mod.TreatmentCarousel })), 
  { 
    ssr: false,
    loading: () => <div className="h-64 bg-muted animate-pulse rounded-lg" />
  }
);

export { TreatmentCarousel };
