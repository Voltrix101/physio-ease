'use client';

import { useState } from 'react';
import { useFormState } from 'react-dom';
import { useSearchParams } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

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
import { ArrowLeft, ArrowRight, Loader2, UploadCloud } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  treatmentId: z.string(),
  date: z.date(),
  time: z.string(),
  paymentProofType: z.enum(['text', 'image']),
  paymentProofText: z.string().optional(),
  paymentProofFile: z.any().optional(),
}).refine(data => {
    if (data.paymentProofType === 'text') return !!data.paymentProofText;
    if (data.paymentProofType === 'image') return !!data.paymentProofFile;
    return false;
}, { message: 'Payment proof is required', path: ['paymentProofFile']});


const timeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'];

export function BookingForm({ treatments }: { treatments: Treatment[] }) {
  const [step, setStep] = useState(1);
  const [pending, setPending] = useState(false);
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const defaultTreatmentId = searchParams.get('treatment') || undefined;

  const initialState: State = { message: null, errors: {}, success: false };
  const [state, dispatch] = useFormState(createAppointment, initialState);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      treatmentId: defaultTreatmentId,
      paymentProofType: 'image',
    },
  });

  const selectedTreatmentId = form.watch('treatmentId');
  const selectedTreatment = treatments.find(t => t.id === selectedTreatmentId);

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
    setPending(true);
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('treatmentId', data.treatmentId);
    formData.append('date', data.date.toISOString());
    formData.append('time', data.time);
    
    let proof = '';
    if (data.paymentProofType === 'text' && data.paymentProofText) {
      proof = data.paymentProofText;
    } else if (data.paymentProofType === 'image' && data.paymentProofFile) {
      try {
        proof = await readFileAsDataURL(data.paymentProofFile);
      } catch (error) {
        toast({
            variant: "destructive",
            title: "File Error",
            description: "Could not read the uploaded file. Please try again.",
        });
        setPending(false);
        return;
      }
    }
    formData.append('paymentProof', proof);

    dispatch(formData);
    setPending(false);
  };

  if (state.success) {
    return <BookingSuccess />;
  }
  
  return (
    <div className="space-y-8">
      <Progress value={(step / 3) * 100} className="w-full" />
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in-0 duration-500">
            <h3 className="text-lg font-medium">Step 1: Choose Your Treatment</h3>
            <Controller
              control={form.control}
              name="treatmentId"
              render={({ field }) => (
                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {treatments.map((treatment) => (
                    <Label key={treatment.id} htmlFor={treatment.id} className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer">
                      <RadioGroupItem value={treatment.id} id={treatment.id} className="sr-only" />
                      <span className="font-semibold">{treatment.name}</span>
                      <span className="text-sm text-muted-foreground">${treatment.price} - {treatment.duration} mins</span>
                    </Label>
                  ))}
                </RadioGroup>
              )}
            />
            <div className="flex justify-end">
              <Button onClick={nextStep} disabled={!selectedTreatmentId}>
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-in fade-in-0 duration-500">
            <h3 className="text-lg font-medium">Step 2: Select Date & Time</h3>
            <div className="grid md:grid-cols-2 gap-8">
                <Controller name="date" control={form.control} render={({ field }) => (
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))} className="rounded-md border p-0" />
                )} />
                <Controller name="time" control={form.control} render={({ field }) => (
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger><SelectValue placeholder="Select a time slot" /></SelectTrigger>
                        <SelectContent>
                            {timeSlots.map(slot => <SelectItem key={slot} value={slot}>{slot}</SelectItem>)}
                        </SelectContent>
                     </Select>
                )} />
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={prevStep}><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
              <Button onClick={nextStep} disabled={!form.watch('date') || !form.watch('time')}>
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 animate-in fade-in-0 duration-500">
            <h3 className="text-lg font-medium">Step 3: Your Details & Payment Proof</h3>
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" {...form.register('name')} placeholder="e.g. Jane Doe" />
              {form.formState.errors.name && <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>}
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
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={prevStep}><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
              <Button type="submit" disabled={pending}>
                {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Request Appointment
              </Button>
            </div>
            {state.message && !state.success && <p className="text-sm text-red-500">{state.message}</p>}
          </div>
        )}
      </form>
    </div>
  );
}
