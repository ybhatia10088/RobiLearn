import React, { useRef, useEffect } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { RobotConfig, RobotState } from '@/types/robot.types';
import { useRobotStore } from '@/store/robotStore';
import * as THREE from 'three';

interface RobotModelProps {
  robotConfig: RobotConfig;
}

const RobotModel: React.FC<RobotModelProps> = ({ robotConfig }) => {
  const group = useRef<THREE.Group>();
  const { robotState } = useRobotStore();
  
  // Load the appropriate model based on robot type
  const modelPath = `/models/${robotConfig.type}.glb`;
  const { scene, animations } = useGLTF(modelPath);
  const { actions, mixer } = useAnimations(animations, group);
  
  // Clone the scene to avoid sharing materials between instances
  const modelScene = React.useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((node) => {
      if (node instanceof THREE.Mesh) {
        // Enhance materials for better visual quality
        if (node.material) {
          const material = node.material.clone();
          material.roughness = 0.7;
          material.metalness = 0.3;
          material.envMapIntensity = 1;
          node.material = material;
          
          // Add custom shader for robot highlights
          if (robotConfig.type === 'mobile' || robotConfig.type === 'drone') {
            material.onBeforeCompile = (shader) => {
              shader.fragmentShader = shader.fragmentShader.replace(
                '#include <common>',
                `
                #include <common>
                uniform float glowIntensity;
                varying vec3 vNormal;
                `
              );
              
              shader.fragmentShader = shader.fragmentShader.replace(
                '#include <output_fragment>',
                `
                #include <output_fragment>
                float rim = smoothstep(0.5, 1.0, 1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)));
                gl_FragColor.rgb += rim * vec3(0.2, 0.5, 1.0) * glowIntensity;
                `
              );
            };
          }
        }
      }
    });
    return clone;
  }, [scene, robotConfig.type]);

  // Handle animations based on robot state
  useEffect(() => {
    if (robotState?.isMoving) {
      if (actions.walk) actions.walk.play();
      if (actions.move) actions.move.play();
      if (actions.propeller && robotConfig.type === 'drone') {
        actions.propeller.setEffectiveTimeScale(3);
        actions.propeller.play();
      }
    } else {
      if (actions.walk) actions.walk.stop();
      if (actions.move) actions.move.stop();
      if (actions.propeller) actions.propeller.setEffectiveTimeScale(1);
    }
    
    if (robotState?.isGrabbing) {
      if (actions.grab) actions.grab.play();
    } else {
      if (actions.grab) actions.grab.stop();
    }
  }, [actions, robotState?.isMoving, robotState?.isGrabbing]);

  // Update robot position and rotation
  useFrame((state, delta) => {
    if (!group.current || !robotState) return;
    
    // Smooth position and rotation updates
    const targetPos = new THREE.Vector3(
      robotState.position.x,
      robotState.position.y,
      robotState.position.z
    );
    
    const currentPos = group.current.position;
    currentPos.lerp(targetPos, 0.1);
    
    const targetRot = new THREE.Euler(0, robotState.rotation.y, 0);
    const currentRot = group.current.rotation;
    currentRot.x = THREE.MathUtils.lerp(currentRot.x, targetRot.x, 0.1);
    currentRot.y = THREE.MathUtils.lerp(currentRot.y, targetRot.y, 0.1);
    currentRot.z = THREE.MathUtils.lerp(currentRot.z, targetRot.z, 0.1);
    
    // Update joint positions for robotic arms
    if (robotConfig.type === 'arm' && robotState.currentJointCommand) {
      const { joint, direction, speed } = robotState.currentJointCommand;
      const jointMesh = group.current.getObjectByName(joint);
      if (jointMesh) {
        const rotationDelta = direction === 'left' ? -speed * delta : speed * delta;
        jointMesh.rotation.y += rotationDelta;
      }
    }
    
    // Update mixer for animations
    if (mixer) mixer.update(delta);
  });

  // Add visual effects based on robot type
  const Effects = () => {
    switch (robotConfig.type) {
      case 'drone':
        return (
          <>
            {/* Propeller blur effect */}
            <mesh position={[0, 0.2, 0]} rotation={[0, 0, Math.PI / 4]}>
              <torusGeometry args={[0.3, 0.01, 16, 100]} />
              <meshPhongMaterial color="#ffffff" opacity={0.2} transparent />
            </mesh>
            {/* Engine glow */}
            <pointLight color="#00ffff" intensity={1} distance={0.5} position={[0, 0.1, 0]} />
          </>
        );
      
      case 'mobile':
        return (
          <>
            {/* Ground effect */}
            <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[0.5, 0.8]} />
              <meshBasicMaterial color="#3b82f6" opacity={0.1} transparent />
            </mesh>
            {/* Status lights */}
            <pointLight color="#3b82f6" intensity={0.5} distance={0.3} position={[0.2, 0.1, 0]} />
          </>
        );
      
      default:
        return null;
    }
  };

  return (
    <group ref={group} dispose={null}>
      <primitive object={modelScene} scale={robotConfig.type === 'arm' ? 0.5 : 0.2} />
      <Effects />
    </group>
  );
};

export default RobotModel;