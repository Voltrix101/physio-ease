
'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';

import type { Treatment } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { BookingSuccess } from './BookingSuccess';
import { ArrowLeft, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { createAppointment, type CreateAppointmentResult } from '@/lib/appointments';

const FormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  treatmentId: z.string({ required_error: 'Please select a service.' }),
  date: z.date({ required_error: 'Please select a date.' }),
  time: z.string({ required_error: 'Please select a time.' }),
  paymentProof: z.any(),
});


const timeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'];

export function BookingForm({ treatments }: { treatments: Treatment[] }) {
  const [step, setStep] = useState(1);
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  
  const defaultTreatmentId = useMemo(() => searchParams.get('treatment') || undefined, [searchParams]);
  
  const [paymentProofType, setPaymentProofType] = useState<'image'|'text'>('image');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<CreateAppointmentResult | null>(null);


  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: user?.displayName || '',
      treatmentId: defaultTreatmentId,
    },
  });
  
  const { toast } = useToast();

  const selectedTreatmentId = form.watch('treatmentId');

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  };
  
 const handleFormSubmit = async (data: z.infer<typeof FormSchema>) => {
    if (!user) {
      toast({ variant: 'destructive', title: 'Not logged in', description: 'Please log in to book an appointment.' });
      return;
    }

    setIsSubmitting(true);
    
    const paymentProofInput = document.getElementById(paymentProofType === 'image' ? 'paymentProof' : 'paymentProofText') as HTMLInputElement;

    let proofValue = '';
    if (paymentProofType === 'image' && paymentProofInput.files && paymentProofInput.files[0]) {
      proofValue = await readFileAsDataURL(paymentProofInput.files[0]);
    } else if (paymentProofType === 'text') {
      proofValue = paymentProofInput.value;
    }
    
    if (!proofValue) {
      toast({ variant: 'destructive', title: 'Missing Proof', description: 'Please provide payment proof.' });
      setIsSubmitting(false);
      return;
    }
    
    const result = await createAppointment({
        name: data.name,
        treatmentId: data.treatmentId,
        date: data.date.toISOString(),
        time: data.time,
        paymentProof: proofValue,
        userId: user.uid,
    });
    
    setSubmissionResult(result);
    setIsSubmitting(false);

    if (!result.success) {
      toast({
        variant: "destructive",
        title: "Booking Failed",
        description: result.message || 'An unknown error occurred.',
      });
    }
  };


  if (submissionResult?.success) {
    return <BookingSuccess />;
  }
  
  return (
    <div className="space-y-8">
      <Progress value={(step / 3) * 100} className="w-full h-2 bg-secondary" />
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in-0 duration-500">
            <h3 className="text-xl font-headline">Step 1: Choose Your Service</h3>
            <Controller
              control={form.control}
              name="treatmentId"
              render={({ field }) => (
                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {treatments.map((treatment) => (
                    <Label key={treatment.id} htmlFor={treatment.id} className="flex flex-col items-start justify-between rounded-lg border-2 border-muted bg-background p-4 hover:bg-accent/10 hover:border-accent peer-data-[state=checked]:border-accent peer-data-[state=checked]:bg-accent/5 [&:has([data-state=checked])]:border-accent cursor-pointer transition-colors">
                      <RadioGroupItem value={treatment.id} id={treatment.id} className="sr-only" />
                      <span className="font-semibold font-headline text-lg text-primary">{treatment.name}</span>
                      <span className="text-sm text-muted-foreground mt-2">{treatment.description}</span>
                      <span className="font-bold text-primary/80 mt-4">₹{treatment.price} - {treatment.duration} mins</span>
                    </Label>
                  ))}
                </RadioGroup>
              )}
            />
             {form.formState.errors.treatmentId && <p className="text-sm text-destructive">{form.formState.errors.treatmentId.message}</p>}
            <div className="flex justify-end">
              <Button type="button" onClick={nextStep} disabled={!selectedTreatmentId} className="bg-accent text-accent-foreground hover:bg-accent/90">
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-in fade-in-0 duration-500">
            <h3 className="text-xl font-headline">Step 2: Select Date & Time</h3>
            <div className="grid md:grid-cols-2 gap-8 items-start">
                <Controller name="date" control={form.control} render={({ field }) => (
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))} className="rounded-lg border p-0 sm:p-3" />
                )} />
                 <div className="space-y-4">
                    <Label>Select a time slot</Label>
                    <Controller name="time" control={form.control} render={({ field }) => (
                         <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger><SelectValue placeholder="Select a time slot" /></SelectTrigger>
                            <SelectContent>
                                {timeSlots.map(slot => <SelectItem key={slot} value={slot}>{slot}</SelectItem>)}
                            </SelectContent>
                         </Select>
                    )} />
                    {form.formState.errors.date && <p className="text-sm text-destructive">{form.formState.errors.date.message}</p>}
                    {form.formState.errors.time && <p className="text-sm text-destructive">{form.formState.errors.time.message}</p>}
                </div>
            </div>
            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={prevStep}><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
              <Button type="button" onClick={nextStep} disabled={!form.watch('date') || !form.watch('time')} className="bg-accent text-accent-foreground hover:bg-accent/90">
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 animate-in fade-in-0 duration-500">
            <h3 className="text-xl font-headline">Step 3: Your Details & Payment Proof</h3>
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" {...form.register('name')} placeholder="e.g. Jane Doe" />
              {form.formState.errors.name && <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>}
            </div>
            
             <RadioGroup onValueChange={(v) => setPaymentProofType(v as 'image'|'text')} defaultValue={paymentProofType} className="flex gap-4">
                <Label htmlFor="type-image" className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="image" id="type-image"/>Upload Screenshot</Label>
                <Label htmlFor="type-text" className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="text" id="type-text"/>Enter Transaction ID</Label>
            </RadioGroup>

            {paymentProofType === 'image' ? (
                 <div className="space-y-2">
                    <Label htmlFor="paymentProof">Upload UPI Screenshot</Label>
                     <Input id="paymentProof" name="paymentProof" type="file" accept="image/*" className="pt-2 h-11"/>
                 </div>
            ) : (
                <div className="space-y-2">
                    <Label htmlFor="paymentProofText">Transaction ID</Label>
                    <Input id="paymentProofText" name="paymentProofText" placeholder="Enter UPI transaction ID" />
                </div>
            )}
             {form.formState.errors.paymentProof && <p className="text-sm text-destructive">{String(form.formState.errors.paymentProof.message)}</p>}
            
            <div className="flex justify-between items-center">
              <Button type="button" variant="outline" onClick={prevStep}><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
              <Button type="submit" disabled={isSubmitting || authLoading || !user} className="bg-accent text-accent-foreground hover:bg-accent/90">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Request Appointment
              </Button>
            </div>
             {(!user && !authLoading) && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        You must be <Link href="/login" className="font-bold underline">logged in</Link> to book an appointment.
                    </AlertDescription>
                </Alert>
            )}
            {submissionResult?.message && !submissionResult.success && <p className="text-sm text-destructive mt-2">{submissionResult.message}</p>}
          </div>
        )}
      </form>
    </div>
  );
}
