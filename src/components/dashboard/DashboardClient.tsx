
'use client';

import { useSearchParams } from 'next/navigation';
import { DashboardSidebar } from "./DashboardSidebar";
import { AppointmentsList } from "./AppointmentsList";
import { TreatmentsList } from "./TreatmentsList";
import { ProductsList } from "./ProductsList";
import { VideosList } from "./VideosList";
import { TestimonialsList } from './TestimonialsList';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { PatientsList } from './PatientsList';

export function DashboardClient() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('view') || 'analytics';

  const renderContent = () => {
    switch (activeTab) {
      case 'appointments':
        return <AppointmentsList />;
      case 'treatments':
        return <TreatmentsList />;
      case 'products':
        return <ProductsList />;
      case 'videos':
        return <VideosList />;
      case 'testimonials':
        return <TestimonialsList />;
      case 'patients':
        return <PatientsList />;
      case 'analytics':
      default:
        return <AnalyticsDashboard />;
    }
  };

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-background">
        {renderContent()}
      </main>
    </div>
  );
}
