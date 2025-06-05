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
  
  // Load the spider robot model
  const { scene } = useGLTF('/models/Robot_model.glb');
  
  useEffect(() => {
    if (modelRef.current && robotState) {
      // Set initial position and rotation
      modelRef.current.position.set(
        robotState.position.x,
        robotState.position.y,
        robotState.position.z
      );
      
      // Rotate the model 180 degrees to face forward
      modelRef.current.rotation.set(
        0,
        Math.PI + robotState.rotation.y,
        0
      );
    }
  }, [robotState]);
  
  useFrame(() => {
    if (!robotState || !modelRef.current) return;
    
    // Update position
    modelRef.current.position.set(
      robotState.position.x,
      robotState.position.y,
      robotState.position.z
    );
    
    // Update rotation (add PI to face forward)
    modelRef.current.rotation.y = Math.PI + robotState.rotation.y;
    
    // Add walking animation when moving
    if (isMoving) {
      const time = Date.now() * 0.001;
      
      // Animate legs
      scene.traverse((child) => {
        if (child.name.includes('leg')) {
          child.rotation.x = Math.sin(time * 5) * 0.2;
        }
      });
    }
  });
  
  return (
    <primitive 
      ref={modelRef}
      object={scene.clone()} 
      scale={[0.5, 0.5, 0.5]}
      castShadow
      receiveShadow
    />
  );
};

export default RobotModel;