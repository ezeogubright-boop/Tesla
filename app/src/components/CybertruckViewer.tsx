import { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, PerspectiveCamera } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

interface ModelProps {
  modelUrl: string;
  rotationY: number;
}

function Model({ modelUrl, rotationY }: ModelProps) {
  const rotationRef = useRef<THREE.Group>(null);
  const modelRef = useRef<THREE.Object3D>(null);
  const [isReady, setIsReady] = useState(false);
  const rotationYRef = useRef(rotationY);
  
  // Update ref when prop changes
  useEffect(() => {
    rotationYRef.current = rotationY;
  }, [rotationY]);
  
  const gltf = useGLTF(modelUrl);

  // Center the model on first load
  useEffect(() => {
    if (!gltf.scene || isReady || !modelRef.current) return;

    // Calculate the bounding box to find true center
    const box = new THREE.Box3().setFromObject(gltf.scene);
    const center = box.getCenter(new THREE.Vector3());
    
    // Position the model so its center is at origin
    gltf.scene.position.sub(center);
    gltf.scene.scale.set(4, 4, 4);
    
    setIsReady(true);
  }, [gltf.scene, isReady]);

  // Rotation on Y axis - use ref to avoid stale closures
  useFrame(() => {
    if (rotationRef.current && isReady) {
      rotationRef.current.rotation.y = rotationYRef.current;
    }
  });

  if (!gltf || !gltf.scene) {
    return (
      <mesh>
        <boxGeometry args={[3, 3, 3]} />
        <meshStandardMaterial color="#4a90e2" />
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

function ModelLoader({ modelUrl, rotationY }: ModelProps) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Model modelUrl={modelUrl} rotationY={rotationY} />
    </Suspense>
  );
}

export function CybertruckViewer({ modelUrl = '/models/tesla_cybertruck.glb' }) {
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startAngle, setStartAngle] = useState(0);
  const knobRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll-based 360 rotation
  useEffect(() => {
    if (!containerRef.current) return;

    const rotObj = { value: 0 };

    const tween = gsap.to(rotObj, {
      value: Math.PI * 2, // 360 degrees
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top center',
        end: 'bottom center',
        scrub: 1,
        markers: false,
      },
      onUpdate: () => {
        if (!isDragging) {
          setRotation(rotObj.value);
        }
      },
    });

    return () => {
      tween.kill();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    const rect = knobRef.current?.getBoundingClientRect();
    if (rect) {
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
      setStartAngle(angle);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !knobRef.current) return;

      const rect = knobRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
      const delta = angle - startAngle;
      
      setRotation((prev) => prev + delta);
      setStartAngle(angle);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, startAngle]);

  return (
    <div className="w-full flex flex-col items-center gap-6" ref={containerRef}>
      {/* 3D Canvas Container */}
      <div className="relative w-full h-96 rounded-xl overflow-hidden bg-black/50">
        <Canvas
          camera={{ position: [0, 0, 10], fov: 50, near: 0.1, far: 1000 }}
          gl={{ antialias: true, alpha: true, precision: 'highp' }}
          dpr={[1, 2]}
        >
          <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={50} near={0.1} far={1000} />
          
          {/* Lighting */}
          <ambientLight intensity={1.2} />
          <directionalLight position={[15, 15, 15]} intensity={2} />
          <directionalLight position={[-15, -10, 10]} intensity={1} color="#4a90e2" />
          <pointLight position={[0, 10, 0]} intensity={1} />
          <pointLight position={[10, 0, 10]} intensity={0.5} />
          
          {/* Model */}
          <ModelLoader modelUrl={modelUrl} rotationY={rotation} />
          
          {/* Controls - disable auto rotate */}
          <OrbitControls 
            autoRotate={false}
            enableZoom={false}
            enablePan={false}
          />
        </Canvas>

        {/* 360 Slider - Bottom Center */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-3">
          <div
            ref={knobRef}
            onMouseDown={handleMouseDown}
            className="relative w-40 h-40 cursor-grab active:cursor-grabbing"
            style={{ userSelect: 'none' }}
          >
            {/* Background circle */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 160 160" style={{ pointerEvents: 'none' }}>
              {/* Track background */}
              <circle cx="80" cy="80" r="65" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
              
              {/* Progress arc */}
              <circle
                cx="80"
                cy="80"
                r="65"
                fill="none"
                stroke="url(#arcGradient)"
                strokeWidth="3"
                strokeDasharray={`${(rotation / (Math.PI * 2)) * (2 * Math.PI * 65)} ${2 * Math.PI * 65}`}
                strokeLinecap="round"
                transform="rotate(-90 80 80)"
              />
              
              {/* Gradient definition */}
              <defs>
                <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="1" />
                  <stop offset="100%" stopColor="#0891b2" stopOpacity="1" />
                </linearGradient>
              </defs>
            </svg>

            {/* Center circle */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-white/5 to-white/10 flex items-center justify-center border border-white/20"
                style={{
                  boxShadow: '0 0 20px rgba(74, 144, 226, 0.3), inset 0 0 15px rgba(255, 255, 255, 0.05)',
                }}
              >
                <div className="text-center">
                  <div className="text-white font-light text-lg">{Math.round((rotation * 180) / Math.PI) % 360}°</div>
                </div>
              </div>
            </div>

            {/* Draggable handle */}
            <div
              className="absolute w-5 h-5 rounded-full bg-gradient-to-br from-cyan-300 to-cyan-500 border-2 border-cyan-200 shadow-lg"
              style={{
                left: '50%',
                top: '50%',
                transform: `translate(-50%, -50%) rotate(${rotation}rad) translateY(-65px)`,
                transformOrigin: 'center',
                boxShadow: '0 0 15px rgba(6, 182, 212, 0.6)',
              }}
            />

            {/* Tick marks */}
            {[...Array(12)].map((_, i) => {
              const isMainTick = i % 3 === 0;
              return (
                <div
                  key={i}
                  className={`absolute w-0.5 ${isMainTick ? 'h-3 bg-white/40' : 'h-2 bg-white/20'}`}
                  style={{
                    left: '50%',
                    top: '4px',
                    transform: `rotate(${(i / 12) * 360}deg)`,
                    transformOrigin: '50% 76px',
                    marginLeft: '-1px',
                  }}
                />
              );
            })}
          </div>

          <p className="text-white/40 text-xs uppercase tracking-widest font-light">Rotate 360°</p>
        </div>
      </div>
    </div>
  );
}
