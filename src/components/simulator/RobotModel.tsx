import React, { useRef, useEffect, useState } from 'react';
import { useGLTF, useAnimations, Box } from '@react-three/drei';
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

  const { robotState, isMoving: storeIsMoving } = useRobotStore();
  const [isMoving, setIsMoving] = useState(false);
  const [currentAction, setCurrentAction] = useState<string | null>(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [modelError, setModelError] = useState(false);

  const isSpider = robotConfig.type === 'spider';
  
  // Load models conditionally with proper error handling
  let spiderGLTF: any = null;
  let humanoidGLTF: any = null;
  let loadError = false;

  try {
    if (isSpider) {
      spiderGLTF = useGLTF('/models/spider-model/source/spider_robot.glb');
    } else {
      humanoidGLTF = useGLTF('/models/humanoid-robot/rusty_robot_walking_animated.glb');
    }
  } catch (error) {
    console.warn(`${isSpider ? 'Spider' : 'Humanoid'} model not found, using fallback`, error);
    loadError = true;
  }

  const activeGLTF = isSpider ? spiderGLTF : humanoidGLTF;

  // Set model loaded state in useEffect to avoid re-render loops
  useEffect(() => {
    if (activeGLTF && !loadError) {
      setModelLoaded(true);
      setModelError(false);
    } else if (loadError) {
      setModelLoaded(false);
      setModelError(true);
    }
  }, [activeGLTF, loadError]);
  
  // Initialize animations only if model is loaded
  const { actions, mixer } = useAnimations(
    activeGLTF?.animations || [], 
    activeGLTF?.scene || null
  );

  // Fallback component if models don't load
  if (!activeGLTF || modelError) {
    return (
      <group ref={modelRef}>
        <Box args={[1, 1, 1]} position={[0, 0.5, 0]}>
          <meshStandardMaterial color={isSpider ? '#8B5CF6' : '#3B82F6'} />
        </Box>
        <Box args={[0.5, 0.5, 0.5]} position={[0, 1.25, 0]}>
          <meshStandardMaterial color={isSpider ? '#A855F7' : '#60A5FA'} />
        </Box>
      </group>
    );
  }

  const { scene } = activeGLTF;

  const getSpiderAnimationName = () => {
    if (!isSpider || !actions) return null;
    
    const allKeys = Object.keys(actions);
    console.log('🕷️ Available spider animation actions:', allKeys);

    // Common spider animation names
    const spiderAnimNames = [
      'Take 001',
      'Armature|Take 001', 
      'mixamo.com',
      'Walking',
      'Walk',
      'Move',
      'Action'
    ];

    for (const name of spiderAnimNames) {
      if (allKeys.includes(name)) {
        console.log('🎬 Found spider animation:', name);
        return name;
      }
    }

    // Fallback to first available animation
    if (allKeys.length > 0) {
      console.log('🎬 Using fallback spider animation:', allKeys[0]);
      return allKeys[0];
    }

    return null;
  };

  const getHumanoidAnimationName = () => {
    if (isSpider || !actions) return null;
    
    const allKeys = Object.keys(actions);
    console.log('🤖 Available humanoid animation actions:', allKeys);

    if (allKeys.includes('mixamo.com')) return 'mixamo.com';
    if (allKeys.length > 0) return allKeys[0];
    return null;
  };

  const animToPlay = isSpider ? getSpiderAnimationName() : getHumanoidAnimationName();

  // Movement detection
  useEffect(() => {
    if (!robotState) return;

    let shouldBeMoving = false;

    if (isSpider) {
      // For spider, only use store movement flags
      shouldBeMoving = storeIsMoving || robotState.isMoving;
      console.log('🕷️ Spider movement check:', { 
        shouldBeMoving, 
        storeIsMoving, 
        robotStateIsMoving: robotState.isMoving 
      });
    } else {
      // For humanoid, check position changes too
      const currentPos = new THREE.Vector3(
        robotState.position.x,
        robotState.position.y,
        robotState.position.z
      );

      const distance = currentPos.distanceTo(lastPositionRef.current);
      const positionBasedMoving = distance > 0.01;
      shouldBeMoving = storeIsMoving || robotState.isMoving || positionBasedMoving;
      
      lastPositionRef.current.copy(currentPos);
      
      console.log('🤖 Humanoid movement check:', { 
        shouldBeMoving, 
        storeIsMoving, 
        robotStateIsMoving: robotState.isMoving, 
        positionBasedMoving 
      });
    }

    if (shouldBeMoving !== isMoving) {
      console.log(`${isSpider ? '🕷️' : '🤖'} Movement state changed from`, isMoving, 'to', shouldBeMoving);
      setIsMoving(shouldBeMoving);
    }
  }, [robotState?.position, robotState?.isMoving, storeIsMoving, isMoving, isSpider]);

  const stopAllActions = () => {
    if (!actions || !mixer) return;
    Object.values(actions).forEach((action) => {
      if (action && action.isRunning()) {
        action.stop();
      }
    });
    setCurrentAction(null);
    console.log(`${isSpider ? '🕷️' : '🤖'} All animations stopped`);
  };

  const switchAnimation = (name: string) => {
    if (!actions || !name || currentAction === name) return;
    
    const next = actions[name];
    if (!next) {
      console.warn(`⚠️ Animation "${name}" not found in actions.`);
      return;
    }

    console.log(`${isSpider ? '🕷️' : '🤖'} Switching to animation:`, name);

    // Stop current animation with fade out
    if (currentAction && actions[currentAction] && actions[currentAction].isRunning()) {
      actions[currentAction].fadeOut(0.2);
    }

    // Start new animation with fade in
    next.reset().fadeIn(0.2).play();
    setCurrentAction(name);
  };

  // Handle animation switching based on movement state
  useEffect(() => {
    console.log(`${isSpider ? '🕷️' : '🤖'} Animation effect - isMoving:`, isMoving, 'animToPlay:', animToPlay);
    
    if (!actions || !animToPlay) {
      console.log(`${isSpider ? '🕷️' : '🤖'} No actions or animToPlay available`);
      return;
    }

    if (isMoving) {
      if (currentAction !== animToPlay) {
        console.log(`${isSpider ? '🕷️' : '🤖'} Starting animation:`, animToPlay);
        switchAnimation(animToPlay);
      }
    } else {
      if (currentAction && actions[currentAction] && actions[currentAction].isRunning()) {
        console.log(`${isSpider ? '🕷️' : '🤖'} Stopping animation:`, currentAction);
        stopAllActions();
      }
    }
  }, [isMoving, actions, animToPlay, currentAction, isSpider]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log(`${isSpider ? '🕷️' : '🤖'} Component unmounting - stopping all animations`);
      stopAllActions();
    };
  }, [isSpider]);

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

    // Smooth position interpolation
    if (isMoving) {
      prevPositionRef.current.lerp(targetPos, 0.15);
    } else {
      prevPositionRef.current.copy(targetPos);
    }

    modelRef.current.position.copy(prevPositionRef.current);

    // Smooth rotation
    const targetRot = robotState.rotation.y;
    modelRef.current.rotation.y += (targetRot - modelRef.current.rotation.y) * 0.12;
  });

  return (
    <primitive
      ref={modelRef}
      object={scene.clone()} // Clone the scene to avoid conflicts
      position={[0, 0, 0]}
      rotation={[0, Math.PI, 0]}
      castShadow
      receiveShadow
    />
  );
};

// Preload models safely
const preloadModels = () => {
  try {
    useGLTF.preload('/models/spider-model/source/spider_robot.glb');
  } catch (error) {
    console.warn('Could not preload spider model');
  }

  try {
    useGLTF.preload('/models/humanoid-robot/rusty_robot_walking_animated.glb');
  } catch (error) {
    console.warn('Could not preload humanoid model');
  }
};

// Call preload function
preloadModels();

export default RobotModel;