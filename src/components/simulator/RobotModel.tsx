import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { RobotConfig } from '@/types/robot.types';
import { useRobotStore } from '@/store/robotStore';
import * as THREE from 'three';

interface RobotModelProps {
  robotConfig: RobotConfig;
}

const RobotModel: React.FC<RobotModelProps> = ({ robotConfig }) => {
  const group = useRef<THREE.Group>();
  const { robotState } = useRobotStore();
  
  // Create robot models based on type
  const RobotGeometry = () => {
    switch (robotConfig.type) {
      case 'mobile':
        return (
          <>
            {/* Main body */}
            <mesh castShadow receiveShadow position={[0, 0.15, 0]}>
              <boxGeometry args={[0.3, 0.1, 0.4]} />
              <meshStandardMaterial color="#2563eb" metalness={0.6} roughness={0.2} />
            </mesh>
            
            {/* Top section */}
            <mesh castShadow position={[0, 0.25, -0.05]}>
              <boxGeometry args={[0.25, 0.1, 0.2]} />
              <meshStandardMaterial color="#1d4ed8" metalness={0.7} roughness={0.3} />
            </mesh>
            
            {/* Sensor array */}
            <mesh castShadow position={[0, 0.25, 0.15]}>
              <cylinderGeometry args={[0.05, 0.05, 0.05, 16]} />
              <meshStandardMaterial color="#000000" metalness={0.8} roughness={0.2} />
            </mesh>
            
            {/* Wheels */}
            {[[-0.17, 0, -0.15], [0.17, 0, -0.15], [-0.17, 0, 0.15], [0.17, 0, 0.15]].map((pos, i) => (
              <mesh key={i} castShadow position={pos} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.05, 0.05, 0.05, 16]} />
                <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
              </mesh>
            ))}
            
            {/* Status lights */}
            <pointLight color="#3b82f6" intensity={2} distance={0.3} position={[0, 0.3, 0.2]} />
            <pointLight color="#3b82f6" intensity={1} distance={0.2} position={[0.1, 0.2, -0.1]} />
          </>
        );
        
      case 'arm':
        return (
          <>
            {/* Base */}
            <mesh castShadow receiveShadow position={[0, 0.1, 0]}>
              <cylinderGeometry args={[0.2, 0.25, 0.2, 32]} />
              <meshStandardMaterial color="#374151" metalness={0.7} roughness={0.2} />
            </mesh>
            
            {/* Main arm segment */}
            <mesh castShadow position={[0, 0.5, 0]}>
              <boxGeometry args={[0.1, 0.6, 0.1]} />
              <meshStandardMaterial color="#2563eb" metalness={0.6} roughness={0.3} />
            </mesh>
            
            {/* Joint */}
            <mesh castShadow position={[0, 0.8, 0]}>
              <sphereGeometry args={[0.08, 16, 16]} />
              <meshStandardMaterial color="#1e40af" metalness={0.8} roughness={0.2} />
            </mesh>
            
            {/* Forearm */}
            <mesh castShadow position={[0, 0.8, 0.2]}>
              <boxGeometry args={[0.08, 0.08, 0.4]} />
              <meshStandardMaterial color="#2563eb" metalness={0.6} roughness={0.3} />
            </mesh>
            
            {/* Gripper base */}
            <mesh castShadow position={[0, 0.8, 0.4]}>
              <boxGeometry args={[0.15, 0.08, 0.08]} />
              <meshStandardMaterial color="#1e40af" metalness={0.7} roughness={0.2} />
            </mesh>
            
            {/* Gripper fingers */}
            {robotState?.isGrabbing ? (
              // Closed position
              <>
                <mesh castShadow position={[-0.05, 0.8, 0.45]}>
                  <boxGeometry args={[0.02, 0.05, 0.1]} />
                  <meshStandardMaterial color="#374151" metalness={0.8} roughness={0.2} />
                </mesh>
                <mesh castShadow position={[0.05, 0.8, 0.45]}>
                  <boxGeometry args={[0.02, 0.05, 0.1]} />
                  <meshStandardMaterial color="#374151" metalness={0.8} roughness={0.2} />
                </mesh>
              </>
            ) : (
              // Open position
              <>
                <mesh castShadow position={[-0.08, 0.8, 0.45]}>
                  <boxGeometry args={[0.02, 0.05, 0.1]} />
                  <meshStandardMaterial color="#374151" metalness={0.8} roughness={0.2} />
                </mesh>
                <mesh castShadow position={[0.08, 0.8, 0.45]}>
                  <boxGeometry args={[0.02, 0.05, 0.1]} />
                  <meshStandardMaterial color="#374151" metalness={0.8} roughness={0.2} />
                </mesh>
              </>
            )}
            
            {/* Status light */}
            <pointLight color="#3b82f6" intensity={1} distance={0.5} position={[0, 0.3, 0]} />
          </>
        );
        
      case 'drone':
        return (
          <>
            {/* Main body */}
            <mesh castShadow receiveShadow position={[0, 0.1, 0]}>
              <boxGeometry args={[0.2, 0.08, 0.2]} />
              <meshStandardMaterial color="#2563eb" metalness={0.6} roughness={0.2} />
            </mesh>
            
            {/* Arms */}
            {[[-0.15, 0.1, -0.15], [0.15, 0.1, -0.15], [-0.15, 0.1, 0.15], [0.15, 0.1, 0.15]].map((pos, i) => (
              <mesh key={i} castShadow position={pos}>
                <boxGeometry args={[0.05, 0.05, 0.05]} />
                <meshStandardMaterial color="#1e40af" metalness={0.7} roughness={0.3} />
              </mesh>
            ))}
            
            {/* Propellers */}
            {[[-0.15, 0.15, -0.15], [0.15, 0.15, -0.15], [-0.15, 0.15, 0.15], [0.15, 0.15, 0.15]].map((pos, i) => (
              <group key={i} position={pos}>
                <mesh castShadow rotation={[0, (robotState?.isMoving ? Date.now() * 0.05 : 0) + (i * Math.PI / 2), 0]}>
                  <cylinderGeometry args={[0.12, 0.12, 0.01, 16]} />
                  <meshStandardMaterial color="#94a3b8" metalness={0.6} roughness={0.4} opacity={0.8} transparent />
                </mesh>
                <pointLight color="#3b82f6" intensity={0.5} distance={0.2} />
              </group>
            ))}
            
            {/* Camera */}
            <mesh castShadow position={[0, 0.05, 0.1]}>
              <sphereGeometry args={[0.02, 16, 16]} />
              <meshStandardMaterial color="#000000" metalness={0.8} roughness={0.2} />
            </mesh>
            
            {/* Status lights */}
            <pointLight color="#22c55e" intensity={1} distance={0.2} position={[0.1, 0.1, -0.1]} />
            <pointLight color="#ef4444" intensity={1} distance={0.2} position={[-0.1, 0.1, -0.1]} />
          </>
        );
        
      default:
        return null;
    }
  };

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
  });

  return (
    <group ref={group} dispose={null}>
      <RobotGeometry />
    </group>
  );
};

export default RobotModel;