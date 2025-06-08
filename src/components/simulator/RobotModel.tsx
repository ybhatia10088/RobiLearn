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

  const visualRoot = useMemo(() => {
    const clone = SkeletonUtils.clone(scene) as THREE.Group;
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    clone.scale.set(0.5, 0.5, 0.5);
    return clone;
  }, [scene]);

  const { actions, names, mixer } = useAnimations(animations, visualRoot);

  const getAnimationName = (type: 'idle' | 'walk') => {
    if (!names || names.length === 0) return '';
    if (type === 'idle') {
      return names.find((n) =>
        /^idle$/i.test(n) || /idle|stand|breath|rest/i.test(n)
      ) || names[0] || '';
    } else {
      return names.find((n) =>
        /^walk$/i.test(n) || /walk|move|run|step|locomotion/i.test(n)
      ) || names[1] || '';
    }
  };

  const idleName = getAnimationName('idle');
  const walkName = getAnimationName('walk');

  const stopAllActions = () => {
    if (!actions || !mixer) return;
    Object.keys(actions).forEach((name) => {
      const action = actions[name];
      if (action?.isRunning()) action.stop();
    });
    setCurrentAction(null);
  };

  const switchAnimation = (name: string) => {
    if (!actions || !name || !mixer || currentAction === name) return;
    if (currentAction && actions[currentAction]?.isRunning()) {
      actions[currentAction].stop();
    }
    const newAction = actions[name];
    if (newAction) {
      newAction.reset();
      newAction.setLoop(THREE.LoopRepeat, Infinity);
      newAction.clampWhenFinished = false;
      newAction.enabled = true;
      newAction.timeScale = 1;
      newAction.play();
      setCurrentAction(name);
    }
  };

  useEffect(() => {
    if (isSpider) return;
    stopAllActions();
    setIsMoving(false);
    movementThresholdRef.current = 0;
    setCurrentAction(null);
  }, [isSpider]);

  useEffect(() => {
    if (!actions || !names.length || isSpider || !mixer) return;
    if (idleName && actions[idleName]) {
      const idleAction = actions[idleName];
      idleAction.setLoop(THREE.LoopRepeat, Infinity);
      idleAction.clampWhenFinished = false;
      idleAction.enabled = true;
      idleAction.play();
      setCurrentAction(idleName);
    }
  }, [actions, names, isSpider, idleName, mixer]);

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
    if (!actions || !names.length || isSpider) return;
    const selectedName = isMoving ? walkName : idleName;
    if (selectedName) {
      switchAnimation(selectedName);
    }
  }, [actions, names, isMoving, isSpider, walkName, idleName]);

  useEffect(() => {
    return () => {
      if (actions) {
        Object.values(actions).forEach((action) => {
          if (action?.isRunning()) action.stop();
        });
      }
      visualRoot.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry?.dispose();
          if (child.material instanceof THREE.Material) child.material.dispose();
        }
      });
    };
  }, [visualRoot, actions]);

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

    if (!isMoving && !isSpider) {
      breathingOffsetRef.current += delta;
      const offset = Math.sin(breathingOffsetRef.current * 2.1) * 0.002;
      modelRef.current.position.y = prevPositionRef.current.y + offset;
    }

    const targetRot = robotState.rotation.y;
    modelRef.current.rotation.y += (targetRot - modelRef.current.rotation.y) * 0.12;
  });

  return (
    <group
      onClick={() => {
        if (!isSpider) {
          setIsMoving(true);
          setTimeout(() => setIsMoving(false), 3000);
        }
      }}
    >
      <primitive
        ref={modelRef}
        object={visualRoot}
        position={[0, 0, 0]}
        rotation={[0, Math.PI, 0]}
        castShadow
        receiveShadow
      />
    </group>
  );
};

useGLTF.preload('/models/spider-model/source/spider_robot.glb');
useGLTF.preload('/models/humanoid-robot/animated_humanoid_robot.glb');

export default RobotModel;
