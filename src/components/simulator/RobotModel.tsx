import React, { useRef, useEffect, useMemo, useState } from 'react';
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
  const [currentAction, setCurrentAction] = useState<string | null>(null);

  const gltf = useGLTF('/models/spider-model/source/spider_robot.glb');
  const scene = useMemo(() => SkeletonUtils.clone(gltf.scene) as THREE.Group, [gltf.scene]);
  const { actions, names, mixer } = useAnimations(gltf.animations, scene);

  // Identify idle/walk animation clips heuristically
  const idleName = names.find((n) => /idle/i.test(n)) || names[0];
  const walkName = names.find((n) => /walk|move|run/i.test(n)) || names[1];

  // Handle animation switching with fade
  const switchAnimation = (name: string) => {
    if (!actions || !name || currentAction === name) return;

    const newAction = actions[name];
    const oldAction = currentAction ? actions[currentAction] : null;

    if (oldAction && newAction && oldAction !== newAction) {
      oldAction.fadeOut(0.3);
      newAction.reset().fadeIn(0.3).play();
    } else if (newAction && !oldAction) {
      newAction.reset().fadeIn(0.3).play();
    }

    setCurrentAction(name);
  };

  // Trigger animation based on movement state
  useEffect(() => {
    if (!actions) return;
    if (isMoving) {
      switchAnimation(walkName);
    } else {
      switchAnimation(idleName);
    }
  }, [isMoving, walkName, idleName, actions]);

  // Clean up model
  useEffect(() => {
    return () => {
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (child.material instanceof THREE.Material) {
            child.material.dispose();
          }
        }
      });
    };
  }, [scene]);

  // Animate position and mixer
  useFrame((state, delta) => {
    if (!robotState || !modelRef.current) return;

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
