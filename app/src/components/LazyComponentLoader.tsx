import React, { Suspense, useEffect, useRef, useState } from 'react';
import { ModelLoaderSkeleton } from './LoadingStates';

interface LazyLoaderProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  threshold?: number;
  rootMargin?: string;
  preload?: boolean;
}

/**
 * Lazy load heavy components (like 3D viewers) when they enter the viewport
 * Uses Intersection Observer API for efficient lazy loading
 */
export function LazyComponentLoader({
  children,
  fallback = <ModelLoaderSkeleton />,
  threshold = 0.1,
  rootMargin = '50px',
  preload = false,
}: LazyLoaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasBeenInView, setHasBeenInView] = useState(preload);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create intersection observer for lazy loading
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setHasBeenInView(true);
            // Stop observing once component is loaded
            if (observerRef.current) {
              observerRef.current.unobserve(container);
            }
          }
        });
      },
      {
        threshold: threshold,
        rootMargin: rootMargin,
      }
    );

    observerRef.current.observe(container);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [threshold, rootMargin]);

  return (
    <div ref={containerRef} className="w-full">
      {hasBeenInView ? (
        <Suspense fallback={fallback}>{children}</Suspense>
      ) : (
        fallback
      )}
    </div>
  );
}

/**
 * HOC to wrap any component with lazy loading
 */
export function withLazyLoad<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ReactNode
) {
  return function LazyLoadedComponent(props: P) {
    return (
      <LazyComponentLoader fallback={fallback}>
        <Component {...props} />
      </LazyComponentLoader>
    );
  };
}
