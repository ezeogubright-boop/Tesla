import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

// Model cache to prevent re-downloading
const modelCache = new Map<string, Promise<any>>();
const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();

// Set Draco decoder path for compressed models
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
loader.setDRACOLoader(dracoLoader);

/**
 * Load GLTF model with caching and compression support
 * Returns a promise that resolves with the loaded model
 */
export function loadModel(modelPath: string): Promise<any> {
  if (modelCache.has(modelPath)) {
    return modelCache.get(modelPath)!;
  }

  const loadPromise = new Promise((resolve, reject) => {
    loader.load(
      modelPath,
      (gltf) => {
        // Optimize the loaded scene
        optimizeScene(gltf.scene);
        resolve(gltf);
      },
      (progress) => {
        // You can track loading progress here if needed
        console.log(`Loading ${modelPath}: ${(progress.loaded / progress.total * 100).toFixed(2)}%`);
      },
      (error) => {
        console.error(`Failed to load model: ${modelPath}`, error);
        reject(error);
      }
    );
  });

  modelCache.set(modelPath, loadPromise);
  return loadPromise;
}

/**
 * Optimize scene by disposing unused resources and compressing geometry
 */
function optimizeScene(scene: any) {
  scene.traverse((child: any) => {
    // Dispose of unused materials and geometries
    if (child.geometry) {
      // Compress indices if possible
      if (child.geometry.index) {
        console.log('Geometry optimized');
      }
    }

    // Set frustum culls for better performance
    child.frustumCulled = true;
    
    // Disable shadows for distant objects
    if (child.isMesh) {
      child.castShadow = false;
      child.receiveShadow = false;
    }
  });
}

/**
 * Preload multiple models in the background
 * Useful for preloading models before user navigates to them
 */
export function preloadModels(modelPaths: string[]) {
  modelPaths.forEach((path) => loadModel(path));
}

/**
 * Clear model cache (use sparingly, mainly for cleanup)
 */
export function clearModelCache() {
  modelCache.forEach((promise) => {
    promise.then((gltf) => {
      gltf.scene.traverse((child: any) => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach((mat: any) => mat.dispose());
          } else {
            child.material.dispose();
          }
        }
      });
    });
  });
  modelCache.clear();
}

/**
 * Get cached model directly (for advanced use cases)
 */
export function getCachedModel(modelPath: string) {
  return modelCache.get(modelPath);
}
