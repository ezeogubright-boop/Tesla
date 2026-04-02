/**
 * Performance monitoring utilities for tracking load times and optimizations
 */

export class PerformanceMonitor {
  private static metrics: Map<string, number> = new Map();
  private static marks: Map<string, number> = new Map();

  /**
   * Start measuring a performance metric
   */
  static startMeasure(label: string) {
    this.marks.set(label, performance.now());
    console.log(`⏱️  Starting measure: ${label}`);
  }

  /**
   * End measuring and log the duration
   */
  static endMeasure(label: string): number {
    const startTime = this.marks.get(label);
    if (!startTime) {
      console.warn(`No start mark found for: ${label}`);
      return 0;
    }

    const duration = performance.now() - startTime;
    this.metrics.set(label, duration);
    
    const status = duration < 1000 ? '✅' : duration < 3000 ? '⚠️' : '❌';
    console.log(`${status} Measure complete - ${label}: ${duration.toFixed(2)}ms`);
    
    this.marks.delete(label);
    return duration;
  }

  /**
   * Get all recorded metrics
   */
  static getMetrics() {
    return Object.fromEntries(this.metrics);
  }

  /**
   * Log Core Web Vitals
   */
  static logWebVitals() {
    if ('web-vital' in window) {
      console.log('Web Vitals:', window['web-vital']);
    }

    // Log resource timing
    const resources = performance.getEntriesByType('resource');
    const heavyResources = resources
      .filter((r: any) => r.duration > 500)
      .map((r: any) => ({
        name: r.name.split('/').pop(),
        duration: r.duration.toFixed(2),
        size: r.transferSize,
      }));

    if (heavyResources.length > 0) {
      console.table(heavyResources);
    }
  }

  /**
   * Get model load time from PerformanceAPI
   */
  static getModelLoadTime(modelName: string): number {
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    const modelResource = resources.find((r) => r.name.includes(modelName));
    return modelResource?.duration || 0;
  }

  /**
   * Clear all metrics
   */
  static clear() {
    this.metrics.clear();
    this.marks.clear();
  }

  /**
   * Print summary report
   */
  static printReport() {
    console.log('=== Performance Report ===');
    console.table(this.getMetrics());
    this.logWebVitals();
  }
}

/**
 * Hook to measure component render time
 */
import { useRef, useEffect, useMemo } from 'react';

export function useMeasureRender(componentName: string) {
  const startTimeRef = useRef(performance.now());

  useEffect(() => {
    const duration = performance.now() - startTimeRef.current;
    PerformanceMonitor.endMeasure(`${componentName} - Total Render`);
  }, [componentName]);

  useMemo(() => {
    PerformanceMonitor.startMeasure(`${componentName} - Compute`);
    return () => PerformanceMonitor.endMeasure(`${componentName} - Compute`);
  }, [componentName]);
}

// Monitor when page becomes interactive
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    const perfData = performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    console.log(`📊 Page Load Time: ${pageLoadTime}ms`);

    // Log Time to Interactive
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          console.log(`⏱️ ${entry.name}: ${(entry as any).duration.toFixed(2)}ms`);
        }
      });
      observer.observe({ entryTypes: ['measure', 'navigation'] });
    }
  });
}

declare global {
  interface Window {
    'web-vital': any;
  }
}
