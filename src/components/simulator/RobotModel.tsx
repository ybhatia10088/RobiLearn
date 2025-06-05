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
  const scene = useMemo(() => SkeletonUtils.clone(gltf.scene) as THREE.Group, [gltf.scene]);
  const { actions, mixer, names } = useAnimations(gltf.animations, scene);

  // Play animation when isMoving === true
  useEffect(() => {
    if (!actions || !names.length) return;

    const idleAction = actions[names[0]];

    if (isMoving && idleAction) {
      idleAction.reset().fadeIn(0.3).play();
    } else {
      idleAction?.fadeOut(0.3);
    }

    return () => {
      idleAction?.stop();
    };
  }, [isMoving, actions, names]);

  // Cleanup geometry/material
  useEffect(() => {
    return () => {
      if (scene) {
        scene.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.geometry.dispose();
            if (child.material instanceof THREE.Material) {
              child.material.dispose();
            }
          }
        });
      }
    };
  }, [scene]);

  // Apply smooth movement/rotation
  useFrame((state, delta) => {
    if (!robotState || !modelRef.current) return;

    // Animate GLTF mixer
    mixer?.update(delta);

    const targetPosition = new THREE.Vector3(
      robotState.position.x,
      robotState.position.y,
      robotState.position.z
    );
    prevPositionRef.current.lerp(targetPosition, 0.2);
    modelRef.current.position.copy(prevPositionRef.current);

    const targetRotation = Math.PI + robotState.rotation.y;
    modelRef.current.rotation.y += (targetRotation - modelRef.current.rotation.y) * 0.1;
  });

  if (!scene) return null;

  return (
    <primitive
      ref={modelRef}
      object={scene}
      position={[0, 0, 0]}
      rotation={[0, Math.PI, 0]}
      castShadow
      receiveShadow
    />
  );
};

useGLTF.preload('/models/spider-model/source/spider_robot.glb');

export default RobotModel;
