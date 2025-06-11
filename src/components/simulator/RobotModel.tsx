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

  const { robotState, isMoving: storeIsMoving, selectedRobot } = useRobotStore();
  const [isMoving, setIsMoving] = useState(false);
  const [currentAction, setCurrentAction] = useState<string | null>(null);

  // Load all models
  const humanoidGLTF = useGLTF('/models/humanoid-robot/rusty_robot_walking_animated.glb');
  const spiderGLTF = useGLTF('/models/spider-model/source/spider_bot.glb');
  const tankGLTF = useGLTF('/models/tank-model/t-35_heavy_five-turret_tank.glb');
  const explorerGLTF = useGLTF('/models/explorer-bot/360_sphere_robot_no_glass.glb');

  // Debug EVERYTHING - this will help identify the issue
  console.log('🔍 Props robotConfig:', robotConfig);
  console.log('🔍 Props robotConfig.type:', robotConfig?.type);
  console.log('🔍 Store selectedRobot:', selectedRobot);
  console.log('🔍 Store selectedRobot.type:', selectedRobot?.type);
  console.log('🔍 Store robotState:', robotState);
  console.log('🔍 Store robotState.type:', robotState?.type);

  // Use the robot type from store as primary source, fallback to props
  const actualRobotType = selectedRobot?.type || robotState?.type || robotConfig?.type;
  console.log('🎯 Actual robot type being used:', actualRobotType);

  // Make the type comparison more robust
  const robotType = actualRobotType?.toLowerCase();
  const isSpider = robotType === 'spider';
  const isTank = robotType === 'tank';
  const isExplorer = robotType === 'explorer';
  const isHumanoid = robotType === 'humanoid' || (!isSpider && !isTank && !isExplorer);
  
  console.log('🤖 Robot Type Checks:', { 
    robotType, 
    isSpider, 
    isTank, 
    isExplorer, 
    isHumanoid,
    actualRobotType 
  });
  
  // Model selection with explicit fallback
  const activeGLTF = (() => {
    if (isSpider) {
      console.log('🕷️ Loading Spider model');
      return spiderGLTF;
    }
    if (isTank) {
      console.log('🚗 Loading Tank model');
      return tankGLTF;
    }
    if (isExplorer) {
      console.log('🌐 Loading Explorer model');
      console.log('🌐 Explorer GLTF object:', explorerGLTF);
      console.log('🌐 Explorer scene:', explorerGLTF?.scene);
      console.log('🌐 Explorer animations:', explorerGLTF?.animations);
      return explorerGLTF;
    }
    console.log('🤖 Loading Humanoid model (default)');
    return humanoidGLTF;
  })();
    
  const { scene, animations } = activeGLTF;
  
  // Clone the scene only if needed to avoid sharing between instances
  const processedScene = React.useMemo(() => {
    if (!scene) {
      console.error(`❌ No scene found for robot type: ${robotType}`);
      return null;
    }
    
    const shouldClone = isSpider || isTank || isExplorer;
    console.log(`📦 ${shouldClone ? 'Cloning' : 'Using original'} scene for ${robotType}`);
    const resultScene = shouldClone ? scene.clone() : scene;
    
    // Log scene structure for debugging
    console.log(`📦 Scene for ${robotType}:`, resultScene);
    console.log(`📦 Scene children count:`, resultScene?.children?.length);
    
    return resultScene;
  }, [scene, isSpider, isTank, isExplorer, robotType]);
  
  const { actions, mixer } = useAnimations(animations, processedScene);

  // Debug: Log available animations
  useEffect(() => {
    const modelTypeName = isSpider ? 'Spider' : isTank ? 'Tank' : isExplorer ? 'Explorer' : 'Humanoid';
    console.log(`🤖 ${modelTypeName} model loaded for robot type: ${robotConfig?.type}`);
    console.log('Available animations:', animations?.map(anim => anim.name) || 'None');
    console.log('Available actions:', Object.keys(actions || {}));
    
    if (animations && animations.length > 0) {
      animations.forEach((clip, index) => {
        console.log(`Animation ${index}: "${clip.name}" - Duration: ${clip.duration}s`);
      });
    } else {
      console.warn(`⚠️ No animations found for ${modelTypeName}`);
    }

    // Special debugging for Explorer
    if (isExplorer) {
      console.log('🌐 EXPLORER DEBUG:');
      console.log('🌐 Explorer GLTF:', explorerGLTF);
      console.log('🌐 Explorer scene:', explorerGLTF?.scene);
      console.log('🌐 Explorer animations:', explorerGLTF?.animations);
      console.log('🌐 Explorer actions:', actions);
      console.log('🌐 Explorer mixer:', mixer);
    }
  }, [animations, actions, isSpider, isTank, isExplorer, robotConfig?.type, explorerGLTF, mixer]);

  // Improved animation selection logic with correct Explorer animation name
  const animToPlay = React.useMemo(() => {
    if (!actions || Object.keys(actions).length === 0) {
      console.log('⚠️ No actions available');
      return null;
    }

    const allKeys = Object.keys(actions);
    console.log('All available action keys:', allKeys);

    // Explorer animation names - INCLUDING the exact name from Sketchfab
    if (isExplorer) {
      const explorerAnimNames = [
        'sphere body|sphere bodyAction', // EXACT name from Sketchfab
        'sphere bodysphere bodyAction',
        'sphere body|sphere body|Action',
        'sphere bodyAction',
        'sphere body|Action',
        'Action',
        'Idle',
        'Rotate',
        'rotate',
        'Roll',
        'roll',
        'move',
        'Move',
        'Take 001',
        'Take001',
        'Scene'
      ];
      
      for (const name of explorerAnimNames) {
        if (allKeys.includes(name)) {
          console.log(`✅ Found explorer animation: "${name}"`);
          return name;
        }
      }
      
      // If no specific match, log all available and use first one
      console.log('🌐 No matching explorer animation found, available keys:', allKeys);
      if (allKeys.length > 0) {
        console.log(`🌐 Using first available animation for explorer: "${allKeys[0]}"`);
        return allKeys[0];
      }
    }

    // Try common spider animation names
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

    // Try tank animation names
    if (isTank) {
      const tankAnimNames = [
        'Scene',
        'Take 001',
        'Take001',
        'Armature|Take 001',
        'Armature|Take001',
        'ArmatureAction',
        'Action',
        'drive',
        'move',
        'animation',
        'default',
        'Main'
      ];
      
      for (const name of tankAnimNames) {
        if (allKeys.includes(name)) {
          console.log(`✅ Found tank animation: ${name}`);
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
  }, [actions, isSpider, isTank, isExplorer]);

  // FIXED: More sensitive movement detection for Explorer
  useEffect(() => {
    if (!robotState) return;

    const currentPos = new THREE.Vector3(
      robotState.position.x,
      robotState.position.y,
      robotState.position.z
    );

    const distance = currentPos.distanceTo(lastPositionRef.current);
    
    // EXPLORER FIX: More sensitive threshold for explorer (sphere bot should be more responsive)
    const threshold = isExplorer ? 0.001 : 0.01; // Much more sensitive for explorer
    movementThresholdRef.current = distance > threshold ? movementThresholdRef.current + 1 : 0;

    // EXPLORER FIX: Immediate response for explorer, less buffering
    const requiredFrames = isExplorer ? 1 : 2; // Explorer responds immediately
    const positionBasedMoving = movementThresholdRef.current > requiredFrames;
    const shouldBeMoving = storeIsMoving || robotState.isMoving || positionBasedMoving;

    if (shouldBeMoving !== isMoving) {
      setIsMoving(shouldBeMoving);
      console.log(`🎭 Movement state changed for ${robotType}: ${shouldBeMoving ? 'MOVING' : 'STOPPED'}`);
      
      // EXPLORER FIX: Extra logging for explorer
      if (isExplorer) {
        console.log(`🌐 EXPLORER Movement Debug:`, {
          distance,
          threshold,
          movementThreshold: movementThresholdRef.current,
          storeIsMoving,
          robotStateIsMoving: robotState.isMoving,
          positionBasedMoving,
          shouldBeMoving
        });
      }
    }

    lastPositionRef.current.copy(currentPos);
  }, [robotState?.position, robotState?.isMoving, storeIsMoving, isMoving, isExplorer, robotType]);

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
    
    // EXPLORER FIX: Adjusted animation speed for explorer (higher speed for more visible rolling effect)
    const speedMultiplier = isSpider ? 1.2 : isTank ? 0.6 : isExplorer ? 2.0 : 0.8; // Much faster for explorer
    next.setEffectiveTimeScale(speedMultiplier);
    
    setCurrentAction(name);
    console.log(`✅ Animation "${name}" started with speed: ${speedMultiplier}`);
    
    // EXPLORER FIX: Extra logging for explorer
    if (isExplorer) {
      console.log(`🌐 EXPLORER Animation started:`, {
        animationName: name,
        speedMultiplier,
        isRunning: next.isRunning(),
        duration: next.getClip().duration
      });
    }
  };

  useEffect(() => {
    if (!actions || !animToPlay) {
      console.log('⚠️ No actions or animation to play available');
      if (isExplorer) {
        console.log('🌐 EXPLORER: Missing actions or animToPlay');
        console.log('🌐 EXPLORER: actions:', actions);
        console.log('🌐 EXPLORER: animToPlay:', animToPlay);
      }
      return;
    }

    console.log(`🎭 Movement state: ${isMoving}, Current action: ${currentAction}, Animation to play: ${animToPlay}`);

    if (isMoving) {
      if (currentAction !== animToPlay) {
        console.log(`Starting movement animation: ${animToPlay}`);
        // EXPLORER FIX: Force animation start for explorer
        if (isExplorer) {
          console.log('🌐 EXPLORER: Forcing animation start');
        }
        switchAnimation(animToPlay);
      }
    } else {
      if (currentAction && actions[currentAction]?.isRunning()) {
        console.log('Stopping animation - robot not moving');
        stopAllActions();
      }
    }
  }, [isMoving, actions, animToPlay, currentAction, isExplorer]);

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

    // EXPLORER FIX: More responsive movement for explorer
    const currentPos = modelRef.current.position;
    const distance = currentPos.distanceTo(targetPos);
    
    if (isMoving && distance > 0.01) {
      // EXPLORER FIX: Faster movement speed for explorer to match animation
      const baseSpeed = isExplorer ? 12 : 8; // Faster base speed for explorer
      const moveSpeed = Math.min(distance * baseSpeed, isExplorer ? 0.4 : 0.25); // Higher max speed for explorer
      prevPositionRef.current.lerp(targetPos, moveSpeed * delta * 60);
    } else if (!isMoving) {
      // Gradual stop with deceleration
      const stopSpeed = isExplorer ? 0.12 : 0.08; // Faster stopping for explorer
      prevPositionRef.current.lerp(targetPos, stopSpeed);
    } else {
      // Snap to target if very close
      prevPositionRef.current.copy(targetPos);
    }

    modelRef.current.position.copy(prevPositionRef.current);
    
    // EXPLORER FIX: Faster rotation for explorer (sphere should rotate quickly)
    const targetRot = robotState.rotation.y;
    const currentRot = modelRef.current.rotation.y;
    const rotDiff = targetRot - currentRot;
    
    // Handle rotation wrapping (shortest path)
    const normalizedDiff = ((rotDiff + Math.PI) % (Math.PI * 2)) - Math.PI;
    const rotSpeed = isMoving ? 
      (isExplorer ? 0.25 : 0.15) : // Much faster rotation for explorer when moving
      (isExplorer ? 0.15 : 0.08);  // Faster rotation for explorer when stopped
    
    modelRef.current.rotation.y += normalizedDiff * rotSpeed;
    
    // EXPLORER FIX: Enhanced bobbing animation for explorer (rolling sphere effect)
    if (isMoving && currentAction) {
      const bobFrequency = isSpider ? 8 : isTank ? 2 : isExplorer ? 10 : 4; // Higher frequency for explorer
      const bobAmplitude = isSpider ? 0.005 : isTank ? 0.002 : isExplorer ? 0.003 : 0.01; // Slightly more bobbing for explorer
      const bobOffset = Math.sin(Date.now() * 0.01 * bobFrequency) * bobAmplitude;
      
      modelRef.current.position.y = prevPositionRef.current.y + bobOffset;
      
      // EXPLORER FIX: Add additional rotation for rolling effect
      if (isExplorer) {
        // Add continuous rotation on X-axis for rolling sphere effect
        const rollSpeed = 0.1;
        modelRef.current.rotation.x += rollSpeed * delta * (distance > 0.01 ? 1 : 0);
      }
    }
  });

  // Early return if no scene (prevents crashes)
  if (!processedScene) {
    console.error(`❌ Cannot render ${robotType} - no scene available`);
    return null;
  }

  // Debug render - log the final scale and model type being used
  console.log(`🎨 Rendering ${robotType} with scale:`, 
    isSpider ? [0.1, 0.1, 0.1] : 
    isTank ? [0.3, 0.3, 0.3] : 
    isExplorer ? [0.8, 0.8, 0.8] : [1, 1, 1] // Slightly larger scale for explorer
  );

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
          ? [0.8, 0.8, 0.8] // Better scale for explorer
          : [1, 1, 1]
      }
      castShadow
      receiveShadow
    />
  );
};

// Preload all models
useGLTF.preload('/models/humanoid-robot/rusty_robot_walking_animated.glb');
useGLTF.preload('/models/spider-model/source/spider_bot.glb');
useGLTF.preload('/models/tank-model/t-35_heavy_five-turret_tank.glb');
useGLTF.preload('/models/explorer-bot/360_sphere_robot_no_glass.glb');

export default RobotModel;