import React, { Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  EffectComposer, 
  Bloom, 
  ChromaticAberration,
  Vignette,
  Noise
} from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import RealisticBlackHole from './RealisticBlackHole';

// Animated star particles
function StarField({ count = 3000 }) {
  const pointsRef = useRef();
  
  const [positions, colors, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const siz = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      // Distribute stars in a sphere, avoiding the center
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 30 + Math.random() * 70;
      
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      
      // Star colors (white, blue-white, yellow)
      const colorType = Math.random();
      if (colorType < 0.3) {
        col[i * 3] = 1.0;
        col[i * 3 + 1] = 1.0;
        col[i * 3 + 2] = 1.0;
      } else if (colorType < 0.6) {
        col[i * 3] = 0.8;
        col[i * 3 + 1] = 0.9;
        col[i * 3 + 2] = 1.0;
      } else {
        col[i * 3] = 1.0;
        col[i * 3 + 1] = 0.95;
        col[i * 3 + 2] = 0.8;
      }
      
      siz[i] = Math.random() * 2 + 0.5;
    }
    
    return [pos, col, siz];
  }, [count]);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.0001;
      pointsRef.current.rotation.x += 0.00005;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={positions.length / 3}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          array={colors}
          count={colors.length / 3}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          array={sizes}
          count={sizes.length}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// Nebula dust clouds
function NebulaCloud({ color, position, scale }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z += 0.0002;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <planeGeometry args={[40, 40]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.1}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

// Dust particles around the black hole
function DustParticles({ count = 500 }) {
  const pointsRef = useRef();
  
  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const r = 5 + Math.random() * 8;
      
      pos[i * 3] = r * Math.cos(theta);
      pos[i * 3 + 1] = (Math.random() - 0.5) * 3;
      pos[i * 3 + 2] = r * Math.sin(theta);
      
      // Orbital velocity
      const speed = 0.02 / Math.sqrt(r);
      vel[i * 3] = -Math.sin(theta) * speed;
      vel[i * 3 + 1] = 0;
      vel[i * 3 + 2] = Math.cos(theta) * speed;
    }
    
    return [pos, vel];
  }, [count]);

  useFrame(() => {
    if (pointsRef.current) {
      const positions = pointsRef.current.geometry.attributes.position.array;
      
      for (let i = 0; i < count; i++) {
        const x = positions[i * 3];
        const z = positions[i * 3 + 2];
        const r = Math.sqrt(x * x + z * z);
        const theta = Math.atan2(z, x);
        
        // Orbital motion
        const speed = 0.008 / Math.sqrt(r);
        const newTheta = theta + speed;
        
        positions[i * 3] = r * Math.cos(newTheta);
        positions[i * 3 + 2] = r * Math.sin(newTheta);
        
        // Slowly spiral inward
        const newR = r - 0.001;
        if (newR < 4) {
          // Reset to outer edge
          const resetR = 12 + Math.random() * 3;
          const resetTheta = Math.random() * Math.PI * 2;
          positions[i * 3] = resetR * Math.cos(resetTheta);
          positions[i * 3 + 1] = (Math.random() - 0.5) * 3;
          positions[i * 3 + 2] = resetR * Math.sin(resetTheta);
        }
      }
      
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={positions.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#ff8844"
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// Light beams being bent
function LightBeams() {
  const beamsRef = useRef();
  
  useFrame((state) => {
    if (beamsRef.current) {
      beamsRef.current.rotation.y += 0.005;
    }
  });

  const beamPositions = useMemo(() => {
    const positions = [];
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      positions.push([Math.cos(angle) * 15, 0, Math.sin(angle) * 15]);
    }
    return positions;
  }, []);

  return (
    <group ref={beamsRef}>
      {beamPositions.map((pos, i) => (
        <mesh key={i} position={pos} rotation={[0, -Math.atan2(pos[2], pos[0]) + Math.PI / 2, 0]}>
          <planeGeometry args={[0.1, 30]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.05}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

// Scene component
function Scene() {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.1} />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#ff6600" />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#4488ff" />
      
      {/* Main black hole */}
      <RealisticBlackHole position={[0, 0, 0]} scale={1} />
      
      {/* Star field */}
      <StarField count={4000} />
      
      {/* Dust particles */}
      <DustParticles count={800} />
      
      {/* Light beams being bent */}
      <LightBeams />
      
      {/* Nebula clouds */}
      <NebulaCloud color="#220033" position={[-20, 10, -30]} scale={[1.5, 1.5, 1]} />
      <NebulaCloud color="#001133" position={[25, -15, -35]} scale={[1.2, 1.2, 1]} />
      <NebulaCloud color="#331100" position={[0, 20, -40]} scale={[2, 2, 1]} />
    </>
  );
}

// Post-processing effects
function Effects() {
  return (
    <EffectComposer>
      <Bloom
        intensity={1.5}
        luminanceThreshold={0.1}
        luminanceSmoothing={0.9}
        radius={0.8}
      />
      <ChromaticAberration
        offset={[0.0005, 0.0005]}
        blendFunction={BlendFunction.NORMAL}
      />
      <Vignette
        offset={0.3}
        darkness={0.7}
        blendFunction={BlendFunction.NORMAL}
      />
      <Noise
        opacity={0.02}
        blendFunction={BlendFunction.OVERLAY}
      />
    </EffectComposer>
  );
}

// Main canvas component
export default function BlackHoleCanvas() {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        camera={{
          position: [0, 2, 12],
          fov: 60,
          near: 0.1,
          far: 1000,
        }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#000005']} />
        <fog attach="fog" args={['#000005', 20, 80]} />
        
        <Suspense fallback={null}>
          <Scene />
          <Effects />
        </Suspense>
      </Canvas>
    </div>
  );
}