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
  
  // Load the appropriate model based on robot type
  const modelPath = robotConfig.type === 'spider' 
    ? '/models/spider-model/source/spiedy_sfabblend.glb'
    : robotConfig.model;
    
  const { scene } = useGLTF(modelPath);
  
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
        Math.PI + robotState.rotation.y, // Add PI to face forward
        0
      );
    }
  }, [robotState]);
  
  useFrame(() => {
    if (!modelRef.current || !robotState) return;
    
    // Update position
    modelRef.current.position.set(
      robotState.position.x,
      robotState.position.y,
      robotState.position.z
    );
    
    // Update rotation (add PI to face forward)
    modelRef.current.rotation.y = Math.PI + robotState.rotation.y;
    
    // Add movement animations based on robot type
    if (isMoving) {
      switch (robotConfig.type) {
        case 'spider': {
          // Find all leg joints
          const leftLegs = modelRef.current.children.filter(child => 
            child.name.toLowerCase().includes('leg') && 
            child.name.toLowerCase().includes('left')
          );
          
          const rightLegs = modelRef.current.children.filter(child => 
            child.name.toLowerCase().includes('leg') && 
            child.name.toLowerCase().includes('right')
          );
          
          const time = Date.now() * 0.002; // Slower animation
          
          // Animate legs in alternating patterns
          leftLegs.forEach((leg, index) => {
            const offset = index * (Math.PI / 3); // Distribute timing for tripod gait
            const amplitude = 0.3; // Reduced movement range
            leg.rotation.x = Math.sin(time + offset) * amplitude;
            leg.rotation.z = Math.cos(time + offset) * (amplitude / 2);
          });
          
          rightLegs.forEach((leg, index) => {
            const offset = index * (Math.PI / 3) + Math.PI; // Opposite phase to left legs
            const amplitude = 0.3;
            leg.rotation.x = Math.sin(time + offset) * amplitude;
            leg.rotation.z = Math.cos(time + offset) * (amplitude / 2);
          });
          break;
        }
          
        case 'tank': {
          // Add track rotation animation
          const tracks = modelRef.current.children.filter(child =>
            child.name.toLowerCase().includes('track')
          );
          
          tracks.forEach(track => {
            track.rotation.x += 0.1;
          });
          break;
        }
          
        case 'humanoid': {
          // Add walking animation
          const arms = modelRef.current.children.filter(child =>
            child.name.toLowerCase().includes('arm')
          );
          
          const legs = modelRef.current.children.filter(child =>
            child.name.toLowerCase().includes('leg')
          );
          
          const time = Date.now() * 0.001;
          
          arms.forEach((arm, index) => {
            arm.rotation.x = Math.sin(time * 5 + (index * Math.PI)) * 0.5;
          });
          
          legs.forEach((leg, index) => {
            leg.rotation.x = Math.sin(time * 5 + (index * Math.PI)) * 0.5;
          });
          break;
        }
      }
    }
  });
  
  return (
    <primitive 
      ref={modelRef}
      object={scene.clone()} 
      scale={[1, 1, 1]}
      castShadow
      receiveShadow
    />
  );
};

export default RobotModel;