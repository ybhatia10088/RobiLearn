import React, { useRef, useEffect, useMemo } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
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

  // Load model and animations
  const gltf = useGLTF('/models/spider-model/source/spider_robot.glb');
  const clonedScene = useMemo(() => SkeletonUtils.clone(gltf.scene) as THREE.Group, [gltf.scene]);
  const { actions, names, mixer } = useAnimations(gltf.animations, clonedScene);

  // Play or stop all animations based on movement
  useEffect(() => {
    if (!actions || names.length === 0) return;

    names.forEach((name) => {
      const action = actions[name];
      if (!action) return;

      if (isMoving) {
        action.reset().fadeIn(0.3).play();
      } else {
        action.fadeOut(0.3);
      }
    });

    return () => {
      names.forEach((name) => actions[name]?.stop());
    };
  }, [isMoving, actions, names]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      clonedScene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (child.material instanceof THREE.Material) {
            child.material.dispose();
          }
        }
      });
    };
  }, [clonedScene]);

  // Smooth movement & animate mixer
  useFrame((state, delta) => {
    if (!robotState || !modelRef.current) return;

    // Animate mixer
    mixer?.update(delta);

    // Position
    const targetPosition = new THREE.Vector3(
      robotState.position.x,
      robotState.position.y,
      robotState.position.z
    );
    prevPositionRef.current.lerp(targetPosition, 0.2);
    modelRef.current.position.copy(prevPositionRef.current);

    // Rotation
    const targetRotation = Math.PI + robotState.rotation.y;
    modelRef.current.rotation.y += (targetRotation - modelRef.current.rotation.y) * 0.1;
  });

  if (!clonedScene) return null;

  return (
    <primitive
      ref={modelRef}
      object={clonedScene}
      position={[0, 0, 0]}
      rotation={[0, Math.PI, 0]}
      castShadow
      receiveShadow
    />
  );
};

useGLTF.preload('/models/spider-model/source/spider_robot.glb');

export default RobotModel;
