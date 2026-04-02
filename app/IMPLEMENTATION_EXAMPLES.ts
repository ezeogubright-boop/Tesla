/**
 * IMPLEMENTATION EXAMPLES
 * Copy-paste ready examples for integrating optimizations into your project
 */

// ================================================================
// EXAMPLE 1: Using Optimized CarViewer3D with LazyLoading
// ================================================================

import { CarViewer3D } from './components/CarViewer3DOptimized';
import { LazyComponentLoader, ModelLoaderSkeleton } from './components/LazyComponentLoader';

export function ExampleCarShowcase() {
  return (
    <section className="py-20 bg-black">
      <h2 className="text-4xl font-bold text-center mb-12 font-orbitron">Model S</h2>
      
      {/* Lazy load 3D viewer - only load when scrolled into view */}
      <LazyComponentLoader 
        threshold={0.1}           // Start loading when 10% visible
        rootMargin="50px"         // Start loading 50px before entering viewport
        fallback={<ModelLoaderSkeleton />}
      >
        <div className="w-full h-96">
          <CarViewer3D 
            modelPath="/models/tesla_model_s.glb"
            rotationY={-0.35}
            modelScale={4}
          />
        </div>
      </LazyComponentLoader>
    </section>
  );
}

// ================================================================
// EXAMPLE 2: Preload Models on Page Navigation
// ================================================================

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { preloadModels } from './utils/modelLoader';

export function Navigation() {
  const navigate = useNavigate();

  const handleShowroomClick = () => {
    // Preload all showroom models before navigating
    preloadModels([
      '/models/tesla_model_3.glb',
      '/models/tesla_model_s.glb',
      '/models/tesla_cybertruck.glb',
      '/models/tesla_roadster.glb',
    ]);
    
    navigate('/showroom');
  };

  return (
    <nav>
      <button onClick={handleShowroomClick}>
        View Showroom
      </button>
    </nav>
  );
}

// ================================================================
// EXAMPLE 3: Performance Monitoring During Load
// ================================================================

import { useEffect } from 'react';
import { PerformanceMonitor } from './utils/performanceMonitor';

export function HomePage() {
  useEffect(() => {
    PerformanceMonitor.startMeasure('HomePage Load');

    return () => {
      PerformanceMonitor.endMeasure('HomePage Load');
      PerformanceMonitor.printReport(); // Log all metrics
    };
  }, []);

  return (
    <div>
      {/* Page content */}
    </div>
  );
}

// ================================================================
// EXAMPLE 4: Optimized Showroom Page (Step-by-step)
// ================================================================

import { useState, useEffect } from 'react';
import { CybertruckViewer } from './components/CybertruckViewerOptimized';
import { LazyComponentLoader } from './components/LazyComponentLoader';
import { PerformanceMonitor } from './utils/performanceMonitor';

export function ShowroomPage() {
  const [page, setPage] = useState<'cybertruck' | 'model3' | 'modelS'>('cybertruck');

  useEffect(() => {
    PerformanceMonitor.startMeasure('Showroom Page');
    return () => {
      const duration = PerformanceMonitor.endMeasure('Showroom Page');
      console.log(`Showroom loaded in ${duration.toFixed(2)}ms`);
    };
  }, [page]);

  return (
    <div className="min-h-screen bg-black">
      {/* Navigation tabs */}
      <div className="flex gap-4 justify-center p-8 bg-gray-900">
        {['cybertruck', 'model3', 'modelS'].map((tab) => (
          <button
            key={tab}
            onClick={() => setPage(tab as any)}
            className={`px-6 py-2 rounded ${
              page === tab
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {tab === 'cybertruck' ? 'Cybertruck' : tab === 'model3' ? 'Model 3' : 'Model S'}
          </button>
        ))}
      </div>

      {/* Lazy-loaded 3D viewers for each model */}
      {page === 'cybertruck' && (
        <LazyComponentLoader>
          <div className="w-full h-[600px]">
            <CybertruckViewer />
          </div>
        </LazyComponentLoader>
      )}

      {page === 'model3' && (
        <LazyComponentLoader>
          <div className="w-full h-[600px]">
            <CarViewer3D modelPath="/models/tesla_model_3.glb" />
          </div>
        </LazyComponentLoader>
      )}

      {page === 'modelS' && (
        <LazyComponentLoader>
          <div className="w-full h-[600px]">
            <CarViewer3D modelPath="/models/tesla_model_s.glb" />
          </div>
        </LazyComponentLoader>
      )}
    </div>
  );
}

// ================================================================
// EXAMPLE 5: HOC - Wrapping Component with Lazy Loading
// ================================================================

import { withLazyLoad } from './components/LazyComponentLoader';
import { CarViewer3D } from './components/CarViewer3DOptimized';

interface ModelViewerProps {
  modelPath: string;
  title: string;
}

const ModelViewer = ({ modelPath, title }: ModelViewerProps) => (
  <section className="py-20">
    <h2 className="text-3xl mb-8 font-orbitron">{title}</h2>
    <div className="h-[500px]">
      <CarViewer3D modelPath={modelPath} />
    </div>
  </section>
);

// Wrap with lazy loading - automatically loads when scrolled into view
export const LazyModelViewer = withLazyLoad(ModelViewer);

// Usage in parent component:
// <LazyModelViewer modelPath="/models/tesla_model_3.glb" title="Model 3" />

// ================================================================
// EXAMPLE 6: Dynamic Model Loading with Error Handling
// ================================================================

import { useState, useEffect } from 'react';
import { useModelLoader } from './hooks/useModelLoader';
import { ModelLoadError } from './components/LoadingStates';

interface DynamicModelViewerProps {
  modelPath: string;
}

export function DynamicModelViewer({ modelPath }: DynamicModelViewerProps) {
  const { gltf, isLoading, error, progress } = useModelLoader(modelPath);
  const [retryCount, setRetryCount] = useState(0);

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
    // Reset the hook by changing the key or manually reloading
  };

  if (error) {
    return (
      <ModelLoadError 
        error={error} 
        onRetry={handleRetry}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="w-full h-96 bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-blue-400 mb-2 font-orbitron">Loading...</div>
          <div className="w-48 h-1 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-96">
      <CybertruckViewer modelUrl={modelPath} />
    </div>
  );
}

// ================================================================
// EXAMPLE 7: Multi-step Performance Optimization Checklist
// ================================================================

/*
STEP-BY-STEP INTEGRATION CHECKLIST:

1. UPDATE VITE CONFIG ✓
   - Already updated in vite.config.ts
   - Adds code-splitting and minification
   - Run: npm run build

2. INSTALL NEW FILES
   - ModelLoader hook: src/hooks/useModelLoader.ts ✓
   - Model utilities: src/utils/modelLoader.ts ✓
   - Loading states: src/components/LoadingStates.tsx ✓
   - Lazy loader: src/components/LazyComponentLoader.tsx ✓
   - Performance monitor: src/utils/performanceMonitor.ts ✓
   - Optimized 3D viewers: src/components/*Optimized.tsx ✓

3. COMPRESS YOUR MODELS
   Command: gltfpack -i model.glb -o model-compressed.glb
   Replace old models with compressed versions

4. UPDATE YOUR PAGES
   Replace imports:
   - OLD: import { CarViewer3D } from './components/CarViewer3D';
   - NEW: import { CarViewer3D } from './components/CarViewer3DOptimized';

5. WRAP WITH LAZY LOADER
   const HeroSection = () => (
     <LazyComponentLoader>
       <CarViewer3D modelPath="..." />
     </LazyComponentLoader>
   )

6. PRELOAD CRITICAL MODELS
   In Navigation component or App.tsx:
   preloadModels(['/models/cybertruck.glb', ...])

7. MONITOR & TEST
   - Chrome DevTools > Performance tab
   - Lighthouse audit (target: >85)
   - Check Network tab for model sizes
   - Monitor Core Web Vitals
   - Use PerformanceMonitor.printReport()

8. DEPLOY & VERIFY
   - Deploy to production
   - Monitor with real user metrics (RUM)
   - Check with WebPageTest.org
   - Adjust lazy-loading thresholds as needed
*/

// ================================================================
// EXAMPLE 8: Advanced - Custom Single Model Cache Control
// ================================================================

import { getCachedModel, clearModelCache } from './utils/modelLoader';

export function ModelConsole() {
  const handleClearCache = () => {
    clearModelCache();
    console.log('Model cache cleared - next load will re-download');
  };

  const handlePreloadAll = () => {
    preloadModels([
      '/models/tesla_model_3.glb',
      '/models/tesla_model_s.glb',
      '/models/tesla_cybertruck.glb',
    ]);
    console.log('All models preloaded in background');
  };

  return (
    <div className="p-4 bg-gray-900 rounded">
      <button onClick={handlePreloadAll} className="btn mr-2">
        Preload All Models
      </button>
      <button onClick={handleClearCache} className="btn">
        Clear Cache
      </button>
    </div>
  );
}

export default {
  ExampleCarShowcase,
  ShowroomPage,
  LazyModelViewer,
  DynamicModelViewer,
  ModelConsole,
};
