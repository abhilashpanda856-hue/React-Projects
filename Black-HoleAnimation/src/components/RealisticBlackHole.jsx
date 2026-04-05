import React, { useRef, useMemo } from 'react';
import { useFrame, extend } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';
import {
  blackHoleVertexShader,
  blackHoleFragmentShader,
  accretionDiskVertexShader,
  accretionDiskFragmentShader,
  photonRingVertexShader,
  photonRingFragmentShader,
  eventHorizonVertexShader,
  eventHorizonFragmentShader,
} from '../shaders/blackHoleShader';

// Create custom shader materials
const BlackHoleMaterial = shaderMaterial(
  {
    uTime: 0,
    uResolution: new THREE.Vector2(1, 1),
    uBlackHoleRadius: 0.5,
    uAccretionDiskInner: 0.8,
    uAccretionDiskOuter: 2.5,
  },
  blackHoleVertexShader,
  blackHoleFragmentShader
);

const AccretionDiskMaterial = shaderMaterial(
  {
    uTime: 0,
    uInnerRadius: 0.2,
    uOuterRadius: 1.0,
  },
  accretionDiskVertexShader,
  accretionDiskFragmentShader
);

const PhotonRingMaterial = shaderMaterial(
  {
    uTime: 0,
    uRadius: 0.6,
  },
  photonRingVertexShader,
  photonRingFragmentShader
);

const EventHorizonMaterial = shaderMaterial(
  {
    uTime: 0,
  },
  eventHorizonVertexShader,
  eventHorizonFragmentShader
);

extend({ BlackHoleMaterial, AccretionDiskMaterial, PhotonRingMaterial, EventHorizonMaterial });

// Main accretion disk component
function AccretionDisk() {
  const diskRef = useRef();
  const materialRef = useRef();

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uTime = state.clock.elapsedTime;
    }
    if (diskRef.current) {
      diskRef.current.rotation.y += 0.002;
    }
  });

  return (
    <group ref={diskRef} rotation={[Math.PI * 0.1, 0, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.2, 4.5, 128, 8]} />
        <accretionDiskMaterial
          ref={materialRef}
          transparent
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          uInnerRadius={0.2}
          uOuterRadius={1.0}
        />
      </mesh>
    </group>
  );
}

// Warped disk to simulate gravitational lensing effect
function WarpedDisk() {
  const diskRef = useRef();
  const materialRef = useRef();

  const geometry = useMemo(() => {
    const geo = new THREE.RingGeometry(1.3, 4.2, 128, 32);
    const positions = geo.attributes.position;
    
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      const dist = Math.sqrt(x * x + y * y);
      
      // Create warping effect
      const warpAmount = Math.sin(Math.atan2(y, x) * 2) * 0.3 * (1 - (dist - 1.3) / 2.9);
      positions.setZ(i, warpAmount);
    }
    
    geo.computeVertexNormals();
    return geo;
  }, []);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uTime = state.clock.elapsedTime;
    }
    if (diskRef.current) {
      diskRef.current.rotation.y += 0.003;
      diskRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.1) * 0.02;
    }
  });

  return (
    <mesh ref={diskRef} geometry={geometry} rotation={[Math.PI * 0.4, 0, 0]}>
      <accretionDiskMaterial
        ref={materialRef}
        transparent
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        uInnerRadius={0.15}
        uOuterRadius={1.0}
      />
    </mesh>
  );
}

// Back-facing disk (gravitational lensing illusion)
function BackDisk() {
  const diskRef = useRef();
  const materialRef = useRef();

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uTime = state.clock.elapsedTime + 1.5;
    }
    if (diskRef.current) {
      diskRef.current.rotation.y -= 0.002;
    }
  });

  return (
    <group ref={diskRef} rotation={[-Math.PI * 0.35, Math.PI, 0]} position={[0, 0.8, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.0, 3.5, 96, 4]} />
        <accretionDiskMaterial
          ref={materialRef}
          transparent
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          uInnerRadius={0.25}
          uOuterRadius={1.0}
        />
      </mesh>
    </group>
  );
}

// Event horizon (the black sphere)
function EventHorizon() {
  const meshRef = useRef();
  const materialRef = useRef();

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uTime = state.clock.elapsedTime;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshBasicMaterial color="#000000" />
    </mesh>
  );
}

// Photon sphere rings
function PhotonRings() {
  const ringRef = useRef();
  const materialRef = useRef();

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uTime = state.clock.elapsedTime;
    }
  });

  return (
    <group ref={ringRef}>
      {/* Main photon ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.05, 1.25, 128, 1]} />
        <photonRingMaterial
          ref={materialRef}
          transparent
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      
      {/* Secondary ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.0, 1.08, 128, 1]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.8}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      
      {/* Tilted ring for depth effect */}
      <mesh rotation={[Math.PI / 2.2, 0.1, 0]}>
        <ringGeometry args={[1.02, 1.12, 96, 1]} />
        <meshBasicMaterial
          color="#ffeedd"
          transparent
          opacity={0.4}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

// Glow effect around the black hole
function GlowEffect() {
  const glowRef = useRef();

  useFrame((state) => {
    if (glowRef.current) {
      glowRef.current.material.opacity = 0.15 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  return (
    <mesh ref={glowRef}>
      <sphereGeometry args={[1.8, 32, 32]} />
      <meshBasicMaterial
        color="#ff6600"
        transparent
        opacity={0.15}
        side={THREE.BackSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

// Main realistic black hole component
export default function RealisticBlackHole({ position = [0, 0, 0], scale = 1 }) {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      // Subtle floating animation
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
      groupRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Core black sphere */}
      <EventHorizon />
      
      {/* Photon rings around event horizon */}
      <PhotonRings />
      
      {/* Main accretion disk */}
      <AccretionDisk />
      
      {/* Warped disk for lensing effect */}
      <WarpedDisk />
      
      {/* Back-facing disk (seen through gravitational lensing) */}
      <BackDisk />
      
      {/* Ambient glow */}
      <GlowEffect />
      
      {/* Additional volumetric glow layers */}
      <mesh>
        <sphereGeometry args={[2.5, 32, 32]} />
        <meshBasicMaterial
          color="#ff4400"
          transparent
          opacity={0.05}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      
      <mesh>
        <sphereGeometry args={[3.5, 32, 32]} />
        <meshBasicMaterial
          color="#ff2200"
          transparent
          opacity={0.02}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}