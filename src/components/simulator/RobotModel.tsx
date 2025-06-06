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
  const droneGLTF = useGLTF('/models/drone-model/drone.glb');

  const isDrone = robotConfig.type === 'drone';
  const activeGLTF = isDrone ? droneGLTF : spiderGLTF;
  const { scene } = activeGLTF;

  const visualRoot = useMemo(() => {
    const clone = SkeletonUtils.clone(scene) as THREE.Group;

    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    if (isDrone) {
      clone.scale.set(1.5, 1.5, 1.5); // Smaller scale for drone
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
      // For drone, only play idle/hover animations, avoid takeoff/landing
      const droneIdleAnimation = names.find((name) => 
        /idle|hover|float|stationary/i.test(name) && 
        !/takeoff|landing|land|take_off/i.test(name)
      );
      
      if (droneIdleAnimation && actions[droneIdleAnimation]) {
        actions[droneIdleAnimation].reset().fadeIn(0.3).play();
        setCurrentAction(droneIdleAnimation);
      }
      // If no specific idle animation found, don't play any animation
    } else {
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

    if (isMoving) {
      prevPositionRef.current.lerp(targetPosition, 0.15);
    } else {
      prevPositionRef.current.copy(targetPosition);
    }

    // Handle position updates differently for drone vs spider
    if (isDrone) {
      // For drone: Set position directly without any animations or offsets
      modelRef.current.position.set(
        prevPositionRef.current.x,
        prevPositionRef.current.y,
        prevPositionRef.current.z
      );
    } else {
      // For spider: Use normal position copy, then apply breathing if idle
      modelRef.current.position.copy(prevPositionRef.current);
      
      if (!isMoving) {
        breathingOffsetRef.current += delta;
        const offset = Math.sin(breathingOffsetRef.current * 2.1) * 0.002;
        modelRef.current.position.y = prevPositionRef.current.y + offset;
      }
    }

    const targetRotation = robotState.rotation.y;
    modelRef.current.rotation.y += (targetRotation - modelRef.current.rotation.y) * 0.12;
  });

  return (
    <primitive
      ref={modelRef}
      object={visualRoot}
      position={[0, 0, 0]}
      rotation={isDrone ? [0, 0, 0] : [0, Math.PI, 0]} // No rotation for drone, keep spider rotation
      castShadow
      receiveShadow
    />
  );
};

useGLTF.preload('/models/spider-model/source/spider_robot.glb');
useGLTF.preload('/models/drone-model/drone.glb');

export default RobotModel;