
'use client';

import { useState, useTransition, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useActionState } from 'react';
import Link from 'next/link';

import { createAppointment, type State } from '@/app/book/actions';
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


const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  treatmentId: z.string({ required_error: 'Please select a service.' }),
  date: z.date({ required_error: 'Please select a date.' }),
  time: z.string({ required_error: 'Please select a time.' }),
  paymentProofType: z.enum(['text', 'image']),
  paymentProofText: z.string().optional(),
  paymentProofFile: z.any().optional(),
}).refine(data => {
    if (data.paymentProofType === 'text') return !!data.paymentProofText && data.paymentProofText.length > 0;
    if (data.paymentProofType === 'image') return !!data.paymentProofFile?.[0];
    return false;
}, { message: 'Payment proof is required', path: ['paymentProofFile']});


const timeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'];

export function BookingForm({ treatments }: { treatments: Treatment[] }) {
  const [step, setStep] = useState(1);
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  
  // Memoize the search param to avoid re-reading from the hook on every render
  const defaultTreatmentId = useMemo(() => searchParams.get('treatment') || undefined, [searchParams]);
  
  const [isPending, startTransition] = useTransition();

  const initialState: State = { message: null, errors: {}, success: false };
  const [state, formAction] = useActionState(createAppointment, initialState);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      treatmentId: defaultTreatmentId,
      paymentProofType: 'image',
    },
  });

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

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!user) {
        toast({
            variant: "destructive",
            title: "Authentication Error",
            description: "You must be logged in to book an appointment.",
        });
        return;
    }
    
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('treatmentId', data.treatmentId);
    formData.append('date', data.date.toISOString());
    formData.append('time', data.time);
    formData.append('patientId', user.uid);
    
    let proof = '';
    if (data.paymentProofType === 'text' && data.paymentProofText) {
      proof = data.paymentProofText;
    } else if (data.paymentProofType === 'image' && data.paymentProofFile?.[0]) {
      try {
        proof = await readFileAsDataURL(data.paymentProofFile[0]);
      } catch (error) {
        toast({
            variant: "destructive",
            title: "File Error",
            description: "Could not read the uploaded file. Please try again.",
        });
        return;
      }
    }
    formData.append('paymentProof', proof);
    
    startTransition(() => {
        formAction(formData);
    });
  };

  if (state.success) {
    return <BookingSuccess />;
  }
  
  return (
    <div className="space-y-8">
      <Progress value={(step / 3) * 100} className="w-full h-2 bg-secondary" />
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
            <div className="grid md:grid-cols-2 gap-8">
                <Controller name="date" control={form.control} render={({ field }) => (
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))} className="rounded-lg border" />
                )} />
                 <div className="space-y-4">
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
              <Input id="name" {...form.register('name')} placeholder="e.g. Jane Doe" defaultValue={user?.displayName || ''} />
              {form.formState.errors.name && <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>}
            </div>
            
            <Controller name="paymentProofType" control={form.control} render={({field}) => (
                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                    <Label htmlFor="type-image" className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="image" id="type-image"/>Upload Screenshot</Label>
                    <Label htmlFor="type-text" className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="text" id="type-text"/>Enter Transaction ID</Label>
                </RadioGroup>
            )} />

            {form.watch('paymentProofType') === 'image' ? (
                 <div className="space-y-2">
                    <Label htmlFor="paymentProofFile">Upload UPI Screenshot</Label>
                     <Input id="paymentProofFile" type="file" accept="image/*" {...form.register('paymentProofFile')} className="pt-2 h-11"/>
                 </div>
            ) : (
                <div className="space-y-2">
                    <Label htmlFor="paymentProofText">Transaction ID</Label>
                    <Input id="paymentProofText" {...form.register('paymentProofText')} placeholder="Enter UPI transaction ID" />
                </div>
            )}
             {form.formState.errors.paymentProofFile && <p className="text-sm text-destructive">{form.formState.errors.paymentProofFile.message}</p>}
            
            <div className="flex justify-between items-center">
              <Button type="button" variant="outline" onClick={prevStep}><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
              <Button type="submit" disabled={isPending || authLoading || !user} className="bg-accent text-accent-foreground hover:bg-accent/90">
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
            {state.message && !state.success && <p className="text-sm text-destructive mt-2">{state.message}</p>}
          </div>
        )}
      </form>
    </div>
  );
}
