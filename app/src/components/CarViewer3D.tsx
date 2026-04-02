import { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

interface CarViewerProps {
  modelPath: string;
  rotationY?: number;
  modelScale?: number;
  autoRotate?: boolean;
}

function CarModel({ modelPath, rotationY = -0.35, modelScale = 4, autoRotate = true }: CarViewerProps) {
  const rotationRef = useRef<THREE.Group>(null);
  const modelRef = useRef<THREE.Object3D>(null);
  const [isReady, setIsReady] = useState(false);
  const rotationYRef = useRef(rotationY);
  
  const gltf = useGLTF(modelPath);

  // Update rotation ref when prop changes
  useEffect(() => {
    rotationYRef.current = rotationY;
  }, [rotationY]);

  // Center the model on first load
  useEffect(() => {
    if (!gltf.scene || isReady) return;

    const box = new THREE.Box3().setFromObject(gltf.scene);
    const center = box.getCenter(new THREE.Vector3());
    
    gltf.scene.position.sub(center);
    gltf.scene.scale.set(modelScale, modelScale, modelScale);
    
    setIsReady(true);
  }, [gltf.scene, isReady, modelScale]);

  // Auto-rotation on Y axis
  useFrame(() => {
    if (rotationRef.current && isReady) {
      if (autoRotate) {
        rotationRef.current.rotation.y += 0.005; // Smooth auto-rotation
      } else {
        rotationRef.current.rotation.y = rotationYRef.current;
      }
    }
  });

  if (!gltf || !gltf.scene) {
    return (
      <mesh>
        <boxGeometry args={[3, 3, 3]} />
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

export function CarViewer3D({ modelPath, rotationY = -0.35, modelScale = 4, autoRotate = true }: CarViewerProps) {
  return (
    <Canvas
      key={modelPath}
      camera={{ position: [0, 0, 10], fov: 50, near: 0.1, far: 1000 }}
      gl={{ antialias: true, alpha: true, precision: 'highp', powerPreference: 'high-performance' }}
      dpr={[1, 2]}
      style={{ width: '100%', height: '100%' }}
    >
      <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={50} near={0.1} far={1000} />
      
      {/* Lighting Setup */}
      <ambientLight intensity={1.2} />
      <directionalLight position={[15, 15, 15]} intensity={2} />
      <directionalLight position={[-15, -10, 10]} intensity={1} color="#4a90e2" />
      <pointLight position={[0, 10, 0]} intensity={1} />
      <pointLight position={[10, 0, 10]} intensity={0.5} />
      
      <Suspense fallback={<CarViewerFallback />}>
        <CarModel modelPath={modelPath} rotationY={rotationY} modelScale={modelScale} autoRotate={autoRotate} />
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
