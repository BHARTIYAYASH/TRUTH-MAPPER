"use client";

import { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

export function CursorGlow() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hasMounted, setHasMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  const isMobile = useIsMobile();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    if (hasMounted && !isMobile) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (hasMounted && !isMobile) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [isMobile, hasMounted]);

  if (!hasMounted || isMobile) {
    return null;
  }
  
  const isRealDark = resolvedTheme === 'real-dark';

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-0 z-50 transition-opacity duration-300",
        isRealDark ? 'opacity-100' : 'opacity-0'
      )}
      style={{
        background: `radial-gradient(circle 280px at ${position.x}px ${position.y}px, transparent 0%, transparent 40%, rgba(0,0,0,0.95) 100%)`,
      }}
    />
  );
}
