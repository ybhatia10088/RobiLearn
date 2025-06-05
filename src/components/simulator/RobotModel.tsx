import React, { useRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { RobotConfig } from '@/types/robot.types';
import { useRobotStore } from '@/store/robotStore';
import * as THREE from 'three';

interface RobotModelProps {
  robotConfig: RobotConfig;
}

const RobotModel: React.FC<RobotModelProps> = ({ robotConfig }) => {
  const modelRef = useRef<THREE.Group>(null);
  const { robotState, isMoving } = useRobotStore();
  const fallbackRef = useRef<THREE.Mesh>(null);
  
  // Create a basic geometry for fallback
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({ 
    color: '#3b82f6',
    metalness: 0.6,
    roughness: 0.4,
  });
  
  useEffect(() => {
    if ((modelRef.current || fallbackRef.current) && robotState) {
      const ref = modelRef.current || fallbackRef.current;
      if (!ref) return;
      
      // Set initial position and rotation
      ref.position.set(
        robotState.position.x,
        robotState.position.y,
        robotState.position.z
      );
      
      // Rotate the model 180 degrees to face forward
      ref.rotation.set(
        0,
        Math.PI + robotState.rotation.y, // Add PI to face forward
        0
      );
    }
  }, [robotState]);
  
  useFrame(() => {
    if (!robotState) return;
    
    const ref = modelRef.current || fallbackRef.current;
    if (!ref) return;
    
    // Update position
    ref.position.set(
      robotState.position.x,
      robotState.position.y,
      robotState.position.z
    );
    
    // Update rotation (add PI to face forward)
    ref.rotation.y = Math.PI + robotState.rotation.y;
    
    // Add movement animations based on robot type
    if (isMoving && fallbackRef.current) {
      // Simple animation for the fallback model
      fallbackRef.current.rotation.x = Math.sin(Date.now() * 0.005) * 0.1;
    }
  });
  
  return (
    <mesh
      ref={fallbackRef}
      geometry={geometry}
      material={material}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial color="#3b82f6" metalness={0.6} roughness={0.4} />
    </mesh>
  );
};

export default RobotModel;