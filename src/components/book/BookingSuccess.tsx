'use client';

import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export function BookingSuccess() {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-4 py-12 animate-in fade-in-0 duration-500">
      <CheckCircle2 className="h-16 w-16 text-green-500 animate-pulse" />
      <h2 className="text-2xl font-bold font-headline">Booking Request Sent!</h2>
      <p className="text-muted-foreground max-w-sm">
        Your appointment request has been successfully submitted. You'll receive a notification and an email once the doctor confirms it.
      </p>
      <Button asChild>
        <Link href="/">Back to Home</Link>
      </Button>
    </div>
  );
}
