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

    const currentTime = Date.now();
    const realDelta = Math.min((currentTime - lastUpdateTimeRef.current) / 1000, 0.016); // Cap at 60fps
    lastUpdateTimeRef.current = currentTime;

    // Physics constants based on robot type
    const robotMass = isSpider ? 0.5 : 2.0; // kg
    const maxSpeed = isSpider ? 3.0 : 1.5; // m/s
    const acceleration = isSpider ? 8.0 : 4.0; // m/s²
    const deceleration = isSpider ? 12.0 : 6.0; // m/s²
    const angularAcceleration = isSpider ? 8.0 : 3.0; // rad/s²
    const maxAngularSpeed = isSpider ? 4.0 : 2.0; // rad/s
    const friction = isSpider ? 0.85 : 0.75; // friction coefficient
    const groundContactForce = robotMass * 9.81; // Normal force

    const targetPos = new THREE.Vector3(
      robotState.position.x,
      robotState.position.y,
      robotState.position.z
    );

    const currentPos = modelRef.current.position.clone();
    const positionDiff = targetPos.clone().sub(currentPos);
    const distance = positionDiff.length();

    // Calculate target velocity based on movement state
    if (isMoving && distance > 0.001) {
      const direction = positionDiff.normalize();
      const desiredSpeed = Math.min(distance * 5, maxSpeed);
      targetVelocityRef.current = direction.multiplyScalar(desiredSpeed);
    } else {
      targetVelocityRef.current.set(0, 0, 0);
    }

    // Apply acceleration/deceleration with physics
    const velocityDiff = targetVelocityRef.current.clone().sub(velocityRef.current);
    const currentAcceleration = isMoving ? acceleration : deceleration;
    
    // Limit acceleration based on friction and contact force
    const maxAccelerationForce = friction * groundContactForce / robotMass;
    const accelerationMagnitude = Math.min(currentAcceleration, maxAccelerationForce);
    
    if (velocityDiff.length() > 0.001) {
      const accelerationVector = velocityDiff.normalize().multiplyScalar(accelerationMagnitude * realDelta);
      velocityRef.current.add(accelerationVector);
    }

    // Apply velocity damping when not moving
    if (!isMoving) {
      velocityRef.current.multiplyScalar(Math.pow(0.1, realDelta));
    }

    // Limit velocity to max speed
    if (velocityRef.current.length() > maxSpeed) {
      velocityRef.current.normalize().multiplyScalar(maxSpeed);
    }

    // Update position based on velocity
    const deltaPosition = velocityRef.current.clone().multiplyScalar(realDelta);
    prevPositionRef.current.add(deltaPosition);

    // Handle rotation with angular physics
    const targetRot = robotState.rotation.y;
    const currentRot = modelRef.current.rotation.y;
    
    // Calculate shortest angular distance
    let angularDiff = targetRot - currentRot;
    while (angularDiff > Math.PI) angularDiff -= Math.PI * 2;
    while (angularDiff < -Math.PI) angularDiff += Math.PI * 2;

    // Calculate target angular velocity
    if (Math.abs(angularDiff) > 0.01) {
      const desiredAngularSpeed = Math.min(Math.abs(angularDiff) * 3, maxAngularSpeed);
      targetAngularVelocityRef.current = Math.sign(angularDiff) * desiredAngularSpeed;
    } else {
      targetAngularVelocityRef.current = 0;
    }

    // Apply angular acceleration
    const angularVelDiff = targetAngularVelocityRef.current - angularVelocityRef.current;
    if (Math.abs(angularVelDiff) > 0.001) {
      const angularAccel = Math.sign(angularVelDiff) * angularAcceleration * realDelta;
      angularVelocityRef.current += angularAccel;
    }

    // Apply angular damping
    if (Math.abs(targetAngularVelocityRef.current) < 0.01) {
      angularVelocityRef.current *= Math.pow(0.1, realDelta);
    }

    // Update rotation
    modelRef.current.rotation.y += angularVelocityRef.current * realDelta;

    // Apply position
    modelRef.current.position.copy(prevPositionRef.current);

    // Realistic walking animation with physics-based bobbing
    if (isMoving && currentAction && velocityRef.current.length() > 0.1) {
      const speed = velocityRef.current.length();
      const normalizedSpeed = speed / maxSpeed;
      
      // Step frequency based on speed and robot type
      const baseFrequency = isSpider ? 12 : 6;
      const stepFrequency = baseFrequency * (0.5 + normalizedSpeed * 0.5);
      
      // Bob amplitude based on speed and robot characteristics
      const baseBobAmplitude = isSpider ? 0.008 : 0.015;
      const bobAmplitude = baseBobAmplitude * normalizedSpeed;
      
      // Add some randomness for more natural movement
      const time = currentTime * 0.001;
      const primaryBob = Math.sin(time * stepFrequency) * bobAmplitude;
      const secondaryBob = Math.sin(time * stepFrequency * 0.7) * bobAmplitude * 0.3;
      
      modelRef.current.position.y = prevPositionRef.current.y + primaryBob + secondaryBob;
      
      // Add subtle side-to-side sway for more realism
      if (!isSpider) { // Humanoids have more sway
        const swayAmplitude = 0.005 * normalizedSpeed;
        const swayFrequency = stepFrequency * 0.5;
        const sway = Math.sin(time * swayFrequency) * swayAmplitude;
        
        const perpDirection = new THREE.Vector3(-velocityRef.current.z, 0, velocityRef.current.x).normalize();
        const swayOffset = perpDirection.multiplyScalar(sway);
        modelRef.current.position.add(swayOffset);
      }
      
      // Adjust animation speed based on actual movement speed
      if (actions && actions[currentAction]) {
        const animationSpeedMultiplier = 0.5 + normalizedSpeed * 1.5;
        actions[currentAction].setEffectiveTimeScale(animationSpeedMultiplier);
      }
    }

    // Add subtle idle animations when not moving
    if (!isMoving && velocityRef.current.length() < 0.01) {
      const idleTime = currentTime * 0.0005;
      const idleBob = Math.sin(idleTime) * 0.002; // Very subtle breathing/idle movement
      modelRef.current.position.y = prevPositionRef.current.y + idleBob;
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