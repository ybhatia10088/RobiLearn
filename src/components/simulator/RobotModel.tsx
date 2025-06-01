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
            {/* Chassis base */}
            <mesh castShadow receiveShadow position={[0, 0.12, 0]}>
              <boxGeometry args={[0.35, 0.08, 0.45]} />
              <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
            </mesh>
            
            {/* Upper body with cooling vents */}
            <mesh castShadow position={[0, 0.22, 0]}>
              <boxGeometry args={[0.32, 0.12, 0.42]} />
              <meshStandardMaterial color="#2563eb" metalness={0.7} roughness={0.3} />
            </mesh>
            
            {/* Cooling vents */}
            {[...Array(3)].map((_, i) => (
              <mesh key={i} position={[0, 0.22, -0.15 + (i * 0.15)]}>
                <boxGeometry args={[0.33, 0.02, 0.02]} />
                <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.1} />
              </mesh>
            ))}
            
            {/* Sensor housing */}
            <mesh castShadow position={[0, 0.28, 0.18]}>
              <cylinderGeometry args={[0.06, 0.07, 0.08, 16]} />
              <meshStandardMaterial color="#1e40af" metalness={0.8} roughness={0.2} />
            </mesh>
            
            {/* LIDAR sensor */}
            <mesh castShadow position={[0, 0.32, 0.18]} rotation={[0, robotState?.isMoving ? Date.now() * 0.005 : 0, 0]}>
              <cylinderGeometry args={[0.05, 0.05, 0.04, 16]} />
              <meshStandardMaterial color="#000000" metalness={0.9} roughness={0.1} />
            </mesh>
            
            {/* Front cameras */}
            {[-0.08, 0.08].map((x, i) => (
              <group key={i} position={[x, 0.25, 0.21]}>
                <mesh castShadow>
                  <boxGeometry args={[0.04, 0.04, 0.02]} />
                  <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
                </mesh>
                <mesh position={[0, 0, 0.01]}>
                  <circleGeometry args={[0.01, 16]} />
                  <meshStandardMaterial color="#000000" metalness={0.9} roughness={0.1} />
                </mesh>
              </group>
            ))}
            
            {/* Wheels with detailed treads */}
            {[[-0.19, 0.08, -0.18], [0.19, 0.08, -0.18], [-0.19, 0.08, 0.18], [0.19, 0.08, 0.18]].map((pos, i) => (
              <group key={i} position={pos}>
                <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[0.08, 0.08, 0.04, 24]} />
                  <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} />
                </mesh>
                {/* Wheel hub */}
                <mesh castShadow position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[0.03, 0.03, 0.042, 12]} />
                  <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.1} />
                </mesh>
                {/* Tread details */}
                {[...Array(8)].map((_, j) => (
                  <mesh key={j} position={[0, 0, 0]} rotation={[Math.PI / 2, (j * Math.PI) / 4, 0]}>
                    <boxGeometry args={[0.01, 0.041, 0.02]} />
                    <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.4} />
                  </mesh>
                ))}
              </group>
            ))}
            
            {/* Status lights and indicators */}
            <pointLight color="#22c55e" intensity={2} distance={0.3} position={[0.1, 0.25, 0.22]} />
            <pointLight color="#3b82f6" intensity={1.5} distance={0.2} position={[-0.1, 0.25, 0.22]} />
            
            {/* Bottom glow for hover effect */}
            <pointLight color="#3b82f6" intensity={1} distance={0.3} position={[0, 0.05, 0]} />
          </>
        );
        
      case 'arm':
        return (
          <>
            {/* Heavy-duty base */}
            <mesh castShadow receiveShadow position={[0, 0.1, 0]}>
              <cylinderGeometry args={[0.25, 0.3, 0.2, 32]} />
              <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
            </mesh>
            
            {/* Base rotation mechanism */}
            <mesh castShadow position={[0, 0.2, 0]}>
              <cylinderGeometry args={[0.2, 0.2, 0.1, 32]} />
              <meshStandardMaterial color="#2563eb" metalness={0.7} roughness={0.3} />
            </mesh>
            
            {/* Main arm segment with hydraulics */}
            <group position={[0, 0.3, 0]}>
              <mesh castShadow>
                <boxGeometry args={[0.12, 0.7, 0.1]} />
                <meshStandardMaterial color="#1e40af" metalness={0.6} roughness={0.3} />
              </mesh>
              
              {/* Hydraulic cylinder */}
              <mesh castShadow position={[0.08, 0.2, 0]}>
                <cylinderGeometry args={[0.02, 0.02, 0.4, 12]} />
                <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.1} />
              </mesh>
              
              {/* Hydraulic piston */}
              <mesh castShadow position={[0.08, 0.4, 0]}>
                <cylinderGeometry args={[0.015, 0.015, 0.2, 12]} />
                <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
              </mesh>
            </group>
            
            {/* Elbow joint with detailed mechanism */}
            <group position={[0, 0.8, 0]}>
              <mesh castShadow>
                <sphereGeometry args={[0.08, 24, 24]} />
                <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
              </mesh>
              
              {/* Joint covers */}
              {[-0.04, 0.04].map((x, i) => (
                <mesh key={i} castShadow position={[x, 0, 0]}>
                  <cylinderGeometry args={[0.04, 0.04, 0.02, 16]} />
                  <meshStandardMaterial color="#2563eb" metalness={0.7} roughness={0.3} />
                </mesh>
              ))}
            </group>
            
            {/* Forearm with cable management */}
            <group position={[0, 0.8, 0.25]}>
              <mesh castShadow>
                <boxGeometry args={[0.08, 0.08, 0.5]} />
                <meshStandardMaterial color="#1e40af" metalness={0.6} roughness={0.3} />
              </mesh>
              
              {/* Cable track */}
              <mesh castShadow position={[0.05, 0, 0]}>
                <boxGeometry args={[0.02, 0.03, 0.48]} />
                <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.4} />
              </mesh>
            </group>
            
            {/* Wrist mechanism */}
            <group position={[0, 0.8, 0.5]}>
              <mesh castShadow>
                <sphereGeometry args={[0.06, 24, 24]} />
                <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
              </mesh>
              
              {/* Rotation indicators */}
              {[-0.03, 0.03].map((x, i) => (
                <mesh key={i} castShadow position={[x, 0, 0]}>
                  <cylinderGeometry args={[0.02, 0.02, 0.08, 12]} />
                  <meshStandardMaterial color="#3b82f6" metalness={0.7} roughness={0.3} />
                </mesh>
              ))}
            </group>
            
            {/* Gripper mechanism */}
            <group position={[0, 0.8, 0.6]}>
              {/* Gripper base */}
              <mesh castShadow>
                <boxGeometry args={[0.15, 0.08, 0.1]} />
                <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.2} />
              </mesh>
              
              {/* Gripper fingers with detailed joints */}
              {robotState?.isGrabbing ? (
                // Closed position
                <>
                  {[-0.06, 0.06].map((x, i) => (
                    <group key={i} position={[x, 0, 0.05]}>
                      <mesh castShadow>
                        <boxGeometry args={[0.02, 0.06, 0.12]} />
                        <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.2} />
                      </mesh>
                      {/* Finger grips */}
                      <mesh castShadow position={[0, 0, 0.06]} rotation={[0.3, 0, 0]}>
                        <boxGeometry args={[0.02, 0.02, 0.04]} />
                        <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.4} />
                      </mesh>
                    </group>
                  ))}
                </>
              ) : (
                // Open position
                <>
                  {[-0.09, 0.09].map((x, i) => (
                    <group key={i} position={[x, 0, 0.05]}>
                      <mesh castShadow>
                        <boxGeometry args={[0.02, 0.06, 0.12]} />
                        <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.2} />
                      </mesh>
                      {/* Finger grips */}
                      <mesh castShadow position={[0, 0, 0.06]} rotation={[0.3, 0, 0]}>
                        <boxGeometry args={[0.02, 0.02, 0.04]} />
                        <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.4} />
                      </mesh>
                    </group>
                  ))}
                </>
              )}
            </group>
            
            {/* Status lights and indicators */}
            <pointLight color="#22c55e" intensity={1.5} distance={0.4} position={[0.15, 0.3, 0]} />
            <pointLight color="#3b82f6" intensity={1} distance={0.3} position={[-0.15, 0.3, 0]} />
          </>
        );
        
      case 'drone':
        return (
          <>
            {/* Central body with carbon fiber texture */}
            <mesh castShadow receiveShadow position={[0, 0.1, 0]}>
              <boxGeometry args={[0.25, 0.06, 0.25]} />
              <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} />
            </mesh>
            
            {/* Upper body with vents */}
            <mesh castShadow position={[0, 0.13, 0]}>
              <boxGeometry args={[0.2, 0.04, 0.2]} />
              <meshStandardMaterial color="#2563eb" metalness={0.7} roughness={0.3} />
            </mesh>
            
            {/* Cooling vents */}
            {[...Array(3)].map((_, i) => (
              <mesh key={i} position={[0, 0.13, -0.06 + (i * 0.06)]}>
                <boxGeometry args={[0.18, 0.02, 0.01]} />
                <meshStandardMaterial color="#000000" metalness={0.9} roughness={0.1} />
              </mesh>
            ))}
            
            {/* Arms with detailed structure */}
            {[[-0.18, 0.1, -0.18], [0.18, 0.1, -0.18], [-0.18, 0.1, 0.18], [0.18, 0.1, 0.18]].map((pos, i) => (
              <group key={i} position={pos}>
                {/* Main arm */}
                <mesh castShadow>
                  <boxGeometry args={[0.04, 0.04, 0.04]} />
                  <meshStandardMaterial color="#1e40af" metalness={0.7} roughness={0.3} />
                </mesh>
                
                {/* Motor mount */}
                <mesh castShadow position={[0, 0.04, 0]}>
                  <cylinderGeometry args={[0.03, 0.03, 0.04, 12]} />
                  <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.2} />
                </mesh>
                
                {/* Motor */}
                <mesh castShadow position={[0, 0.06, 0]}>
                  <cylinderGeometry args={[0.025, 0.025, 0.03, 12]} />
                  <meshStandardMaterial color="#000000" metalness={0.9} roughness={0.1} />
                </mesh>
              </group>
            ))}
            
            {/* Propellers with realistic motion blur */}
            {[[-0.18, 0.15, -0.18], [0.18, 0.15, -0.18], [-0.18, 0.15, 0.18], [0.18, 0.15, 0.18]].map((pos, i) => (
              <group key={i} position={pos}>
                {/* Spinning propellers */}
                <mesh castShadow rotation={[0, (robotState?.isMoving ? Date.now() * 0.05 : 0) + (i * Math.PI / 2), 0]}>
                  <cylinderGeometry args={[0.15, 0.15, 0.002, 24]} />
                  <meshStandardMaterial 
                    color="#94a3b8" 
                    metalness={0.6} 
                    roughness={0.4} 
                    opacity={robotState?.isMoving ? 0.6 : 0.9} 
                    transparent 
                  />
                </mesh>
                
                {/* Propeller hub */}
                <mesh castShadow position={[0, 0.002, 0]}>
                  <cylinderGeometry args={[0.01, 0.01, 0.004, 12]} />
                  <meshStandardMaterial color="#000000" metalness={0.9} roughness={0.1} />
                </mesh>
                
                {/* LED ring */}
                <mesh castShadow position={[0, -0.002, 0]}>
                  <torusGeometry args={[0.02, 0.002, 16, 32]} />
                  <meshStandardMaterial 
                    color={i % 2 === 0 ? "#22c55e" : "#ef4444"} 
                    emissive={i % 2 === 0 ? "#22c55e" : "#ef4444"}
                    emissiveIntensity={0.5}
                  />
                </mesh>
              </group>
            ))}
            
            {/* Camera gimbal */}
            <group position={[0, 0.08, 0.1]}>
              {/* Gimbal base */}
              <mesh castShadow>
                <boxGeometry args={[0.06, 0.04, 0.04]} />
                <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
              </mesh>
              
              {/* Camera housing */}
              <mesh castShadow position={[0, -0.02, 0.02]}>
                <boxGeometry args={[0.04, 0.04, 0.04]} />
                <meshStandardMaterial color="#000000" metalness={0.9} roughness={0.1} />
              </mesh>
              
              {/* Lens */}
              <mesh position={[0, -0.02, 0.04]}>
                <cylinderGeometry args={[0.01, 0.01, 0.02, 16]} />
                <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.1} />
              </mesh>
            </group>
            
            {/* GPS antenna */}
            <mesh castShadow position={[0, 0.15, 0]}>
              <cylinderGeometry args={[0.01, 0.01, 0.02, 12]} />
              <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.2} />
            </mesh>
            
            {/* Status lights and navigation lights */}
            <pointLight color="#22c55e" intensity={1.5} distance={0.2} position={[0.18, 0.1, 0.18]} />
            <pointLight color="#ef4444" intensity={1.5} distance={0.2} position={[-0.18, 0.1, 0.18]} />
            <pointLight color="#3b82f6" intensity={1} distance={0.3} position={[0, 0.1, -0.18]} />
          </>
        );
        
      default:
        return null;
    }
  };

  // Update robot position and rotation with smooth interpolation
  useFrame((state, delta) => {
    if (!group.current || !robotState) return;
    
    // Smooth position updates
    const targetPos = new THREE.Vector3(
      robotState.position.x,
      robotState.position.y,
      robotState.position.z
    );
    
    const currentPos = group.current.position;
    currentPos.lerp(targetPos, 0.1);
    
    // Smooth rotation updates
    const targetRot = new THREE.Euler(0, robotState.rotation.y, 0);
    const currentRot = group.current.rotation;
    currentRot.x = THREE.MathUtils.lerp(currentRot.x, targetRot.x, 0.1);
    currentRot.y = THREE.MathUtils.lerp(currentRot.y, targetRot.y, 0.1);
    currentRot.z = THREE.MathUtils.lerp(currentRot.z, targetRot.z, 0.1);
    
    // Add subtle hover effect for drones
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