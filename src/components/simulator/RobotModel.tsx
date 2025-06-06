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
  const humanoidGLTF = useGLTF('/models/humanoid-robot/animated_humanoid_robot.glb');

  const isSpider = robotConfig.type === 'spider';
  const activeGLTF = isSpider ? spiderGLTF : humanoidGLTF;
  const { scene, animations } = activeGLTF;

  // Clone the scene graph, set shadows, and scale
  const visualRoot = useMemo(() => {
    const clone = SkeletonUtils.clone(scene) as THREE.Group;

    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    // Adjust scale for humanoid or spider as needed
    clone.scale.set(0.5, 0.5, 0.5);
    return clone;
  }, [scene]);

  // Hook into animations on the cloned root
  const { actions, names, mixer } = useAnimations(animations, visualRoot);

  // Identify idle and walk animation names (case-insensitive)
  const idleName =
    names.find((n) => /^idle$/i.test(n) || /idle/i.test(n)) ||
    names[0] ||
    '';
  const walkName =
    names.find((n) => /^walk$/i.test(n) || /walk/i.test(n) || /move/i.test(n)) ||
    names[1] ||
    '';

  // Stop all actions helper
  const stopAllActions = () => {
    if (!actions) return;
    names.forEach((name) => {
      const action = actions[name];
      if (action && action.isRunning()) action.stop();
    });
    setCurrentAction(null);
  };

  const switchAnimation = (name: string) => {
    if (!actions || currentAction === name) return;

    // Stop any previous action
    if (currentAction && actions[currentAction]) {
      actions[currentAction].fadeOut(0.2);
    }

    // Start the new action
    const newAction = actions[name];
    if (newAction) {
      newAction.reset().fadeIn(0.2).play();
      setCurrentAction(name);
    }
  };

  // On mount or when switching between spider and humanoid, stop all actions
  useEffect(() => {
    stopAllActions();
  }, [isSpider]);

  // Play idle or walk based on isMoving
  useEffect(() => {
    if (!actions || !names.length) return;
    // Uncomment to debug animation names:
    // console.log('Loaded animations for humanoid/spider:', names);

    const selectedName = isMoving ? walkName : idleName;
    if (selectedName) {
      switchAnimation(selectedName);
    }
  }, [actions, names, isMoving]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      visualRoot.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (child.material instanceof THREE.Material) child.material.dispose();
        }
      });
    };
  }, [visualRoot]);

  // Update position, rotation, and idle breathing
  useFrame((_, delta) => {
    if (!robotState || !modelRef.current) return;

    mixer?.update(delta);

    const targetPos = new THREE.Vector3(
      robotState.position.x,
      robotState.position.y,
      robotState.position.z
    );

    if (isMoving) {
      prevPositionRef.current.lerp(targetPos, 0.15);
    } else {
      prevPositionRef.current.copy(targetPos);
    }

    modelRef.current.position.copy(prevPositionRef.current);

    if (!isMoving) {
      breathingOffsetRef.current += delta;
      const offset = Math.sin(breathingOffsetRef.current * 2.1) * 0.002;
      modelRef.current.position.y = prevPositionRef.current.y + offset;
    }

    const targetRot = robotState.rotation.y;
    modelRef.current.rotation.y += (targetRot - modelRef.current.rotation.y) * 0.12;
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

// Preload both models for performance
useGLTF.preload('/models/spider-model/source/spider_robot.glb');
useGLTF.preload('/models/humanoid-robot/animated_humanoid_robot.glb');

export default RobotModel;
