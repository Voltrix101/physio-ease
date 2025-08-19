'use client';

import dynamic from 'next/dynamic';

// Client-side dynamic import for chatbot
const Chatbot = dynamic(() => import('./chatbot/Chatbot').then(mod => ({ default: mod.Chatbot })), {
  ssr: false,
  loading: () => null, // No loading spinner to avoid layout shift
});

export { Chatbot };
