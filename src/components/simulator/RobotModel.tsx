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
  const lastPositionRef = useRef(new THREE.Vector3(0, 0, 0));
  const movementThresholdRef = useRef(0);
  const { robotState } = useRobotStore();
  const [currentAction, setCurrentAction] = useState<string | null>(null);
  const [isMoving, setIsMoving] = useState(false);

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

  // Enhanced animation name detection for humanoid models
  const getAnimationName = (type: 'idle' | 'walk') => {
    if (!names || names.length === 0) return '';
    
    // Log available animations for debugging
    console.log(`Available animations for ${isSpider ? 'spider' : 'humanoid'}:`, names);
    
    if (type === 'idle') {
      return names.find((n) => 
        /^idle$/i.test(n) || 
        /idle/i.test(n) || 
        /stand/i.test(n) ||
        /breathing/i.test(n) ||
        /rest/i.test(n)
      ) || names[0] || '';
    } else {
      return names.find((n) => 
        /^walk$/i.test(n) || 
        /walk/i.test(n) || 
        /move/i.test(n) ||
        /run/i.test(n) ||
        /step/i.test(n) ||
        /locomotion/i.test(n)
      ) || names[1] || '';
    }
  };

  const idleName = getAnimationName('idle');
  const walkName = getAnimationName('walk');

  // Stop all actions helper
  const stopAllActions = () => {
    if (!actions) return;
    names.forEach((name) => {
      const action = actions[name];
      if (action && action.isRunning()) {
        action.stop();
      }
    });
    setCurrentAction(null);
  };

  const switchAnimation = (name: string) => {
    if (!actions || !name || currentAction === name) return;

    console.log(`Switching animation to: ${name}`);

    // Stop any previous action with fade out
    if (currentAction && actions[currentAction]) {
      actions[currentAction].fadeOut(0.3);
    }

    // Start the new action
    const newAction = actions[name];
    if (newAction) {
      newAction.reset().fadeIn(0.3).play();
      newAction.setLoop(THREE.LoopRepeat, Infinity);
      setCurrentAction(name);
    }
  };

  // Detect movement based on position changes
  useEffect(() => {
    if (!robotState) return;

    const currentPos = new THREE.Vector3(
      robotState.position.x,
      robotState.position.y,
      robotState.position.z
    );

    const distance = currentPos.distanceTo(lastPositionRef.current);
    
    // Update movement threshold
    movementThresholdRef.current = distance > 0.01 ? movementThresholdRef.current + 1 : 0;
    
    // Set moving state based on consistent movement
    const shouldBeMoving = movementThresholdRef.current > 2;
    
    if (shouldBeMoving !== isMoving) {
      setIsMoving(shouldBeMoving);
      console.log(`Movement state changed: ${shouldBeMoving ? 'moving' : 'idle'}`);
    }

    lastPositionRef.current.copy(currentPos);
  }, [robotState?.position, isMoving]);

  // On mount or when switching between spider and humanoid, stop all actions
  useEffect(() => {
    stopAllActions();
    setIsMoving(false);
    movementThresholdRef.current = 0;
  }, [isSpider]);

  // Play idle or walk based on isMoving
  useEffect(() => {
    if (!actions || !names.length) return;
    
    // Skip animation switching for spider models to avoid interference
    if (isSpider) return;
    
    const selectedName = isMoving ? walkName : idleName;
    console.log(`Animation selection: ${isMoving ? 'walking' : 'idle'} -> ${selectedName}`);
    
    if (selectedName) {
      switchAnimation(selectedName);
    }
  }, [actions, names, isMoving, isSpider, walkName, idleName]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mixer) {
        mixer.stopAllAction();
      }
      visualRoot.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (child.material instanceof THREE.Material) child.material.dispose();
        }
      });
    };
  }, [visualRoot, mixer]);

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

    // Apply breathing effect only when idle and not spider
    if (!isMoving && !isSpider) {
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