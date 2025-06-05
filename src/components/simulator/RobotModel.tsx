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
  const model = useMemo(() => {
    const clonedScene = scene.clone();
    
    // Set up model properties
    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        
        if (child.material) {
          child.material = new THREE.MeshStandardMaterial({
            color: child.material.color,
            metalness: 0.8,
            roughness: 0.2,
          });
        }
      }
    });
    
    clonedScene.scale.set(0.5, 0.5, 0.5);
    return clonedScene;
  }, [scene]);
  
  // Clean up
  useEffect(() => {
    return () => {
      if (model) {
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.geometry.dispose();
            if (child.material instanceof THREE.Material) {
              child.material.dispose();
            }
          }
        });
      }
    };
  }, [model]);
  
  useFrame((state) => {
    if (!robotState || !modelRef.current || !model) return;
    
    // Update position with lerp for smooth movement
    const targetPosition = new THREE.Vector3(
      robotState.position.x,
      robotState.position.y,
      robotState.position.z
    );
    
    modelRef.current.position.lerp(targetPosition, 0.1);
    
    // Update rotation with lerp for smooth rotation
    const targetRotation = Math.PI + robotState.rotation.y;
    modelRef.current.rotation.y += (targetRotation - modelRef.current.rotation.y) * 0.1;
    
    // Animate legs when moving
    if (isMoving) {
      const time = state.clock.getElapsedTime();
      model.traverse((child) => {
        if (child instanceof THREE.Mesh && child.name.toLowerCase().includes('leg')) {
          const isLeftLeg = child.name.toLowerCase().includes('left');
          const phase = isLeftLeg ? 0 : Math.PI;
          child.rotation.x = Math.sin(time * 8 + phase) * 0.3;
          child.position.y = Math.abs(Math.sin(time * 8 + phase)) * 0.1;
        }
      });
    }
  });
  
  if (!model) return null;
  
  return (
    <primitive
      ref={modelRef}
      object={model}
      position={[0, 0, 0]}
      rotation={[0, Math.PI, 0]}
      castShadow
      receiveShadow
    />
  );
};

useGLTF.preload('/models/spider-model/source/spider_robot.glb');

export default RobotModel;