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

  // Drone-specific refs
  const propellersRef = useRef<THREE.Group[]>([]);
  const droneAltitude = useRef(0);

  const { robotState, isMoving: storeIsMoving, moveCommands } = useRobotStore();
  const [isMoving, setIsMoving] = useState(false);
  const [currentAction, setCurrentAction] = useState<string | null>(null);

  const humanoidGLTF = useGLTF('/models/humanoid-robot/rusty_robot_walking_animated.glb');
  const spiderGLTF = useGLTF('/models/spider-model/source/spider_bot.glb');
  const tankGLTF = useGLTF('/models/tank-model/t-35_heavy_five-turret_tank.glb');
  const explorerGLTF = useGLTF('/models/explorer-bot/360_sphere_robot_no_glass.glb');

  const isSpider = robotConfig.type === 'spider';
  const isTank = robotConfig.type === 'tank';
  const isExplorer = robotConfig.type === 'explorer' || robotConfig.type === 'mobile';
  const isDrone = robotConfig.type === 'drone';

  console.log('🔍 Robot type debug:', {
    robotConfigType: robotConfig.type,
    isExplorer,
    isSpider,
    isTank,
    isDrone
  });

  // Physics constants for drone
  const PHYSICS = {
    droneHoverAmplitude: 0.008,
    droneHoverSpeed: 2.5,
    propellerSpeedIdle: 15,
    propellerSpeedActive: 30,
    droneLiftAcceleration: 0.03,
    droneMaxAltitude: 4.0,
    droneMinAltitude: 0.15
  };

  // Enhanced Drone with realistic aerodynamics
  const DroneGeometry = () => (
    <>
      {/* Main body - aerodynamic design */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[0.25, 0.08, 0.35]} />
        <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Top and bottom shells */}
      <mesh castShadow position={[0, 0.04, 0]}>
        <boxGeometry args={[0.23, 0.02, 0.33]} />
        <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh castShadow position={[0, -0.04, 0]}>
        <boxGeometry args={[0.23, 0.02, 0.33]} />
        <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Advanced gimbal camera system */}
      <group position={[0, -0.08, 0.15]}>
        {/* Gimbal frame */}
        <mesh castShadow>
          <torusGeometry args={[0.06, 0.008, 16, 32]} />
          <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.1} />
        </mesh>
        
        {/* Camera housing */}
        <mesh castShadow>
          <boxGeometry args={[0.06, 0.04, 0.08]} />
          <meshStandardMaterial color="#000000" metalness={1} roughness={0} />
        </mesh>
        
        {/* Camera lens */}
        <mesh castShadow position={[0, 0, 0.04]}>
          <cylinderGeometry args={[0.02, 0.02, 0.02, 32]} />
          <meshStandardMaterial 
            color="#1a1a1a" 
            metalness={1} 
            roughness={0}
            transparent
            opacity={0.9}
          />
        </mesh>

        {/* Lens reflection */}
        <mesh castShadow position={[0, 0, 0.045]}>
          <cylinderGeometry args={[0.018, 0.018, 0.001, 32]} />
          <meshStandardMaterial 
            color="#3b82f6" 
            emissive="#3b82f6"
            emissiveIntensity={0.2}
            metalness={1} 
            roughness={0}
          />
        </mesh>
      </group>

      {/* Motor arms with improved aerodynamics */}
      {[
        { pos: [-0.18, 0, -0.18], index: 0, color: "#22c55e" },
        { pos: [0.18, 0, -0.18], index: 1, color: "#ef4444" },
        { pos: [-0.18, 0, 0.18], index: 2, color: "#ef4444" },
        { pos: [0.18, 0, 0.18], index: 3, color: "#22c55e" }
      ].map(({ pos, index, color }) => (
        <group key={index} position={pos}>
          {/* Streamlined arm */}
          <mesh castShadow rotation={[0, Math.PI/4, 0]}>
            <boxGeometry args={[0.15, 0.02, 0.03]} />
            <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.2} />
          </mesh>

          {/* Motor housing */}
          <mesh castShadow position={[0, 0.025, 0]}>
            <cylinderGeometry args={[0.025, 0.03, 0.04, 32]} />
            <meshStandardMaterial color="#1f2937" metalness={0.9} roughness={0.1} />
          </mesh>

          {/* Motor heat fins */}
          {[...Array(8)].map((_, i) => {
            const angle = (i * Math.PI * 2) / 8;
            return (
              <mesh 
                key={i} 
                castShadow 
                position={[
                  Math.cos(angle) * 0.032,
                  0.025,
                  Math.sin(angle) * 0.032
                ]}
                rotation={[0, angle, 0]}
              >
                <boxGeometry args={[0.001, 0.04, 0.008]} />
                <meshStandardMaterial color="#374151" metalness={0.7} roughness={0.3} />
              </mesh>
            );
          })}

          {/* Enhanced propeller system */}
          <group 
            ref={(el) => { 
              if (el && !propellersRef.current.includes(el)) {
                propellersRef.current[index] = el;
              }
            }}
            position={[0, 0.045, 0]}
          >
            {/* Propeller hub */}
            <mesh castShadow>
              <cylinderGeometry args={[0.008, 0.008, 0.01, 16]} />
              <meshStandardMaterial color="#1f2937" metalness={0.9} roughness={0.1} />
            </mesh>

            {/* Propeller blades - more realistic shape */}
            {[0, Math.PI/2, Math.PI, 3*Math.PI/2].map((rotation, i) => (
              <group key={i} rotation={[0, rotation, 0]}>
                <mesh castShadow position={[0, 0, 0.08]}>
                  <boxGeometry args={[0.004, 0.002, 0.12]} />
                  <meshStandardMaterial 
                    color="#1f2937" 
                    metalness={0.6} 
                    roughness={0.3}
                    opacity={robotState?.isMoving ? 0.2 : 0.9}
                    transparent
                  />
                </mesh>
                
                {/* Blade tip */}
                <mesh castShadow position={[0, 0, 0.13]}>
                  <boxGeometry args={[0.008, 0.003, 0.02]} />
                  <meshStandardMaterial color="#fb923c" metalness={0.7} roughness={0.2} />
                </mesh>
              </group>
            ))}
          </group>

          {/* Navigation LED */}
          <pointLight
            color={color}
            intensity={robotState?.isMoving ? 3 : 1.5}
            distance={0.5}
            position={[0, 0.03, 0]}
          />

          {/* LED housing */}
          <mesh castShadow position={[0, 0.02, 0]}>
            <cylinderGeometry args={[0.005, 0.005, 0.002, 16]} />
            <meshStandardMaterial 
              color={color}
              emissive={color}
              emissiveIntensity={robotState?.isMoving ? 0.5 : 0.3}
            />
          </mesh>
        </group>
      ))}

      {/* Additional navigation lights */}
      <pointLight
        color="#ffffff"
        intensity={2}
        distance={0.6}
        position={[0, 0.05, -0.15]}
      />
      <pointLight
        color="#ff0000"
        intensity={1.5}
        distance={0.4}
        position={[0, 0.05, 0.15]}
      />

      {/* Status indicator panel */}
      <mesh castShadow position={[0, 0.03, -0.12]}>
        <boxGeometry args={[0.08, 0.01, 0.02]} />
        <meshStandardMaterial 
          color="#000000" 
          emissive="#3b82f6"
          emissiveIntensity={robotState?.isMoving ? 0.4 : 0.2}
        />
      </mesh>
    </>
  );

  const activeGLTF = robotConfig.type === 'explorer' || robotConfig.type === 'mobile'
    ? explorerGLTF
    : robotConfig.type === 'spider' 
    ? spiderGLTF 
    : robotConfig.type === 'tank'
    ? tankGLTF 
    : humanoidGLTF;

  const { scene, animations } = isDrone ? { scene: null, animations: [] } : activeGLTF;

  const processedScene = React.useMemo(() => {
    if (isDrone) return null;
    
    const clonedScene = scene.clone();
    
    // Special handling for explorer bot visibility and positioning
    if (isExplorer && clonedScene) {
      // Calculate bounding box to understand the model's actual dimensions
      const box = new THREE.Box3().setFromObject(clonedScene);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      
      console.log('🔍 Explorer bot bounding box:', {
        size: { x: size.x, y: size.y, z: size.z },
        center: { x: center.x, y: center.y, z: center.z },
        min: { x: box.min.x, y: box.min.y, z: box.min.z },
        max: { x: box.max.x, y: box.max.y, z: box.max.z }
      });

      // Traverse the scene and ensure all materials are visible
      clonedScene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          // Make sure the mesh is visible
          child.visible = true;
          child.castShadow = true;
          child.receiveShadow = true;
          
          // Fix material properties for better visibility
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach(mat => {
                mat.transparent = false;
                mat.opacity = 1;
                if (mat instanceof THREE.MeshStandardMaterial) {
                  mat.metalness = 0.3;
                  mat.roughness = 0.7;
                }
              });
            } else {
              child.material.transparent = false;
              child.material.opacity = 1;
              if (child.material instanceof THREE.MeshStandardMaterial) {
                child.material.metalness = 0.3;
                child.material.roughness = 0.7;
              }
            }
          }
        }
      });
    }
    
    return (isSpider || isTank || isExplorer) ? clonedScene : scene;
  }, [scene, isSpider, isTank, isExplorer, isDrone]);

  const { actions, mixer } = useAnimations(animations, processedScene);

  useEffect(() => {
    if (isDrone) {
      console.log('🚁 Drone model loaded (procedural geometry)');
      // Initialize drone altitude
      droneAltitude.current = robotState?.position.y || 0.5;
      return;
    }

    console.log(`🤖 ${isSpider ? 'Spider' : isTank ? 'Tank' : isExplorer ? 'Explorer/Mobile' : 'Humanoid'} model loaded:`);
    console.log('Available animations:', animations?.map(anim => anim.name) || 'None');
    console.log('Available actions:', Object.keys(actions || {}));
    
    if (animations && animations.length > 0) {
      animations.forEach((clip, index) => {
        console.log(`Animation ${index}: "${clip.name}" - Duration: ${clip.duration}s`);
      });
    }

    // Debug explorer bot scene structure
    if (isExplorer && processedScene) {
      console.log('🔍 Explorer bot scene structure:');
      processedScene.traverse((child) => {
        console.log(`- ${child.name} (${child.type}), visible: ${child.visible}`);
        if (child instanceof THREE.Mesh) {
          console.log(`  Material: ${child.material?.type}, opacity: ${child.material?.opacity}`);
        }
      });
    }
  }, [animations, actions, isSpider, isTank, isExplorer, processedScene, isDrone]);

  const animToPlay = React.useMemo(() => {
    if (isDrone || !actions || Object.keys(actions).length === 0) {
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
      const explorerAnimNames = [
        'sphere body|sphere bodyAction',
        'sphere bodyAction',
        'sphere body',
        'sphere bodyAction.001',
        'rotate', 
        'rolling', 
        'ExplorerSpin', 
        'Move',
        'Action',
        'Scene'
      ];
      for (const name of explorerAnimNames) {
        if (allKeys.includes(name)) {
          console.log(`🎯 Found explorer animation: "${name}"`);
          return name;
        }
      }
    }

    if (allKeys.includes('mixamo.com')) return 'mixamo.com';
    if (allKeys.length > 0) return allKeys[0];
    return null;
  }, [actions, isSpider, isTank, isExplorer, isDrone]);

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

    console.log(`🎬 Switching to animation: "${name}" for ${isExplorer ? 'Explorer/Mobile' : isSpider ? 'Spider' : isTank ? 'Tank' : 'Humanoid'}`);

    if (currentAction && actions[currentAction]?.isRunning()) {
      actions[currentAction].fadeOut(0.3);
    }

    next.reset().fadeIn(0.3).play();
    next.setLoop(THREE.LoopRepeat, Infinity);
    next.clampWhenFinished = false;
    
    // Adjusted speed multipliers for different robot types
    const speedMultiplier = isSpider ? 1.2 : isTank ? 0.6 : isExplorer ? 0.8 : 0.8;
    next.setEffectiveTimeScale(speedMultiplier);
    setCurrentAction(name);
  };

  useEffect(() => {
    if (isDrone || !actions || !animToPlay) return;

    if (isMoving) {
      if (currentAction !== animToPlay) {
        switchAnimation(animToPlay);
      }
    } else {
      if (currentAction && actions[currentAction]?.isRunning()) {
        stopAllActions();
      }
    }
  }, [isMoving, actions, animToPlay, currentAction, isDrone]);

  useEffect(() => {
    return () => {
      if (!isDrone) {
        stopAllActions();
      }
    };
  }, [actions, isDrone]);

  useFrame((state, delta) => {
    if (!robotState || !modelRef.current) return;

    if (mixer && !isDrone) {
      mixer.update(delta);
    }

    const targetPos = new THREE.Vector3(
      robotState.position.x,
      robotState.position.y,
      robotState.position.z
    );

    const currentPos = modelRef.current.position;
    const distance = currentPos.distanceTo(targetPos);
    
    // Apply the explorer float height offset to the target position
    if (isExplorer) {
      targetPos.y += explorerFloatHeight;
    }
    
    // Drone-specific movement and animation
    if (isDrone) {
      // Enhanced drone physics with realistic flight dynamics
      const time = state.clock.elapsedTime;
      
      // Apply altitude changes
      if (moveCommands?.joint === 'altitude') {
        const altitudeChange = moveCommands.direction === 'up' 
          ? PHYSICS.droneLiftAcceleration 
          : -PHYSICS.droneLiftAcceleration;
        droneAltitude.current = THREE.MathUtils.clamp(
          droneAltitude.current + altitudeChange,
          PHYSICS.droneMinAltitude,
          PHYSICS.droneMaxAltitude
        );
      }
      
      // Smooth hovering motion with multiple oscillations for realism
      const hoverY = Math.sin(time * PHYSICS.droneHoverSpeed) * PHYSICS.droneHoverAmplitude;
      const microHover = Math.sin(time * 8) * 0.003;
      targetPos.y += (hoverY + microHover) * 0.5;
      
      // Advanced propeller physics with realistic counter-rotation
      propellersRef.current.forEach((propeller, index) => {
        if (propeller) {
          const baseSpeed = robotState.isMoving 
            ? PHYSICS.propellerSpeedActive 
            : PHYSICS.propellerSpeedIdle;
          
          // Counter-rotating pairs for stability
          const isClockwise = (index === 0 || index === 3);
          const direction = isClockwise ? 1 : -1;
          const rotationSpeed = baseSpeed + Math.sin(time * 2 + index) * 2;
          
          propeller.rotation.y += rotationSpeed * delta * direction;
          
          // Individual motor vibrations
          if (robotState.isMoving) {
            propeller.position.y = Math.sin(time * 25 + index * 1.5) * 0.001;
            propeller.rotation.x = Math.sin(time * 15 + index) * 0.005;
          } else {
            propeller.position.y = THREE.MathUtils.lerp(propeller.position.y, 0, delta * 5);
            propeller.rotation.x = THREE.MathUtils.lerp(propeller.rotation.x, 0, delta * 3);
          }
        }
      });
      
      // Realistic flight dynamics with banking and pitching
      if (robotState.isMoving) {
        const forwardTilt = -0.12;
        modelRef.current.rotation.x = THREE.MathUtils.lerp(
          modelRef.current.rotation.x,
          forwardTilt,
          delta * 3
        );
        
        const turnRate = angularVelocityRef.current;
        const bankAngle = THREE.MathUtils.clamp(turnRate * 4, -0.25, 0.25);
        modelRef.current.rotation.z = THREE.MathUtils.lerp(
          modelRef.current.rotation.z,
          bankAngle,
          delta * 4
        );
        
        const yawOscillation = Math.sin(time * 3) * 0.02;
        modelRef.current.rotation.y += yawOscillation * delta;
      } else {
        modelRef.current.rotation.x = THREE.MathUtils.lerp(
          modelRef.current.rotation.x,
          Math.sin(time * 1.5) * 0.01,
          delta * 5
        );
        modelRef.current.rotation.z = THREE.MathUtils.lerp(
          modelRef.current.rotation.z,
          Math.cos(time * 1.2) * 0.008,
          delta * 5
        );
      }
      
      // Apply target altitude smoothly
      modelRef.current.position.y = THREE.MathUtils.lerp(
        modelRef.current.position.y,
        droneAltitude.current,
        delta * 2
      );
      
      // Wind effect simulation
      if (Math.random() < 0.01) {
        const windStrength = 0.002;
        modelRef.current.position.x += (Math.random() - 0.5) * windStrength;
        modelRef.current.position.z += (Math.random() - 0.5) * windStrength;
        modelRef.current.rotation.z += (Math.random() - 0.5) * 0.01;
      }
    } else {
      // Original movement logic for GLTF models
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
    }

    // Rotation handling for all models
    if (!isDrone) {
      const targetRot = robotState.rotation.y;
      const currentRot = modelRef.current.rotation.y;
      const rotDiff = targetRot - currentRot;
      const normalizedDiff = ((rotDiff + Math.PI) % (Math.PI * 2)) - Math.PI;
      const rotSpeed = isMoving ? 0.15 : 0.08;
      modelRef.current.rotation.y += normalizedDiff * rotSpeed;

      // Enhanced bobbing animation for different robot types
      if (isMoving && currentAction) {
        const bobFrequency = isSpider ? 8 : isTank ? 2 : isExplorer ? 6 : 4;
        const bobAmplitude = isSpider ? 0.005 : isTank ? 0.002 : isExplorer ? 0.003 : 0.01;
        const bobOffset = Math.sin(Date.now() * 0.01 * bobFrequency) * bobAmplitude;
        modelRef.current.position.y = prevPositionRef.current.y + bobOffset;
      }
    }
  });

  // Safe explorer scaling to prevent crashes
  const explorerScale = Math.min(2.5, 5);
  const explorerFloatHeight = isExplorer ? 0.5 : 0;

  // Render drone procedurally or GLTF models
  if (isDrone) {
    return (
      <group ref={modelRef}>
        <DroneGeometry />
      </group>
    );
  }

  return (
    <primitive
      ref={modelRef}
      object={processedScene}
      position={isExplorer ? [0, explorerFloatHeight, 0] : [0, 0, 0]}
      rotation={[0, Math.PI, 0]}
      scale={
        isSpider
          ? [0.1, 0.1, 0.1]
          : isTank
          ? [0.3, 0.3, 0.3]
          : isExplorer
          ? [explorerScale, explorerScale, explorerScale]
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
