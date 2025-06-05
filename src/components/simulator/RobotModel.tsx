import React, { useRef, useEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { RobotConfig } from '@/types/robot.types';
import { useRobotStore } from '@/store/robotStore';
import { SkeletonUtils } from 'three-stdlib';

interface RobotModelProps {
  robotConfig: RobotConfig;
}

const RobotModel: React.FC<RobotModelProps> = ({ robotConfig }) => {
  const modelRef = useRef<THREE.Group>(null);
  const prevPositionRef = useRef(new THREE.Vector3(0, 0, 0));
  const { robotState, isMoving } = useRobotStore();

  // Load and clone the GLB model safely
  const { scene } = useGLTF('/models/spider-model/source/spider_robot.glb');
  const model = useMemo(() => {
    const cloned = SkeletonUtils.clone(scene) as THREE.Group;

    cloned.name = 'SpiderRoot';

    cloned.traverse((child) => {
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

    cloned.scale.set(0.5, 0.5, 0.5);
    return cloned;
  }, [scene]);

  // Clean up model resources
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

  // Animate position, rotation, and legs
  useFrame((state) => {
    if (!robotState || !modelRef.current) return;

    // Smooth position update
    const targetPos = new THREE.Vector3(
      robotState.position.x,
      robotState.position.y,
      robotState.position.z
    );

    prevPositionRef.current.lerp(targetPos, 0.2);
    modelRef.current.position.copy(prevPositionRef.current);

    // Smooth rotation update
    const targetRotation = Math.PI + robotState.rotation.y;
    modelRef.current.rotation.y += (targetRotation - modelRef.current.rotation.y) * 0.1;

    // Leg animation
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

// Preload spider robot GLB
useGLTF.preload('/models/spider-model/source/spider_robot.glb');

export default RobotModel;
