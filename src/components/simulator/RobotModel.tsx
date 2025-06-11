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
  
  const velocityRef = useRef(new THREE.Vector3(0, 0, 0));
  const accelerationRef = useRef(new THREE.Vector3(0, 0, 0));
  const angularVelocityRef = useRef(0);
  const lastUpdateTimeRef = useRef(Date.now());
  const targetVelocityRef = useRef(new THREE.Vector3(0, 0, 0));
  const targetAngularVelocityRef = useRef(0);

  const { robotState, isMoving: storeIsMoving } = useRobotStore();
  const [isMoving, setIsMoving] = useState(false);
  const [currentAction, setCurrentAction] = useState<string | null>(null);

  const humanoidGLTF = useGLTF('/models/humanoid-robot/rusty_robot_walking_animated.glb');
  const spiderGLTF = useGLTF('/models/spider-model/source/spider_bot.glb');
  const tankGLTF = useGLTF('/models/tank-model/t-35_heavy_five-turret_tank.glb');
  const explorerGLTF = useGLTF('/models/explorer-bot/360_sphere_robot_no_glass.glb');

  const isSpider = robotConfig.type === 'spider';
  const isTank = robotConfig.type === 'tank';
  const isExplorer = robotConfig.type === 'explorer';

  const activeGLTF = isSpider 
    ? spiderGLTF 
    : isTank 
    ? tankGLTF 
    : isExplorer
    ? explorerGLTF
    : humanoidGLTF;

  const { scene, animations } = activeGLTF;

  const processedScene = React.useMemo(() => {
    return (isSpider || isTank || isExplorer) ? scene.clone() : scene;
  }, [scene, isSpider, isTank, isExplorer]);

  const { actions, mixer } = useAnimations(animations, processedScene);

  useEffect(() => {
    console.log(`🤖 ${isSpider ? 'Spider' : isTank ? 'Tank' : isExplorer ? 'Explorer' : 'Humanoid'} model loaded:`);
    console.log('Available animations:', animations?.map(anim => anim.name) || 'None');
    console.log('Available actions:', Object.keys(actions || {}));
    
    if (animations && animations.length > 0) {
      animations.forEach((clip, index) => {
        console.log(`Animation ${index}: "${clip.name}" - Duration: ${clip.duration}s`);
      });
    }
  }, [animations, actions, isSpider, isTank, isExplorer]);

  const animToPlay = React.useMemo(() => {
    if (!actions || Object.keys(actions).length === 0) {
      console.log('⚠️ No actions available');
      return null;
    }

    const allKeys = Object.keys(actions);

    if (isSpider) {
      const spiderAnimNames = ['walk', 'walking', 'Walk', 'Walking', 'walk_cycle', 'spider_walk', 'move', 'Move', 'locomotion', 'Locomotion'];
      for (const name of spiderAnimNames) {
        if (allKeys.includes(name)) {
          return name;
        }
      }
    }

    if (isTank) {
      const tankAnimNames = ['Scene', 'Take 001', 'Take001', 'Armature|Take 001', 'Armature|Take001', 'ArmatureAction', 'Action', 'drive', 'move', 'animation', 'default', 'Main'];
      for (const name of tankAnimNames) {
        if (allKeys.includes(name)) {
          return name;
        }
      }
    }

    if (isExplorer) {
      const explorerAnimNames = ['rotate', 'rolling', 'ExplorerSpin', 'Move'];
      for (const name of explorerAnimNames) {
        if (allKeys.includes(name)) {
          return name;
        }
      }
    }

    if (allKeys.includes('mixamo.com')) return 'mixamo.com';
    if (allKeys.length > 0) return allKeys[0];
    return null;
  }, [actions, isSpider, isTank, isExplorer]);

  useEffect(() => {
    if (!robotState) return;

    const currentPos = new THREE.Vector3(
      robotState.position.x,
      robotState.position.y,
      robotState.position.z
    );

    const distance = currentPos.distanceTo(lastPositionRef.current);
    movementThresholdRef.current = distance > 0.01 ? movementThresholdRef.current + 1 : 0;

    const positionBasedMoving = movementThresholdRef.current > 2;
    const shouldBeMoving = storeIsMoving || robotState.isMoving || positionBasedMoving;

    if (shouldBeMoving !== isMoving) {
      setIsMoving(shouldBeMoving);
      console.log(`🎭 Movement state changed: ${shouldBeMoving ? 'MOVING' : 'STOPPED'}`);
    }

    lastPositionRef.current.copy(currentPos);
  }, [robotState?.position, robotState?.isMoving, storeIsMoving, isMoving]);

  const stopAllActions = () => {
    if (!actions || !mixer) return;
    Object.values(actions).forEach((action) => {
      if (action?.isRunning()) {
        action.stop();
      }
    });
    setCurrentAction(null);
  };

  const switchAnimation = (name: string) => {
    if (!actions || !name || currentAction === name) return;
    const next = actions[name];
    if (!next) return;

    if (currentAction && actions[currentAction]?.isRunning()) {
      actions[currentAction].fadeOut(0.3);
    }

    next.reset().fadeIn(0.3).play();
    next.setLoop(THREE.LoopRepeat, Infinity);
    next.clampWhenFinished = false;
    const speedMultiplier = isSpider ? 1.2 : isTank ? 0.6 : isExplorer ? 1.0 : 0.8;
    next.setEffectiveTimeScale(speedMultiplier);
    setCurrentAction(name);
  };

  useEffect(() => {
    if (!actions || !animToPlay) return;

    if (isMoving) {
      if (currentAction !== animToPlay) {
        switchAnimation(animToPlay);
      }
    } else {
      if (currentAction && actions[currentAction]?.isRunning()) {
        stopAllActions();
      }
    }
  }, [isMoving, actions, animToPlay, currentAction]);

  useEffect(() => {
    return () => {
      stopAllActions();
    };
  }, [actions]);

  useFrame((_, delta) => {
    if (!robotState || !modelRef.current) return;

    if (mixer) {
      mixer.update(delta);
    }

    const targetPos = new THREE.Vector3(
      robotState.position.x,
      robotState.position.y,
      robotState.position.z
    );

    const currentPos = modelRef.current.position;
    const distance = currentPos.distanceTo(targetPos);
    
    if (isMoving && distance > 0.01) {
      const moveSpeed = Math.min(distance * 8, 0.25);
      prevPositionRef.current.lerp(targetPos, moveSpeed * delta * 60);
    } else if (!isMoving) {
      const stopSpeed = 0.08;
      prevPositionRef.current.lerp(targetPos, stopSpeed);
    } else {
      prevPositionRef.current.copy(targetPos);
    }

    modelRef.current.position.copy(prevPositionRef.current);

    const targetRot = robotState.rotation.y;
    const currentRot = modelRef.current.rotation.y;
    const rotDiff = targetRot - currentRot;
    const normalizedDiff = ((rotDiff + Math.PI) % (Math.PI * 2)) - Math.PI;
    const rotSpeed = isMoving ? 0.15 : 0.08;
    modelRef.current.rotation.y += normalizedDiff * rotSpeed;

    if (isMoving && currentAction) {
      const bobFrequency = isSpider ? 8 : isTank ? 2 : isExplorer ? 5 : 4;
      const bobAmplitude = isSpider ? 0.005 : isTank ? 0.002 : isExplorer ? 0.004 : 0.01;
      const bobOffset = Math.sin(Date.now() * 0.01 * bobFrequency) * bobAmplitude;
      modelRef.current.position.y = prevPositionRef.current.y + bobOffset;
    }
  });

  return (
    <primitive
      ref={modelRef}
      object={processedScene}
      position={[0, 0, 0]}
      rotation={[0, Math.PI, 0]}
      scale={
        isSpider
          ? [0.1, 0.1, 0.1]
          : isTank
          ? [0.3, 0.3, 0.3]
          : isExplorer
          ? [0.15, 0.15, 0.15]
          : [1, 1, 1]
      }
      castShadow
      receiveShadow
    />
  );
};

useGLTF.preload('/models/humanoid-robot/rusty_robot_walking_animated.glb');
useGLTF.preload('/models/spider-model/source/spider_bot.glb');
useGLTF.preload('/models/tank-model/t-35_heavy_five-turret_tank.glb');
useGLTF.preload('/models/explorer-bot/360_sphere_robot_no_glass.glb');

export default RobotModel;
