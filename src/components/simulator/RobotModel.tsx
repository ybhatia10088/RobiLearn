import React, { useRef, useEffect, useMemo } from 'react';
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
  
  // Load and memoize the spider robot model
  const { scene } = useGLTF('/models/spider-model/source/spider_robot.glb');
  const model = useMemo(() => scene.clone(), [scene]);
  
  // Initialize model properties
  useEffect(() => {
    if (!model) return;
    
    // Set up shadows and materials
    model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        
        // Enhance material properties
        if (child.material) {
          child.material.metalness = 0.8;
          child.material.roughness = 0.2;
        }
      }
    });
    
    // Set initial scale
    model.scale.set(0.5, 0.5, 0.5);
  }, [model]);
  
  // Handle position and rotation updates
  useEffect(() => {
    if (modelRef.current && robotState) {
      modelRef.current.position.set(
        robotState.position.x,
        robotState.position.y,
        robotState.position.z
      );
      
      modelRef.current.rotation.set(
        0,
        Math.PI + robotState.rotation.y,
        0
      );
    }
  }, [robotState]);
  
  // Animation frame updates
  useFrame((state) => {
    if (!robotState || !modelRef.current) return;
    
    // Smooth position updates
    modelRef.current.position.lerp(
      new THREE.Vector3(
        robotState.position.x,
        robotState.position.y,
        robotState.position.z
      ),
      0.1
    );
    
    // Smooth rotation updates
    const targetRotation = Math.PI + robotState.rotation.y;
    modelRef.current.rotation.y += (targetRotation - modelRef.current.rotation.y) * 0.1;
    
    // Animate legs when moving
    if (isMoving) {
      const time = state.clock.getElapsedTime();
      
      model.traverse((child) => {
        if (child instanceof THREE.Mesh && child.name.toLowerCase().includes('leg')) {
          const isLeftLeg = child.name.toLowerCase().includes('left');
          const phase = isLeftLeg ? 0 : Math.PI;
          
          // More natural walking animation
          child.rotation.x = Math.sin(time * 8 + phase) * 0.3;
          child.rotation.z = Math.cos(time * 8 + phase) * 0.15;
          child.position.y = Math.abs(Math.sin(time * 8 + phase)) * 0.1;
        }
      });
    } else {
      // Reset leg positions when stationary
      model.traverse((child) => {
        if (child instanceof THREE.Mesh && child.name.toLowerCase().includes('leg')) {
          child.rotation.x = 0;
          child.rotation.z = 0;
          child.position.y = 0;
        }
      });
    }
  });
  
  return (
    <primitive 
      ref={modelRef}
      object={model}
      castShadow
      receiveShadow
    />
  );
};

// Preload the model
useGLTF.preload('/models/spider-model/source/spider_robot.glb');

export default RobotModel;