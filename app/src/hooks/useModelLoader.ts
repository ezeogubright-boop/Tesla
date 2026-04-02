import { useEffect, useState, useRef } from 'react';
import { loadModel, preloadModels } from '../utils/modelLoader';

interface UseModelLoaderResult {
  gltf: any;
  isLoading: boolean;
  error: Error | null;
  progress: number;
}

/**
 * Hook for loading 3D models with caching, error handling, and progress tracking
 */
export function useModelLoader(modelPath: string): UseModelLoaderResult {
  const [gltf, setGltf] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [progress, setProgress] = useState(0);
  const loadedModelRef = useRef<string | null>(null);

  useEffect(() => {
    // Prevent re-loading the same model
    if (loadedModelRef.current === modelPath) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setProgress(0);

    let isMounted = true;

    loadModel(modelPath)
      .then((loadedGltf) => {
        if (isMounted) {
          setGltf(loadedGltf);
          setIsLoading(false);
          setProgress(100);
          loadedModelRef.current = modelPath;
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [modelPath]);

  return { gltf, isLoading, error, progress };
}

/**
 * Hook to preload models before they're needed
 */
export function usePreloadModels(modelPaths: string[]) {
  useEffect(() => {
    preloadModels(modelPaths);
  }, [modelPaths]);
}
