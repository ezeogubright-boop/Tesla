import { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

interface CarViewerProps {
  modelPath: string;
  rotationY?: number;
  modelScale?: number;
}

function CarModel({ modelPath, rotationY = -0.35, modelScale = 4 }: CarViewerProps) {
  const rotationRef = useRef<THREE.Group>(null);
  const modelRef = useRef<THREE.Object3D>(null);
  const [isReady, setIsReady] = useState(false);
  
  const gltf = useGLTF(modelPath);

  // Center the model on first load - EXACT SAME as CybertruckViewer
  useEffect(() => {
    if (!gltf.scene || isReady) return;

    // Calculate the bounding box to find true center
    const box = new THREE.Box3().setFromObject(gltf.scene);
    const center = box.getCenter(new THREE.Vector3());
    
    // Position the model so its center is at origin
    gltf.scene.position.sub(center);
    gltf.scene.scale.set(modelScale, modelScale, modelScale);
    
    setIsReady(true);
  }, [gltf.scene, isReady]);

  // Rotation on Y axis - pure rotation like basketball on finger
  useFrame(() => {
    if (rotationRef.current && isReady) {
      rotationRef.current.rotation.y = rotationY;
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

export function CarViewer3D({ modelPath, rotationY = -0.35, modelScale = 4 }: CarViewerProps) {
  return (
    <Canvas
      key={modelPath}
      camera={{ position: [0, 0, 10], fov: 50, near: 0.1, far: 1000 }}
      gl={{ antialias: true, alpha: true, precision: 'highp' }}
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
