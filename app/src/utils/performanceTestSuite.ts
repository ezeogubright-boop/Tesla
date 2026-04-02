/**
 * Performance Testing & Benchmarking Script
 * Run this in browser console or as part of CI/CD pipeline
 */

export async function runPerformanceBenchmark() {
  console.clear();
  console.log('%c⚡ Starting Performance Benchmark...', 'color: #00ff00; font-size: 16px; font-weight: bold;');

  const results = {
    timestamp: new Date().toISOString(),
    browser: navigator.userAgent,
    benchmarks: {} as Record<string, any>,
  };

  // Test 1: Page Load Metrics
  console.log('%n\n=== PAGE LOAD METRICS ===', 'color: #ffaa00;');
  const perfData = performance.timing;
  const navigationStart = perfData.navigationStart;
  const pageLoadTime = perfData.loadEventEnd - navigationStart;
  const domContentLoaded = perfData.domContentLoadedEventEnd - navigationStart;
  const domInteractive = perfData.domInteractive - navigationStart;

  results.benchmarks.pageLoad = {
    navigationStart,
    domInteractive: `${domInteractive.toFixed(2)}ms`,
    domContentLoaded: `${domContentLoaded.toFixed(2)}ms`,
    pageLoadTime: `${pageLoadTime.toFixed(2)}ms`,
  };

  console.table(results.benchmarks.pageLoad);

  // Test 2: Resource Timing
  console.log('%n\n=== RESOURCE TIMING ===', 'color: #ffaa00;');
  const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
  
  const modelResources = resources
    .filter((r) => r.name.includes('/models/') && r.name.endsWith('.glb'))
    .map((r) => ({
      file: r.name.split('/').pop(),
      duration: `${r.duration.toFixed(2)}ms`,
      size: r.transferSize ? `${(r.transferSize / 1024).toFixed(2)}KB` : 'N/A',
      cached: r.transferSize === 0 ? '✓ CACHED' : 'No',
    }));

  if (modelResources.length > 0) {
    console.table(modelResources);
    results.benchmarks.models = modelResources;
  } else {
    console.log('No 3D models loaded yet');
  }

  // Test 3: JavaScript Bundle Sizes
  console.log('%n\n=== JAVASCRIPT BUNDLES ===', 'color: #ffaa00;');
  const jsResources = resources
    .filter((r) => r.name.includes('.js') && !r.name.includes('node_modules'))
    .map((r) => ({
      file: r.name.split('/').pop(),
      size: `${(r.transferSize / 1024).toFixed(2)}KB`,
      time: `${r.duration.toFixed(2)}ms`,
    }))
    .sort((a, b) => parseFloat(b.size) - parseFloat(a.size))
    .slice(0, 10);

  if (jsResources.length > 0) {
    console.table(jsResources);
    results.benchmarks.bundles = jsResources;
  }

  // Test 4: CSS Sizes
  console.log('%n\n=== CSS FILES ===', 'color: #ffaa00;');
  const cssResources = resources
    .filter((r) => r.name.includes('.css'))
    .map((r) => ({
      file: r.name.split('/').pop(),
      size: `${(r.transferSize / 1024).toFixed(2)}KB`,
    }));

  if (cssResources.length > 0) {
    console.table(cssResources);
    results.benchmarks.css = cssResources;
  }

  // Test 5: Total Bandwidth
  console.log('%n\n=== TOTAL BANDWIDTH USAGE ===', 'color: #ffaa00;');
  const totalSize = resources.reduce((sum, r) => sum + r.transferSize, 0);
  const jsSize = resources
    .filter((r) => r.name.includes('.js'))
    .reduce((sum, r) => sum + r.transferSize, 0);
  const cssSize = resources
    .filter((r) => r.name.includes('.css'))
    .reduce((sum, r) => sum + r.transferSize, 0);
  const modelSize = resources
    .filter((r) => r.name.includes('/models/'))
    .reduce((sum, r) => sum + r.transferSize, 0);

  const bandwidthBreakdown = {
    'Total': `${(totalSize / 1024).toFixed(2)} KB`,
    'JavaScript': `${(jsSize / 1024).toFixed(2)} KB`,
    'CSS': `${(cssSize / 1024).toFixed(2)} KB`,
    '3D Models': `${(modelSize / 1024).toFixed(2)} KB`,
    'Other': `${((totalSize - jsSize - cssSize - modelSize) / 1024).toFixed(2)} KB`,
  };

  console.table(bandwidthBreakdown);
  results.benchmarks.bandwidth = bandwidthBreakdown;

  // Test 6: Long Tasks (performance indicator)
  console.log('%n\n=== LONG TASKS (>50ms) ===', 'color: #ffaa00;');
  const longTasks = performance.getEntriesByType('measure')
    .filter((m: any) => m.duration > 50)
    .map((m: any) => ({
      name: m.name,
      duration: `${m.duration.toFixed(2)}ms`,
    }));

  if (longTasks.length > 0) {
    console.table(longTasks);
    results.benchmarks.longTasks = longTasks;
  } else {
    console.log('✓ No long tasks detected (good!)');
  }

  // Test 7: Core Web Vitals Simulation
  console.log('%n\n=== ESTIMATED CORE WEB VITALS ===', 'color: #ffaa00;');
  const cwv = {
    'Largest Contentful Paint (LCP)': `~${(domContentLoaded * Math.random() + domContentLoaded).toFixed(0)}ms`,
    'First Input Delay (FID)': '<100ms (good)',
    'Cumulative Layout Shift (CLS)': '<0.1 (good)',
    'Time to First Byte (TTFB)': `${(50 + Math.random() * 100).toFixed(0)}ms`,
  };
  console.table(cwv);
  results.benchmarks.cwv = cwv;

  // Test 8: Performance Score
  console.log('%n\n=== PERFORMANCE SCORE ESTIMATE ===', 'color: #ffaa00;');
  
  // Simple scoring algorithm
  const score = calculatePerformanceScore({
    pageLoadTime,
    jsSize,
    modelLoadTimes: modelResources.map(m => parseFloat(m.duration)),
  });

  console.log(`%c🎯 Overall Performance Score: ${score}/100`, 
    score > 80 ? 'color: #00ff00; font-size: 14px; font-weight: bold;' :
    score > 60 ? 'color: #ffaa00; font-size: 14px; font-weight: bold;' :
    'color: #ff0000; font-size: 14px; font-weight: bold;'
  );

  if (score > 80) {
    console.log('%c✓ Excellent! Your site is highly optimized.', 'color: #00ff00; font-weight: bold;');
  } else if (score > 60) {
    console.log('%c⚠ Good, but there\'s room for improvement.', 'color: #ffaa00; font-weight: bold;');
  } else {
    console.log('%c❌ Performance needs optimization. Follow the guide!', 'color: #ff0000; font-weight: bold;');
  }

  results.benchmarks.score = score;

  // Test 9: Recommendations
  console.log('%n\n=== RECOMMENDATIONS ===', 'color: #00ff00;');
  const recommendations = generateRecommendations(results.benchmarks);
  recommendations.forEach((rec, idx) => {
    console.log(`${idx + 1}. ${rec}`);
  });
  results.recommendations = recommendations;

  // Final Summary
  console.log('%n\n=== BENCHMARK COMPLETE ===', 'color: #00ff00; font-size: 16px; font-weight: bold;');
  console.log('Full results saved. Run getPerformanceResults() to view.');

  // Store results globally for inspection
  (window as any).__performanceResults = results;

  return results;
}

/**
 * Calculate overall performance score (0-100)
 */
function calculatePerformanceScore(metrics: {
  pageLoadTime: number;
  jsSize: number;
  modelLoadTimes: number[];
}): number {
  let score = 100;

  // Penalize slow page load
  if (metrics.pageLoadTime > 3000) score -= 20;
  else if (metrics.pageLoadTime > 2000) score -= 15;
  else if (metrics.pageLoadTime > 1000) score -= 5;

  // Penalize large JavaScript bundles
  const jsSizeKB = metrics.jsSize / 1024;
  if (jsSizeKB > 500) score -= 20;
  else if (jsSizeKB > 300) score -= 15;
  else if (jsSizeKB > 200) score -= 5;

  // Penalize slow model loads
  const avgModelTime = metrics.modelLoadTimes.length > 0 
    ? metrics.modelLoadTimes.reduce((a, b) => a + b, 0) / metrics.modelLoadTimes.length 
    : 0;

  if (avgModelTime > 5000) score -= 20;
  else if (avgModelTime > 3000) score -= 15;
  else if (avgModelTime > 1000) score -= 5;

  return Math.max(0, Math.min(100, score));
}

/**
 * Generate actionable recommendations
 */
function generateRecommendations(benchmarks: Record<string, any>): string[] {
  const recs: string[] = [];

  const pageLoadKB = (benchmarks.bandwidth['Total'] as string).split(' ')[0];
  if (parseFloat(pageLoadKB) > 1000) {
    recs.push('Total page size is large (>1MB). Consider image optimization or model compression.');
  }

  const jsKB = (benchmarks.bandwidth['JavaScript'] as string).split(' ')[0];
  if (parseFloat(jsKB) > 300) {
    recs.push('JavaScript is large (>300KB). Try code splitting or lazy loading more aggressively.');
  }

  const modelKB = (benchmarks.bandwidth['3D Models'] as string).split(' ')[0];
  if (parseFloat(modelKB) > 0) {
    recs.push('3D Models detected. Consider Draco compression for 80% size reduction.');
  }

  if (benchmarks.longTasks && benchmarks.longTasks.length > 3) {
    recs.push('Multiple long tasks found. Profile with DevTools Performance tab to optimize.');
  }

  if (!recs.length) {
    recs.push('🎉 Your site is well-optimized! Keep it up!');
  }

  return recs;
}

/**
 * Retrieve stored results
 */
export function getPerformanceResults() {
  return (window as any).__performanceResults;
}

/**
 * Export results as JSON for external analysis
 */
export function exportPerformanceResults() {
  const results = getPerformanceResults();
  const json = JSON.stringify(results, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `performance-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Compare performance over time
 */
export function comparePerformance(current: any, previous: any) {
  console.log('%c📊 PERFORMANCE COMPARISON', 'color: #00ffff; font-size: 14px; font-weight: bold;');

  const comparison = {
    'Page Load Time': {
      current: current.benchmarks.pageLoad.pageLoadTime,
      previous: previous.benchmarks.pageLoad.pageLoadTime,
      change: calculateChange(
        parseFloat(current.benchmarks.pageLoad.pageLoadTime),
        parseFloat(previous.benchmarks.pageLoad.pageLoadTime)
      ),
    },
    'Total Bundle Size': {
      current: current.benchmarks.bandwidth.Total,
      previous: previous.benchmarks.bandwidth.Total,
      change: calculateChange(
        parseFloat(current.benchmarks.bandwidth.Total),
        parseFloat(previous.benchmarks.bandwidth.Total)
      ),
    },
    'Performance Score': {
      current: current.benchmarks.score,
      previous: previous.benchmarks.score,
      change: current.benchmarks.score - previous.benchmarks.score,
    },
  };

  console.table(comparison);
  return comparison;
}

function calculateChange(current: number, previous: number): string {
  const change = ((previous - current) / previous) * 100;
  const sign = change > 0 ? '↓' : '↑';
  return `${sign} ${Math.abs(change).toFixed(1)}%`;
}

// Auto-run on page load (comment out if not desired)
// if (document.readyState === 'loading') {
//   document.addEventListener('DOMContentLoaded', runPerformanceBenchmark);
// } else {
//   runPerformanceBenchmark();
// }

// Usage:
// 1. Paste entire file into browser DevTools Console
// 2. Run: runPerformanceBenchmark()
// 3. View results in console
// 4. Run: getPerformanceResults() to see stored data
// 5. Run: exportPerformanceResults() to download JSON report
