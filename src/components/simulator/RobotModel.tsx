import React, { useRef, useEffect, useState } from 'react';More actions
import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { RobotConfig } from '@/types/robot.types';
import { useRobotStore } from '@/store/robotStore';
@@ -10,764 +10,22 @@ interface RobotModelProps {

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
  
  const { robotState, moveCommands } = useRobotStore();
  
  // Enhanced state management for realistic movements
  const [armAngles, setArmAngles] = useState({
    base: 0,
    shoulder: 0,
    elbow: 0,
    wrist: 0
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

  // Arm joint limits for realistic movement
  const ARM_LIMITS = {
    base: { min: -Math.PI, max: Math.PI },
    shoulder: { min: -Math.PI/2, max: Math.PI/4 },
    elbow: { min: 0, max: Math.PI*0.75 },
    wrist: { min: -Math.PI, max: Math.PI }
  };

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
  const { robotState, updatePhysics } = useRobotStore();

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

  // Realistic physics and movement simulation
  useFrame((state, delta) => {
  // Update physics on each frame
  useFrame((_, delta) => {
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
    }
    updatePhysics(delta);
  });

  return (
    <group ref={group}>
      {robotConfig.type === 'mobile' && <MobileRobotGeometry />}
      {robotConfig.type === 'arm' && <RoboticArmGeometry />}
      {robotConfig.type === 'drone' && <DroneGeometry />}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#3b82f6" />
      </mesh>
    </group>
  );
};

export default RobotModel;
export default RobotModel;