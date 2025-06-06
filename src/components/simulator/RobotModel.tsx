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
  const breathingOffsetRef = useRef(0);
  const { robotState, isMoving } = useRobotStore();
  const [currentAction, setCurrentAction] = useState<string | null>(null);

  const spiderGLTF = useGLTF('/models/spider-model/source/spider_robot.glb');
  const droneGLTF = useGLTF('/models/drone-model/animated_drone.glb');

  const isDrone = robotConfig.type === 'drone';
  const activeGLTF = isDrone ? droneGLTF : spiderGLTF;
  const { scene } = activeGLTF;

  // ✅ Clone the full scene to preserve hierarchy
  const visualRoot = useMemo(() => {
    const clone = SkeletonUtils.clone(scene) as THREE.Group;

    // Enable shadows
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    // Apply scale
    if (isDrone) {
      clone.scale.set(4, 4, 4); // Adjust as needed
    } else {
      clone.scale.set(0.5, 0.5, 0.5);
    }

    return clone;
  }, [scene, isDrone]);

  const { actions, names, mixer } = useAnimations(activeGLTF.animations, visualRoot);

  const idleName = names.find((n) => /idle/i.test(n)) || names[0];
  const walkName = names.find((n) => /walk|move|run/i.test(n)) || names[1];

  const switchAnimation = (name: string) => {
    if (!actions || currentAction === name) return;

    const newAction = actions[name];
    const oldAction = currentAction ? actions[currentAction] : null;

    if (oldAction && newAction && oldAction !== newAction) {
      oldAction.fadeOut(0.4);
      newAction.reset().fadeIn(0.4).play();
    } else if (newAction && !oldAction) {
      newAction.reset().fadeIn(0.4).play();
    }

    setCurrentAction(name);
  };

  useEffect(() => {
    if (!actions) return;

    if (isDrone) {
      // ✅ Play all drone animations (e.g. propellers)
      names.forEach((name) => {
        const action = actions[name];
        if (action) action.reset().fadeIn(0.3).play();
      });
    } else {
      // 🕷 Use idle/walk logic for spider
      isMoving ? switchAnimation(walkName) : switchAnimation(idleName);
    }
  }, [actions, names, isDrone, isMoving]);

  useEffect(() => {
    return () => {
      visualRoot.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (child.material instanceof THREE.Material) {
            child.material.dispose();
          }
        }
      });
    };
  }, [visualRoot]);

  useFrame((state, delta) => {
    if (!robotState || !modelRef.current) return;

    mixer?.update(delta);

    const targetPosition = new THREE.Vector3(
      robotState.position.x,
      robotState.position.y,
      robotState.position.z
    );
    prevPositionRef.current.lerp(targetPosition, 0.15);
    modelRef.current.position.copy(prevPositionRef.current);

    const targetRotation = robotState.rotation.y;
    modelRef.current.rotation.y += (targetRotation - modelRef.current.rotation.y) * 0.12;

    if (!isDrone && !isMoving) {
      breathingOffsetRef.current += delta;
      const offset = Math.sin(breathingOffsetRef.current * 2.1) * 0.002;
      modelRef.current.position.y = prevPositionRef.current.y + offset;
    } else {
      modelRef.current.position.y = prevPositionRef.current.y;
    }
  });

  return (
    <primitive
      ref={modelRef}
      object={visualRoot}
      position={[0, 0, 0]}
      rotation={[0, Math.PI, 0]}
      castShadow
      receiveShadow
    />
  );
};

// ✅ Preload both models
useGLTF.preload('/models/spider-model/source/spider_robot.glb');
useGLTF.preload('/models/drone-model/animated_drone.glb');

export default RobotModel;
