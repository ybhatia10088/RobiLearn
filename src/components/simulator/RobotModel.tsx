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
  const [currentAction, setCurrentAction] = useState<string | null>(null);
  const [isMoving, setIsMoving] = useState(false);

  const spiderGLTF = useGLTF('/models/spider-model/source/spider_robot.glb');
  const humanoidGLTF = useGLTF('/models/humanoid-robot/animated_humanoid_robot.glb');

  const isSpider = robotConfig.type === 'spider';
  const activeGLTF = isSpider ? spiderGLTF : humanoidGLTF;
  const { scene, animations } = activeGLTF;

  // Use the original scene to preserve skeleton binding
  const { actions, names, mixer } = useAnimations(animations, scene);
  const visualRoot = scene;

  const runName = 'RUN'; // <-- updated

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
    } else {
      console.warn("Animation not found:", name);
    }
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
      switchAnimation(runName);
    }
  }, [actions, isMoving, isSpider, runName]);

  useEffect(() => {
    return () => {
      if (actions) {
        Object.values(actions).forEach((action) => {
          if (action?.isRunning()) action.stop();
        });
      }
    };
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
    <group
      onClick={() => {
        if (!isSpider) {
          console.log("CLICK: play RUN");
          setIsMoving(true);
          setTimeout(() => {
            console.log("STOP RUN");
            setIsMoving(false);
            stopAllActions();
          }, 3000);
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
