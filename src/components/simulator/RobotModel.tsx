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

  const { robotState } = useRobotStore();
  const [isMoving, setIsMoving] = useState(false);
  const [currentAction, setCurrentAction] = useState<string | null>(null);

  const spiderGLTF = useGLTF('/models/spider-model/source/spider_robot.glb');
  const humanoidGLTF = useGLTF('/models/humanoid-robot/rusty_robot_walking_animated.glb');

  const isSpider = robotConfig.type === 'spider';
  const activeGLTF = isSpider ? spiderGLTF : humanoidGLTF;
  const { scene, animations } = activeGLTF;

  const visualRoot = scene;
  const { actions, mixer } = useAnimations(animations, visualRoot);

  const animNames = animations.map((a, i) => a.name || `Unnamed_${i}`);
  const secondAnimName = animNames[1] || animNames[0];

  useEffect(() => {
    if (animations.length > 0) {
      console.log('🎞️ Available animations:');
      animNames.forEach((name, i) => {
        console.log(`#${i + 1}:`, name);
      });
    } else {
      console.warn('⚠️ No animations found in the model.');
    }
  }, [animations]);

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
      console.warn(`⚠️ Animation "${name}" not found`);
      return;
    }

    if (currentAction && actions[currentAction]?.isRunning()) {
      actions[currentAction].fadeOut(0.2);
    }

    next.reset().fadeIn(0.2).play();
    setCurrentAction(name);
  };

  useEffect(() => {
    if (!robotState) return;

    const currentPos = new THREE.Vector3(
      robotState.position.x,
      robotState.position.y,
      robotState.position.z
    );

    const distance = currentPos.distanceTo(lastPositionRef.current);
    movementThresholdRef.current = distance > 0.01 ? movementThresholdRef.current + 1 : 0;

    const shouldBeMoving = movementThresholdRef.current > 2;
    if (shouldBeMoving !== isMoving) {
      setIsMoving(shouldBeMoving);
    }

    lastPositionRef.current.copy(currentPos);
  }, [robotState?.position, isMoving]);

  useEffect(() => {
    if (!actions || isSpider) return;

    if (isMoving) {
      if (secondAnimName && currentAction !== secondAnimName) {
        switchAnimation(secondAnimName);
      }
    } else {
      if (currentAction && actions[currentAction]?.isRunning()) {
        stopAllActions();
      }
    }
  }, [isMoving, actions, isSpider, secondAnimName]);

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
