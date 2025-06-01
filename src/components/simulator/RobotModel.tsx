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
            {/* Base frame with LEGO Mindstorms style */}
            <mesh castShadow receiveShadow position={[0, 0.1, 0]}>
              <boxGeometry args={[0.45, 0.15, 0.6]} />
              <meshStandardMaterial color="#e2e8f0" metalness={0.4} roughness={0.6} />
            </mesh>

            {/* Structural beams */}
            {[...Array(6)].map((_, i) => (
              <mesh key={i} castShadow position={[-0.2 + i * 0.08, 0.15, 0]}>
                <boxGeometry args={[0.05, 0.3, 0.5]} />
                <meshStandardMaterial color="#cbd5e1" metalness={0.5} roughness={0.5} />
              </mesh>
            ))}

            {/* Sensor mount with details */}
            <group position={[0, 0.3, 0.2]}>
              <mesh castShadow>
                <boxGeometry args={[0.2, 0.1, 0.15]} />
                <meshStandardMaterial color="#94a3b8" metalness={0.6} roughness={0.4} />
              </mesh>
              
              {/* Sensor lenses */}
              {[-0.05, 0.05].map((x) => (
                <mesh key={x} castShadow position={[x, 0, 0.08]}>
                  <cylinderGeometry args={[0.02, 0.02, 0.02, 16]} />
                  <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
                </mesh>
              ))}
            </group>

            {/* Large wheels with treads */}
            {[[-0.25, 0.15, 0], [0.25, 0.15, 0]].map((pos, i) => (
              <group key={i} position={pos}>
                {/* Main wheel */}
                <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[0.15, 0.15, 0.08, 32]} />
                  <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.3} />
                </mesh>
                
                {/* Wheel hub */}
                <mesh castShadow position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[0.05, 0.05, 0.09, 16]} />
                  <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.2} />
                </mesh>
                
                {/* Detailed treads */}
                {[...Array(16)].map((_, j) => (
                  <group key={j} rotation={[0, (j * Math.PI) / 8, 0]}>
                    <mesh castShadow position={[0, 0, 0.15]}>
                      <boxGeometry args={[0.04, 0.07, 0.02]} />
                      <meshStandardMaterial color="#475569" metalness={0.6} roughness={0.4} />
                    </mesh>
                  </group>
                ))}
              </group>
            ))}

            {/* Orange accents and technical details */}
            {[[-0.2, 0.25, -0.25], [0.2, 0.25, -0.25], [-0.2, 0.25, 0.25], [0.2, 0.25, 0.25]].map((pos, i) => (
              <mesh key={i} castShadow position={pos}>
                <boxGeometry args={[0.06, 0.06, 0.03]} />
                <meshStandardMaterial color="#fb923c" metalness={0.6} roughness={0.3} />
              </mesh>
            ))}

            {/* Technical details */}
            {[...Array(4)].map((_, i) => (
              <mesh key={i} castShadow position={[0, 0.2, -0.2 + i * 0.15]}>
                <boxGeometry args={[0.3, 0.02, 0.02]} />
                <meshStandardMaterial color="#94a3b8" metalness={0.7} roughness={0.3} />
              </mesh>
            ))}
          </>
        );

      case 'arm':
        return (
          <>
            {/* Heavy base with ventilation */}
            <group position={[0, 0, 0]}>
              <mesh castShadow receiveShadow>
                <boxGeometry args={[0.4, 0.1, 0.4]} />
                <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
              </mesh>
              
              {/* Ventilation grills */}
              {[...Array(3)].map((_, i) => (
                <mesh key={i} castShadow position={[0, 0.05, -0.1 + i * 0.1]}>
                  <boxGeometry args={[0.35, 0.02, 0.02]} />
                  <meshStandardMaterial color="#1f2937" metalness={0.9} roughness={0.1} />
                </mesh>
              ))}
            </group>

            {/* Main rotating base */}
            <group position={[0, 0.1, 0]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.15, 0.18, 0.15, 32]} />
                <meshStandardMaterial color="#fb923c" metalness={0.7} roughness={0.3} />
              </mesh>
              
              {/* Mechanical details */}
              {[...Array(8)].map((_, i) => (
                <mesh key={i} castShadow position={[
                  Math.cos(i * Math.PI / 4) * 0.16,
                  0.07,
                  Math.sin(i * Math.PI / 4) * 0.16
                ]}>
                  <cylinderGeometry args={[0.015, 0.015, 0.02, 8]} />
                  <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.2} />
                </mesh>
              ))}
            </group>

            {/* First arm segment */}
            <group position={[0, 0.25, 0]}>
              <mesh castShadow>
                <boxGeometry args={[0.1, 0.4, 0.08]} />
                <meshStandardMaterial color="#fb923c" metalness={0.7} roughness={0.3} />
              </mesh>
              
              {/* Structural reinforcements */}
              {[0.1, 0.2, 0.3].map((y) => (
                <mesh key={y} castShadow position={[0, y, 0]}>
                  <boxGeometry args={[0.12, 0.03, 0.1]} />
                  <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
                </mesh>
              ))}
            </group>

            {/* Elbow joint with detailed mechanism */}
            <group position={[0, 0.45, 0]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.06, 0.06, 0.12, 32]} />
                <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
              </mesh>
              
              {/* Joint details */}
              {[-0.04, 0.04].map((x) => (
                <mesh key={x} castShadow position={[x, 0, 0]}>
                  <cylinderGeometry args={[0.02, 0.02, 0.14, 16]} />
                  <meshStandardMaterial color="#1f2937" metalness={0.9} roughness={0.1} />
                </mesh>
              ))}
            </group>

            {/* Forearm with precision mechanisms */}
            <group position={[0, 0.45, 0.2]}>
              <mesh castShadow>
                <boxGeometry args={[0.08, 0.08, 0.35]} />
                <meshStandardMaterial color="#fb923c" metalness={0.7} roughness={0.3} />
              </mesh>
              
              {/* Cable routing and details */}
              {[0.1, 0.2, 0.3].map((z) => (
                <group key={z}>
                  <mesh castShadow position={[0.04, 0, z]}>
                    <cylinderGeometry args={[0.01, 0.01, 0.35, 8]} />
                    <meshStandardMaterial color="#1f2937" metalness={0.9} roughness={0.1} />
                  </mesh>
                  <mesh castShadow position={[-0.04, 0, z]}>
                    <cylinderGeometry args={[0.01, 0.01, 0.35, 8]} />
                    <meshStandardMaterial color="#1f2937" metalness={0.9} roughness={0.1} />
                  </mesh>
                </group>
              ))}
            </group>

            {/* Wrist mechanism */}
            <group position={[0, 0.45, 0.4]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.04, 0.04, 0.1, 32]} />
                <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
              </mesh>
            </group>

            {/* Gripper mechanism */}
            <group position={[0, 0.45, 0.45]}>
              {/* Gripper base */}
              <mesh castShadow>
                <boxGeometry args={[0.12, 0.08, 0.08]} />
                <meshStandardMaterial color="#1f2937" metalness={0.8} roughness={0.2} />
              </mesh>

              {/* Gripper fingers with animation */}
              {robotState?.isGrabbing ? (
                // Closed position
                <>
                  {[-0.04, 0.04].map((x) => (
                    <group key={x} position={[x, 0, 0.06]}>
                      <mesh castShadow>
                        <boxGeometry args={[0.02, 0.12, 0.02]} />
                        <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
                      </mesh>
                      <mesh castShadow position={[x > 0 ? -0.01 : 0.01, 0.06, 0.01]}>
                        <boxGeometry args={[0.02, 0.02, 0.04]} />
                        <meshStandardMaterial color="#1f2937" metalness={0.7} roughness={0.3} />
                      </mesh>
                    </group>
                  ))}
                </>
              ) : (
                // Open position
                <>
                  {[-0.06, 0.06].map((x) => (
                    <group key={x} position={[x, 0, 0.06]}>
                      <mesh castShadow>
                        <boxGeometry args={[0.02, 0.12, 0.02]} />
                        <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
                      </mesh>
                      <mesh castShadow position={[x > 0 ? -0.01 : 0.01, 0.06, 0.01]}>
                        <boxGeometry args={[0.02, 0.02, 0.04]} />
                        <meshStandardMaterial color="#1f2937" metalness={0.7} roughness={0.3} />
                      </mesh>
                    </group>
                  ))}
                </>
              )}
            </group>
          </>
        );

      case 'drone':
        return (
          <>
            {/* Main body - DJI Mavic style */}
            <group position={[0, 0, 0]}>
              {/* Core body */}
              <mesh castShadow receiveShadow>
                <boxGeometry args={[0.25, 0.08, 0.35]} />
                <meshStandardMaterial color="#64748b" metalness={0.7} roughness={0.3} />
              </mesh>

              {/* Top shell with cooling vents */}
              <mesh castShadow position={[0, 0.04, 0]}>
                <boxGeometry args={[0.23, 0.04, 0.33]} />
                <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.2} />
              </mesh>

              {/* Detailed vents */}
              {[...Array(5)].map((_, i) => (
                <mesh key={i} castShadow position={[0, 0.06, -0.12 + i * 0.06]}>
                  <boxGeometry args={[0.2, 0.01, 0.01]} />
                  <meshStandardMaterial color="#1f2937" metalness={0.9} roughness={0.1} />
                </mesh>
              ))}
            </group>

            {/* Advanced camera gimbal */}
            <group position={[0, -0.02, 0.15]}>
              {/* Gimbal housing */}
              <mesh castShadow>
                <boxGeometry args={[0.12, 0.12, 0.12]} />
                <meshStandardMaterial color="#1f2937" metalness={0.9} roughness={0.1} />
              </mesh>

              {/* Dual camera system */}
              <group position={[0, -0.02, 0.06]}>
                {[-0.03, 0.03].map((x) => (
                  <mesh key={x} castShadow position={[x, 0, 0]}>
                    <cylinderGeometry args={[0.015, 0.015, 0.02, 32]} />
                    <meshStandardMaterial color="#000000" metalness={1} roughness={0} />
                  </mesh>
                ))}
              </group>

              {/* Gimbal detail */}
              <mesh castShadow position={[0, 0, 0.06]}>
                <boxGeometry args={[0.14, 0.02, 0.02]} />
                <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.2} />
              </mesh>
            </group>

            {/* Arms with folding mechanism */}
            {[[-0.2, 0, -0.2], [0.2, 0, -0.2], [-0.2, 0, 0.2], [0.2, 0, 0.2]].map((pos, i) => (
              <group key={i} position={pos}>
                {/* Arm structure */}
                <mesh castShadow>
                  <boxGeometry args={[0.05, 0.04, 0.2]} />
                  <meshStandardMaterial color="#64748b" metalness={0.7} roughness={0.3} />
                </mesh>

                {/* Folding joint */}
                <mesh castShadow position={[0, 0, 0.1]}>
                  <cylinderGeometry args={[0.02, 0.02, 0.06, 16]} />
                  <meshStandardMaterial color="#1f2937" metalness={0.9} roughness={0.1} />
                </mesh>

                {/* Motor mount */}
                <group position={[0, 0.04, 0]}>
                  <mesh castShadow>
                    <cylinderGeometry args={[0.03, 0.03, 0.05, 32]} />
                    <meshStandardMaterial color="#1f2937" metalness={0.9} roughness={0.1} />
                  </mesh>

                  {/* Motor */}
                  <mesh castShadow position={[0, 0.025, 0]}>
                    <cylinderGeometry args={[0.025, 0.025, 0.03, 32]} />
                    <meshStandardMaterial color="#000000" metalness={1} roughness={0} />
                  </mesh>

                  {/* Propeller system */}
                  <group position={[0, 0.04, 0]}>
                    {/* Main propeller */}
                    <mesh 
                      castShadow 
                      rotation={[0, robotState?.isMoving ? Date.now() * 0.05 : 0, 0]}
                    >
                      <cylinderGeometry args={[0.18, 0.18, 0.002, 32]} />
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
                        position={[Math.cos(angle) * 0.17, 0.001, Math.sin(angle) * 0.17]}
                        rotation={[0, robotState?.isMoving ? Date.now() * 0.05 : 0, 0]}
                      >
                        <boxGeometry args={[0.02, 0.002, 0.02]} />
                        <meshStandardMaterial color="#fb923c" metalness={0.6} roughness={0.3} />
                      </mesh>
                    ))}
                  </group>
                </group>
              </group>
            ))}

            {/* Status lights */}
            {[[-0.12, 0, -0.15], [0.12, 0, -0.15]].map((pos, i) => (
              <pointLight
                key={i}
                color={i === 0 ? "#22c55e" : "#ef4444"}
                intensity={1}
                distance={0.2}
                position={pos}
              />
            ))}

            {/* Battery indicator */}
            <pointLight
              color="#3b82f6"
              intensity={1}
              distance={0.2}
              position={[0, 0.06, -0.15]}
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
    
    // Add subtle hovering motion for drone
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