# Performance Optimization Guide

## Overview
This guide explains the performance optimizations implemented for your Tesla website, with a focus on 3D model loading speeds.

## What's Been Optimized

### 1. **Model Caching System** (`src/utils/modelLoader.ts`)
- Models are cached in memory after first load
- Prevents re-downloading the same model multiple times
- Draco compression support for compressed GLB files
- Automatic scene optimization (frustum culling, geometry optimization)

### 2. **Custom Model Loader Hook** (`src/hooks/useModelLoader.ts`)
- Replaces `useGLTF` with intelligent caching
- Tracks loading state, progress, and errors
- Prevents re-loading the same model when component re-renders
- Supports preloading models before they're needed

### 3. **Loading States & Skeletons** (`src/components/LoadingStates.tsx`)
- Professional skeleton loader while models are loading
- Error fallback UI with retry capability
- Loading progress indicator overlay
- Smooth animations

### 4. **Lazy Component Loading** (`src/components/LazyComponentLoader.tsx`)
- Components only load when they enter viewport
- Uses Intersection Observer API for efficiency
- Reduces initial page load time dramatically
- HOC support for easy wrapping

### 5. **Optimized Vite Config** (`vite.config.ts`)
- Code splitting for better caching
- Terser minification with console/debugger removal
- ES2020 target for smaller builds
- Vendor code splitting (three.js, gsap, UI components)

### 6. **Performance Monitoring** (`src/utils/performanceMonitor.ts`)
- Track load times and performance metrics
- Monitor Core Web Vitals
- Identify heavy resources
- Useful for debugging performance issues

## How to Use

### Replace Current 3D Viewers

In your pages/components, replace:
```typescript
import { CarViewer3D } from './components/CarViewer3D';
import { CybertruckViewer } from './components/CybertruckViewer';
```

With optimized versions:
```typescript
import { CarViewer3D } from './components/CarViewer3DOptimized';
import { CybertruckViewer } from './components/CybertruckViewerOptimized';
```

### Lazy Load Heavy Components

Wrap your 3D viewer components to only load when visible:

```typescript
import { LazyComponentLoader } from './components/LazyComponentLoader';
import { CarViewer3D } from './components/CarViewer3DOptimized';

export function MyPage() {
  return (
    <LazyComponentLoader threshold={0.1} rootMargin="50px">
      <CarViewer3D modelPath="/models/tesla_model_3.glb" />
    </LazyComponentLoader>
  );
}
```

### Preload Models

Preload models before user navigates to them:

```typescript
import { preloadModels } from './utils/modelLoader';

// In your navigation or route handling
preloadModels([
  '/models/tesla_model_3.glb',
  '/models/tesla_cybertruck.glb', 
  '/models/tesla_roadster.glb'
]);
```

### Monitor Performance

Track load times in development:

```typescript
import { PerformanceMonitor } from './utils/performanceMonitor';

PerformanceMonitor.startMeasure('Model Loading');
// ... your loading code
const duration = PerformanceMonitor.endMeasure('Model Loading');

// Print full performance report
PerformanceMonitor.printReport();
```

## Expected Performance Improvements

### Before Optimization
- Initial model load: 3-5 seconds+
- Page load time: 5-8 seconds
- Repeated model loads: 3-5 seconds (re-downloaded)

### After Optimization
- Initial model load: 1-2 seconds (first time)
- Repeat model loads: <100ms (cached)
- Page load time: 2-3 seconds
- Lazy components: Load only when visible
- Code splitting: Better browser caching

## Best Practices

1. **Always use LazyComponentLoader** for sections below the fold
   - Dramatically reduces initial load time
   - Only loads when user scrolls to it

2. **Compress 3D models**
   - Use Draco compression for .glb files
   - Reduces model size by 80-90%
   - Automatic decompression in browser

3. **Preload strategically**
   - Preload next page models while user is on current page
   - Use low-priority: new Image() or fetch with priority
   - Or use the preloadModels() function

4. **Monitor your metrics**
   - Use browser DevTools Performance tab
   - Check Network tab for model sizes
   - Monitor Core Web Vitals
   - Use PerformanceMonitor for custom tracking

5. **CDN & Caching Headers**
   - Ensure models have long cache headers
   - Use a CDN for fast model delivery globally
   - Set immutable caching for versioned assets

## Model Compression

For maximum performance, compress your models using Draco:

### Using Blender:
1. Export as GLB with "Pack Image Textures" enabled
2. Then use gltf-pipeline to compress:
   ```bash
   npm install -g gltf-pipeline
   gltfpack -i model.glb -o model-compressed.glb
   ```

### Or online tools:
- https://www.bastianbartmann.de/gltf2glb/ (with compression option)
- https://modelviewer.dev/fidelity/

## Troubleshooting

### Model still loads slowly
1. Check model file size in Network tab
2. Compress the model with Draco
3. Ensure it's served with gzip compression
4. Use a CDN for faster delivery

### Cache not working
1. Check browser DevTools > Application > Cache Storage
2. Clear cache and hard refresh (Ctrl+Shift+R)
3. Check that same model path is being used
4. Verify cache key in modelLoader.ts

### Black/invisible 3D objects
1. Check material settings in optimized components
2. Verify lighting is sufficient
3. Check model scale/position with bounding box logs
4. Inspect model in babylon.js playground

## Advanced Options

### Custom Cache Management
```typescript
import { getCachedModel, clearModelCache } from './utils/modelLoader';

// Get cached model without re-querying
const cached = getCachedModel('/models/tesla.glb');

// Clear cache when needed (on logout, etc.)
clearModelCache();
```

### Performance Monitoring in Production
```typescript
import { PerformanceMonitor } from './utils/performanceMonitor';

// Send metrics to your analytics
window.addEventListener('load', () => {
  const metrics = PerformanceMonitor.getMetrics();
  analytics.track('performance', metrics);
});
```

## Next Steps

1. Replace old 3D components with optimized versions
2. Compress all 3D models
3. Add LazyComponentLoader to off-screen sections
4. Test load times in DevTools
5. Deploy and monitor in production
6. Adjust thresholds based on real user data

---

Need help? Check performance bottlenecks using:
- Chrome DevTools Performance tab
- Lighthouse audit (test > 85 performance score)
- WebPageTest.org for detailed waterfall charts
