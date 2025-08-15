'use client';

import { useState, useEffect } from 'react';
import type { User } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const adminDocRef = doc(db, 'admins', user.uid);
        try {
          const adminDocSnap = await getDoc(adminDocRef);
          // If document doesn't exist, user is not an admin
          setIsAdmin(adminDocSnap.exists() && adminDocSnap.data()?.isAdmin === true);
        } catch (error) {
          console.error("Error checking admin status:", error);
          // If there's an error (like permission denied), assume not admin
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, loading, isAdmin };
}
