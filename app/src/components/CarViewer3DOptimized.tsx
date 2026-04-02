import { Suspense, useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { useModelLoader } from '../hooks/useModelLoader';
import { ModelLoaderSkeleton, ModelLoadError } from './LoadingStates';

interface CarViewerProps {
  modelPath: string;
  rotationY?: number;
  modelScale?: number;
}

// Optimized model component using custom hook
function CarModel({ modelPath, rotationY = -0.35, modelScale = 4 }: CarViewerProps) {
  const rotationRef = useRef<THREE.Group>(null);
  const modelRef = useRef<THREE.Object3D>(null);
  const [isReady, setIsReady] = useState(false);
  
  // Use optimized model loader with caching
  const { gltf, isLoading, error } = useModelLoader(modelPath);

  // Center and position the model
  useEffect(() => {
    if (!gltf?.scene || isReady) return;

    const box = new THREE.Box3().setFromObject(gltf.scene);
    const center = box.getCenter(new THREE.Vector3());
    
    gltf.scene.position.sub(center);
    gltf.scene.scale.set(modelScale, modelScale, modelScale);
    
    // Optimize materials for performance
    gltf.scene.traverse((child: any) => {
      if (child.isMesh) {
        child.frustumCulled = true;
        if (child.material) {
          child.material.toneMapped = false;
        }
      }
    });
    
    setIsReady(true);
  }, [gltf?.scene, isReady, modelScale]);

  // Smooth rotation animation
  useFrame(() => {
    if (rotationRef.current && isReady) {
      rotationRef.current.rotation.y = rotationY;
    }
  });

  if (error) {
    return (
      <mesh>
        <boxGeometry args={[3, 3, 3]} />
        <meshStandardMaterial color="#cc0000" wireframe />
      </mesh>
    );
  }

  if (!gltf?.scene || !isReady) {
    return (
      <mesh>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="#333" wireframe />
      </mesh>
    );
  }

  return (
    <group ref={rotationRef} position={[0, 0, 0]}>
      <primitive ref={modelRef} object={gltf.scene} />
    </group>
  );
}

function CarViewerFallback() {
  return (
    <mesh>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="#333" wireframe />
    </mesh>
  );
}

/**
 * Optimized CarViewer3D with lazy loading, caching, and better performance
 */
export function CarViewer3D({ modelPath, rotationY = -0.35, modelScale = 4 }: CarViewerProps) {
  // Memoize canvas props to prevent unnecessary re-renders
  const canvasProps = useMemo(() => ({
    key: modelPath,
    camera: { position: [0, 0, 10], fov: 50, near: 0.1, far: 1000 },
    gl: { 
      antialias: true, 
      alpha: true, 
      precision: 'highp' as const,
      powerPreference: 'high-performance' as const,
    },
    dpr: [1, 2] as [number, number],
    style: { width: '100%', height: '100%' },
  }), [modelPath]);

  return (
    <Canvas {...canvasProps}>
      <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={50} near={0.1} far={1000} />
      
      {/* Optimized lighting */}
      <ambientLight intensity={1.2} />
      <directionalLight position={[15, 15, 15]} intensity={2} castShadow />
      <directionalLight position={[-15, -10, 10]} intensity={1} color="#4a90e2" />
      <pointLight position={[0, 10, 0]} intensity={1} />
      <pointLight position={[10, 0, 10]} intensity={0.5} />
      
      <Suspense fallback={<CarViewerFallback />}>
        <CarModel modelPath={modelPath} rotationY={rotationY} modelScale={modelScale} />
      </Suspense>

      <OrbitControls
        autoRotate={false}
        enableZoom={false}
        enablePan={false}
        enableRotate={false}
      />
    </Canvas>
  );
}
