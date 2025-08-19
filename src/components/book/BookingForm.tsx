
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useActionState } from 'react';
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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { createAppointment } from '@/app/book/actions';

const timeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'];

export function BookingForm({ treatments }: { treatments: Treatment[] }) {
  const [step, setStep] = useState(1);
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  
  const defaultTreatmentId = useMemo(() => searchParams.get('treatment') || undefined, [searchParams]);
  
  const [paymentProofType, setPaymentProofType] = useState<'image'|'text'>('image');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentProofValue, setPaymentProofValue] = useState('');

  // State for form fields that are not part of the initial useFormState
  const [selectedTreatmentId, setSelectedTreatmentId] = useState<string | undefined>(defaultTreatmentId);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string | undefined>();
  const [name, setName] = useState('');
  
  const { toast } = useToast();

  const initialState = { message: null, errors: {}, success: false };
  const [state, dispatch] = useActionState(createAppointment, initialState);

  useEffect(() => {
    setName(user?.displayName || '');
  }, [user]);

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        setPaymentProofValue(loadEvent.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const submitForm = async (formData: FormData) => {
      setIsSubmitting(true);
      await dispatch(formData);
      setIsSubmitting(false);
  }
  
  useEffect(() => {
    if (state.message && !state.success) {
      toast({
        variant: "destructive",
        title: "Booking Failed",
        description: state.message,
      });
    }
  }, [state, toast]);


  if (state.success) {
    return <BookingSuccess />;
  }
  
  return (
    <div className="space-y-8">
      <Progress value={(step / 3) * 100} className="w-full h-2 bg-secondary" />
      <form action={submitForm} className="space-y-6">
        {user && <input type="hidden" name="userId" value={user.uid} />}
        <input type="hidden" name="paymentProof" value={paymentProofValue} />
        {selectedTreatmentId && <input type="hidden" name="treatmentId" value={selectedTreatmentId} />}
        {selectedDate && <input type="hidden" name="date" value={selectedDate.toISOString()} />}
        {selectedTime && <input type="hidden" name="time" value={selectedTime} />}

        {step === 1 && (
          <div className="space-y-4 animate-in fade-in-0 duration-500">
            <h3 className="text-xl font-headline">Step 1: Choose Your Service</h3>
            <RadioGroup 
                name="treatmentId"
                onValueChange={setSelectedTreatmentId} 
                defaultValue={selectedTreatmentId} 
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {treatments.map((treatment) => (
                <Label key={treatment.id} htmlFor={treatment.id} className="flex flex-col items-start justify-between rounded-lg border-2 border-muted bg-background p-4 hover:bg-accent/10 hover:border-accent peer-data-[state=checked]:border-accent peer-data-[state=checked]:bg-accent/5 [&:has([data-state=checked])]:border-accent cursor-pointer transition-colors">
                  <RadioGroupItem value={treatment.id} id={treatment.id} className="sr-only" />
                  <span className="font-semibold font-headline text-lg text-primary">{treatment.name}</span>
                  <span className="text-sm text-muted-foreground mt-2">{treatment.description}</span>
                  <span className="font-bold text-primary/80 mt-4">₹{treatment.price} - {treatment.duration} mins</span>
                </Label>
              ))}
            </RadioGroup>
            {state.errors?.treatmentId && <p className="text-sm text-destructive">{state.errors.treatmentId[0]}</p>}
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
                <Calendar 
                    mode="single" 
                    selected={selectedDate} 
                    onSelect={setSelectedDate} 
                    disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))} 
                    className="rounded-lg border p-0 sm:p-3" 
                />
                 <div className="space-y-4">
                    <Label>Select a time slot</Label>
                     <Select name="time" onValueChange={setSelectedTime} defaultValue={selectedTime}>
                        <SelectTrigger><SelectValue placeholder="Select a time slot" /></SelectTrigger>
                        <SelectContent>
                            {timeSlots.map(slot => <SelectItem key={slot} value={slot}>{slot}</SelectItem>)}
                        </SelectContent>
                     </Select>
                    {state.errors?.date && <p className="text-sm text-destructive">{state.errors.date[0]}</p>}
                    {state.errors?.time && <p className="text-sm text-destructive">{state.errors.time[0]}</p>}
                </div>
            </div>
            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={prevStep}><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
              <Button type="button" onClick={nextStep} disabled={!selectedDate || !selectedTime} className="bg-accent text-accent-foreground hover:bg-accent/90">
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
              <Input id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Jane Doe" />
              {state.errors?.name && <p className="text-sm text-destructive">{state.errors.name[0]}</p>}
            </div>
            
             <RadioGroup onValueChange={(v) => setPaymentProofType(v as 'image'|'text')} defaultValue={paymentProofType} className="flex gap-4">
                <Label htmlFor="type-image" className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="image" id="type-image"/>Upload Screenshot</Label>
                <Label htmlFor="type-text" className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="text" id="type-text"/>Enter Transaction ID</Label>
            </RadioGroup>

            {paymentProofType === 'image' ? (
                 <div className="space-y-2">
                    <Label htmlFor="paymentProofFile">Upload UPI Screenshot</Label>
                     <Input id="paymentProofFile" name="paymentProofFile" type="file" accept="image/*" className="pt-2 h-11" onChange={handleFileChange} />
                 </div>
            ) : (
                <div className="space-y-2">
                    <Label htmlFor="paymentProofText">Transaction ID</Label>
                    <Input id="paymentProofText" name="paymentProofText" placeholder="Enter UPI transaction ID" value={paymentProofValue} onChange={(e) => setPaymentProofValue(e.target.value)} />
                </div>
            )}
             {state.errors?.paymentProof && <p className="text-sm text-destructive">{state.errors.paymentProof[0]}</p>}
            
            <div className="flex justify-between items-center">
              <Button type="button" variant="outline" onClick={prevStep}><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
              <Button type="submit" disabled={isSubmitting || authLoading || !user || !paymentProofValue} className="bg-accent text-accent-foreground hover:bg-accent/90">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Request Appointment
              </Button>
            </div>
             {(!user && !authLoading) && (
                <Alert variant="destructive" className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Login Required</AlertTitle>
                    <AlertDescription>
                        You must be <Link href="/login" className="font-bold underline">logged in</Link> to book an appointment.
                    </AlertDescription>
                </Alert>
            )}
            {state.errors?.userId && (
                 <Alert variant="destructive" className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{state.errors.userId[0]}</AlertDescription>
                </Alert>
            )}
          </div>
        )}
      </form>
    </div>
  );
}
