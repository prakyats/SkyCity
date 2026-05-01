'use client';
import { useState, useEffect, useCallback } from 'react';
import { Preloader } from '@/components/ui/Preloader';

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  const handleComplete = useCallback(() => {
    setIsLoading(false);
  }, []);

  // Prevent scroll when loading
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isLoading]);

  return (
    <>
      {isLoading && <Preloader onComplete={handleComplete} />}
      <div className={isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-1000'}>
        {children}
      </div>
    </>
  );
}
