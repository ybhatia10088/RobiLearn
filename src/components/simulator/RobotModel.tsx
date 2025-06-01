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
  const leftWheelRef = useRef<THREE.Group>();
  const rightWheelRef = useRef<THREE.Group>();
  const armBaseRef = useRef<THREE.Group>();
  const armSegment1Ref = useRef<THREE.Group>();
  const armSegment2Ref = useRef<THREE.Group>();
  const gripperRef = useRef<THREE.Group>();
  const propellersRef = useRef<THREE.Group[]>([]);
  
  const { robotState } = useRobotStore();
  
  // Track wheel rotation for realistic movement
  const wheelRotation = useRef(0);
  const prevPosition = useRef(new THREE.Vector3());

  // Create robot models based on type
  const RobotGeometry = () => {
    switch (robotConfig.type) {
      case 'mobile':
        return (
          <>
            {/* Main chassis - lower and more realistic */}
            <mesh castShadow receiveShadow position={[0, 0.08, 0]}>
              <boxGeometry args={[0.4, 0.12, 0.6]} />
              <meshStandardMaterial color="#e2e8f0" metalness={0.3} roughness={0.7} />
            </mesh>

            {/* Side panels for structural detail */}
            <mesh castShadow position={[-0.21, 0.08, 0]}>
              <boxGeometry args={[0.02, 0.12, 0.55]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.4} roughness={0.6} />
            </mesh>
            <mesh castShadow position={[0.21, 0.08, 0]}>
              <boxGeometry args={[0.02, 0.12, 0.55]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.4} roughness={0.6} />
            </mesh>

            {/* Top sensor platform */}
            <mesh castShadow position={[0, 0.18, 0.2]}>
              <boxGeometry args={[0.15, 0.04, 0.15]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.5} roughness={0.5} />
            </mesh>

            {/* Sensor array */}
            <group position={[0, 0.22, 0.27]}>
              {/* Main sensor housing */}
              <mesh castShadow>
                <boxGeometry args={[0.12, 0.06, 0.08]} />
                <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
              </mesh>
              
              {/* Individual sensors */}
              {[-0.03, 0, 0.03].map((x, i) => (
                <mesh key={i} castShadow position={[x, 0, 0.04]}>
                  <cylinderGeometry args={[0.015, 0.015, 0.02, 16]} />
                  <meshStandardMaterial 
                    color={i === 1 ? "#3b82f6" : "#1e293b"} 
                    metalness={0.8} 
                    roughness={0.2} 
                  />
                </mesh>
              ))}
            </group>

            {/* Left wheel assembly */}
            <group ref={leftWheelRef} position={[-0.22, 0.08, 0]}>
              {/* Wheel hub */}
              <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.08, 0.08, 0.06, 32]} />
                <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.2} />
              </mesh>
              
              {/* Tire */}
              <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.12, 0.12, 0.04, 32]} />
                <meshStandardMaterial color="#1f2937" metalness={0.1} roughness={0.9} />
              </mesh>
              
              {/* Tire treads */}
              {[...Array(12)].map((_, i) => (
                <mesh key={i} castShadow rotation={[0, 0, Math.PI / 2]} position={[
                  Math.cos(i * Math.PI / 6) * 0.125,
                  0,
                  Math.sin(i * Math.PI / 6) * 0.125
                ]}>
                  <boxGeometry args={[0.02, 0.04, 0.04]} />
                  <meshStandardMaterial color="#374151" metalness={0.2} roughness={0.8} />
                </mesh>
              ))}
            </group>

            {/* Right wheel assembly */}
            <group ref={rightWheelRef} position={[0.22, 0.08, 0]}>
              <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.08, 0.08, 0.06, 32]} />
                <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.2} />
              </mesh>
              
              <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.12, 0.12, 0.04, 32]} />
                <meshStandardMaterial color="#1f2937" metalness={0.1} roughness={0.9} />
              </mesh>
              
              {[...Array(12)].map((_, i) => (
                <mesh key={i} castShadow rotation={[0, 0, Math.PI / 2]} position={[
                  Math.cos(i * Math.PI / 6) * 0.125,
                  0,
                  Math.sin(i * Math.PI / 6) * 0.125
                ]}>
                  <boxGeometry args={[0.02, 0.04, 0.04]} />
                  <meshStandardMaterial color="#374151" metalness={0.2} roughness={0.8} />
                </mesh>
              ))}
            </group>

            {/* Status LED indicators */}
            <mesh castShadow position={[-0.15, 0.15, 0.25]}>
              <cylinderGeometry args={[0.01, 0.01, 0.005, 16]} />
              <meshStandardMaterial 
                color={robotState?.isMoving ? "#22c55e" : "#ef4444"} 
                emissive={robotState?.isMoving ? "#22c55e" : "#ef4444"}
                emissiveIntensity={0.3}
              />
            </mesh>
            <mesh castShadow position={[0.15, 0.15, 0.25]}>
              <cylinderGeometry args={[0.01, 0.01, 0.005, 16]} />
              <meshStandardMaterial 
                color="#3b82f6" 
                emissive="#3b82f6"
                emissiveIntensity={0.2}
              />
            </mesh>

            {/* Bumper sensors */}
            <mesh castShadow position={[0, 0.05, 0.31]}>
              <boxGeometry args={[0.3, 0.02, 0.02]} />
              <meshStandardMaterial color="#1f2937" metalness={0.8} roughness={0.2} />
            </mesh>
          </>
        );

      case 'arm':
        return (
          <>
            {/* Heavy base platform */}
            <mesh castShadow receiveShadow position={[0, 0.03, 0]}>
              <cylinderGeometry args={[0.25, 0.25, 0.06, 32]} />
              <meshStandardMaterial color="#64748b" metalness={0.7} roughness={0.3} />
            </mesh>

            {/* Base mounting bolts */}
            {[0, Math.PI/2, Math.PI, 3*Math.PI/2].map((angle, i) => (
              <mesh key={i} castShadow position={[
                Math.cos(angle) * 0.2,
                0.06,
                Math.sin(angle) * 0.2
              ]}>
                <cylinderGeometry args={[0.015, 0.015, 0.01, 16]} />
                <meshStandardMaterial color="#1f2937" metalness={0.9} roughness={0.1} />
              </mesh>
            ))}

            {/* Rotating base */}
            <group ref={armBaseRef} position={[0, 0.06, 0]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.12, 0.15, 0.12, 32]} />
                <meshStandardMaterial color="#fb923c" metalness={0.6} roughness={0.4} />
              </mesh>

              {/* First arm segment (shoulder) */}
              <group ref={armSegment1Ref} position={[0, 0.06, 0]}>
                {/* Shoulder joint */}
                <mesh castShadow rotation={[0, 0, Math.PI/2]}>
                  <cylinderGeometry args={[0.05, 0.05, 0.1, 32]} />
                  <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
                </mesh>

                {/* Upper arm */}
                <mesh castShadow position={[0, 0, 0.2]}>
                  <boxGeometry args={[0.08, 0.08, 0.35]} />
                  <meshStandardMaterial color="#fb923c" metalness={0.6} roughness={0.4} />
                </mesh>

                {/* Reinforcement ribs */}
                {[0.1, 0.2, 0.3].map((z, i) => (
                  <mesh key={i} castShadow position={[0, 0, z]}>
                    <boxGeometry args={[0.1, 0.02, 0.02]} />
                    <meshStandardMaterial color="#94a3b8" metalness={0.7} roughness={0.3} />
                  </mesh>
                ))}

                {/* Elbow joint */}
                <group ref={armSegment2Ref} position={[0, 0, 0.37]}>
                  <mesh castShadow rotation={[Math.PI/2, 0, 0]}>
                    <cylinderGeometry args={[0.04, 0.04, 0.1, 32]} />
                    <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
                  </mesh>

                  {/* Forearm */}
                  <mesh castShadow position={[0, 0, 0.15]}>
                    <boxGeometry args={[0.06, 0.06, 0.25]} />
                    <meshStandardMaterial color="#fb923c" metalness={0.6} roughness={0.4} />
                  </mesh>

                  {/* Wrist assembly */}
                  <group ref={gripperRef} position={[0, 0, 0.27]}>
                    {/* Wrist joint */}
                    <mesh castShadow>
                      <cylinderGeometry args={[0.03, 0.03, 0.08, 32]} />
                      <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
                    </mesh>

                    {/* Gripper base */}
                    <mesh castShadow position={[0, 0, 0.06]}>
                      <boxGeometry args={[0.1, 0.06, 0.06]} />
                      <meshStandardMaterial color="#1f2937" metalness={0.8} roughness={0.2} />
                    </mesh>

                    {/* Gripper fingers - animated based on state */}
                    {robotState?.isGrabbing ? (
                      // Closed gripper
                      <>
                        <mesh castShadow position={[-0.02, 0, 0.09]}>
                          <boxGeometry args={[0.015, 0.08, 0.015]} />
                          <meshStandardMaterial color="#94a3b8" metalness={0.7} roughness={0.3} />
                        </mesh>
                        <mesh castShadow position={[0.02, 0, 0.09]}>
                          <boxGeometry args={[0.015, 0.08, 0.015]} />
                          <meshStandardMaterial color="#94a3b8" metalness={0.7} roughness={0.3} />
                        </mesh>
                      </>
                    ) : (
                      // Open gripper
                      <>
                        <mesh castShadow position={[-0.04, 0, 0.09]}>
                          <boxGeometry args={[0.015, 0.08, 0.015]} />
                          <meshStandardMaterial color="#94a3b8" metalness={0.7} roughness={0.3} />
                        </mesh>
                        <mesh castShadow position={[0.04, 0, 0.09]}>
                          <boxGeometry args={[0.015, 0.08, 0.015]} />
                          <meshStandardMaterial color="#94a3b8" metalness={0.7} roughness={0.3} />
                        </mesh>
                      </>
                    )}
                  </group>
                </group>
              </group>
            </group>
          </>
        );

      case 'drone':
        return (
          <>
            {/* Main body - streamlined design */}
            <mesh castShadow receiveShadow position={[0, 0, 0]}>
              <boxGeometry args={[0.2, 0.06, 0.3]} />
              <meshStandardMaterial color="#64748b" metalness={0.7} roughness={0.3} />
            </mesh>

            {/* Top shell */}
            <mesh castShadow position={[0, 0.03, 0]}>
              <boxGeometry args={[0.18, 0.02, 0.28]} />
              <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.2} />
            </mesh>

            {/* Camera gimbal */}
            <group position={[0, -0.05, 0.12]}>
              <mesh castShadow>
                <sphereGeometry args={[0.04, 16, 16]} />
                <meshStandardMaterial color="#1f2937" metalness={0.9} roughness={0.1} />
              </mesh>
              
              {/* Camera lens */}
              <mesh castShadow position={[0, 0, 0.04]}>
                <cylinderGeometry args={[0.015, 0.015, 0.02, 16]} />
                <meshStandardMaterial color="#000000" metalness={1} roughness={0} />
              </mesh>
            </group>

            {/* Arms and propellers */}
            {[
              { pos: [-0.15, 0, -0.15], index: 0 },
              { pos: [0.15, 0, -0.15], index: 1 },
              { pos: [-0.15, 0, 0.15], index: 2 },
              { pos: [0.15, 0, 0.15], index: 3 }
            ].map(({ pos, index }) => (
              <group key={index} position={pos}>
                {/* Arm */}
                <mesh castShadow>
                  <boxGeometry args={[0.04, 0.02, 0.12]} />
                  <meshStandardMaterial color="#64748b" metalness={0.7} roughness={0.3} />
                </mesh>

                {/* Motor */}
                <mesh castShadow position={[0, 0.02, 0]}>
                  <cylinderGeometry args={[0.02, 0.02, 0.03, 16]} />
                  <meshStandardMaterial color="#1f2937" metalness={0.9} roughness={0.1} />
                </mesh>

                {/* Propeller */}
                <group 
                  ref={(el) => { if (el) propellersRef.current[index] = el; }}
                  position={[0, 0.035, 0]}
                >
                  {/* Propeller blades */}
                  <mesh castShadow>
                    <boxGeometry args={[0.001, 0.001, 0.2]} />
                    <meshStandardMaterial 
                      color="#1f2937" 
                      metalness={0.6} 
                      roughness={0.4}
                      opacity={robotState?.isMoving ? 0.3 : 0.9}
                      transparent
                    />
                  </mesh>
                  <mesh castShadow rotation={[0, Math.PI/2, 0]}>
                    <boxGeometry args={[0.001, 0.001, 0.2]} />
                    <meshStandardMaterial 
                      color="#1f2937" 
                      metalness={0.6} 
                      roughness={0.4}
                      opacity={robotState?.isMoving ? 0.3 : 0.9}
                      transparent
                    />
                  </mesh>

                  {/* Propeller tips */}
                  {[-0.09, 0.09].map((z) => (
                    <mesh key={z} castShadow position={[0, 0, z]}>
                      <boxGeometry args={[0.01, 0.002, 0.02]} />
                      <meshStandardMaterial color="#fb923c" metalness={0.6} roughness={0.3} />
                    </mesh>
                  ))}
                </group>

                {/* LED lights */}
                <pointLight
                  color={index < 2 ? "#22c55e" : "#ef4444"}
                  intensity={robotState?.isMoving ? 2 : 1}
                  distance={0.3}
                  position={[0, 0.02, 0]}
                />
              </group>
            ))}

            {/* Status indicator */}
            <pointLight
              color="#3b82f6"
              intensity={1.5}
              distance={0.4}
              position={[0, 0.04, -0.12]}
            />
          </>
        );

      default:
        return null;
    }
  };

  useFrame((state, delta) => {
    if (!group.current || !robotState) return;
    
    // Smooth position and rotation updates
    const targetPos = new THREE.Vector3(
      robotState.position.x,
      robotState.position.y,
      robotState.position.z
    );
    
    group.current.position.lerp(targetPos, 0.1);
    
    const targetRot = new THREE.Euler(0, robotState.rotation.y, 0);
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y, 
      targetRot.y, 
      0.1
    );

    // Mobile robot wheel animation
    if (robotConfig.type === 'mobile' && robotState.isMoving) {
      const currentPos = group.current.position;
      const distance = currentPos.distanceTo(prevPosition.current);
      
      if (distance > 0.001) {
        wheelRotation.current += distance * 10;
        
        if (leftWheelRef.current) {
          leftWheelRef.current.rotation.x = wheelRotation.current;
        }
        if (rightWheelRef.current) {
          rightWheelRef.current.rotation.x = wheelRotation.current;
        }
        
        prevPosition.current.copy(currentPos);
      }
    }

    // Robotic arm animations
    if (robotConfig.type === 'arm') {
      const time = state.clock.elapsedTime;
      
      // Subtle base rotation
      if (armBaseRef.current && robotState.isMoving) {
        armBaseRef.current.rotation.y = Math.sin(time * 0.5) * 0.3;
      }
      
      // Arm segment movements
      if (armSegment1Ref.current && robotState.isMoving) {
        armSegment1Ref.current.rotation.x = Math.sin(time * 0.7) * 0.2;
      }
      
      if (armSegment2Ref.current && robotState.isMoving) {
        armSegment2Ref.current.rotation.x = Math.sin(time * 0.9) * 0.3;
      }
    }

    // Drone propeller animation and hovering
    if (robotConfig.type === 'drone') {
      // Hovering motion
      group.current.position.y += Math.sin(state.clock.elapsedTime * 3) * 0.002;
      
      // Propeller rotation
      if (robotState.isMoving || true) { // Drones always have spinning props when on
        propellersRef.current.forEach((propeller, index) => {
          if (propeller) {
            const speed = robotState.isMoving ? 20 : 10;
            const direction = index % 2 === 0 ? 1 : -1; // Counter-rotating pairs
            propeller.rotation.y += delta * speed * direction;
          }
        });
      }
      
      // Slight tilting when moving
      if (robotState.isMoving) {
        group.current.rotation.x = Math.sin(state.clock.elapsedTime * 2) * 0.05;
        group.current.rotation.z = Math.cos(state.clock.elapsedTime * 1.5) * 0.03;
      }
    }
  });

  return (
    <group ref={group} dispose={null}>
      <RobotGeometry />
    </group>
  );
};

export default RobotModel;
