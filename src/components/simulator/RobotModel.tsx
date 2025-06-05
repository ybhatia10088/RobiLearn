import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { RobotConfig } from '@/types/robot.types';
import { useRobotStore } from '@/store/robotStore';
import * as THREE from 'three';

interface RobotModelProps {
  robotConfig: RobotConfig;
}

const RobotModel: React.FC<RobotModelProps> = ({ robotConfig }) => {
  const group = useRef<THREE.Group>(null);
  const leftWheelRef = useRef<THREE.Group>(null);
  const rightWheelRef = useRef<THREE.Group>(null);
  const armBaseRef = useRef<THREE.Group>(null);
  const armSegment1Ref = useRef<THREE.Group>(null);
  const armSegment2Ref = useRef<THREE.Group>(null);
  const armWristRef = useRef<THREE.Group>(null);
  const gripperRef = useRef<THREE.Group>(null);
  const propellersRef = useRef<THREE.Group[]>([]);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const torsoRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const neckRef = useRef<THREE.Group>(null);
  
  const { robotState, moveCommands } = useRobotStore();
  
  // Enhanced state management for realistic movements
  const [armAngles, setArmAngles] = useState({
    base: 0,
    shoulder: 0,
    elbow: 0,
    wrist: 0
  });

  const [humanoidState, setHumanoidState] = useState({
    leftLeg: { hip: 0, knee: 0, ankle: 0 },
    rightLeg: { hip: 0, knee: 0, ankle: 0 },
    leftArm: { shoulder: 0, elbow: 0 },
    rightArm: { shoulder: 0, elbow: 0 },
    walkCycle: 0,
    isWalking: false
  });
  
  const wheelRotation = useRef(0);
  const prevPosition = useRef(new THREE.Vector3());
  const velocity = useRef(new THREE.Vector3());
  const angularVelocity = useRef(0);
  const droneAltitude = useRef(robotState?.position.y || 0);

  // Physics constants
  const PHYSICS = {
    acceleration: 0.02,
    deceleration: 0.95,
    maxSpeed: 0.05,
    wheelRadius: 0.14,
    armSpeed: 0.8,
    droneHoverAmplitude: 0.008,
    droneHoverSpeed: 2.5,
    propellerSpeedIdle: 15,
    propellerSpeedActive: 30,
    droneLiftAcceleration: 0.03,
    droneMaxAltitude: 4.0,
    droneMinAltitude: 0.15
  };

  const HUMANOID_PHYSICS = {
    walkSpeed: 0.02,
    stepHeight: 0.08,
    armSwing: 0.4,
    torsoSway: 0.02,
    headBob: 0.01,
    walkCycleSpeed: 3.5,
    jointDamping: 0.95,
    balanceCorrection: 0.1
  };

  // Arm joint limits for realistic movement
  const ARM_LIMITS = {
    base: { min: -Math.PI, max: Math.PI },
    shoulder: { min: -Math.PI/2, max: Math.PI/4 },
    elbow: { min: 0, max: Math.PI*0.75 },
    wrist: { min: -Math.PI, max: Math.PI }
  };

  // Move useEffect to the top level of the component
  useEffect(() => {
    // Reset internal state when robot state is reset
    if (robotState && 
        robotState.position.x === 0 && 
        robotState.position.y === 0 && 
        robotState.position.z === 0 && 
        !robotState.isMoving) {
      
      // Reset internal physics state
      velocity.current.set(0, 0, 0);
      angularVelocity.current = 0;
      wheelRotation.current = 0;
      prevPosition.current.set(0, 0, 0);
      
      // Reset arm angles
      setArmAngles({
        base: 0,
        shoulder: 0,
        elbow: 0,
        wrist: 0
      });
      
      // Reset drone altitude
      if (robotConfig.type === 'drone') {
        droneAltitude.current = 1.5; // Default drone hover height
      }
      
      // Immediately set group position to origin
      if (group.current) {
        group.current.position.set(0, 0, 0);
        group.current.rotation.set(0, 0, 0);
        
        // Set drone to proper initial height
        if (robotConfig.type === 'drone') {
          group.current.position.y = 1.5;
        }
      }
    }
  }, [robotState?.position, robotState?.isMoving, robotConfig.type]);

  // Enhanced Mobile Robot
  const MobileRobotGeometry = () => (
    <>
      {/* Main chassis - more sophisticated design */}
      <mesh castShadow receiveShadow position={[0, 0.1, 0]}>
        <boxGeometry args={[0.5, 0.15, 0.7]} />
        <meshStandardMaterial 
          color="#e2e8f0" 
          metalness={0.4} 
          roughness={0.6}
          envMapIntensity={1}
        />
      </mesh>

      {/* Chassis reinforcement frame */}
      <mesh castShadow position={[0, 0.1, 0]}>
        <boxGeometry args={[0.52, 0.02, 0.72]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Side protection panels */}
      {[-0.26, 0.26].map((x, i) => (
        <mesh key={i} castShadow position={[x, 0.1, 0]}>
          <boxGeometry args={[0.02, 0.15, 0.65]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.5} roughness={0.5} />
        </mesh>
      ))}

      {/* Top sensor platform with curved edges */}
      <mesh castShadow position={[0, 0.22, 0.25]}>
        <cylinderGeometry args={[0.12, 0.15, 0.05, 32]} />
        <meshStandardMaterial color="#475569" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Advanced sensor array housing */}
      <group position={[0, 0.27, 0.32]}>
        <mesh castShadow>
          <boxGeometry args={[0.16, 0.08, 0.1]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
        </mesh>
        
        {/* Multiple sensor types */}
        {[
          { pos: [-0.05, 0, 0.051], color: "#3b82f6", size: 0.018 }, // Main camera
          { pos: [0, 0, 0.051], color: "#ef4444", size: 0.015 }, // Laser
          { pos: [0.05, 0, 0.051], color: "#22c55e", size: 0.012 }, // Secondary sensor
        ].map((sensor, i) => (
          <mesh key={i} castShadow position={sensor.pos}>
            <cylinderGeometry args={[sensor.size, sensor.size, 0.025, 16]} />
            <meshStandardMaterial 
              color={sensor.color}
              emissive={sensor.color}
              emissiveIntensity={0.3}
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
        ))}
      </group>

      {/* Enhanced wheel assemblies with better separation */}
      {[
        { side: 'left', x: -0.32, ref: leftWheelRef },
        { side: 'right', x: 0.32, ref: rightWheelRef }
      ].map(({ side, x, ref }) => (
        <group key={side} ref={ref} position={[x, 0.1, 0]}>
          {/* Wheel suspension arm */}
          <mesh castShadow position={[x > 0 ? -0.03 : 0.03, 0, 0]}>
            <boxGeometry args={[0.06, 0.06, 0.4]} />
            <meshStandardMaterial color="#64748b" metalness={0.7} roughness={0.3} />
          </mesh>

          {/* Wheel hub - larger and more detailed */}
          <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.1, 0.1, 0.08, 32]} />
            <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.2} />
          </mesh>
          
          {/* Hub details */}
          <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.08, 0.08, 0.09, 6]} />
            <meshStandardMaterial color="#64748b" metalness={0.7} roughness={0.3} />
          </mesh>
          
          {/* Tire - larger and more realistic */}
          <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.14, 0.14, 0.06, 32]} />
            <meshStandardMaterial color="#1f2937" metalness={0.1} roughness={0.95} />
          </mesh>
          
          {/* Tire sidewall details */}
          <mesh castShadow rotation={[0, 0, Math.PI / 2]} position={[0, 0, 0.035]}>
            <cylinderGeometry args={[0.13, 0.13, 0.01, 32]} />
            <meshStandardMaterial color="#374151" metalness={0.2} roughness={0.8} />
          </mesh>
          <mesh castShadow rotation={[0, 0, Math.PI / 2]} position={[0, 0, -0.035]}>
            <cylinderGeometry args={[0.13, 0.13, 0.01, 32]} />
            <meshStandardMaterial color="#374151" metalness={0.2} roughness={0.8} />
          </mesh>
          
          {/* Tire treads - more realistic pattern */}
          {[...Array(16)].map((_, i) => {
            const angle = (i * Math.PI * 2) / 16;
            return (
              <mesh 
                key={i} 
                castShadow 
                rotation={[0, 0, Math.PI / 2]} 
                position={[
                  Math.cos(angle) * 0.145,
                  0,
                  Math.sin(angle) * 0.145
                ]}
              >
                <boxGeometry args={[0.015, 0.06, 0.03]} />
                <meshStandardMaterial color="#111827" metalness={0.1} roughness={1} />
              </mesh>
            );
          })}
        </group>
      ))}

      {/* Front and rear bumpers with sensors */}
      <mesh castShadow position={[0, 0.06, 0.36]}>
        <boxGeometry args={[0.4, 0.03, 0.02]} />
        <meshStandardMaterial color="#1f2937" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh castShadow position={[0, 0.06, -0.36]}>
        <boxGeometry args={[0.4, 0.03, 0.02]} />
        <meshStandardMaterial color="#1f2937" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Status LED array */}
      {[-0.18, -0.06, 0.06, 0.18].map((x, i) => (
        <mesh key={i} castShadow position={[x, 0.18, 0.32]}>
          <cylinderGeometry args={[0.008, 0.008, 0.003, 16]} />
          <meshStandardMaterial 
            color={robotState?.isMoving ? "#22c55e" : "#ef4444"} 
            emissive={robotState?.isMoving ? "#22c55e" : "#ef4444"}
            emissiveIntensity={0.4}
          />
        </mesh>
      ))}
    </>
  );

  // Enhanced Robotic Arm with realistic joints
  const RoboticArmGeometry = () => (
    <>
      {/* Heavy industrial base with mounting */}
      <mesh castShadow receiveShadow position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.08, 32]} />
        <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Base mounting plate */}
      <mesh castShadow position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.32, 0.32, 0.01, 32]} />
        <meshStandardMaterial color="#1f2937" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Mounting bolts */}
      {[0, Math.PI/2, Math.PI, 3*Math.PI/2].map((angle, i) => (
        <mesh key={i} castShadow position={[
          Math.cos(angle) * 0.25,
          0.085,
          Math.sin(angle) * 0.25
        ]}>
          <cylinderGeometry args={[0.02, 0.02, 0.015, 16]} />
          <meshStandardMaterial color="#000000" metalness={1} roughness={0} />
        </mesh>
      ))}

      {/* Rotating base assembly */}
      <group ref={armBaseRef} position={[0, 0.08, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.15, 0.18, 0.15, 32]} />
          <meshStandardMaterial color="#fb923c" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Base joint actuator */}
        <mesh castShadow position={[0, 0.08, 0]} rotation={[0, 0, Math.PI/2]}>
          <cylinderGeometry args={[0.06, 0.06, 0.12, 32]} />
          <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Shoulder assembly - first joint */}
        <group ref={armSegment1Ref} position={[0, 0.08, 0]}>
          {/* Shoulder joint housing */}
          <mesh castShadow rotation={[0, 0, Math.PI/2]}>
            <cylinderGeometry args={[0.08, 0.08, 0.15, 32]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
          </mesh>

          {/* Upper arm segment */}
          <mesh castShadow position={[0, 0, 0.25]} rotation={[Math.PI/2, 0, 0]}>
            <cylinderGeometry args={[0.05, 0.07, 0.4, 32]} />
            <meshStandardMaterial color="#fb923c" metalness={0.6} roughness={0.4} />
          </mesh>

          {/* Structural reinforcement */}
          {[0.15, 0.25, 0.35].map((z, i) => (
            <mesh key={i} castShadow position={[0, 0, z]}>
              <boxGeometry args={[0.12, 0.03, 0.03]} />
              <meshStandardMaterial color="#64748b" metalness={0.7} roughness={0.3} />
            </mesh>
          ))}

          {/* Elbow joint assembly */}
          <group ref={armSegment2Ref} position={[0, 0, 0.45]}>
            <mesh castShadow rotation={[Math.PI/2, 0, 0]}>
              <cylinderGeometry args={[0.06, 0.06, 0.12, 32]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
            </mesh>

            {/* Forearm segment */}
            <mesh castShadow position={[0, 0, 0.2]} rotation={[Math.PI/2, 0, 0]}>
              <cylinderGeometry args={[0.04, 0.05, 0.35, 32]} />
              <meshStandardMaterial color="#fb923c" metalness={0.6} roughness={0.4} />
            </mesh>

            {/* Wrist assembly */}
            <group ref={armWristRef} position={[0, 0, 0.37]}>
              {/* Wrist joint */}
              <mesh castShadow>
                <cylinderGeometry args={[0.04, 0.04, 0.1, 32]} />
                <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
              </mesh>

              {/* End effector mount */}
              <group ref={gripperRef} position={[0, 0, 0.08]}>
                {/* Gripper base */}
                <mesh castShadow>
                  <boxGeometry args={[0.12, 0.08, 0.08]} />
                  <meshStandardMaterial color="#1f2937" metalness={0.8} roughness={0.2} />
                </mesh>

                {/* Hydraulic/pneumatic cylinders for gripper */}
                {[-0.04, 0.04].map((x, i) => (
                  <mesh key={i} castShadow position={[x, 0, 0.06]}>
                    <cylinderGeometry args={[0.008, 0.008, 0.04, 16]} />
                    <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.1} />
                  </mesh>
                ))}

                {/* Gripper fingers with realistic movement */}
                <group>
                  <mesh 
                    castShadow 
                    position={[robotState?.isGrabbing ? -0.015 : -0.05, 0, 0.12]}
                    rotation={[0, robotState?.isGrabbing ? 0.2 : 0, 0]}
                  >
                    <boxGeometry args={[0.02, 0.1, 0.06]} />
                    <meshStandardMaterial color="#94a3b8" metalness={0.7} roughness={0.3} />
                  </mesh>
                  <mesh 
                    castShadow 
                    position={[robotState?.isGrabbing ? 0.015 : 0.05, 0, 0.12]}
                    rotation={[0, robotState?.isGrabbing ? -0.2 : 0, 0]}
                  >
                    <boxGeometry args={[0.02, 0.1, 0.06]} />
                    <meshStandardMaterial color="#94a3b8" metalness={0.7} roughness={0.3} />
                  </mesh>

                  {/* Gripper tips */}
                  <mesh 
                    castShadow 
                    position={[robotState?.isGrabbing ? -0.01 : -0.04, 0, 0.16]}
                  >
                    <boxGeometry args={[0.01, 0.02, 0.02]} />
                    <meshStandardMaterial color="#1f2937" metalness={0.9} roughness={0.1} />
                  </mesh>
                  <mesh 
                    castShadow 
                    position={[robotState?.isGrabbing ? 0.01 : 0.04, 0, 0.16]}
                  >
                    <boxGeometry args={[0.01, 0.02, 0.02]} />
                    <meshStandardMaterial color="#1f2937" metalness={0.9} roughness={0.1} />
                  </mesh>
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>
    </>
  );

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

  const HumanoidRobotGeometry = () => (
    <>
      {/* Main torso assembly */}
      <group ref={torsoRef} position={[0, 1.2, 0]}>
        {/* Upper torso - more anatomical chest */}
        <mesh castShadow receiveShadow position={[0, 0.18, 0]}>
          <boxGeometry args={[0.42, 0.45, 0.24]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.5} roughness={0.5} />
        </mesh>

        {/* Chest armor plating */}
        <mesh castShadow position={[0, 0.2, 0.13]}>
          <boxGeometry args={[0.32, 0.35, 0.03]} />
          <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} />
        </mesh>

        {/* Pectoral definition */}
        {[-0.08, 0.08].map((x, i) => (
          <mesh key={i} castShadow position={[x, 0.25, 0.11]}>
            <boxGeometry args={[0.12, 0.15, 0.04]} />
            <meshStandardMaterial color="#64748b" metalness={0.7} roughness={0.4} />
          </mesh>
        ))}

        {/* Enhanced shoulder assemblies */}
        {[-0.24, 0.24].map((x, i) =>
          <group key={i} position={[x, 0.32, 0]}>
            <mesh castShadow>
              <sphereGeometry args={[0.08, 32, 32]} />
              <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.2} />
            </mesh>
            {/* Shoulder armor */}
            <mesh castShadow position={[x > 0 ? 0.05 : -0.05, 0, 0]}>
              <boxGeometry args={[0.1, 0.12, 0.08]} />
              <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} />
            </mesh>
          </group>
        )}

        {/* Abdominal section - more defined */}
        <mesh castShadow position={[0, -0.12, 0]}>
          <boxGeometry args={[0.32, 0.28, 0.2]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.4} roughness={0.6} />
        </mesh>

        {/* Ab definition panels */}
        {[0.08, -0.08].map((y, i) => (
          <mesh key={i} castShadow position={[0, y, 0.11]}>
            <boxGeometry args={[0.24, 0.08, 0.02]} />
            <meshStandardMaterial color="#64748b" metalness={0.7} roughness={0.4} />
          </mesh>
        ))}

        {/* Waist joint mechanism */}
        <mesh castShadow position={[0, -0.3, 0]}>
          <cylinderGeometry args={[0.08, 0.1, 0.08, 32]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Status display panel */}
        <mesh castShadow position={[0, 0.05, 0.14]}>
          <boxGeometry args={[0.15, 0.08, 0.01]} />
          <meshStandardMaterial 
            color="#000000"
            emissive="#3b82f6"
            emissiveIntensity={robotState?.isMoving ? 0.4 : 0.2}
          />
        </mesh>

        {/* Cooling vents */}
        {[-0.12, -0.04, 0.04, 0.12].map((x, i) => (
          <mesh key={i} castShadow position={[x, -0.05, 0.12]}>
            <boxGeometry args={[0.02, 0.15, 0.005]} />
            <meshStandardMaterial color="#1f2937" metalness={0.9} roughness={0.1} />
          </mesh>
        ))}
      </group>

      {/* Advanced head assembly */}
      <group ref={headRef} position={[0, 1.75, 0]}>
        {/* Main head unit - more proportional */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.24, 0.28, 0.26]} />
          <meshStandardMaterial color="#f8fafc" metalness={0.3} roughness={0.7} />
        </mesh>

        {/* Face mask - more detailed */}
        <mesh castShadow position={[0, 0.02, 0.14]}>
          <boxGeometry args={[0.22, 0.24, 0.03]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Forehead sensor array */}
        <mesh castShadow position={[0, 0.08, 0.15]}>
          <boxGeometry args={[0.16, 0.04, 0.01]} />
          <meshStandardMaterial color="#1e40af" emissive="#1e40af" emissiveIntensity={0.2} />
        </mesh>

        {/* Eyes - larger, more expressive */}
        {[-0.06, 0.06].map((x, i) => (
          <group key={i} position={[x, 0.03, 0.16]}>
            <mesh castShadow>
              <sphereGeometry args={[0.025, 32, 32]} />
              <meshStandardMaterial 
                color="#ffffff"
                emissive="#60a5fa"
                emissiveIntensity={0.4}
                metalness={0.1}
                roughness={0.1}
              />
            </mesh>
            {/* Pupil */}
            <mesh castShadow position={[0, 0, 0.02]}>
              <cylinderGeometry args={[0.008, 0.008, 0.005, 16]} />
              <meshStandardMaterial color="#1e40af" emissive="#1e40af" emissiveIntensity={0.6} />
            </mesh>
            <pointLight color="#60a5fa" intensity={0.3} distance={0.5} />
          </group>
        ))}

        {/* Jaw/mouth area */}
        <mesh castShadow position={[0, -0.08, 0.14]}>
          <boxGeometry args={[0.12, 0.06, 0.02]} />
          <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
        </mesh>

        {/* Side panels */}
        {[-0.13, 0.13].map((x, i) => (
          <mesh key={i} castShadow position={[x, 0, 0.08]}>
            <boxGeometry args={[0.04, 0.2, 0.1]} />
            <meshStandardMaterial color="#64748b" metalness={0.7} roughness={0.4} />
          </mesh>
        ))}

        {/* Antenna array */}
        {[-0.08, 0.08].map((x, i) => (
          <mesh key={i} castShadow position={[x, 0.16, -0.05]}>
            <cylinderGeometry args={[0.003, 0.003, 0.08, 16]} />
            <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.1} />
          </mesh>
        ))}

        {/* Enhanced neck connection */}
        <mesh castShadow position={[0, -0.18, 0]}>
          <cylinderGeometry args={[0.08, 0.06, 0.08, 32]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>

      {/* Left arm assembly */}
      <group ref={leftArmRef} position={[-0.24, 1.52, 0]}>
        {/* Shoulder joint */}
        <mesh castShadow>
          <sphereGeometry args={[0.08, 32, 32]} />
          <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Upper arm */}
        <mesh castShadow position={[0, -0.18, 0]}>
          <cylinderGeometry args={[0.04, 0.05, 0.3, 32]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.6} roughness={0.4} />
        </mesh>

        {/* Elbow joint */}
        <mesh castShadow position={[0, -0.35, 0]}>
          <sphereGeometry args={[0.05, 32, 32]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Forearm */}
        <mesh castShadow position={[0, -0.52, 0]}>
          <cylinderGeometry args={[0.035, 0.04, 0.28, 32]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.5} roughness={0.5} />
        </mesh>

        {/* Enhanced hand assembly */}
        <group position={[0, -0.68, 0]}>
          {/* Palm - more anatomical */}
          <mesh castShadow position={[0, -0.06, 0]}>
            <boxGeometry args={[0.09, 0.12, 0.05]} />
            <meshStandardMaterial color="#475569" metalness={0.6} roughness={0.4} />
          </mesh>

          {/* Fingers - more realistic proportions */}
          {[-0.03, -0.01, 0.01, 0.03].map((x, i) => (
            <group key={i} position={[x, -0.12, 0.01]}>
              {/* Finger segments */}
              <mesh castShadow position={[0, -0.02, 0]}>
                <boxGeometry args={[0.012, 0.04, 0.025]} />
                <meshStandardMaterial color="#64748b" metalness={0.7} roughness={0.3} />
              </mesh>
              <mesh castShadow position={[0, -0.06, 0]}>
                <boxGeometry args={[0.01, 0.03, 0.022]} />
                <meshStandardMaterial color="#64748b" metalness={0.7} roughness={0.3} />
              </mesh>
              <mesh castShadow position={[0, -0.085, 0]}>
                <boxGeometry args={[0.008, 0.02, 0.02]} />
                <meshStandardMaterial color="#64748b" metalness={0.7} roughness={0.3} />
              </mesh>
            </group>
          ))}

          {/* Articulated thumb */}
          <group position={[0.045, -0.08, 0]} rotation={[0, 0, -0.3]}>
            <mesh castShadow position={[0, -0.015, 0]}>
              <boxGeometry args={[0.012, 0.03, 0.025]} />
              <meshStandardMaterial color="#64748b" metalness={0.7} roughness={0.3} />
            </mesh>
            <mesh castShadow position={[0, -0.035, 0]}>
              <boxGeometry args={[0.01, 0.02, 0.022]} />
              <meshStandardMaterial color="#64748b" metalness={0.7} roughness={0.3} />
            </mesh>
          </group>

          {/* Wrist actuators */}
          <mesh castShadow position={[0, 0.02, 0]}>
            <cylinderGeometry args={[0.04, 0.045, 0.06, 32]} />
            <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>
      </group>

      {/* Right arm assembly (mirrored) */}
      <group ref={rightArmRef} position={[0.24, 1.52, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.08, 32, 32]} />
          <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.2} />
        </mesh>

        <mesh castShadow position={[0, -0.18, 0]}>
          <cylinderGeometry args={[0.04, 0.05, 0.3, 32]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.6} roughness={0.4} />
        </mesh>

        <mesh castShadow position={[0, -0.35, 0]}>
          <sphereGeometry args={[0.05, 32, 32]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
        </mesh>

        <mesh castShadow position={[0, -0.52, 0]}>
          <cylinderGeometry args={[0.035, 0.04, 0.28, 32]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.5} roughness={0.5} />
        </mesh>

        <group position={[0, -0.68, 0]}>
          <mesh castShadow position={[0, -0.06, 0]}>
            <boxGeometry args={[0.09, 0.12, 0.05]} />
            <meshStandardMaterial color="#475569" metalness={0.6} roughness={0.4} />
          </mesh>

          {[-0.03, -0.01, 0.01, 0.03].map((x, i) => (
            <group key={i} position={[x, -0.12, 0.01]}>
              <mesh castShadow position={[0, -0.02, 0]}>
                <boxGeometry args={[0.012, 0.04, 0.025]} />
                <meshStandardMaterial color="#64748b" metalness={0.7} roughness={0.3} />
              </mesh>
              <mesh castShadow position={[0, -0.06, 0]}>
                <boxGeometry args={[0.01, 0.03, 0.022]} />
                <meshStandardMaterial color="#64748b" metalness={0.7} roughness={0.3} />
              </mesh>
              <mesh castShadow position={[0, -0.085, 0]}>
                <boxGeometry args={[0.008, 0.02, 0.02]} />
                <meshStandardMaterial color="#64748b" metalness={0.7} roughness={0.3} />
              </mesh>
            </group>
          ))}

          <group position={[-0.045, -0.08, 0]} rotation={[0, 0, 0.3]}>
            <mesh castShadow position={[0, -0.015, 0]}>
              <boxGeometry args={[0.012, 0.03, 0.025]} />
              <meshStandardMaterial color="#64748b" metalness={0.7} roughness={0.3} />
            </mesh>
            <mesh castShadow position={[0, -0.035, 0]}>
              <boxGeometry args={[0.01, 0.02, 0.022]} />
              <meshStandardMaterial color="#64748b" metalness={0.7} roughness={0.3} />
            </mesh>
          </group>

          <mesh castShadow position={[0, 0.02, 0]}>
            <cylinderGeometry args={[0.04, 0.045, 0.06, 32]} />
            <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>
      </group>

      {/* Left leg assembly */}
      <group ref={leftLegRef} position={[-0.1, 0.7, 0]}>
        {/* Hip joint */}
        <mesh castShadow position={[0, 0.15, 0]}>
          <sphereGeometry args={[0.08, 32, 32]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Upper leg (thigh) - better proportions */}
        <mesh castShadow position={[0, -0.08, 0]}>
          <cylinderGeometry args={[0.07, 0.09, 0.4, 32]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.6} roughness={0.4} />
        </mesh>

        {/* Thigh armor plating */}
        <mesh castShadow position={[0, -0.05, 0.08]}>
          <boxGeometry args={[0.12, 0.25, 0.04]} />
          <meshStandardMaterial color="#64748b" metalness={0.7} roughness={0.4} />
        </mesh>

        {/* Enhanced knee joint */}
        <group position={[0, -0.3, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.07, 32, 32]} />
            <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Knee cap protection */}
          <mesh castShadow position={[0, 0, 0.07]}>
            <sphereGeometry args={[0.05, 32, 16]} />
            <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} />
          </mesh>
        </group>

        {/* Lower leg (shin) */}
        <mesh castShadow position={[0, -0.48, 0]}>
          <cylinderGeometry args={[0.05, 0.06, 0.32, 32]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.5} roughness={0.5} />
        </mesh>

        {/* Ankle joint */}
        <mesh castShadow position={[0, -0.66, 0]}>
          <sphereGeometry args={[0.05, 32, 32]} />
          <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Enhanced foot assembly */}
        <group position={[0, -0.72, 0.08]}>
          <mesh castShadow>
            <boxGeometry args={[0.14, 0.08, 0.28]} />
            <meshStandardMaterial color="#475569" metalness={0.6} roughness={0.4} />
          </mesh>
          
          {/* Toe section */}
          <mesh castShadow position={[0, -0.02, 0.16]}>
            <boxGeometry args={[0.12, 0.04, 0.08]} />
            <meshStandardMaterial color="#64748b" metalness={0.7} roughness={0.3} />
          </mesh>
          
          {/* Heel stabilizer */}
          <mesh castShadow position={[0, 0, -0.12]}>
            <boxGeometry args={[0.1, 0.06, 0.06]} />
            <meshStandardMaterial color="#64748b" metalness={0.7} roughness={0.3} />
          </mesh>
          
          {/* Arch support */}
          <mesh castShadow position={[0, -0.06, 0.02]}>
            <boxGeometry args={[0.08, 0.02, 0.15]} />
            <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />
          </mesh>

          {/* Foot sensors */}
          {[-0.04, 0.04].map((x, i) => (
            <mesh key={i} castShadow position={[x, -0.05, 0.15]}>
              <cylinderGeometry args={[0.01, 0.01, 0.005, 16]} />
              <meshStandardMaterial 
                color="#22c55e"
                emissive="#22c55e"
                emissiveIntensity={0.3}
              />
            </mesh>
          ))}
        </group>
      </group>

      {/* Right leg assembly (mirrored) */}
      <group ref={rightLegRef} position={[0.1, 0.7, 0]}>
        <mesh castShadow position={[0, 0.15, 0]}>
          <sphereGeometry args={[0.08, 32, 32]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
        </mesh>

        <mesh castShadow position={[0, -0.08, 0]}>
          <cylinderGeometry args={[0.07, 0.09, 0.4, 32]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.6} roughness={0.4} />
        </mesh>

        <mesh castShadow position={[0, -0.05, 0.08]}>
          <boxGeometry args={[0.12, 0.25, 0.04]} />
          <meshStandardMaterial color="#64748b" metalness={0.7} roughness={0.4} />
        </mesh>

        <group position={[0, -0.3, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.07, 32, 32]} />
            <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh castShadow position={[0, 0, 0.07]}>
            <sphereGeometry args={[0.05, 32, 16]} />
            <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} />
          </mesh>
        </group>

        <mesh castShadow position={[0, -0.48, 0]}>
          <cylinderGeometry args={[0.05, 0.06, 0.32, 32]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.5} roughness={0.5} />
        </mesh>

        <mesh castShadow position={[0, -0.66, 0]}>
          <sphereGeometry args={[0.05, 32, 32]} />
          <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.2} />
        </mesh>

        <group position={[0, -0.72, 0.08]}>
          <mesh castShadow>
            <boxGeometry args={[0.14, 0.08, 0.28]} />
            <meshStandardMaterial color="#475569" metalness={0.6} roughness={0.4} />
          </mesh>
          
          <mesh castShadow position={[0, -0.02, 0.16]}>
            <boxGeometry args={[0.12, 0.04, 0.08]} />
            <meshStandardMaterial color="#64748b" metalness={0.7} roughness={0.3} />
          </mesh>
          
          <mesh castShadow position={[0, 0, -0.12]}>
            <boxGeometry args={[0.1, 0.06, 0.06]} />
            <meshStandardMaterial color="#64748b" metalness={0.7} roughness={0.3} />
          </mesh>
          
          <mesh castShadow position={[0, -0.06, 0.02]}>
            <boxGeometry args={[0.08, 0.02, 0.15]} />
            <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />
          </mesh>

          {[-0.04, 0.04].map((x, i) => (
            <mesh key={i} castShadow position={[x, -0.05, 0.15]}>
              <cylinderGeometry args={[0.01, 0.01, 0.005, 16]} />
              <meshStandardMaterial 
                color="#22c55e"
                emissive="#22c55e"
                emissiveIntensity={0.3}
              />
            </mesh>
          ))}
        </group>
      </group>

      {/* Power cables and hydraulic lines */}
      {[
        { start: [0, 1.2, -0.1], end: [-0.1, 0.85, 0], color: "#ef4444" },
        { start: [0, 1.2, -0.1], end: [0.1, 0.85, 0], color: "#3b82f6" },
        { start: [-0.24, 1.35, 0], end: [-0.24, 1.2, 0], color: "#22c55e" },
        { start: [0.24, 1.35, 0], end: [0.24, 1.2, 0], color: "#22c55e" }
      ].map(({ start, end, color }, i) => (
        <mesh key={i} castShadow position={[
          (start[0] + end[0]) / 2,
          (start[1] + end[1]) / 2,
          (start[2] + end[2]) / 2
        ]}>
          <cylinderGeometry args={[0.005, 0.005, 
            Math.sqrt(
              Math.pow(end[0] - start[0], 2) + 
              Math.pow(end[1] - start[1], 2) + 
              Math.pow(end[2] - start[2], 2)
            ), 
            16
          ]} />
          <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
        </mesh>
      ))}
    </>
  );

  // Realistic physics and movement simulation
  useFrame((state, delta) => {
    if (!group.current || !robotState) return;
    
    // Enhanced position interpolation with momentum
    const targetPos = new THREE.Vector3(
      robotState.position.x,
      robotState.position.y,
      robotState.position.z
    );
    
    // Apply momentum and smooth movement
    if (robotState.isMoving) {
      velocity.current.lerp(
        targetPos.clone().sub(group.current.position).multiplyScalar(PHYSICS.acceleration),
        0.1
      );
      velocity.current.clampLength(0, PHYSICS.maxSpeed);
    } else {
      velocity.current.multiplyScalar(PHYSICS.deceleration);
    }
    
    group.current.position.add(velocity.current);
    
    // Smooth rotation with angular momentum
    const targetRot = robotState.rotation.y;
    const currentRot = group.current.rotation.y;
    const rotDiff = targetRot - currentRot;
    
    if (Math.abs(rotDiff) > 0.01) {
      angularVelocity.current += rotDiff * 0.05;
      angularVelocity.current *= 0.95; // Angular damping
      group.current.rotation.y += angularVelocity.current;
    }

    // Calculate distance traveled for wheel rotation
    const distance = group.current.position.distanceTo(prevPosition.current);
    wheelRotation.current += distance / PHYSICS.wheelRadius;
    prevPosition.current.copy(group.current.position);

    // Type-specific animations
    switch (robotConfig.type) {
      case 'mobile':
        // Realistic wheel physics
        if (leftWheelRef.current && rightWheelRef.current) {
          leftWheelRef.current.rotation.x = wheelRotation.current;
          rightWheelRef.current.rotation.x = wheelRotation.current;
        }
        break;

      case 'arm':
        // Realistic robotic arm joint control with constraints
        if (moveCommands) {
          const jointStep = delta * PHYSICS.armSpeed;
          
          // Base rotation - smooth and controlled
          if (armBaseRef.current) {
            const baseTarget = moveCommands.joint === 'base' ? 
              (moveCommands.direction === 'left' ? -0.5 : 0.5) : 0;
            armAngles.base = THREE.MathUtils.clamp(
              THREE.MathUtils.lerp(armAngles.base, baseTarget, jointStep),
              ARM_LIMITS.base.min,
              ARM_LIMITS.base.max
            );
            armBaseRef.current.rotation.y = armAngles.base;
          }
          
          // Shoulder joint
          if (armSegment1Ref.current) {
            const shoulderTarget = moveCommands.joint === 'shoulder' ?
              (moveCommands.direction === 'forward' ? -0.3 : 0.3) : 0;
            armAngles.shoulder = THREE.MathUtils.clamp(
              THREE.MathUtils.lerp(armAngles.shoulder, shoulderTarget, jointStep),
              ARM_LIMITS.shoulder.min,
              ARM_LIMITS.shoulder.max
            );
            armSegment1Ref.current.rotation.x = armAngles.shoulder;
          }
          
          // Elbow joint
          if (armSegment2Ref.current) {
            const elbowTarget = moveCommands.joint === 'elbow' ?
              (moveCommands.direction === 'forward' ? -0.8 : 0.2) : -0.2;
            armAngles.elbow = THREE.MathUtils.clamp(
              THREE.MathUtils.lerp(armAngles.elbow, elbowTarget, jointStep),
              ARM_LIMITS.elbow.min,
              ARM_LIMITS.elbow.max
            );
            armSegment2Ref.current.rotation.x = armAngles.elbow;
          }
          
          // Wrist rotation
          if (armWristRef.current) {
            const wristTarget = moveCommands.joint === 'wrist' ?
              (moveCommands.direction === 'left' ? -1.5 : 1.5) : 0;
            armAngles.wrist = THREE.MathUtils.clamp(
              THREE.MathUtils.lerp(armAngles.wrist, wristTarget, jointStep * 0.7),
              ARM_LIMITS.wrist.min,
              ARM_LIMITS.wrist.max
            );
            armWristRef.current.rotation.z = armAngles.wrist;
          }
        }
        break;

      case 'drone':
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
        const microHover = Math.sin(time * 8) * 0.003; // Micro oscillations
        group.current.position.y += (hoverY + microHover) * 0.5;
        
        // Advanced propeller physics with realistic counter-rotation
        propellersRef.current.forEach((propeller, index) => {
          if (propeller) {
            const baseSpeed = robotState.isMoving 
              ? PHYSICS.propellerSpeedActive 
              : PHYSICS.propellerSpeedIdle;
            
            // Counter-rotating pairs for stability (front-left & back-right CW, front-right & back-left CCW)
            const isClockwise = (index === 0 || index === 3); // Front-left and back-right
            const direction = isClockwise ? 1 : -1;
            const rotationSpeed = baseSpeed + Math.sin(time * 2 + index) * 2; // Slight variation per motor
            
            propeller.rotation.y += rotationSpeed * delta * direction;
            
            // Individual motor vibrations
            if (robotState.isMoving) {
              propeller.position.y = Math.sin(time * 25 + index * 1.5) * 0.001;
              propeller.rotation.x = Math.sin(time * 15 + index) * 0.005;
            } else {
              // Return to neutral position when hovering
              propeller.position.y = THREE.MathUtils.lerp(propeller.position.y, 0, delta * 5);
              propeller.rotation.x = THREE.MathUtils.lerp(propeller.rotation.x, 0, delta * 3);
            }
          }
        });
        
        // Realistic flight dynamics with proper banking and pitching
        if (robotState.isMoving) {
          // Calculate movement direction
          const moveDirection = new THREE.Vector3(
            Math.cos(robotState.rotation.y),
            0,
            Math.sin(robotState.rotation.y)
          );
          
          // Forward pitch when moving forward (nose down for acceleration)
          const forwardTilt = -0.12;
          group.current.rotation.x = THREE.MathUtils.lerp(
            group.current.rotation.x,
            forwardTilt,
            delta * 3
          );
          
          // Banking during turns (lean into turns)
          const turnRate = angularVelocity.current;
          const bankAngle = THREE.MathUtils.clamp(turnRate * 4, -0.25, 0.25);
          group.current.rotation.z = THREE.MathUtils.lerp(
            group.current.rotation.z,
            bankAngle,
            delta * 4
          );
          
          // Slight yaw oscillation during flight for realism
          const yawOscillation = Math.sin(time * 3) * 0.02;
          group.current.rotation.y += yawOscillation * delta;
          
        } else {
          // Smooth return to level flight with slight overshoot
          group.current.rotation.x = THREE.MathUtils.lerp(
            group.current.rotation.x,
            Math.sin(time * 1.5) * 0.01, // Tiny natural sway
            delta * 5
          );
          group.current.rotation.z = THREE.MathUtils.lerp(
            group.current.rotation.z,
            Math.cos(time * 1.2) * 0.008, // Tiny roll sway
            delta * 5
          );
        }
        
        // Apply target altitude smoothly
        group.current.position.y = THREE.MathUtils.lerp(
          group.current.position.y,
          droneAltitude.current,
          delta * 2
        );
        
        // Wind effect simulation - subtle random movements
        if (Math.random() < 0.01) { // Occasional wind gusts
          const windStrength = 0.002;
          group.current.position.x += (Math.random() - 0.5) * windStrength;
          group.current.position.z += (Math.random() - 0.5) * windStrength;
          
          // Compensate with slight tilt
          group.current.rotation.z += (Math.random() - 0.5) * 0.01;
        }
        
        // Emergency landing detection
        if (droneAltitude.current <= 0.2 && !robotState.isMoving) {
          // Gradual propeller slowdown for landing
          propellersRef.current.forEach((propeller, index) => {
            if (propeller) {
              const landingSpeed = 5;
              propeller.rotation.y += landingSpeed * delta * (index % 2 === 0 ? 1 : -1);
            }
          });
          
          // Settle into landing position
          group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, 0, delta * 8);
          group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, 0, delta * 8);
        }
        break;

      case 'humanoid':
        const humanoidTime = state.clock.elapsedTime;
        
        if (robotState.isMoving) {
          // Walking animation cycle
          const walkPhase = humanoidTime * HUMANOID_PHYSICS.walkCycleSpeed;
          
          // Leg animation - alternating step cycle
          if (leftLegRef.current && rightLegRef.current) {
            const leftPhase = Math.sin(walkPhase);
            const rightPhase = Math.sin(walkPhase + Math.PI);
            
            // Hip rotation for forward step
            leftLegRef.current.rotation.x = leftPhase * 0.3;
            rightLegRef.current.rotation.x = rightPhase * 0.3;
            
            // Vertical step motion
            leftLegRef.current.position.y = 0.7 + Math.max(0, leftPhase) * HUMANOID_PHYSICS.stepHeight;
            rightLegRef.current.position.y = 0.7 + Math.max(0, rightPhase) * HUMANOID_PHYSICS.stepHeight;
            
            // Forward step displacement
            leftLegRef.current.position.z = leftPhase * 0.05;
            rightLegRef.current.position.z = rightPhase * 0.05;
          }
          
          // Arm swing - opposite to legs
          if (leftArmRef.current && rightArmRef.current) {
            leftArmRef.current.rotation.x = Math.sin(walkPhase + Math.PI) * HUMANOID_PHYSICS.armSwing;
            rightArmRef.current.rotation.x = Math.sin(walkPhase) * HUMANOID_PHYSICS.armSwing;
          }
          
          // Torso sway for balance
          const torsoSway = Math.sin(walkPhase * 2) * HUMANOID_PHYSICS.torsoSway;
          const torsoVerticalBob = Math.abs(Math.sin(walkPhase * 2)) * 0.02;
          
          if (torsoRef.current) {
            torsoRef.current.rotation.z = torsoSway;
            torsoRef.current.position.y = 1.2 + torsoVerticalBob;
          }
          
          // Neck and head stabilization - keep completely stable
          if (neckRef.current) {
            // Neck follows torso position but counters some sway
            neckRef.current.position.y = 1.55; // Fixed neck position
            neckRef.current.rotation.z = -torsoSway * 0.15; // Slight counter-rotation
          }
          
          if (headRef.current) {
            // Head sits on top of neck and counters remaining sway
            headRef.current.rotation.z = -torsoSway * 0.15;
            
            // Keep head at fixed height relative to neck
            headRef.current.position.y = 1.65;
            
            // Keep head centered front-back
            headRef.current.position.z = 0;
            
            // Keep head facing forward
            headRef.current.rotation.y = 0;
            headRef.current.rotation.x = 0;
          }
          
        } else {
          // Idle animations - subtle breathing and micro movements
          const breathingPhase = Math.sin(humanoidTime * 0.5) * 0.008;
          
          if (torsoRef.current) {
            torsoRef.current.position.y = 1.2 + breathingPhase;
            torsoRef.current.rotation.y = Math.sin(humanoidTime * 0.3) * 0.02; // Slight turning
            torsoRef.current.rotation.z = THREE.MathUtils.lerp(torsoRef.current.rotation.z, 0, delta * 2);
          }
          
          // Neck and head remain completely stable during idle
          if (neckRef.current) {
            // Keep neck at fixed position and orientation
            neckRef.current.position.y = 1.55;
            neckRef.current.rotation.x = 0;
            neckRef.current.rotation.y = 0;
            neckRef.current.rotation.z = 0;
          }
          
          if (headRef.current) {
            // Keep head at fixed position and orientation
            headRef.current.position.y = 1.65;
            headRef.current.position.z = 0;
            headRef.current.rotation.x = 0;
            headRef.current.rotation.y = 0;
            headRef.current.rotation.z = 0;
          }
          
          // Return limbs and neck to neutral position
          [leftLegRef, rightLegRef, leftArmRef, rightArmRef, neckRef].forEach(ref => {
            if (ref.current) {
              ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, 0, delta * 3);
              
              if (ref === neckRef) {
                // Neck specific positioning
                ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, 1.55, delta * 4);
              } else {
                // Limb positioning
                ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, 
                  ref === leftLegRef || ref === rightLegRef ? 0.7 : 
                  ref === leftArmRef || ref === rightArmRef ? 1.48 : ref.current.position.y, 
                  delta * 4);
              }
              
              // Reset z positions for limbs and neck
              if (ref.current.position.z !== undefined) {
                ref.current.position.z = THREE.MathUtils.lerp(ref.current.position.z, 0, delta * 4);
              }
            }
          });
        }
        break;
    }
  });
  return (
    <group ref={group}>
      {robotConfig.type === 'mobile' && <MobileRobotGeometry />}
      {robotConfig.type === 'arm' && <RoboticArmGeometry />}
      {robotConfig.type === 'drone' && <DroneGeometry />}
      {robotConfig.type === 'humanoid' && <HumanoidRobotGeometry />}
    </group>
  );
};
export default RobotModel;