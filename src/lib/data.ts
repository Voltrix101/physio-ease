import type { Treatment, Appointment, Product, Video } from './types';

export const mockServices: Treatment[] = [
  {
    id: '1',
    name: 'Dry Needling (CDNT)',
    description: 'A skilled intervention that uses a thin filiform needle to penetrate the skin and stimulate underlying myofascial trigger points.',
    price: 1500,
    duration: 45,
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'dry needling therapy'
  },
  {
    id: '2',
    name: 'Kinesiology Taping (CKTP)',
    description: 'Application of a special elastic tape to support muscles, reduce pain and swelling, and improve performance.',
    price: 800,
    duration: 30,
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'kinesiology tape'
  },
  {
    id: '3',
    name: 'Dry Cupping (CCTS)',
    description: 'An ancient form of alternative medicine in which a therapist puts special cups on your skin for a few minutes to create suction.',
    price: 1200,
    duration: 40,
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'cupping therapy'
  },
  {
    id: '4',
    name: 'General Physiotherapy',
    description: 'Comprehensive assessment and treatment for a wide range of musculoskeletal issues.',
    price: 1000,
    duration: 60,
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'physiotherapy exercise'
  },
];

export const mockProducts: Product[] = [
    {
        id: 'prod-1',
        name: 'Foam Roller',
        price: '1200',
        imageUrl: 'https://placehold.co/300x300.png',
        affiliateUrl: '#',
        dataAiHint: 'foam roller',
    },
    {
        id: 'prod-2',
        name: 'Resistance Bands Set',
        price: '999',
        imageUrl: 'https://placehold.co/300x300.png',
        affiliateUrl: '#',
        dataAiHint: 'resistance bands',
    },
    {
        id: 'prod-3',
        name: 'Kinesiology Tape Roll',
        price: '650',
        imageUrl: 'https://placehold.co/300x300.png',
        affiliateUrl: '#',
        dataAiHint: 'kinesiology tape',
    },
    {
        id: 'prod-4',
        name: 'Cold Therapy Pack',
        price: '500',
        imageUrl: 'https://placehold.co/300x300.png',
        affiliateUrl: '#',
        dataAiHint: 'ice pack',
    }
];

export const mockVideos: Video[] = [
    {
        id: 'vid-1',
        title: '5 Stretches for Lower Back Pain',
        description: 'Follow along with these simple yet effective stretches to alleviate lower back pain.',
        youtubeId: 'z915K14nL8s', // Example video ID
    },
    {
        id: 'vid-2',
        title: 'Strengthening Exercises for Knee Injuries',
        description: 'Learn how to safely strengthen the muscles around your knee to aid recovery.',
        youtubeId: 'N4s4O2G3dY4', // Example video ID
    },
    {
        id: 'vid-3',
        title: 'Proper Foam Rolling Technique',
        description: 'Dr. Amiya demonstrates the correct way to use a foam roller for muscle recovery.',
        youtubeId: 'roll-video-id', // Placeholder
    }
]

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
];
