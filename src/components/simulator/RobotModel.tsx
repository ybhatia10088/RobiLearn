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
  
  // Load the spider robot model from the correct path
  const { scene } = useGLTF('/models/spider-model/source/spider_robot.glb');
  
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
      
      // Prepare model for shadows
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    }
  }, [robotState, scene]);
  
  useFrame((state) => {
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
      const time = state.clock.getElapsedTime();
      
      // Animate legs with more natural movement
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh && child.name.toLowerCase().includes('leg')) {
          // Create alternating leg movements
          const isLeftLeg = child.name.toLowerCase().includes('left');
          const phase = isLeftLeg ? 0 : Math.PI;
          
          // Apply walking motion
          child.rotation.x = Math.sin(time * 8 + phase) * 0.3;
          child.rotation.z = Math.cos(time * 8 + phase) * 0.15;
        }
      });
    } else {
      // Reset leg positions when not moving
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh && child.name.toLowerCase().includes('leg')) {
          child.rotation.x = 0;
          child.rotation.z = 0;
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

// Preload the model
useGLTF.preload('/models/spider-model/source/spider_robot.glb');

export default RobotModel;