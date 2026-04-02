import { Suspense, useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';
import { useModelLoader } from '../hooks/useModelLoader';
import { ModelLoaderSkeleton, ModelLoadError } from './LoadingStates';

gsap.registerPlugin(ScrollTrigger);

interface CybertruckViewerProps {
  modelUrl?: string;
}

// Optimized model component
function Model({ modelUrl }: { modelUrl: string; rotationY: number }) {
  const rotationRef = useRef<THREE.Group>(null);
  const modelRef = useRef<THREE.Object3D>(null);
  const [isReady, setIsReady] = useState(false);
  const [rotationY, setRotationY] = useState(0);
  
  // Use optimized model loader
  const { gltf, isLoading, error } = useModelLoader(modelUrl);

  // Center and optimize model on load
  useEffect(() => {
    if (!gltf?.scene || isReady || !modelRef.current) return;

    const box = new THREE.Box3().setFromObject(gltf.scene);
    const center = box.getCenter(new THREE.Vector3());
    
    gltf.scene.position.sub(center);
    gltf.scene.scale.set(4, 4, 4);
    
    // Optimize materials
    gltf.scene.traverse((child: any) => {
      if (child.isMesh) {
        child.frustumCulled = true;
        if (child.material) {
          child.material.toneMapped = false;
        }
      }
    });
    
    setIsReady(true);
  }, [gltf?.scene, isReady]);

  // Smooth rotation frame
  useFrame(() => {
    if (rotationRef.current) {
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
        <meshStandardMaterial color="#4a90e2" wireframe />
      </mesh>
    );
  }

  return (
    <group ref={rotationRef} position={[0, 0, 0]}>
      <primitive ref={modelRef} object={gltf.scene} />
    </group>
  );
}

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="#4a90e2" wireframe />
    </mesh>
  );
}

/**
 * Optimized CybertruckViewer with scroll-based rotation and lazy loading
 */
export function CybertruckViewer({ modelUrl = '/models/tesla_cybertruck.glb' }: CybertruckViewerProps) {
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startAngle, setStartAngle] = useState(0);
  const knobRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rotObjRef = useRef({ value: 0 });

  // Scroll-based 360 rotation with optimized animation
  useEffect(() => {
    if (!containerRef.current) return;

    const rotObj = rotObjRef.current;

    const tween = gsap.to(rotObj, {
      value: Math.PI * 2,
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top center',
        end: 'bottom center',
        scrub: 1,
        markers: false,
      },
      onUpdate: () => {
        setRotation(rotObj.value);
      },
    });

    return () => {
      tween.kill();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  // Interactive knob rotation
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!knobRef.current) return;
    setIsDragging(true);
    const rect = knobRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
    setStartAngle(angle - rotation);
  };

  // Mouse move handler for knob dragging
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!knobRef.current) return;
      const rect = knobRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
      setRotation(angle - startAngle);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, startAngle]);

  // Memoize canvas props
  const canvasProps = useMemo(() => ({
    key: modelUrl,
    camera: { position: [0, 0, 12], fov: 50, near: 0.1, far: 1000 },
    gl: {
      antialias: true,
      alpha: true,
      precision: 'highp' as const,
      powerPreference: 'high-performance' as const,
    },
    dpr: [1, 2] as [number, number],
    style: { width: '100%', height: '100%' },
  }), [modelUrl]);

  return (
    <div ref={containerRef} className="relative w-full h-screen bg-black">
      {/* 3D Canvas */}
      <div className="w-full h-full">
        <Canvas {...canvasProps}>
          <PerspectiveCamera makeDefault position={[0, 0, 12]} fov={50} near={0.1} far={1000} />
          
          {/* Optimized lighting */}
          <ambientLight intensity={1.2} />
          <directionalLight position={[15, 15, 15]} intensity={2} castShadow />
          <directionalLight position={[-15, -10, 10]} intensity={1} color="#4a90e2" />
          <pointLight position={[0, 10, 0]} intensity={1} />

          <Suspense fallback={<LoadingFallback />}>
            <Model modelUrl={modelUrl} rotationY={rotation} />
          </Suspense>

          <OrbitControls
            autoRotate={false}
            enableZoom={false}
            enablePan={false}
            enableRotate={false}
          />
        </Canvas>
      </div>

      {/* Interactive Control Knob */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div
          ref={knobRef}
          onMouseDown={handleMouseDown}
          className={`w-16 h-16 bg-gradient-to-b from-gray-700 to-gray-900 rounded-full border-2 border-blue-500 flex items-center justify-center cursor-grab active:cursor-grabbing shadow-lg ${
            isDragging ? 'opacity-100' : 'opacity-75 hover:opacity-100'
          } transition-opacity`}
        >
          <div className="w-2 h-6 bg-blue-400 rounded-full" />
        </div>
        <p className="text-center text-gray-400 text-xs mt-3 font-orbitron">Drag to Rotate</p>
      </div>
    </div>
  );
}
