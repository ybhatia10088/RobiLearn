import React, { useRef, useEffect, useState } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { RobotConfig } from '@/types/robot.types';
import { useRobotStore } from '@/store/robotStore';

interface RobotModelProps {
  robotConfig: RobotConfig;
}

const RobotModel: React.FC<RobotModelProps> = ({ robotConfig }) => {
  const modelRef = useRef<THREE.Group>(null);
  const prevPositionRef = useRef(new THREE.Vector3(0, 0, 0));
  const lastPositionRef = useRef(new THREE.Vector3(0, 0, 0));
  const movementThresholdRef = useRef(0);

  const { robotState, isMoving: storeIsMoving } = useRobotStore();
  const [isMoving, setIsMoving] = useState(false);
  const [currentAction, setCurrentAction] = useState<string | null>(null);

  const spiderGLTF = useGLTF('/models/spider-model/source/spider_robot.glb');
  const humanoidGLTF = useGLTF('/models/humanoid-robot/rusty_robot_walking_animated.glb');

  const isSpider = robotConfig.type === 'spider';
  const activeGLTF = isSpider ? spiderGLTF : humanoidGLTF;
  const { scene, animations } = activeGLTF;

  const visualRoot = scene;
  const { actions, mixer } = useAnimations(animations, visualRoot);

  const getFallbackActionName = () => {
    const allKeys = Object.keys(actions);
    console.log('🎬 Available animation actions:', allKeys);

    if (allKeys.includes('mixamo.com')) return 'mixamo.com';
    if (allKeys.length > 0) return allKeys[0];
    return null;
  };

  const animToPlay = getFallbackActionName();

  // Updated effect to check both store flags AND position changes
  useEffect(() => {
    if (!robotState) return;

    const currentPos = new THREE.Vector3(
      robotState.position.x,
      robotState.position.y,
      robotState.position.z
    );

    const distance = currentPos.distanceTo(lastPositionRef.current);
    movementThresholdRef.current = distance > 0.01 ? movementThresholdRef.current + 1 : 0;

    // Check BOTH store movement flags AND position-based movement detection
    const positionBasedMoving = movementThresholdRef.current > 2;
    const shouldBeMoving = storeIsMoving || robotState.isMoving || positionBasedMoving;

    console.log('🚶 Movement check:', { 
      shouldBeMoving, 
      storeIsMoving, 
      robotStateIsMoving: robotState.isMoving, 
      positionBasedMoving,
      currentIsMoving: isMoving
    });

    if (shouldBeMoving !== isMoving) {
      console.log('🚶 Movement state changed from', isMoving, 'to', shouldBeMoving);
      setIsMoving(shouldBeMoving);
    }

    lastPositionRef.current.copy(currentPos);
  }, [robotState?.position, robotState?.isMoving, storeIsMoving, isMoving]);

  const stopAllActions = () => {
    if (!actions || !mixer) return;
    Object.values(actions).forEach((action) => {
      if (action?.isRunning()) action.stop();
    });
    setCurrentAction(null);
  };

  const switchAnimation = (name: string) => {
    if (!actions || !name || currentAction === name) return;
    const next = actions[name];
    if (!next) {
      console.warn(`⚠️ Animation "${name}" not found in actions.`);
      return;
    }

    if (currentAction && actions[currentAction]?.isRunning()) {
      actions[currentAction].fadeOut(0.2);
    }

    next.reset().fadeIn(0.2).play();
    setCurrentAction(name);
  };

  useEffect(() => {
    if (!actions || !animToPlay) return;

    if (isMoving) {
      if (currentAction !== animToPlay) {
        console.log('▶️ Triggering animation:', animToPlay);
        switchAnimation(animToPlay);
      }
    } else {
      if (currentAction && actions[currentAction]?.isRunning()) {
        console.log('⏹️ Stopping animation');
        stopAllActions();
      }
    }
  }, [isMoving, actions, isSpider, animToPlay, currentAction]);

  useEffect(() => {
    return () => stopAllActions();
  }, [actions]);

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

useGLTF.preload('/models/spider-model/source/spider_robot.glb');
useGLTF.preload('/models/humanoid-robot/rusty_robot_walking_animated.glb');

export default RobotModel;
