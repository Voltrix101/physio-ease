import type { Treatment, Appointment } from './types';

export const mockTreatments: Treatment[] = [
  {
    id: '1',
    name: 'Deep Tissue Massage',
    description: 'An intensive massage that focuses on deeper layers of muscle tissue to release chronic tension.',
    price: 80,
    duration: 60,
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'massage therapy'
  },
  {
    id: '2',
    name: 'Sports Injury Rehab',
    description: 'Specialized program to help athletes recover from injuries and improve performance.',
    price: 120,
    duration: 90,
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'sports injury'
  },
  {
    id: '3',
    name: 'Post-operative Care',
    description: 'Gentle, guided exercises and therapies to restore mobility and function after surgery.',
    price: 100,
    duration: 60,
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'physical therapy'
  },
  {
    id: '4',
    name: 'Acupuncture Session',
    description: 'Traditional technique using fine needles to relieve pain and promote natural healing.',
    price: 70,
    duration: 45,
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'acupuncture needles'
  },
   {
    id: '5',
    name: 'Joint Mobilization',
    description: 'Skilled manual therapy techniques to improve joint movement and reduce stiffness.',
    price: 90,
    duration: 60,
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'joint pain'
  },
];

export const mockAppointments: Appointment[] = [
  {
    id: 'APT001',
    patientName: 'Alice Johnson',
    treatmentName: 'Deep Tissue Massage',
    date: new Date('2024-08-15T10:00:00'),
    status: 'pending',
    paymentReference: 'TXN123456',
    createdAt: new Date('2024-08-01T14:20:00'),
    paymentVerification: {
      paymentConfirmationSuggested: true,
      reason: 'Transaction ID format appears valid and matches typical payment processor formats.'
    }
  },
  {
    id: 'APT002',
    patientName: 'Bob Williams',
    treatmentName: 'Sports Injury Rehab',
    date: new Date('2024-08-15T11:30:00'),
    status: 'pending',
    paymentReference: 'Screenshot_Payment.jpg',
    createdAt: new Date('2024-08-02T09:05:00'),
    paymentVerification: {
      paymentConfirmationSuggested: false,
      reason: 'The uploaded image is blurry and does not clearly show a transaction amount or recipient details.'
    }
  },
  {
    id: 'APT003',
    patientName: 'Charlie Brown',
    treatmentName: 'Post-operative Care',
    date: new Date('2024-08-16T14:00:00'),
    status: 'confirmed',
    paymentReference: 'TXN789012',
    createdAt: new Date('2024-08-03T18:00:00'),
  },
  {
    id: 'APT004',
    patientName: 'Diana Prince',
    treatmentName: 'Acupuncture Session',
    date: new Date('2024-08-17T09:00:00'),
    status: 'completed',
    paymentReference: 'TXN345678',
    createdAt: new Date('2024-08-04T11:45:00'),
  },
  {
    id: 'APT005',
    patientName: 'Ethan Hunt',
    treatmentName: 'Joint Mobilization',
    date: new Date('2024-08-18T16:00:00'),
    status: 'rejected',
    paymentReference: 'Invalid ID',
    createdAt: new Date('2024-08-05T13:10:00'),
  },
];
