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
            {/* Main chassis frame */}
            <mesh castShadow receiveShadow position={[0, 0.15, 0]}>
              <boxGeometry args={[0.4, 0.2, 0.5]} />
              <meshStandardMaterial color="#e5e7eb" metalness={0.6} roughness={0.3} />
            </mesh>
            
            {/* Structural supports */}
            {[[-0.15, 0.15, 0], [0.15, 0.15, 0]].map((pos, i) => (
              <mesh key={i} castShadow position={pos}>
                <boxGeometry args={[0.05, 0.25, 0.45]} />
                <meshStandardMaterial color="#d1d5db" metalness={0.7} roughness={0.2} />
              </mesh>
            ))}
            
            {/* Sensor mount */}
            <mesh castShadow position={[0, 0.3, 0.1]}>
              <boxGeometry args={[0.15, 0.1, 0.1]} />
              <meshStandardMaterial color="#9ca3af" metalness={0.8} roughness={0.2} />
            </mesh>
            
            {/* Sensor array */}
            <mesh castShadow position={[0, 0.35, 0.12]}>
              <boxGeometry args={[0.1, 0.08, 0.06]} />
              <meshStandardMaterial color="#4b5563" metalness={0.9} roughness={0.1} />
            </mesh>
            
            {/* Large wheels */}
            {[[-0.22, 0.12, 0], [0.22, 0.12, 0]].map((pos, i) => (
              <group key={i} position={pos}>
                <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[0.12, 0.12, 0.05, 32]} />
                  <meshStandardMaterial color="#1f2937" metalness={0.7} roughness={0.3} />
                </mesh>
                {/* Wheel hub */}
                <mesh castShadow position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[0.04, 0.04, 0.06, 16]} />
                  <meshStandardMaterial color="#6b7280" metalness={0.8} roughness={0.2} />
                </mesh>
                {/* Treads */}
                {[...Array(12)].map((_, j) => (
                  <mesh key={j} position={[0, 0, 0]} rotation={[Math.PI / 2, (j * Math.PI) / 6, 0]}>
                    <boxGeometry args={[0.02, 0.051, 0.03]} />
                    <meshStandardMaterial color="#374151" metalness={0.6} roughness={0.4} />
                  </mesh>
                ))}
              </group>
            ))}
            
            {/* Orange accents */}
            {[[-0.2, 0.2, -0.24], [0.2, 0.2, -0.24], [-0.2, 0.2, 0.24], [0.2, 0.2, 0.24]].map((pos, i) => (
              <mesh key={i} castShadow position={pos}>
                <boxGeometry args={[0.05, 0.05, 0.02]} />
                <meshStandardMaterial color="#fb923c" metalness={0.6} roughness={0.3} />
              </mesh>
            ))}
          </>
        );
        
      case 'arm':
        return (
          <>
            {/* Base plate */}
            <mesh castShadow receiveShadow position={[0, 0.025, 0]}>
              <boxGeometry args={[0.3, 0.05, 0.3]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
            </mesh>
            
            {/* Base housing */}
            <mesh castShadow position={[0, 0.125, 0]}>
              <boxGeometry args={[0.2, 0.15, 0.2]} />
              <meshStandardMaterial color="#fb923c" metalness={0.7} roughness={0.3} />
            </mesh>
            
            {/* Rotation joint */}
            <mesh castShadow position={[0, 0.2, 0]}>
              <cylinderGeometry args={[0.08, 0.08, 0.1, 32]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
            </mesh>
            
            {/* Main arm */}
            <group position={[0, 0.25, 0]}>
              {/* First segment */}
              <mesh castShadow>
                <boxGeometry args={[0.08, 0.4, 0.05]} />
                <meshStandardMaterial color="#fb923c" metalness={0.7} roughness={0.3} />
              </mesh>
              
              {/* Structural details */}
              {[0.1, 0.2, 0.3].map((y) => (
                <mesh key={y} castShadow position={[0, y, 0]}>
                  <boxGeometry args={[0.1, 0.02, 0.07]} />
                  <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
                </mesh>
              ))}
            </group>
            
            {/* Elbow joint */}
            <group position={[0, 0.45, 0]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.04, 0.04, 0.1, 32]} />
                <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
              </mesh>
            </group>
            
            {/* Forearm */}
            <group position={[0, 0.45, 0.15]}>
              <mesh castShadow>
                <boxGeometry args={[0.06, 0.06, 0.3]} />
                <meshStandardMaterial color="#fb923c" metalness={0.7} roughness={0.3} />
              </mesh>
              
              {/* Structural reinforcements */}
              {[0.05, 0.15, 0.25].map((z) => (
                <mesh key={z} castShadow position={[0, 0, z]}>
                  <boxGeometry args={[0.08, 0.08, 0.02]} />
                  <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
                </mesh>
              ))}
            </group>
            
            {/* Wrist */}
            <group position={[0, 0.45, 0.3]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.03, 0.03, 0.08, 32]} />
                <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
              </mesh>
            </group>
            
            {/* Gripper base */}
            <group position={[0, 0.45, 0.35]}>
              <mesh castShadow>
                <boxGeometry args={[0.1, 0.06, 0.06]} />
                <meshStandardMaterial color="#1f2937" metalness={0.8} roughness={0.2} />
              </mesh>
            </group>
            
            {/* Gripper fingers */}
            {robotState?.isGrabbing ? (
              // Closed position
              <>
                {[-0.03, 0.03].map((x) => (
                  <group key={x} position={[x, 0.45, 0.4]}>
                    <mesh castShadow>
                      <boxGeometry args={[0.02, 0.1, 0.02]} />
                      <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
                    </mesh>
                    <mesh castShadow position={[0, 0.05, 0.01]}>
                      <boxGeometry args={[0.02, 0.02, 0.04]} />
                      <meshStandardMaterial color="#1f2937" metalness={0.7} roughness={0.3} />
                    </mesh>
                  </group>
                ))}
              </>
            ) : (
              // Open position
              <>
                {[-0.05, 0.05].map((x) => (
                  <group key={x} position={[x, 0.45, 0.4]}>
                    <mesh castShadow>
                      <boxGeometry args={[0.02, 0.1, 0.02]} />
                      <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
                    </mesh>
                    <mesh castShadow position={[0, 0.05, 0.01]}>
                      <boxGeometry args={[0.02, 0.02, 0.04]} />
                      <meshStandardMaterial color="#1f2937" metalness={0.7} roughness={0.3} />
                    </mesh>
                  </group>
                ))}
              </>
            )}
          </>
        );
        
      case 'drone':
        return (
          <>
            {/* Main body - matches DJI Mavic style */}
            <mesh castShadow receiveShadow position={[0, 0.08, 0]}>
              <boxGeometry args={[0.25, 0.08, 0.3]} />
              <meshStandardMaterial color="#64748b" metalness={0.7} roughness={0.3} />
            </mesh>
            
            {/* Top shell with vents */}
            <mesh castShadow position={[0, 0.12, 0]}>
              <boxGeometry args={[0.23, 0.04, 0.28]} />
              <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.2} />
            </mesh>
            
            {/* Camera gimbal housing */}
            <group position={[0, 0.06, 0.12]}>
              <mesh castShadow>
                <boxGeometry args={[0.1, 0.1, 0.1]} />
                <meshStandardMaterial color="#1f2937" metalness={0.9} roughness={0.1} />
              </mesh>
              
              {/* Camera lenses */}
              {[-0.02, 0.02].map((x) => (
                <mesh key={x} position={[x, -0.02, 0.05]}>
                  <cylinderGeometry args={[0.015, 0.015, 0.02, 16]} />
                  <meshStandardMaterial color="#000000" metalness={1} roughness={0} />
                </mesh>
              ))}
            </group>
            
            {/* Arms with foldable design */}
            {[[-0.2, 0.08, -0.2], [0.2, 0.08, -0.2], [-0.2, 0.08, 0.2], [0.2, 0.08, 0.2]].map((pos, i) => (
              <group key={i} position={pos}>
                {/* Arm segment */}
                <mesh castShadow>
                  <boxGeometry args={[0.04, 0.03, 0.15]} />
                  <meshStandardMaterial color="#64748b" metalness={0.7} roughness={0.3} />
                </mesh>
                
                {/* Motor mount */}
                <mesh castShadow position={[0, 0.03, 0]}>
                  <cylinderGeometry args={[0.025, 0.025, 0.04, 16]} />
                  <meshStandardMaterial color="#1f2937" metalness={0.9} roughness={0.1} />
                </mesh>
                
                {/* Motor */}
                <mesh castShadow position={[0, 0.05, 0]}>
                  <cylinderGeometry args={[0.02, 0.02, 0.03, 16]} />
                  <meshStandardMaterial color="#000000" metalness={1} roughness={0} />
                </mesh>
                
                {/* Propeller with orange tips */}
                <group position={[0, 0.07, 0]}>
                  <mesh castShadow rotation={[0, robotState?.isMoving ? Date.now() * 0.05 : 0, 0]}>
                    <cylinderGeometry args={[0.15, 0.15, 0.002, 32]} />
                    <meshStandardMaterial 
                      color="#1f2937" 
                      metalness={0.6} 
                      roughness={0.4}
                      opacity={robotState?.isMoving ? 0.6 : 0.9}
                      transparent
                    />
                  </mesh>
                  
                  {/* Orange propeller tips */}
                  {[0, Math.PI].map((angle) => (
                    <mesh 
                      key={angle} 
                      position={[Math.cos(angle) * 0.14, 0.001, Math.sin(angle) * 0.14]}
                      rotation={[0, robotState?.isMoving ? Date.now() * 0.05 : 0, 0]}
                    >
                      <boxGeometry args={[0.02, 0.002, 0.02]} />
                      <meshStandardMaterial color="#fb923c" metalness={0.6} roughness={0.3} />
                    </mesh>
                  ))}
                </group>
              </group>
            ))}
            
            {/* Navigation lights */}
            {[[-0.12, 0.04, -0.14], [0.12, 0.04, -0.14]].map((pos, i) => (
              <pointLight
                key={i}
                color={i === 0 ? "#22c55e" : "#ef4444"}
                intensity={1}
                distance={0.2}
                position={pos}
              />
            ))}
            
            {/* Status LED */}
            <pointLight
              color="#3b82f6"
              intensity={1}
              distance={0.2}
              position={[0, 0.14, -0.14]}
            />
          </>
        );
        
      default:
        return null;
    }
  };

  useFrame((state, delta) => {
    if (!group.current || !robotState) return;
    
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
    
    if (robotConfig.type === 'drone') {
      group.current.position.y += Math.sin(state.clock.elapsedTime * 2) * 0.001;
    }
  });

  return (
    <group ref={group} dispose={null}>
      <RobotGeometry />
    </group>
  );
};

export default RobotModel;