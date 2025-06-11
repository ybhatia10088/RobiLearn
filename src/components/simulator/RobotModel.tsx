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

  // Load all models with error handling
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
  
  // Model selection with explicit fallback and error handling
  const activeGLTF = (() => {
    try {
      if (isSpider) {
        console.log('🕷️ Loading Spider model');
        if (!spiderGLTF.scene) {
          console.error('❌ Spider model failed to load');
          return humanoidGLTF; // Fallback
        }
        return spiderGLTF;
      }
      if (isTank) {
        console.log('🚗 Loading Tank model');
        if (!tankGLTF.scene) {
          console.error('❌ Tank model failed to load');
          return humanoidGLTF; // Fallback
        }
        return tankGLTF;
      }
      if (isExplorer) {
        console.log('🌐 Loading Explorer model');
        console.log('🌐 Explorer GLTF object:', explorerGLTF);
        console.log('🌐 Explorer scene:', explorerGLTF?.scene);
        console.log('🌐 Explorer animations:', explorerGLTF?.animations);
        if (!explorerGLTF.scene) {
          console.error('❌ Explorer model failed to load - using fallback');
          return humanoidGLTF; // Fallback
        }
        return explorerGLTF;
      }
      console.log('🤖 Loading Humanoid model (default)');
      return humanoidGLTF;
    } catch (error) {
      console.error('❌ Error loading model:', error);
      return humanoidGLTF; // Always fallback to humanoid
    }
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
    
    try {
      const resultScene = shouldClone ? scene.clone() : scene;
      
      // Log scene structure for debugging
      console.log(`📦 Scene for ${robotType}:`, resultScene);
      console.log(`📦 Scene children count:`, resultScene?.children?.length);
      
      // CRITICAL FIX: Ensure the scene is properly structured
      if (!resultScene.children || resultScene.children.length === 0) {
        console.warn(`⚠️ Scene has no children for ${robotType}, but continuing anyway`);
      }
      
      return resultScene;
    } catch (error) {
      console.error(`❌ Error processing scene for ${robotType}:`, error);
      return scene; // Return original if cloning fails
    }
  }, [scene, isSpider, isTank, isExplorer, robotType]);
  
  // CRITICAL FIX: Make animations optional - don't let missing animations block rendering
  const { actions, mixer } = useAnimations(animations || [], processedScene);

  // Debug: Log available animations - but don't block rendering
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
      console.warn(`⚠️ No animations found for ${modelTypeName} - but model will still render`);
    }

    // Special debugging for Explorer
    if (isExplorer) {
      console.log('🌐 EXPLORER DEBUG:');
      console.log('🌐 Explorer GLTF:', explorerGLTF);
      console.log('🌐 Explorer scene:', explorerGLTF?.scene);
      console.log('🌐 Explorer animations:', explorerGLTF?.animations);
      console.log('🌐 Explorer actions:', actions);
      console.log('🌐 Explorer mixer:', mixer);
      console.log('🌐 Explorer processedScene:', processedScene);
    }
  }, [animations, actions, isSpider, isTank, isExplorer, robotConfig?.type, explorerGLTF, mixer, processedScene]);

  // CRITICAL FIX: Improved animation selection logic that won't block rendering
  const animToPlay = React.useMemo(() => {
    // If no actions available, return null but DON'T block rendering
    if (!actions || Object.keys(actions).length === 0) {
      console.log('⚠️ No actions available - model will render without animation');
      return null;
    }

    const allKeys = Object.keys(actions);
    console.log('All available action keys:', allKeys);

    try {
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
        
        // If no specific match, use first available
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

      console.log('❌ No suitable animation found - but model will still render');
      return null;
    } catch (error) {
      console.error('❌ Error in animation selection:', error);
      return null;
    }
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
    if (!actions || !mixer) {
      console.log('🛑 No actions or mixer to stop');
      return;
    }
    console.log('🛑 Stopping all animations');
    try {
      Object.values(actions).forEach((action) => {
        if (action?.isRunning()) {
          console.log(`Stopping action: ${action.getClip().name}`);
          action.stop();
        }
      });
      setCurrentAction(null);
    } catch (error) {
      console.error('❌ Error stopping actions:', error);
    }
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

    try {
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
      const speedMultiplier = isSpider ? 1.2 : isTank ? 0.6 : isExplorer ? 1.5 : 0.8;
      next.setEffectiveTimeScale(speedMultiplier);
      
      setCurrentAction(name);
      console.log(`✅ Animation "${name}" started with speed: ${speedMultiplier}`);
    } catch (error) {
      console.error(`❌ Error switching to animation "${name}":`, error);
    }
  };

  // CRITICAL FIX: Don't let animation logic prevent rendering
  useEffect(() => {
    if (!actions || !animToPlay) {
      console.log('⚠️ No actions or animation to play available - but model will still render');
      return;
    }

    console.log(`🎭 Movement state: ${isMoving}, Current action: ${currentAction}, Animation to play: ${animToPlay}`);

    try {
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
    } catch (error) {
      console.error('❌ Error in animation logic:', error);
    }
  }, [isMoving, actions, animToPlay, currentAction]);

  // Cleanup on unmount or when actions change
  useEffect(() => {
    return () => {
      console.log('🧹 Cleaning up animations');
      try {
        stopAllActions();
      } catch (error) {
        console.error('❌ Error during cleanup:', error);
      }
    };
  }, [actions]);

  useFrame((_, delta) => {
    if (!robotState || !modelRef.current) return;
    
    try {
      // Update animation mixer (only if available)
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
      
      // Add subtle bobbing animation for more realistic movement
      if (isMoving && currentAction) {
        const bobFrequency = isSpider ? 8 : isTank ? 2 : isExplorer ? 6 : 4;
        const bobAmplitude = isSpider ? 0.005 : isTank ? 0.002 : isExplorer ? 0.002 : 0.01;
        const bobOffset = Math.sin(Date.now() * 0.01 * bobFrequency) * bobAmplitude;
        
        modelRef.current.position.y = prevPositionRef.current.y + bobOffset;
      }
    } catch (error) {
      console.error('❌ Error in useFrame:', error);
    }
  });

  // CRITICAL FIX: Always try to render, even if scene is problematic
  if (!processedScene) {
    console.error(`❌ Cannot render ${robotType} - no scene available`);
    
    // EMERGENCY FALLBACK: Try to render humanoid instead
    if (isExplorer && humanoidGLTF.scene) {
      console.log('🚨 EMERGENCY: Rendering humanoid as fallback for explorer');
      return (
        <primitive
          ref={modelRef}
          object={humanoidGLTF.scene}
          position={[0, 0, 0]}
          rotation={[0, Math.PI, 0]}
          scale={[1, 1, 1]}
          castShadow
          receiveShadow
        />
      );
    }
    
    return null;
  }

  // Debug render - log the final scale and model type being used
  const finalScale = isSpider 
    ? [0.1, 0.1, 0.1] 
    : isTank 
    ? [0.3, 0.3, 0.3] 
    : isExplorer
    ? [0.8, 0.8, 0.8]
    : [1, 1, 1];

  console.log(`🎨 Rendering ${robotType} with scale:`, finalScale);

  return (
    <primitive
      ref={modelRef}
      object={processedScene}
      position={[0, 0, 0]}
      rotation={[0, Math.PI, 0]}
      scale={finalScale}
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
