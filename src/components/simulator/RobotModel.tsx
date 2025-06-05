import React, { useRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { RobotConfig } from '@/types/robot.types';
import { useRobotStore } from '@/store/robotStore';

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
      
      modelRef.current.rotation.set(
        robotState.rotation.x,
        robotState.rotation.y,
        robotState.rotation.z
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
    
    // Update rotation
    modelRef.current.rotation.y = robotState.rotation.y;
    
    // Add movement animations based on robot type
    if (isMoving) {
      switch (robotConfig.type) {
        case 'spider':
          // Add leg movement animation
          const time = Date.now() * 0.001;
          const legs = modelRef.current.children.filter(child => 
            child.name.toLowerCase().includes('leg')
          );
          
          legs.forEach((leg, index) => {
            const offset = index * (Math.PI / 4);
            leg.rotation.x = Math.sin(time * 5 + offset) * 0.2;
          });
          break;
          
        case 'tank':
          // Add track rotation animation
          const tracks = modelRef.current.children.filter(child =>
            child.name.toLowerCase().includes('track')
          );
          
          tracks.forEach(track => {
            track.rotation.x += 0.1;
          });
          break;
          
        case 'humanoid':
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