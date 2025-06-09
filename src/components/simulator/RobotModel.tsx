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
  
  // Physics-based movement state
  const velocityRef = useRef(new THREE.Vector3(0, 0, 0));
  const accelerationRef = useRef(new THREE.Vector3(0, 0, 0));
  const angularVelocityRef = useRef(0);
  const lastUpdateTimeRef = useRef(Date.now());
  const targetVelocityRef = useRef(new THREE.Vector3(0, 0, 0));
  const targetAngularVelocityRef = useRef(0);

  const { robotState, isMoving: storeIsMoving } = useRobotStore();
  const [isMoving, setIsMoving] = useState(false);
  const [currentAction, setCurrentAction] = useState<string | null>(null);

  // Load both models
  const humanoidGLTF = useGLTF('/models/humanoid-robot/rusty_robot_walking_animated.glb');
  const spiderGLTF = useGLTF('/models/spider-model/source/spider_bot.glb');

  const isSpider = robotConfig.type === 'spider';
  const activeGLTF = isSpider ? spiderGLTF : humanoidGLTF;
  const { scene, animations } = activeGLTF;
  
  // Clone the scene only if needed to avoid sharing between instances
  const processedScene = React.useMemo(() => {
    // Clone for spider to avoid conflicts, use original for humanoid
    return isSpider ? scene.clone() : scene;
  }, [scene, isSpider]);
  
  const { actions, mixer } = useAnimations(animations, processedScene);

  // Debug: Log available animations
  useEffect(() => {
    console.log(`🤖 ${isSpider ? 'Spider' : 'Humanoid'} model loaded:`);
    console.log('Available animations:', animations?.map(anim => anim.name) || 'None');
    console.log('Available actions:', Object.keys(actions || {}));
    
    if (animations && animations.length > 0) {
      animations.forEach((clip, index) => {
        console.log(`Animation ${index}: "${clip.name}" - Duration: ${clip.duration}s`);
      });
    }
  }, [animations, actions, isSpider]);

  // Improved animation selection logic
  const animToPlay = React.useMemo(() => {
    if (!actions || Object.keys(actions).length === 0) {
      console.log('⚠️ No actions available');
      return null;
    }

    const allKeys = Object.keys(actions);
    console.log('All available action keys:', allKeys);

    // Try common spider animation names first
    if (isSpider) {
      const spiderAnimNames = [
        'walk',
        'walking',
        'Walk',
        'Walking',
        'walk_cycle',
        'spider_walk',
        'move',
        'Move',
        'locomotion',
        'Locomotion'
      ];
      
      for (const name of spiderAnimNames) {
        if (allKeys.includes(name)) {
          console.log(`✅ Found spider animation: ${name}`);
          return name;
        }
      }
    }

    // Fallback: try mixamo.com or first available
    if (allKeys.includes('mixamo.com')) {
      console.log('✅ Using mixamo.com animation');
      return 'mixamo.com';
    }
    
    if (allKeys.length > 0) {
      console.log(`✅ Using first available animation: ${allKeys[0]}`);
      return allKeys[0];
    }

    console.log('❌ No suitable animation found');
    return null;
  }, [actions, isSpider]);

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
    console.log('🛑 Stopping all animations');
    Object.values(actions).forEach((action) => {
      if (action?.isRunning()) {
        console.log(`Stopping action: ${action.getClip().name}`);
        action.stop();
      }
    });
    setCurrentAction(null);
  };

  const switchAnimation = (name: string) => {
    if (!actions || !name || currentAction === name) return;
    
    const next = actions[name];
    if (!next) {
      console.warn(`⚠️ Animation "${name}" not found in actions.`);
      console.log('Available actions:', Object.keys(actions));
      return;
    }

    console.log(`🎬 Switching to animation: ${name}`);

    // Stop current animation with fade out
    if (currentAction && actions[currentAction]?.isRunning()) {
      console.log(`Fading out: ${currentAction}`);
      actions[currentAction].fadeOut(0.3);
    }

    // Start new animation with fade in
    next.reset().fadeIn(0.3).play();
    
    // Set animation properties for better looping and realistic speed
    next.setLoop(THREE.LoopRepeat, Infinity);
    next.clampWhenFinished = false;
    
    // Adjust animation speed based on robot type for more realism
    const speedMultiplier = isSpider ? 1.2 : 0.8; // Spiders move faster, humanoids more deliberate
    next.setEffectiveTimeScale(speedMultiplier);
    
    setCurrentAction(name);
    console.log(`✅ Animation "${name}" started with speed: ${speedMultiplier}`);
  };

  useEffect(() => {
    if (!actions || !animToPlay) {
      console.log('⚠️ No actions or animation to play available');
      return;
    }

    console.log(`🎭 Movement state: ${isMoving}, Current action: ${currentAction}, Animation to play: ${animToPlay}`);

    if (isMoving) {
      if (currentAction !== animToPlay) {
        console.log(`Starting movement animation: ${animToPlay}`);
        switchAnimation(animToPlay);
      }
    } else {
      if (currentAction && actions[currentAction]?.isRunning()) {
        console.log('Stopping animation - robot not moving');
        stopAllActions();
      }
    }
  }, [isMoving, actions, animToPlay, currentAction]);

  // Cleanup on unmount or when actions change
  useEffect(() => {
    return () => {
      console.log('🧹 Cleaning up animations');
      stopAllActions();
    };
  }, [actions]);

  useFrame((_, delta) => {
    if (!robotState || !modelRef.current) return;
    
    // Update animation mixer
    if (mixer) {
      mixer.update(delta);
    }

    const targetPos = new THREE.Vector3(
      robotState.position.x,
      robotState.position.y,
      robotState.position.z
    );

    // More realistic movement interpolation
    const currentPos = modelRef.current.position;
    const distance = currentPos.distanceTo(targetPos);
    
    if (isMoving && distance > 0.01) {
      // Smoother, more realistic movement with acceleration/deceleration
      const moveSpeed = Math.min(distance * 8, 0.25); // Dynamic speed based on distance
      prevPositionRef.current.lerp(targetPos, moveSpeed * delta * 60);
    } else if (!isMoving) {
      // Gradual stop with deceleration
      const stopSpeed = 0.08;
      prevPositionRef.current.lerp(targetPos, stopSpeed);
    } else {
      // Snap to target if very close
      prevPositionRef.current.copy(targetPos);
    }

    modelRef.current.position.copy(prevPositionRef.current);
    
    // More realistic rotation with momentum
    const targetRot = robotState.rotation.y;
    const currentRot = modelRef.current.rotation.y;
    const rotDiff = targetRot - currentRot;
    
    // Handle rotation wrapping (shortest path)
    const normalizedDiff = ((rotDiff + Math.PI) % (Math.PI * 2)) - Math.PI;
    const rotSpeed = isMoving ? 0.15 : 0.08; // Faster rotation when moving
    
    modelRef.current.rotation.y += normalizedDiff * rotSpeed;
    
    // Add subtle bobbing animation for more realistic walking
    if (isMoving && currentAction) {
      const bobFrequency = isSpider ? 8 : 4; // Spiders move legs faster
      const bobAmplitude = isSpider ? 0.005 : 0.01;
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
      scale={isSpider ? [0.1, 0.1, 0.1] : [1, 1, 1]}
      castShadow
      receiveShadow
    />
  );
};

// Preload both models
useGLTF.preload('/models/humanoid-robot/rusty_robot_walking_animated.glb');
useGLTF.preload('/models/spider-model/source/spider_bot.glb');

export default RobotModel;